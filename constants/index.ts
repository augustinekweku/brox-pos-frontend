export const PACKAGE_SUBSCRIPTIONS = [
  {
    id: 1,
    name: "Basic",
    price: 150,
    maximumUsers: 1,
    maximumOrganizations: 1,
    maximumStorage: 20000, // in Kb
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    id: 2,
    name: "Pro",
    price: 19.99,
    maximumOrganizations: 5,
    maximumUsers: 5,
    maximumStorage: 50000, // in Kb
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    id: 3,
    name: "Enterprise",
    price: 29.99,
    maximumUsers: 10,
    maximumOrganizations: 10,
    maximumStorage: 100000, // in Kb
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
];

export const USER_ROLES = {
  ADMIN: "admin",
  SALES_PERSON: "sales_person",
};

export const PAYMENT_METHODS = {
  cash: {
    name: "Cash",
    logo: "/images/svg/cash.svg",
    isActivated: true,
  },
  mobile_money: {
    name: "Mobile Money",
    logo: "/images/svg/mobile-money.svg",
    isActivated: false,
  },
  card: {
    name: "Bank Card",
    logo: "/images/svg/card-payment.svg",
    isActivated: false,
  },
};

export enum subscriptionPackage {
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export const COOKIE_KEY = "broxPosToken";
