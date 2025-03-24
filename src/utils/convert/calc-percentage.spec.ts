import { calcPercentage } from "./calc-percentage";

describe("calc percentage", () => {
  it("round calc", () => {
    const ammout = 54433;
    const percentage = 2.3;
    const resultExpect = 1252;
    const result = calcPercentage(ammout, percentage);

    expect(result).toEqual(resultExpect);
  });
});
