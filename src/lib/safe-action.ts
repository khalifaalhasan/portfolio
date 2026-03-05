import { z } from "zod";
import { auth } from "@/lib/auth/auth"; // Pastikan path auth benar
import { headers } from "next/headers";

// 👇 FIX: Update Type ActionState
export type ActionState<T = any> = {
  error?: string;
  success?: boolean;
  message?: string;
  // Tambahkan '| undefined' di sini agar cocok dengan output Zod
  fieldErrors?: Record<string, string[] | undefined>; 
  data?: T;
};

export function createAuthAction<T extends z.ZodType>(
  schema: T,
  handler: (
    data: z.infer<T>,
    session: typeof auth.$Infer.Session
  ) => Promise<ActionState>
) {
  return async (rawInput: z.infer<T>): Promise<ActionState> => {
    
    // 1. Cek Session
    const session = await auth.api.getSession({ 
        headers: await headers() 
    });

    if (!session) {
      return { error: "Unauthorized: Harap login terlebih dahulu." };
    }

    // 2. Validasi Zod
    const validated = schema.safeParse(rawInput);

    if (!validated.success) {
      return {
        error: "Data tidak valid.",
        // Sekarang ini tidak akan error lagi
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    // 3. Jalankan Logic
    try {
      return await handler(validated.data, session);
    } catch (error) {
      console.error("Action Error:", error);
      return { error: "An error occurred on the server." };
    }
  };
}