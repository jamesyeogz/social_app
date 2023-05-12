import { type NextPage } from "next";
import type { ReactElement } from "react";
import {
  SignInButton,
  useUser,
  SignedIn,
  UserButton,
  SignedOut,
  SignIn,
} from "@clerk/nextjs";
import Link from "next/link";

const NavBar = (user: any) => {
  return (
    <div className="flex w-full flex-row items-center justify-between p-3">
      <div className="flex flex-1 flex-row items-center">
        <Link href="/">
          {" "}
          <div className="bh-transparent rounded-lg border p-3 text-2xl font-bold hover:blur-sm">
            Insania.io
          </div>
        </Link>

        <div className="pl-3"></div>
      </div>

      <div className="flex flex-1 justify-end px-4 py-2">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <div className="rounded border border-blue-500 bg-transparent font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">
            <SignInButton />
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export default NavBar;
