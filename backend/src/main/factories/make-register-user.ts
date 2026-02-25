import { RegisterUser } from "../../application/use-cases/register-user";
import { PrismaUserRepository } from "../../infra/database/prisma-user-repository";

export function makeRegisterUser() {
  const userRepository = new PrismaUserRepository();
  const registerUser = new RegisterUser(userRepository);

  return registerUser;
}