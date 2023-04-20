import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      <div className="bg-slate-500">
        <div className="container mx-auto px-4 pt-24 pb-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight text-white">
              Unleash <span style={{textShadow: "0px 0px 16px rgba(66, 68, 90, 1);"}}>cinema experience</span> with {" "}
              <span className="pb-3 sm:pb-5 bg-clip-text text-primary-500">tailored</span>
            </h1>
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight text-white">
              <span className="pb-3 sm:pb-5 bg-clip-text text-primary-500">movie recommendations</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        ...
      </div>
    </main>
  );
}
