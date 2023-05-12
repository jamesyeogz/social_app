import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
const CreateCommentWizard = (props: { postId: string }) => {
  const [content, setContent] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.comment.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.comment.getCommentsByPostId.invalidate();
    },
    onError: (e) => {
      const errorMessage = e?.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]!);
      }
    },
  });
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="flex w-full items-center gap-3 p-10">
      <img
        src={user.profileImageUrl}
        alt="Profile Name"
        className="h-14 w-14 rounded-full"
      />
      <div className="w-full grow rounded border border-white p-3">
        <input
          placeholder="Type some Words"
          className="h-12 w-full bg-transparent text-left outline-none "
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          disabled={isPosting}
        />
      </div>
      {isPosting && <div><LoadingSpinner /></div>}
      {!isPosting && (
        <button
          onClick={() => {
            mutate({content: content,postId:props.postId });
          }}
        >
          Comment
        </button>
      )}
    </div>
  );
};

export default CreateCommentWizard;
