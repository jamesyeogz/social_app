import React from 'react'
import { RouterOutputs } from '~/utils/api'
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import Link from 'next/link';

dayjs.extend(relativeTime);
type CommentWithPostId = RouterOutputs["comment"]["getCommentsByPostId"][number];

const CommentView = (props:CommentWithPostId) => {
    const number = 2;
    const {comment,author} = props;
  return (
    <div className=" w-full justify-center pt-10">
    <div className="border-b p-3">
      <Link href={`/${author.id}`}>
        <div className='flex flex-row items-center gap-3'>
        <img src={author?.profileImageUrl} alt='image' className='h-12 w-12 rounded-full'/>
        <div className='flex flex-wrap'>
        <div className="text-xl font-semibold text-white">
        @{author.username? author.username:author.id}
      </div>
      <div className="text-xl font-thin text-white">
        . Posted {dayjs(comment.createdAt).fromNow()}
      </div>
        </div>

        </div>
        </Link>
      <p className="mb-2 text-xl text-white">{comment.content}</p>
    </div>
  </div>
  )
}

export default CommentView