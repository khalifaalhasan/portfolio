import "server-only"

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getCompetition = cache(async (userId: string)=> {
    try{
        return await prisma.competition.findMany({
            where : { userId },
            orderBy: { createdAt: "desc"},
        });
    } catch (error){
        return[]
    }
})

