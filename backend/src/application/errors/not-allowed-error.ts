import { AppError } from './app-error'

export class NotAllowedError extends AppError {
  constructor() {
    super('Access denied', 403)
  }
}