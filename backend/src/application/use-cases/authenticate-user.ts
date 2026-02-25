import type { UserRepository } from "../../domain/repositories/user-repository";
import bcrypt from "bcryptjs";

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export class AuthenticateUser {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: AuthenticateUserRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const doesPasswordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!doesPasswordMatches) {
      throw new Error("Invalid credentials.");
    }

    return { user };
  }
}