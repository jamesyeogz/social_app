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
            <div className="flex flex-wrap">
            <div className=" md:text-xl font-semibold text-white text-sm ">
              @{author.username ? author.username : author.id}
            </div>
            <div className=" md:text-xl font-thin text-white text-l ">
              . Posted {dayjs(post.createdAt).fromNow()}
            </div>
            </div>

          </div>
        </Link>
        <Link href={`/post/${post.id}`}>
          <div className="my-3  md:text-3xl  text-l font-bold text-white text-xl ">{post.title}</div>
          <p className="mb-2 md:text-2xl  text-l text-white text-l ">{post.content}</p>
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
