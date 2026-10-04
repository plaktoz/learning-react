export interface CreditCard {
  label: string;
  number: string;
  used: number;
  limit: number;
  dueDate: string;
}

export interface SavingsAccount {
  label: string;
  number: string;
  balance: number;
  currency: string;
}

export interface UserAccounts {
  savings: SavingsAccount;
  creditCards: CreditCard[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  accounts: UserAccounts;
}

export interface LoginResult {
  success: boolean;
  userId?: number;
  error?: string;
}
