import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import movies  from "./movies.json";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@casper.network";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("testtest", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { slug: movie.slug },
      update: movie,
      create: movie,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
