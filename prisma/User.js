import prisma from "./prisma";

export const getUserByEmail = async (email) => {
  const user = prisma.user.findUnique({
    where: {
      email
    }
  })

  return user
}