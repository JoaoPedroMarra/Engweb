import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Utensils } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-burger');

  const featuredProducts = [
    PlaceHolderImages.find((img) => img.id === 'classic-burger'),
    PlaceHolderImages.find((img) => img.id === 'bacon-deluxe'),
    PlaceHolderImages.find((img) => img.id === 'veggie-burger'),
  ].filter(Boolean) as (typeof PlaceHolderImages)[0][];
  const featuredNames = ['Fast Burguin', 'Fast Burgão', 'Fast Mini'];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative h-[60vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-lg">
            FastBurguer
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl font-body drop-shadow-md">
            Feito com paixão, servido com prazer. Os melhores burgers para você.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Link href="/cardapio">Fazer pedido</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link href="/register">Cadastrar-se</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4 text-center">
        <h2 className="font-headline text-4xl font-bold mb-4 text-primary">Nossos Burgers</h2>
        <p className="text-muted-foreground font-body text-lg max-w-3xl mx-auto mb-12">
          Cada burger é uma obra-prima, feito com ingredientes frescos e um toque de alegria.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, i) => (
            <Card key={product.id} className="overflow-hidden border-2 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative h-60 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.description}
                    fill
                    className="object-cover"
                    data-ai-hint={product.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl">{featuredNames[i] ?? product.description}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="w-full bg-secondary/50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-4xl font-bold text-primary mb-4">A arte do burger</h2>
            <p className="font-body text-lg text-foreground/80 mb-4">
              Na FastBurguer, acreditamos que um grande burger é mais que uma refeição; é uma experiência. Começamos com a missão de criar os burgers mais saborosos usando ingredientes selecionados.
            </p>
            <p className="font-body text-lg text-foreground/80">
              Nossos chefs são artistas e a chapa é a tela. Prove a diferença que qualidade e dedicação fazem.
            </p>
            <Button asChild className="mt-8" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              <Link href="/about">Conheça nossa história</Link>
            </Button>
          </div>
          <div className="flex justify-center">
             <Utensils className="h-48 w-48 text-primary/30" />
          </div>
        </div>
      </section>
    </div>
  );
}
