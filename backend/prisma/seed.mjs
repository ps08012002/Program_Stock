import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Insert ke tb_kode
  const kode1 = await prisma.tb_kode.create({
    data: {
      kode_tinta: '001',
    },
  })
  const kode2 = await prisma.tb_kode.create({
    data: {
      kode_tinta: '003',
    },
  })
  const kode3 = await prisma.tb_kode.create({
    data: {
      kode_tinta: '008',
    },
  })
  const kode4 = await prisma.tb_kode.create({
    data: {
      kode_tinta: '664',
    },
  })
  const kode5 = await prisma.tb_kode.create({
    data: {
      kode_tinta: 'Ribbon LX',
    },
  })

  // Insert ke tb_warna
  await prisma.tb_warna.createMany({
    data: [
      { warna: 'Cyan', id_kode: kode1.id },
      { warna: 'Yellow', id_kode: kode1.id },
      { warna: 'Magenta', id_kode: kode1.id },
      { warna: 'Black', id_kode: kode1.id },

      { warna: 'Cyan', id_kode: kode2.id },
      { warna: 'Yellow', id_kode: kode2.id },
      { warna: 'Magenta', id_kode: kode2.id },
      { warna: 'Black', id_kode: kode2.id },

      { warna: 'Cyan', id_kode: kode3.id },
      { warna: 'Yellow', id_kode: kode3.id },
      { warna: 'Magenta', id_kode: kode3.id },
      { warna: 'Black', id_kode: kode3.id },

      { warna: 'Cyan', id_kode: kode4.id },
      { warna: 'Yellow', id_kode: kode4.id },
      { warna: 'Magenta', id_kode: kode4.id },
      { warna: 'Black', id_kode: kode4.id },

      { warna: 'Black', id_kode: kode5.id },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
