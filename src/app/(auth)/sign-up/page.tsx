import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Daftar - Portfolio Builder",
  description: "Buat akun portfolio baru",
};

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
        <CardDescription>
          Mulai bangun portfolio impianmu sekarang.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Render Client Component di sini */}
        <SignUpForm />
      </CardContent>
    </Card>
  );
}