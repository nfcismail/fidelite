import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_PASSWORD || "mokajoy2026";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: "admin@mokajoy.ma" },
    update: { passwordHash },
    create: {
      email: "admin@mokajoy.ma",
      name: "Propriétaire",
      passwordHash,
      role: "owner",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@mokajoy.ma" },
    update: {},
    create: {
      email: "staff@mokajoy.ma",
      name: "Serveur",
      passwordHash: await bcrypt.hash("staff123", 10),
      role: "staff",
    },
  });

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      brandName: "Moka Joy",
      tagline: "La fidélité qui régale",
      welcomeText: "Scannez, collectionnez, savourez.",
      primaryColor: "#3D2314",
      accentColor: "#C47A3A",
      displayFont: "Fraunces",
      bodyFont: "Source Sans 3",
      address: "Jet Sakan, Agadir 80000",
      phone: "06 90 75 59 73",
      instagramUrl: "https://www.instagram.com/mokajoycafe/",
      mapsUrl:
        "https://www.google.com/maps/place/moka+joy/data=!4m2!3m1!1s0xdb3b7be6340dcbf:0x5e35730ef7bb1876",
      stampsDefault: 10,
    },
  });

  const rewardCount = await prisma.reward.count();
  if (rewardCount === 0) {
    await prisma.reward.createMany({
      data: [
        {
          title: "Café offert",
          stampsRequired: 10,
          active: true,
          sortOrder: 0,
        },
        {
          title: "Pâtisserie offerte",
          stampsRequired: 8,
          active: true,
          sortOrder: 1,
        },
      ],
    });
  }

  console.log("Seed OK");
  console.log("  Owner: admin@mokajoy.ma /", password);
  console.log("  Staff: staff@mokajoy.ma / staff123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
