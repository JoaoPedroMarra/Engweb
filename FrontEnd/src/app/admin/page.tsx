import ProtectedRoute from "@/components/ProtectedRoute"
import AddProductForm from "@/components/forms/AddProductForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage(){
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <section className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Painel do Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm />
          </CardContent>
        </Card>
      </section>
    </ProtectedRoute>
  )
}