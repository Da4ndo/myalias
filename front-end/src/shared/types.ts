export interface Alias {
  id: number;
  real_email: string;
  alias_email: string;
  enable: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  accepted: boolean;
  plan: string;
}
