import { User } from 'src/users/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      clientId?: string;
    }
  }
}
