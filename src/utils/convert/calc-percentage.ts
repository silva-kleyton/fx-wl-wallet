export const calcPercentage = (amount: number, percentage: number): number => {
  return Math.round(amount * (percentage / 100));
};
