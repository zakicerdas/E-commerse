import prisma from "../prisma";
import type { User } from "../generated/client";

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    where: { deletedAt: null },
    include: {
      transactions: true,
    },
  });
};

export const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  await getUserById(id);

  delete (data as any).password;

  return await prisma.user.update({
    where: { id },
    data,
  });
};


export const deleteUser = async (id: string): Promise<User> => {
  await getUserById(id);

  return await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const searchUsers = async (
  name?: string,
  email?: string
): Promise<User[]> => {
  return await prisma.user.findMany({
    where: {
      deletedAt: null,
      AND: [
        name
          ? { name: { contains: name, mode: "insensitive" } }
          : {},
        email
          ? { email: { contains: email, mode: "insensitive" } }
          : {},
      ],
    },
  });
};