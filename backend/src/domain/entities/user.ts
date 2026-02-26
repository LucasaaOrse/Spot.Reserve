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
  private _id: string;     // ← id sempre garantido

  constructor(props: UserProps) {
    const emailSchema = z.string().email();
    emailSchema.parse(props.email);

    this.props = props;
    // Se id vier no props (usuário vindo do banco), usa ele.
    // Se não vier (novo usuário), gera UUID agora.
    this._id = props.id ?? crypto.randomUUID();
  }

  get id(): string { return this._id; }   // ← nunca undefined
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get role() { return this.props.role; }
  get passwordHash() { return this.props.passwordHash; }
}
