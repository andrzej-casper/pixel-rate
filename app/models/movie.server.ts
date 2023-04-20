import { prisma } from "~/db.server";
import type { Movie } from "@prisma/client";

export async function getMovies() {
  return prisma.movie.findMany();
}

export async function getMovie(slug: string) {
  return prisma.movie.findUnique({ where: { slug } });
}
