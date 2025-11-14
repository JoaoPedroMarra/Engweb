import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RegisterForm from "@/components/forms/RegisterForm"
import { FlameKindling } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Tabs defaultValue="customer" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer">Conta de Cliente</TabsTrigger>
          <TabsTrigger value="admin">Conta de Administrador</TabsTrigger>
        </TabsList>
        <TabsContent value="customer">
          <Card>
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <FlameKindling className="h-8 w-8 text-primary"/>
                </div>
              <CardTitle className="font-headline text-2xl">Criar conta de Cliente</CardTitle>
              <CardDescription>Cadastre-se para saborear os melhores burgers.</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm role="customer" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
          <Card>
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <FlameKindling className="h-8 w-8 text-primary"/>
                </div>
              <CardTitle className="font-headline text-2xl">Criar conta de Administrador</CardTitle>
              <CardDescription>Obtenha acesso ao painel de gerenciamento.</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm role="admin" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
