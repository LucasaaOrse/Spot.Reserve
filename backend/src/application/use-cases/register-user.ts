import { User, type UserRole } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/user-repository";
import bcrypt from "bcryptjs";

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password, role }: RegisterUserRequest) {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 6);

    const user = new User({
      name,
      email,
      passwordHash,
      role,
    });

    await this.userRepository.create(user);

    return { user };
  }
}