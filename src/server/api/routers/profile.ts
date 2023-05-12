import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "../helpers/filterUser";

export const profileRouter = createTRPCRouter({
    getUserByUsername: publicProcedure.input(z.object({username: z.string() })).query(async({input})=>{
        const [user] = await clerkClient.users.getUserList({
            userId: [input.username]
        })
        if(!user){
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message: "User Not Found"
            })
        }
        return filterUserForClient(user);
    })

});