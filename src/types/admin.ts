
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  dateCreated: string;
}

export interface NewUserForm {
  name: string;
  email: string;
  password: string;
}
