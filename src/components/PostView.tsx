import React from "react";
import { RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import DislikeButton from "./DislikeButton";
import LikeButton from "./LikeButton";

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const number = 2;
  const { post, author } = props;
  const { data, isLoading: isLoading } = api.posts.getLikesByPostId.useQuery({
    id: post.id,
  });
  if (!data) return <div>Something Went Wrong</div>;
  return (
    <div className=" w-full justify-center pt-10">
      <div className="border-b p-3">
        <Link href={`/${author.id}`}>
          <div className="flex flex-row items-center gap-3">
            <img
              src={author?.profileImageUrl}
              alt="image"
              className="h-12 w-12 rounded-full"
            />
            <span className="text-xl font-semibold text-white">
              @{author.username ? author.username : author.id}
            </span>
            <span className="text-xl font-thin text-white">
              . Posted {dayjs(post.createdAt).fromNow()}
            </span>
          </div>
        </Link>
        <Link href={`/post/${post.id}`}>
          <h1 className="my-3 text-3xl font-bold text-white">{post.title}</h1>
          <p className="mb-2 text-xl text-white">{post.content}</p>
          {/* <span className="px-3">{number} Comments</span> */}
          <span>{data.length} Likes </span>
        </Link>
        {/* {userId && data.filter((like) => like.authorId === userId).length > 0 ? (
          <DislikeButton id={post.id}></DislikeButton>
        ) : (
          <LikeButton id={post.id}></LikeButton>
        )} */}
        <LikeButton id={post.id}></LikeButton>
      </div>
    </div>
  );
};

export default PostView;
