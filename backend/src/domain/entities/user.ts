import { z } from "zod";

export type UserRole = "ADMIN" | "ORGANIZER" | "GUEST";

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    // Validação de regra de negócio com Zod antes de criar a instância
    const emailSchema = z.string().email();
    emailSchema.parse(props.email);

    this.props = props;
  }

  // Getters para proteger o acesso
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get role() { return this.props.role; }
  get passwordHash() { return this.props.passwordHash; }
}