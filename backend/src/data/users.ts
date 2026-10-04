import type { User } from "../types";

export const USERS: User[] = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    password: "password123",
    accounts: {
      savings: { label: "Savings Account", number: "**** 4821", balance: 24_530.75, currency: "USD" },
      creditCards: [
        { label: "Platinum Visa",    number: "**** 9032", used: 1_240.50, limit: 5_000,  dueDate: "15 Aug 2025" },
        { label: "World Mastercard", number: "**** 1177", used: 3_890.00, limit: 8_000,  dueDate: "22 Aug 2025" },
      ],
    },
  },
  {
    id: 2,
    name: "Jamie Lee",
    email: "jamie.lee@example.com",
    password: "letmein456",
    accounts: {
      savings: { label: "Savings Account", number: "**** 2293", balance: 8_765.40, currency: "USD" },
      creditCards: [
        { label: "Gold Visa",           number: "**** 5541", used: 4_200.00, limit: 6_000,  dueDate: "10 Aug 2025" },
        { label: "Everyday Mastercard", number: "**** 8820", used:   310.75, limit: 2_000,  dueDate: "18 Aug 2025" },
      ],
    },
  },
  {
    id: 3,
    name: "Sam Taylor",
    email: "sam.taylor@example.com",
    password: "qwerty789",
    accounts: {
      savings: { label: "Savings Account", number: "**** 7734", balance: 51_200.00, currency: "USD" },
      creditCards: [
        { label: "Infinite Visa",       number: "**** 3309", used:   920.00, limit: 15_000, dueDate: "5 Aug 2025"  },
        { label: "Business Mastercard", number: "**** 6612", used: 7_450.00, limit: 10_000, dueDate: "28 Aug 2025" },
      ],
    },
  },
];
