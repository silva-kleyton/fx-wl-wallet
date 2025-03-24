import removeMaskRG from "./remove-mask";
import removeSpaceString from "./remove-space-string";

describe("Mask - Remove Mask", () => {
  it("Remove mask RG", () => {
    const text = removeMaskRG("MG 123 1.1,456-08");

    expect(text).toHaveLength(12);
  });
});
