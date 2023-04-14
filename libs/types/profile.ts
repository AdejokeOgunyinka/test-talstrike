import { UserRole } from '@/libs/types/user';

export type Profile = {
  id: string;
  bio: string;
  country: string;
  designation: string;
  showSocialLinks: boolean;
  linkedinUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  [key: string]: any;
};

export type Languages = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Specialization = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Interests = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
export type ProfileBody = {
  gender?: string;
  trainings?: string;
  date_of_birth?: string;
  specialties?: string;
  position?: string;
  biography?: string;
  years_of_experience?: number;
  sport?: string;
  address?: string;
};

export type Certification = {
  id: string;
  userId: string;
  title: string;
  organizationName: string;
  credentialId: string;
  credentialLink: string;
  dateIssued: string;
  imageUrl?: string;
};

export type Experience = {
  id: string;
  userId: string;
  title: string;
  organizationName: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl?: string;
};

export type Education = {
  id: string;
  userId: string;
  degree: string;
  schoolName: string;
  fieldOfStudy: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
};

export type ProfilePhotoBody = {
  imageUrl: string;
};
export type UsernameBody = {
  username: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  role: UserRole;
  languages: Partial<Languages[]>;
  specializations: Partial<Specialization[]>;
  profile: Partial<Profile> | null;
  [key: string]: any;
  interests: Partial<Interests[]>;
  certifications: Certification[];
  experiences: Experience[];
  educations: Education[];
};
