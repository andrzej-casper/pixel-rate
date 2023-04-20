import { V2_MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MovieView } from "~/components/movie";
import { getMovies } from "~/models/movie.server";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async () => {
  return json({ movies: await getMovies() });
};

export default function Index() {
  const user = useOptionalUser();
  const { movies } = useLoaderData<typeof loader>();

  const randomMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <main className="mb-6">
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
          <div className="flex justify-center mt-20">
            <Link to="/register">
              <span className="rounded-lg bg-primary-600 hover:bg-primary-700 shadow-xl text-white py-4 px-8 text-xl mx-auto">
                Try <b>PixelRate</b> for free
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold sm:text-4xl text-primary-900 py-10">
          Movies{"  "}
          <Link to="/movies">
            <span className="text-2xl text-primary-800">
              - see all
            </span>
          </Link>
        </h1>
        <ul className="grid grid-cols-3 gap-x-12 gap-y-8">
          {randomMovies.map((movie) => (
            <li key={movie.slug}>
              <MovieView movie={movie} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
