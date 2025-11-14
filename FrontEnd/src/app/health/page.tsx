import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getHealthStatus() {
  try {
    // In a real app, this URL should come from environment variables
    const res = await fetch('http://localhost:3000/health', { next: { revalidate: 10 } });
    if (res.ok) {
        const data = await res.json();
        return { ok: true, data };
    }
    return { ok: false, data: { message: `API responded with status ${res.status}` } };
  } catch (error) {
    return { ok: false, data: { message: 'Failed to connect to the API.' } };
  }
}

export default async function HealthPage() {
  const { ok, data } = await getHealthStatus();

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">Status do Backend</h1>
        <p className="text-muted-foreground mt-2 font-body">Verificando a conexão com os serviços.</p>
      </div>

      <Card className={ok ? 'border-green-500' : 'border-destructive'}>
        <CardHeader className="text-center">
            {ok ? (
                <CheckCircle className="mx-auto h-16 w-16 text-green-500"/>
            ) : (
                <XCircle className="mx-auto h-16 w-16 text-destructive"/>
            )}
            <CardTitle className="mt-4 font-headline text-2xl">
                {ok ? 'Serviço Online' : 'Serviço Offline'}
            </CardTitle>
        </CardHeader>
        <CardContent className="text-center font-body text-muted-foreground">
            <p>{data.message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
