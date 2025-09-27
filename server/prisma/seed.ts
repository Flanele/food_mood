import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL! } },
});

const defaults = [
  // Яйца
  { normalizedName: 'EGG', gramsPerPiece: 50, source: 'default' },
  { normalizedName: 'EGG SMALL', gramsPerPiece: 45, source: 'default' },
  { normalizedName: 'EGG LARGE', gramsPerPiece: 60, source: 'default' },
  { normalizedName: 'EGG WHITE', gramsPerPiece: 33, source: 'default' },
  { normalizedName: 'EGG YOLK', gramsPerPiece: 17, source: 'default' },

  // Овощи/фрукты
  { normalizedName: 'GARLIC CLOVE', gramsPerPiece: 5, source: 'default' },
  { normalizedName: 'ONION', gramsPerPiece: 110, source: 'default' },
  { normalizedName: 'SHALLOT', gramsPerPiece: 50, source: 'default' },
  { normalizedName: 'CARROT', gramsPerPiece: 70, source: 'default' },
  { normalizedName: 'POTATO', gramsPerPiece: 170, source: 'default' },
  { normalizedName: 'SWEET POTATO', gramsPerPiece: 200, source: 'default' },
  { normalizedName: 'TOMATO', gramsPerPiece: 120, source: 'default' },
  { normalizedName: 'CHERRY TOMATO', gramsPerPiece: 17, source: 'default' },
  { normalizedName: 'CUCUMBER', gramsPerPiece: 200, source: 'default' },
  { normalizedName: 'BELL PEPPER', gramsPerPiece: 150, source: 'default' },
  { normalizedName: 'MUSHROOM', gramsPerPiece: 18, source: 'default' }, // white button, medium

  // Фрукты
  { normalizedName: 'BANANA', gramsPerPiece: 120, source: 'default' },
  { normalizedName: 'APPLE', gramsPerPiece: 180, source: 'default' },
  { normalizedName: 'PEAR', gramsPerPiece: 180, source: 'default' },
  { normalizedName: 'ORANGE', gramsPerPiece: 130, source: 'default' },
  { normalizedName: 'MANDARIN', gramsPerPiece: 90, source: 'default' },
  { normalizedName: 'LEMON', gramsPerPiece: 100, source: 'default' },
  { normalizedName: 'LIME', gramsPerPiece: 70, source: 'default' },
  { normalizedName: 'KIWI', gramsPerPiece: 75, source: 'default' },
  { normalizedName: 'AVOCADO', gramsPerPiece: 200, source: 'default' },

  // Зелень/лук
  { normalizedName: 'GREEN ONION', gramsPerPiece: 15, source: 'default' }, // 1 стебель
  { normalizedName: 'SPRING ONION', gramsPerPiece: 25, source: 'default' }, // кочанок маленький

  // Бейкери/снэки
  { normalizedName: 'BREAD SLICE', gramsPerPiece: 25, source: 'default' },
  { normalizedName: 'TORTILLA', gramsPerPiece: 40, source: 'default' }, // средняя
  { normalizedName: 'RICE CAKE', gramsPerPiece: 9, source: 'default' },
  { normalizedName: 'CHOCOLATE SQUARE', gramsPerPiece: 5, source: 'default' },
  { normalizedName: 'CHOCOLATE BAR', gramsPerPiece: 90, source: 'default' }, // плитка стандарт
  { normalizedName: 'COOKIE', gramsPerPiece: 12, source: 'default' },
];

async function main() {
  for (const d of defaults) {
    await prisma.pieceWeight.upsert({
      where: { normalizedName: d.normalizedName },
      update: { gramsPerPiece: d.gramsPerPiece, source: d.source },
      create: d,
    });
  }
}

main().finally(() => prisma.$disconnect());
