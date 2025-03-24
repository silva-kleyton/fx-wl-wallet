import { maskMoneyInt } from "./add-mask-money";

describe("Add mask integer value", () => {
  it("add mask", () => {
    const text = maskMoneyInt(1000 / 100);
    const text2 = maskMoneyInt(1001 / 100);

    expect(text).toStrictEqual("R$ 10,00");
    expect(text2).toStrictEqual("R$10,01");
  });
});
