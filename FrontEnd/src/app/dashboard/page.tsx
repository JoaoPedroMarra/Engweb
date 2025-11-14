"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import apiFetch from '@/lib/api';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      if (!token) return;
      try {
        setIsLoading(true);
        const data = await apiFetch('/customer/orders', { token });
        const list = Array.isArray(data?.orders) ? data.orders : [];
        const adapted = list.map((o: any) => ({
          id: String(o.id),
          userId: String(o.customerId ?? ''),
          items: (o.items || []).map((it: any) => ({
            productId: String(it.productId),
            quantity: Number(it.quantity || 0),
            price: Number(it.unitPrice || it.price || 0),
          })),
          total: Number(o.total || 0),
          createdAt: String(o.createdAt),
        }));
        setOrders(adapted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  if (isLoading) {
    return (
        <div className="space-y-4">
            {Array.from({length: 3}).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2"/>
                        <Skeleton className="h-4 w-1/4"/>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full"/>
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-6 w-1/4"/>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (orders.length === 0) {
    return (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground"/>
            <h3 className="mt-4 text-lg font-medium font-headline">Sem pedidos por enquanto</h3>
            <p className="mt-1 text-sm text-muted-foreground font-body">Você ainda não fez pedidos conosco.</p>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">Pedido #{order.id.slice(0, 8)}</CardTitle>
                <CardDescription>
                  Data: {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="secondary">Total: R$ {order.total.toFixed(2)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-bold mb-2 font-body">Itens:</p>
            <ul className="list-disc list-inside space-y-1 font-body">
              {order.items.map((item, index) => (
                <li key={index}>
                  Produto {item.productId.slice(0, 8)} - {item.quantity} x R$ {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline text-primary">Seu Painel</h1>
                <p className="text-muted-foreground mt-2 font-body">Aqui está um resumo das suas atividades recentes.</p>
            </div>
            <h2 className="text-2xl font-bold font-headline mb-4">Histórico de pedidos</h2>
            <OrderHistory />
        </div>
    </ProtectedRoute>
  );
}
