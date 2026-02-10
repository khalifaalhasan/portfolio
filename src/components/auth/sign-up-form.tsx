"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc"; // Icon Google yang diminta

import { authClient } from "@/lib/auth/auth-client";
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const router = useRouter();

  // State terpisah agar loading spinner muncul di tempat yang spesifik
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "github" | "google" | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  // 1. Logic Sign Up via Email (Manual)
  async function onSubmit(data: SignUpValues) {
    setIsEmailLoading(true);
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Akun berhasil dibuat!");
            router.push("/dashboard");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Gagal membuat akun.");
            setIsEmailLoading(false);
          },
        },
      );
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
      setIsEmailLoading(false);
    }
  }

  // 2. Logic Sign Up via Social Media (OAuth)
  // Note: signIn.social otomatis handle Register jika user belum ada
  // async function handleSocialLogin(provider: "github" | "google") {
  //   setSocialLoading(provider);

  //   await authClient.signIn.social({
  //     provider: provider,
  //     callbackURL: "/dashboard",
  //   }, {
  //     onSuccess: () => {
  //       toast.success(`Berhasil masuk dengan ${provider}`);
  //     },
  //     onError: (ctx) => {
  //       toast.error(`Gagal daftar dengan ${provider}`);
  //       setSocialLoading(null);
  //     }
  //   });
  // }

  // Helper variable untuk disable semua input saat ada proses loading apapun
  const isGlobalLoading = isEmailLoading || socialLoading !== null;

  return (
    <div className="space-y-4">
      {/* --- BAGIAN SOCIAL BUTTONS --- */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          // onClick={() => handleSocialLogin("github")} nunggu nanti setup sosial auth
          disabled={isGlobalLoading}
          type="button" // Penting agar tidak men-trigger submit form
        >
          {socialLoading === "github" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>

        <Button
          variant="outline"
          // onClick={() => handleSocialLogin("google")}
          disabled={isGlobalLoading}
          type="button"
        >
          {socialLoading === "google" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>

      {/* --- VISUAL SEPARATOR --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau daftar dengan email
          </span>
        </div>
      </div>

      {/* --- FORM SIGN UP EMAIL --- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            placeholder="John Doe"
            disabled={isGlobalLoading}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="nama@email.com"
            type="email"
            disabled={isGlobalLoading}
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
            placeholder="Minimal 8 karakter"
            disabled={isGlobalLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isGlobalLoading}>
          {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Daftar Sekarang
        </Button>
      </form>

      <div className="flex justify-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/sign-in" className="ml-1 text-primary hover:underline">
          Login di sini
        </Link>
      </div>
    </div>
  );
}
