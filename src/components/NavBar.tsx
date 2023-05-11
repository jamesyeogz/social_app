import { type NextPage } from "next";
import type { ReactElement } from 'react';
import {
    SignInButton,
    useUser,
    SignedIn,
    UserButton,
    SignedOut,
    SignIn,
  } from "@clerk/nextjs";
  
  const NavBar = () => {
    const user = useUser();

    return (
      <div className="p-3 w-full flex flex-row justify-between items-center">
        <div className="font-bold text-2xl bh-transparent border p-3 rounded-lg hover:blur-sm">
          Insania.io
        </div>
        {/* {!!user.isSignedIn && <> */}
        <div className="bg-transparent hover:bg-white text-white-200 font-semibold hover:text-black py-2 px-4 border border-white-200 hover:border-transparent rounded">
          Make a New Post
        </div>
        {/* </>} */}
        <div>
          <SignedIn>
          </SignedIn>
          <SignedOut>
            <div className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            <SignInButton/>
            </div>
          </SignedOut>
        </div>
        
      </div>
    )
  }
  
  export default NavBar