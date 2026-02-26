import { prisma } from "./prisma";
import { User, type UserRole } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/user-repository";

export class PrismaUserRepository implements UserRepository {
  private prisma = prisma;

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    return new User({
      id: user.id,           // ← id do banco
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      role: user.role as UserRole,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      role: user.role as UserRole,
    });
  }

  async create(user: User): Promise<void> {
    // Usa o id gerado pela entidade de domínio (crypto.randomUUID no User)
    // para garantir que user.id === id no banco após o create
    await this.prisma.user.create({
      data: {
        id: user.id,              // ← passa o id do domínio para o banco
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        role: user.role,
      },
    });
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        role: user.role,
      },
    });
  }
}
