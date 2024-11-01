import * as React from "react";

import Sidebar2 from "@/components/Layout/Sidebar2";
import Topnav2 from "@/components/Layout/Topnav2";
import ReduxUserStateProvider from "@/components/ReduxUserStateProvider";

export default function Dashboard({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ReduxUserStateProvider>
      <div>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
          <Sidebar2 />
          <div className="flex flex-col">
            <Topnav2 />
            <div
              className="bg-[#F9F9F9] p-2 lg:p-4"
              style={{
                height: "calc(100svh - 72px)",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </ReduxUserStateProvider>
  );
}
