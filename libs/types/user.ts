export enum UserRole {
  mentor = 'mentor',
  mentee = 'mentee',
}

export enum NewUserRole {
  player = 'player',
  coach = 'coach',
  trainer = 'trainer',
  agent = 'agent',
}

export type RoleTypes = keyof typeof UserRole;

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  cpassword?: string;
};

export type LoginInfo = {
  email: string;
  password: string;
};
