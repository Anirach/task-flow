declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name: string;
      email: string;
      avatar: string;
      role: string;
    };
    projectRole?: string;
  }
}
