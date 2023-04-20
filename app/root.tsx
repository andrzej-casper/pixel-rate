import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ToastContainer } from 'react-toastify';

import logo from "./images/logo.png";

import { getUser } from "~/session.server";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import commonStylesheetUrl from "~/styles/common.css";
import toastifyStylesheetUrl from "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "./context";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  { rel: "stylesheet", href: commonStylesheetUrl },
  { rel: "stylesheet", href: toastifyStylesheetUrl },
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  const user = useOptionalUser();

  return (
    <AppProvider>
      <html lang="en" className="h-full">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="flex flex-col h-full bg-gray-50">
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
                  { user !== undefined &&
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="items-center px-4 py-2 border border-transparent text-base font-medium text-white hover:text-gray-300"
                      >
                        Logout {user.email}
                      </button>
                    </Form>
                  }
                  { user === undefined &&
                    <Link to="/login">
                      <div className="items-center px-4 py-2 border border-transparent text-base font-medium text-white hover:text-gray-300">
                        Login
                      </div>
                    </Link>
                  }
                  { user === undefined &&
                    <Link to="/posts">
                      <div className="items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-md">
                        Get started
                      </div>
                    </Link>
                  }
                </div>
              </div>
            </div>
          </header>
          <main role="main" className="grow">
            <Outlet />
          </main>
          <footer className="container mx-auto p-6 text-center border-t">
            <p className="text-md text-gray-400">&copy; {new Date().getFullYear()}{" "} PixelRate</p>
          </footer>
          <ToastContainer position="bottom-right" />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </AppProvider>
  );
}
