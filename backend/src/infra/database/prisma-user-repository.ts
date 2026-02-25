import { prisma } from "./prisma";
import { User, type UserRole } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/user-repository";

export class PrismaUserRepository implements UserRepository {
  private prisma = prisma;

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    // Converte o modelo do Prisma para a Entidade de Domínio
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      role: user.role as UserRole,
    });
  }

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        role: user.role,
      },
    });
  }

  // Implemente os outros métodos (findById, save) seguindo a mesma lógica
  async findById(id: string): Promise<User | null> { 
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    // Converte o modelo do Prisma para a Entidade de Domínio
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      role: user.role as UserRole,
    });

   }
  async save(user: User): Promise<void> {
    

  }
}