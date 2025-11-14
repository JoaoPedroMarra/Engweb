"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addProductSchema } from "@/lib/schemas"
import { useAuth } from "@/hooks/useAuth"
import apiFetch, { API_URL } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function AddProductForm() {
  const { toast } = useToast()
  const { token } = useAuth()

  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof addProductSchema>) {
    try {
      const fileInput = (document.getElementById('product-image') as HTMLInputElement | null)
      const file = fileInput?.files?.[0]
      if (file) {
        const fd = new FormData()
        fd.append('name', values.name)
        fd.append('price', String(values.price))
        fd.append('description', values.description || '')
        fd.append('image', file)
        const res = await fetch(`${API_URL}/admin/products/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token || ''}` }, body: fd })
        if (!res.ok) throw new Error('Falha no upload')
      } else {
        await apiFetch('/admin/products', { token, data: values, method: 'POST' })
      }
      toast({ title: "Produto adicionado", description: `"${values.name}" foi adicionado ao cardápio.` })
      form.reset()
      if (fileInput) fileInput.value = ''
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao adicionar produto",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Adicionar novo produto</CardTitle>
        <CardDescription>Preencha os dados abaixo para incluir um item no cardápio.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: X-Burger Clássico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="25.90" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Uma descrição breve e saborosa do produto." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Imagem do produto (opcional)</FormLabel>
              <Input id="product-image" type="file" accept="image/png,image/jpeg" />
            </div>
            <Button type="submit" className="w-full font-bold sm:w-auto" disabled={form.formState.isSubmitting} style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {form.formState.isSubmitting ? "Adicionando produto..." : "Adicionar produto"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
