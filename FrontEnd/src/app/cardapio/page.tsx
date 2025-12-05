import { apiGet, API_URL } from "@/lib/api"
import Image from "next/image"

export default async function CardapioPage(){
  let products: any[] = []
  try {
    const res = await apiGet('/cardapio')
    products = Array.isArray((res as any)?.products) ? (res as any).products : []
  } catch {
    products = []
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
                  src={p.imageUrl ? (String(p.imageUrl).startsWith('http') ? p.imageUrl : `${API_URL}${p.imageUrl}`) : 'https://placehold.co/800x500?text=Burger'}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-5 py-4">
                <div className="font-headline font-bold text-xl text-foreground">{p.name}</div>
                <div className="mt-1 font-body text-sm text-neutral-600">R$ {Number(p.price).toFixed(2)}</div>
              </div>
            </div>
          ))}
          {!products.length && (
            <div className="text-center text-muted-foreground font-body">Sem itens no cardápio</div>
          )}
        </div>
      </div>
    </section>
  )
}
export const dynamic = 'force-dynamic'
export const revalidate = 0
