import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LiveReload } from "remix-gitpod-livereload";
import { ToastContainer } from 'react-toastify';

import { getUser } from "~/session.server";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import commonStylesheetUrl from "~/styles/common.css";
import toastifyStylesheetUrl from "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "./context";
import Header from "./components/header";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  { rel: "stylesheet", href: commonStylesheetUrl },
  { rel: "stylesheet", href: toastifyStylesheetUrl },
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {

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
          <Header />
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
