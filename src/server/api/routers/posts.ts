import { auth, clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/server";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });
    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        });
      }

      return {
        post,
        author,
      };
    });
  }),
  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
        title: z.string().min(1).max(32),
      })
    )
    .mutation(({ ctx, input }) => {
      const authorId = ctx.userId;
      const post = ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
          title: input.title,
        },
      });
    }),
});
