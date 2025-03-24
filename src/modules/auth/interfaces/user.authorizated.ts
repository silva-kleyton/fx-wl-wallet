interface IUserAuthenticated {
  id: string;
  email: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user: IUserAuthenticated;
}
