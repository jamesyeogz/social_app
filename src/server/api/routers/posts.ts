import { auth, clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/server";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Post, Prisma, PrismaClient } from "@prisma/client";

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
const addUserDataToPosts = async (ctx: any, posts: Post[]) => {
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
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    return addUserDataToPosts(ctx, posts);
  }),
  getLikesByPostId: publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const likes = await ctx.prisma.like.findMany({
      where: {
        postId: input.id,
      },
    });
    return likes
  }),
  getPostByPostId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!post)
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      return (await addUserDataToPosts(ctx, [post]))[0];
    }),
  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
        },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
      });
      return addUserDataToPosts(ctx, posts);
    }),
  Dislike: privateProcedure
    .mutation(({ ctx }) => {
      const authorId = ctx.userId;
      return ctx.prisma.like.deleteMany({
        where: { id: authorId },
      });
    }),
  Like: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const authorId = ctx.userId;
      console.log(authorId)
      return ctx.prisma.like.create({
        data: {
          authorId:authorId,
          postId: input.id,
          
        },
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
      return post;
    }),
});
