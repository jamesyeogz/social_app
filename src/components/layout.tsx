import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="w-full flex-row justify-center md:max-w-7xl ">
        {props.children}
      </div>
    </main>
  );
};
