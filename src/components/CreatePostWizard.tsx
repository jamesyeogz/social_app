import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setContent("");
      setTitle("");
      ctx.posts.getAll.invalidate();
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
          placeholder="Type Title"
          className="mb-1 h-12 w-full bg-transparent text-xl outline-none"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          disabled={isPosting}
        />
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
      <button
        onClick={() => {
          mutate({ title: title, content: content });
        }}
      >
        Post
      </button>
    </div>
  );
};

export default CreatePostWizard;
