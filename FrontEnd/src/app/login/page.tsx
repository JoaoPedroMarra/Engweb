import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/components/forms/LoginForm"
import { FlameKindling } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Tabs defaultValue="customer" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer">Cliente</TabsTrigger>
          <TabsTrigger value="admin">Administrador</TabsTrigger>
        </TabsList>
        <TabsContent value="customer">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <FlameKindling className="h-8 w-8 text-primary"/>
              </div>
              <CardTitle className="font-headline text-2xl">Login de Cliente</CardTitle>
              <CardDescription>Bem-vindo! Informe seus dados para entrar.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm role="customer" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
          <Card>
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <FlameKindling className="h-8 w-8 text-primary"/>
                </div>
              <CardTitle className="font-headline text-2xl">Login de Administrador</CardTitle>
              <CardDescription>Acesse o painel do administrador.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm role="admin" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
