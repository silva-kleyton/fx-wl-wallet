import { convertIntegerToFloat } from "./convert-integer-to-float";

describe("convert integer to float", () => {
  it("convert", () => {
    const result1 = convertIntegerToFloat(50);
    const result2 = convertIntegerToFloat(5037);
    const result3 = convertIntegerToFloat(3733);
    const result4 = convertIntegerToFloat(1000);
    const result5 = convertIntegerToFloat(10000);
    const result6 = convertIntegerToFloat(100000);
    const result7 = convertIntegerToFloat(100004);
    const result8 = convertIntegerToFloat(100030);

    expect(result1).toEqual(0.5);
    expect(result2).toEqual(50.37);
    expect(result3).toEqual(37.33);
    expect(result4).toEqual(10.0);
    expect(result5).toEqual(100.0);
    expect(result6).toEqual(1000.0);
    expect(result7).toEqual(1000.04);
    expect(result8).toEqual(1000.3);
  });
});
