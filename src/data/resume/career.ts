import "server-only"
import prisma from "@/lib/prisma";
import { cache } from "react";

export const getCareerJourney = cache(async (userId: string) => {
    try{
        return await prisma.careerJourney.findMany({
            where: { userId },
            orderBy : { createdAt: "desc"},
        });
    } catch (error){
        return[]
    }
})