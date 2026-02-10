import "server-only"

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getEducation = cache(async (userId: string)=> {
    try{
        return await prisma.education.findMany({
            where : { userId },
            orderBy: { createdAt: "desc"},
        });
    } catch (error){
        return[]
    }
})

