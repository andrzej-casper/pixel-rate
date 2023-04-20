import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MovieView } from "~/components/movie";

import { getMovies } from "~/models/movie.server";

export const loader = async () => {
  return json({ movies: await getMovies() });
};

export default function Movies() {
  const { movies } = useLoaderData<typeof loader>();
  console.log(movies);
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl">Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.slug}>
            <MovieView movie={movie} />
          </li>
        ))}
      </ul>
    </main>
  );
}
