"use client"

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import apiFetch from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type CartItem = { productId: number; name: string; price: number; quantity: number }

function CartInner() {
  const [items, setItems] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    try {
      const key = 'cart_items'
      const current = JSON.parse(localStorage.getItem(key) || '[]')
      setItems(current)
    } catch {}
  }, [])

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  function updateQty(index: number, delta: number) {
    setItems(prev => {
      const next = [...prev]
      next[index].quantity = Math.max(1, next[index].quantity + delta)
      localStorage.setItem('cart_items', JSON.stringify(next))
      return next
    })
  }

  function removeItem(index: number) {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== index)
      localStorage.setItem('cart_items', JSON.stringify(next))
      return next
    })
  }

  async function checkout() {
    if (!token) return
    const addressParts = [
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Endereço: ${street}, ${number}`,
      district ? `Bairro: ${district}` : '',
      city ? `Cidade: ${city}` : '',
      notes ? `Obs: ${notes}` : ''
    ].filter(Boolean)
    const address = addressParts.join(' | ')
    const payload = {
      items: items.map(it => ({ productId: it.productId, quantity: it.quantity })),
      deliveryAddress: address,
    }
    const res = await apiFetch('/customer/orders', { token, data: payload, method: 'POST' })
    if (res) {
      localStorage.setItem('cart_items', '[]')
      setItems([])
      setName('')
      setPhone('')
      setStreet('')
      setNumber('')
      setDistrict('')
      setCity('')
      setNotes('')
      alert('Pedido realizado com sucesso!')
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Seu Carrinho</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground font-body">Seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={`${it.productId}-${idx}`} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-body font-medium">{it.name}</div>
                    <div className="text-sm text-muted-foreground">R$ {it.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => updateQty(idx, -1)}>-</Button>
                    <Input className="w-14 text-center" value={it.quantity} readOnly />
                    <Button size="sm" variant="secondary" onClick={() => updateQty(idx, 1)}>+</Button>
                    <Button size="sm" variant="ghost" onClick={() => removeItem(idx)}>Remover</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(xx) xxxxx-xxxx" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Rua</label>
                <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Rua" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Número</label>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Número" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Bairro</label>
                <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Bairro" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Observações</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Complemento, referência, portaria, etc." />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="font-body">Total: <strong>R$ {total.toFixed(2)}</strong></div>
          <Button disabled={!items.length || !name.trim() || !phone.trim() || !street.trim() || !number.trim()} onClick={checkout} style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>Finalizar compra</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function CarrinhoPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CartInner />
    </ProtectedRoute>
  )
}
