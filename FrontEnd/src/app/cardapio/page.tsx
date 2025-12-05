"use client"

import { useEffect, useState } from "react"
import { apiGet, API_URL } from "@/lib/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function CardapioPage(){
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await apiGet('/cardapio')
        const list = Array.isArray((res as any)?.products) ? (res as any).products : []
        if (mounted) setProducts(list)
      } catch {
        if (mounted) setProducts([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  function addToCart(p: any) {
    try {
      const key = 'cart_items'
      const current = JSON.parse(localStorage.getItem(key) || '[]')
      const idx = current.findIndex((it: any) => String(it.productId) === String(p.id))
      if (idx >= 0) {
        current[idx].quantity += 1
      } else {
        current.push({ productId: p.id, name: p.name, price: Number(p.price || 0), quantity: 1 })
      }
      localStorage.setItem(key, JSON.stringify(current))
    } catch {}
  }

  return (
    <section className="w-full py-12 md:py-16" style={{ backgroundColor: '#f4f1ea' }}>
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="font-headline text-4xl md:text-5xl text-red-700 text-center mb-3">Nossos Burgers</h2>
        <p className="text-center font-body text-foreground/70 mb-10">Cada burger é uma obra-prima, feito com ingredientes frescos e um toque de alegria.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p: any) => (
            <div key={p.id} className="rounded-xl border border-neutral-300 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white overflow-hidden transform hover:-translate-y-0.5">
              <div className="relative h-56 w-full">
                <Image
                  src={p.imageUrl ? (String(p.imageUrl).startsWith('http') ? p.imageUrl : `/api${p.imageUrl}`) : 'https://placehold.co/800x500?text=Burger'}
                  alt={p.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="px-5 py-4">
                <div className="font-headline font-bold text-xl text-foreground">{p.name}</div>
                <div className="mt-1 font-body text-sm text-neutral-600">R$ {Number(p.price).toFixed(2)}</div>
                <div className="mt-3">
                  <Button onClick={() => addToCart(p)} size="sm" variant="secondary">Adicionar ao carrinho</Button>
                </div>
              </div>
            </div>
          ))}
          {!loading && !products.length && (
            <div className="text-center text-muted-foreground font-body">Sem itens no cardápio</div>
          )}
        </div>
      </div>
    </section>
  )
}
