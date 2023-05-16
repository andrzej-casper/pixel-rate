import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MovieView } from "~/components/movie";

import { getMovies } from "~/models/movie.server";

export const loader = async () => {
  return json({ movies: await getMovies() });
};

export default function Movies() {
  const { movies } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto px-4">
      <div className="text-3xl font-extrabold sm:text-4xl py-10 items-center select-none">
        <h1 className="text-primary-900">
          <Link to="/movies">
            Movies
          </Link>
        </h1>
      </div>
      <ul className="grid grid-cols-3 gap-x-12 gap-y-8">
        {movies.map((movie) => (
          <li key={movie.slug}>
            <MovieView movie={movie} />
          </li>
        ))}
      </ul>
    </main>
  );
}
