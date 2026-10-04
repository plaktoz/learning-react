// Types that mirror the backend API responses.
// No data, no logic — shapes only.

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

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  accounts: UserAccounts;
}
