"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import AddProductForm from "@/components/forms/AddProductForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import apiFetch from "@/lib/api"

type Prod = { id: number; name: string; price: number; description?: string }

export default function AdminPage(){
  const [products, setProducts] = useState<Prod[]>([])
  const [editing, setEditing] = useState<Record<number, Prod>>({})
  const { toast } = useToast()
  const { token } = useAuth()

  async function load(){
    try {
      const res = await apiFetch('/cardapio')
      const items = Array.isArray((res as any)?.products) ? (res as any).products : []
      setProducts(items)
    } catch (e:any) {
      toast({ variant:'destructive', title:'Falha ao carregar', description: e?.message || 'Erro' })
    }
  }

  useEffect(() => { load() }, [])

  function startEdit(p: Prod){
    setEditing(prev => ({ ...prev, [p.id]: { ...p } }))
  }

  function cancelEdit(id: number){
    setEditing(prev => { const cp = { ...prev }; delete cp[id]; return cp })
  }

  function setField(id: number, field: keyof Prod, value: string){
    setEditing(prev => ({ ...prev, [id]: { ...prev[id], [field]: field === 'price' ? Number(value) : value } as Prod }))
  }

  async function save(id: number){
    const data = editing[id]
    try {
      const res = await apiFetch(`/admin/products/${id}`, { method:'PUT', token, data: { name: data.name, price: data.price } })
      const updated = (res as any)?.product
      setProducts(prev => prev.map(p => p.id === id ? updated : p))
      cancelEdit(id)
      toast({ title:'Produto atualizado', description:`${updated.name} salvo.` })
    } catch(e:any){
      toast({ variant:'destructive', title:'Falha ao salvar', description: e?.message || 'Erro' })
    }
  }

  async function remove(id: number){
    try {
      await apiFetch(`/admin/products/${id}`, { method:'DELETE', token })
      setProducts(prev => prev.filter(p => p.id !== id))
      toast({ title:'Produto excluído', description:`Item removido do cardápio.` })
    } catch(e:any){
      toast({ variant:'destructive', title:'Falha ao excluir', description: e?.message || 'Erro' })
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <section className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Painel do Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Gerenciar produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map(p => {
                const ed = editing[p.id]
                return (
                  <div key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center border p-3 rounded">
                    <div className="md:col-span-6">
                      <Input value={(ed?.name ?? p.name) as any} onChange={e => setField(p.id, 'name', e.target.value)} disabled={!ed} />
                    </div>
                    <div className="md:col-span-3">
                      <Input type="number" step="0.01" value={(ed?.price ?? p.price) as any} onChange={e => setField(p.id, 'price', e.target.value)} disabled={!ed} />
                    </div>
                    <div className="md:col-span-3 flex gap-2 justify-end">
                      {!ed ? (
                        <>
                          <Button variant="secondary" onClick={() => startEdit(p)}>Editar</Button>
                          <Button variant="destructive" onClick={() => remove(p.id)}>Excluir</Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => save(p.id)}>Salvar</Button>
                          <Button variant="secondary" onClick={() => cancelEdit(p.id)}>Cancelar</Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
              {!products.length && (
                <div className="text-muted-foreground">Nenhum produto cadastrado.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </ProtectedRoute>
  )
}
