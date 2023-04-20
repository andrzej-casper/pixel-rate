import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

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

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post",
      markdown: `
  # This is my first post

  Isn't it great?
      `.trim(),
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
      markdown: `
  # 90s Mixtape

  - I wish (Skee-Lo)
  - This Is How We Do It (Montell Jordan)
  - Everlong (Foo Fighters)
  - Ms. Jackson (Outkast)
  - Interstate Love Song (Stone Temple Pilots)
  - Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
  - Just a Friend (Biz Markie)
  - The Man Who Sold The World (Nirvana)
  - Semi-Charmed Life (Third Eye Blind)
  - ...Baby One More Time (Britney Spears)
  - Better Man (Pearl Jam)
  - It's All Coming Back to Me Now (Céline Dion)
  - This Kiss (Faith Hill)
  - Fly Away (Lenny Kravits)
  - Scar Tissue (Red Hot Chili Peppers)
  - Santa Monica (Everclear)
  - C'mon N' Ride it (Quad City DJ's)
      `.trim(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  const movies = [
    {
      slug: "skazani-na-shawshank",
      title: "Skazani na Shawshank",
      pictureUrl: "https://fwcdn.pl/fpo/10/48/1048/6925401.2.jpg",
    },
    {
      slug: "nietykalni",
      title: "Nietykalni",
      pictureUrl: "https://fwcdn.pl/fpo/33/90/583390/7441162.2.jpg",
    },
    {
      slug: "zielona-mila",
      title: "Zielona Mila",
      pictureUrl: "https://fwcdn.pl/fpo/08/62/862/7517878.2.jpg",
    },
    {
      slug: "ojciech-chrzestny",
      title: "Ojciech chrzestny",
      pictureUrl: "https://fwcdn.pl/fpo/10/89/1089/7196615.2.jpg",
    },
    {
      slug: "dwunastu-gniewnych-ludzi",
      title: "Dwunastu gniewnych ludzi",
      pictureUrl: "https://fwcdn.pl/fpo/07/01/30701/7492190.2.jpg",
    },
    {
      slug: "forrest-gump",
      title: "Forrest Gump",
      pictureUrl: "https://fwcdn.pl/fpo/09/98/998/8021615.2.jpg",
    },
    {
      slug: "lot-nad-kukulczym-gniazdem",
      title: "Lot nad kukułczym gniazdem",
      pictureUrl: "https://fwcdn.pl/fpo/10/19/1019/8055822.2.jpg",
    },
    {
      slug: "ojciec-chrzestny-ii",
      title: "Ojciec chrzestny II",
      pictureUrl: "https://fwcdn.pl/fpo/10/90/1090/7196616.2.jpg",
    },
    {
      slug: "wladca-piercieni-powrot-krola",
      title: "Władca Pierścieni: Powrót króla",
      pictureUrl: "https://fwcdn.pl/fpo/18/41/11841/7494142.2.jpg",
    },
    {
      slug: "lista-schindlera",
      title: "Lista Schindlera",
      pictureUrl: "https://fwcdn.pl/fpo/12/11/1211/7254286.2.jpg",
    },
  ];

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
