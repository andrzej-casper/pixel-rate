import invariant from "tiny-invariant";
import { getMovie } from "./movie.server";
import { readFile } from "fs/promises";
import { json } from "@remix-run/node";
import path from "path";

export const loaderMovieWasm = async ({ params, request }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const movie = await getMovie(params.slug);
  invariant(movie, `Movie not found: ${params.slug}`);

  // read session WASM
  const filePath = path.resolve(__dirname, '../contract/contract/target/wasm32-unknown-unknown/release/contract.wasm')
  const file = await readFile(filePath);
  const ratingWasm = new Uint8Array(file.buffer);

  const ratingWasmStr = btoa(String.fromCharCode.apply(null, ratingWasm));

  return json({ movie, ratingWasmStr });
};