import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { Comment } from "@prisma/client";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
const addUserDataToComments = async (comments: Comment[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: comments.map((comment) => comment.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);
  return comments.map((comment) => {
    const author = users.find((user) => user.id === comment.authorId);
    if (!author) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });
    }

    return {
      comment,
      author,
    };
  });}

export const commentRouter = createTRPCRouter({
  getCommentsByPostId: publicProcedure
    .input(z.object({ postId: z.string() })).query(async({ctx,input})=>{
      const postId = input.postId
      const comments = await ctx.prisma.comment.findMany({
        where:{
          postId: postId
        },
        take:100,
        orderBy: [{createdAt: 'desc'}]
      })
      return addUserDataToComments(comments)
    }),
    create:privateProcedure.input(z.object({
      content: z.string(),
      postId: z.string()
    })).mutation(({ctx,input})=>{
      const authorId = ctx.userId;
      const comment = ctx.prisma.comment.create({
        data:{
          authorId : authorId,
          content:input.content,
          postId:input.postId
        }
      })
      return comment
    })
});
