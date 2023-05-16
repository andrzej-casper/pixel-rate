import type { V2_MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useEffectOnce } from "~/hooks";

export const meta: V2_MetaFunction = () => [{ title: "NFT Claimed" }];

export default function NFTSuccess() {
  useEffectOnce(() => {
    toast.success("NFT claimed!");
  });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        Thank you for participating in the workshop!
      </div>
    </div>
  );
}
