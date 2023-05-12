import invariant from "tiny-invariant";
import { getMovie } from "./movie.server";
import { json } from "@remix-run/node";

export const loaderMovie = async ({ params, request }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const movie = await getMovie(params.slug);
  invariant(movie, `Movie not found: ${params.slug}`);

  return json({ movie });
};