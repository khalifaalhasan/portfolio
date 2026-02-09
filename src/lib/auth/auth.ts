import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma  from "@/lib/prisma"


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // integrasi login
  emailAndPassword: {
    enabled: true,
  },

  // sosial integrasi login
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // rate limiting
  rateLimit: {
    enabled: true,
    window: 60, // 60 seconds
    max: 50, // max 50 requests per window per IP
  },

  plugins: [nextCookies()],

  // mapping user saat register, nanti aja yak kita bikin ex dl aja

  //   hooks : {
  //     after: {
  //         createUser: async (user) => {
  //             await prisma.profile.create({data : {userId : user.id}, name: user.name, ...})
  //         }
  //     }
  //   }
});
