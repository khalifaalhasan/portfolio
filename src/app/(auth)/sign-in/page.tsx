import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Login - Portfolio Builder",
  description: "Masuk ke akun anda",
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Masuk ke Akun</CardTitle>
        <CardDescription>
          Pilih metode login untuk mengakses dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Render Client Component di sini */}
        <SignInForm />
      </CardContent>
    </Card>
  );
}