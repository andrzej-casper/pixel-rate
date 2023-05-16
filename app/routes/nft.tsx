import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigate, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import { SOUVENIR_ENDPOINT } from "~/config";
import { logout } from "~/session.server";
import { toast } from "react-toastify";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import useApp from "~/context";
import { CLPublicKey } from "casper-js-sdk";
import { useEffectOnce } from "~/hooks";

export const loader = async ({ request }: LoaderArgs) => {
  // const userId = await getUserId(request);
  // if (userId) return redirect("/");

  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const userMessage = formData.get("userMessage");
  const fingerprint = formData.get("fingerprint");
  const accountHash = formData.get("account_hash");

  if (userMessage.length > 64) {
    return json(
      { errors: { userMessage: null, password: "Password is too long." } },
      { status: 400 }
    );
  }

  if (fingerprint == null || fingerprint.length == 0) {
    return json(
      { errors: { userMessage: null, password: "Fingerprint is required." } },
      { status: 400 }
    );
  }

  if (accountHash == null || accountHash.length == 0) {
    return json(
      { errors: { userMessage: null, password: "Account hash is required." } },
      { status: 400 }
    );
  }

  const data = {
    "account_hash": accountHash,
    "metadata": userMessage,
    "fingerprint": fingerprint,
  };

  console.log("Submitting", data);

  const response = await fetch(SOUVENIR_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  const result = await response.text();
  console.log("Souvenir result:", result);

  return redirect("/nft-success")
};

export const meta: V2_MetaFunction = () => [{ title: "Claim souvenir NFT" }];

export default function NFT() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const userMessageRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [fingerprint, setFingerprint] = useState("");
  const { activeWalletKey } = useApp();
  const [accountHash, setAccountHash ] = useState("");

  useEffectOnce(() => {
    if (!activeWalletKey) {
      toast.warning("You must be logged first.");
      navigate("/login");
      return;
    }
  });

  useEffect(() => {
    if (activeWalletKey !== null) {
      const accountHash = CLPublicKey.fromHex(activeWalletKey).toAccountRawHashStr();
      console.log("Got new wallet key", accountHash);
      setAccountHash(accountHash);
    }
  }, [activeWalletKey]);


  useEffect(() => {
    const fetchData = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      setFingerprint(visitorId);
    }

    fetchData()
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (actionData?.errors?.userMessage) {
      userMessageRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="userMessage"
              className="block text-sm font-medium text-gray-700"
            >
              Additional user message - stored in NFT's metadata
            </label>
            <div className="mt-1">
              <input
                ref={userMessageRef}
                id="userMessage"
                required
                autoFocus={true}
                name="userMessage"
                type="userMessage"
                autoComplete="userMessage"
                aria-invalid={actionData?.errors?.userMessage ? true : undefined}
                aria-describedby="userMessage-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                defaultValue="My NFT for participating in the Casper workshop"
              />
              {actionData?.errors?.userMessage && (
                <div className="pt-1 text-red-700" id="userMessage-error">
                  {actionData.errors.userMessage}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="fingerprint" value={fingerprint} />
          <input type="hidden" name="account_hash" value={accountHash} />

          <button
            type="submit"
            className="w-full rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 focus:bg-primary-400"
          >
            Claim souvenir 🎁
          </button>
        </Form>
      </div>
    </div>
  );
}
