export enum PlanTypes {
  FREE = "Free Plan",
  BASIC = "Basic Plan",
  PREMIUM = "Premium Plan",
  VIP = "VIP Plan",
  PRO = "Pro Plan",
}

export const FreePlanMock = {
  id: "9ca30c0b-31df-4fc9-a1e7-eb6afeeb4b11",
  name: PlanTypes.FREE,
  percent: 70,
  price: 0,
}

export const ProPlanMock = {
  id: "9ca30c0b-31df-4fc9-a1e7-eb6afeeb4b12",
  name: PlanTypes.PRO,
  percent: 10,
  price: 50,
}

export enum PlanTranslationsTypes {
  "Free Plan" = "FREE",
  "Basic Plan" = "BASIC",
  "Premium Plan" = "PREMIUM",
  "VIP Plan" = "VIP",
  "Pro Plan" = "PRO",
}

export const BasicPlan = {
  type: PlanTypes.BASIC,
  fee: 1,
  price: 25,
  subscription: 400,
}

export const FreePlan = {
  type: PlanTypes.BASIC,
  fee: 1,
  price: 25,
  subscription: 400,
}

export const PremiumPlan = {
  type: PlanTypes.PREMIUM,
  fee: 1.5,
  price: 50,
  subscription: 400,
}

export const VipPlan = {
  type: PlanTypes.VIP,
  fee: 2,
  price: 100,
  subscription: 400,
}
export const ProPlan = {
  type: PlanTypes.PRO,
  fee: 1,
  price: 50,
  subscription: 400,
}

// TODO: This should be a fixture
export const Plans = {
  [PlanTypes.FREE]: FreePlan,
  [PlanTypes.BASIC]: BasicPlan,
  [PlanTypes.PREMIUM]: PremiumPlan,
  [PlanTypes.VIP]: VipPlan,
  [PlanTypes.PRO]: ProPlan,
}

export type Plan = {
  id: string
  name: PlanTypes
  percent: number
  price: number
}
