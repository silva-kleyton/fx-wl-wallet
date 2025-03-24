import removeSpaceString from "./remove-space-string";

describe("Mask - Remove space string", () => {
  it("", () => {
    const text = removeSpaceString("MG 123 456");

    expect(text).toHaveLength(8);
  });
});
