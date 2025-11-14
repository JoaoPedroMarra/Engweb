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
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { registerSchema } from "@/lib/schemas"
import type { UserRole } from "@/lib/types"

interface RegisterFormProps {
  role: UserRole
}

export default function RegisterForm({ role }: RegisterFormProps) {
  const { register } = useAuth()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      adminToken: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await register(values, role)
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha no cadastro",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="voce@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {role === 'admin' && (
          <FormField
            control={form.control}
            name="adminToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token secreto do admin</FormLabel>
                <FormControl>
                  <Input placeholder="Informe o token" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full font-bold" disabled={form.formState.isSubmitting} style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
          {form.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </Form>
  )
}
