export const pricingRule = {
  default: {
    price: 0.05,
    feePercentage: 0.5,
  },
  highTurnover: {
    discountThresholdAmount: 1000,
    discountRate: 0.03,
  },
} as const;
