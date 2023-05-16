import { Form, Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import useApp from "~/context";
import { useOptionalUser } from "~/utils";

import logo from "~/images/logo.png";

export default function Header() {
  const user = useOptionalUser();

  const { activeWalletKey, unsetActiveWalletKey } = useApp();

  const [walletKey, setWalletKey ] = useState(activeWalletKey);

  const walletDisconnect = () => {
    unsetActiveWalletKey();
  }

  useEffect(() => {
    console.log("Wallet Key is udpated!", activeWalletKey);
    setWalletKey(activeWalletKey)
  }, [activeWalletKey]);

  return (
    <header className="px-4 bg-slate-500">
      <div className="container mx-auto py-2">
        <div className="flex flex-row">
          <div className="flex-grow">
            <div className="flex flex-row items-center h-full select-none">
              <Link to="/" className="p-1">
                <img src={logo} alt="PixelRate" className="h-8 w-auto" />
              </Link>
            </div>
          </div>
          <div className="flex flex-row">
            { walletKey === null &&
              <Link to="/nft">
                <div className="items-center px-4 py-2 border border-transparent text-base font-medium text-primary-400 hover:text-primary-600">
                  Souvenir NFT
                </div>
              </Link>
            }
            { walletKey !== null &&
              <button
                type="submit"
                className="items-center px-4 py-2 border border-transparent text-base font-medium text-white hover:text-gray-300"
                onClick={() => walletDisconnect()}
              >
                  Logout {walletKey.substring(0, 4)}..{walletKey.slice(-4)}@casper
              </button>
            }
            { user !== undefined && walletKey === null &&
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="items-center px-4 py-2 border border-transparent text-base font-medium text-white hover:text-gray-300"
                >
                  Logout {user.email}
                </button>
              </Form>
            }
            { user === undefined && walletKey === null &&
              <Link to="/login">
                <div className="items-center px-4 py-2 border border-transparent text-base font-medium text-white hover:text-gray-300">
                  Login
                </div>
              </Link>
            }
            { user === undefined && walletKey === null &&
              <Link to="/join">
                <div className="items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-md">
                  Get started
                </div>
              </Link>
            }
          </div>
        </div>
      </div>
    </header>
  );
}