import { useUser } from "@clerk/nextjs";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import NavBar from "~/components/NavBar";
import { api } from "~/utils/api";
import PostView from "../../components/PostView";
import { PageLayout } from "~/components/layout";
import LoadingSpinner from "~/components/LoadingSpinner";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
import CommentView from "~/components/CommentView";
import CreateCommentWizard from "~/components/CreateCommentWizard";
const CommentFeed = (props: { postId: string }) => {
  const { data, isLoading } = api.comment.getCommentsByPostId.useQuery({
    postId: props.postId,
  });
  if (isLoading) return <LoadingSpinner />;
  if (!data || data.length === 0) return <div> There are no comments</div>;
  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <CommentView {...fullPost} key={fullPost.comment.id} />
      ))}
    </div>
  );
};

const PostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { data, isLoading: isLoading } = api.posts.getPostByPostId.useQuery({
    id: `${postId}`,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.post.content}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <NavBar user={user} />
        <PostView {...data} />
        <CreateCommentWizard postId={postId} />
        <CommentFeed postId={postId}/>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id != "string") throw new Error("no id");
  await ssg.posts.getPostByPostId.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId: id,
    },
  };
};
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
export default PostPage;
