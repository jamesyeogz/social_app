import { useUser } from "@clerk/nextjs";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import NavBar from "~/components/NavBar";
import { api } from "~/utils/api";
import PostView from "../components/PostView";
import { PageLayout } from "~/components/layout";
import LoadingSpinner from "~/components/LoadingSpinner";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
const ProfileFeed = (props:{userId:string}) =>{
    const{data,isLoading} = api.posts.getPostsByUserId.useQuery({userId: props.userId})

    if (isLoading) return <LoadingSpinner /> ;
    if(!data || data.length === 0) return <div> User has not posted</div>
    return <div className="flex flex-col">
        {data?.map((fullPost) =>(
            <PostView {...fullPost} key={fullPost.post.id} />
        ))}
    </div>
}

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { data, isLoading: isLoading } = api.profile.getUserByUsername.useQuery(
    { username: `${username}` }
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <NavBar user={user} />
        <div className="border-b border-slate-800 bg-slate-800 relative h-48">
            <img src={data.profileImageUrl} alt="Profile Image" className="rounded-full h-24 w-24 -mb-12 absolute bottom-0 left-0 ml-4 border-4 border-black "/>
            
            
        </div>
        <div className="h-[50px]"/>
        <div className="p-4 text-xl font-semibold">{data.id}</div>
        <div className="border-b border-slate-400">
<ProfileFeed userId={username}/>

        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const slug = context.params?.slug;
  if (typeof slug != "string") throw new Error("no slug");
  await ssg.profile.getUserByUsername.prefetch({ username: slug });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: slug,
    },
  };
};
export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
export default ProfilePage;
