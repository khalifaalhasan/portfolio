"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth/auth-client";


export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<"github" | "google" | "email" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInValues) {
    setIsLoading(true);
    setActiveProvider("email");
    
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        toast.success("Login berhasil!");
        router.push("/dashboard");
      },
      onError: (ctx) => {
         toast.error(ctx.error.message || "Email atau password salah.");
         setIsLoading(false);
         setActiveProvider(null);
      }
    });
  }

  async function handleSocialLogin(provider: "github" | "google") {
    setIsLoading(true);
    setActiveProvider(provider);

    await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    }, {
      onError: (ctx) => {
        toast.error(`Gagal login dengan ${provider}.`);
        setIsLoading(false);
        setActiveProvider(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={() => handleSocialLogin("github")}
          disabled={isLoading}
        >
          {activeProvider === "github" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
        >
          {activeProvider === "google" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle  className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau lanjut dengan email
          </span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="nama@email.com"
            type="email"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {activeProvider === "email" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Masuk dengan Email
        </Button>
      </form>

      <div className="flex justify-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/sign-up" className="ml-1 text-primary hover:underline">
          Daftar di sini
        </Link>
      </div>
    </div>
  );
}