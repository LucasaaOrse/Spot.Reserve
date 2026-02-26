"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Validação com Zod
const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Alterado para false para tratarmos o erro aqui
      });

      if (result?.error) {
        toast.error("Credenciais inválidas ou conta não encontrada.");
        return;
      }

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard"); // Redireciona manualmente após o sucesso
      router.refresh(); // Garante que a sessão seja atualizada no layout
      
    } catch (error) {
      toast.error("Ocorreu um erro inesperado ao tentar entrar.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-600">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <LogIn size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Acesse sua conta</CardTitle>
          <CardDescription>
            Entre para gerenciar seus eventos ou reservar seu lugar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="seu@email.com" 
                          className="pl-10 focus-visible:ring-indigo-600" 
                          {...field} 
                        />
                      </div>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 focus-visible:ring-indigo-600" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  "Entrar no EventPro"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Ainda não tem conta como organizador?{" "}
            <Link 
              href="/auth/register" 
              className="font-semibold text-indigo-600 hover:underline"
            >
              Cadastre sua empresa
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}