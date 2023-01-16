import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createLog = async (data: any) => {
  await prisma.logs.create({
    data: data,
  });
};

const createSensorsData = async (data: any) => {
  await prisma.sensors_data.create({
    data: data,
  });
};

export { createSensorsData, createLog };
