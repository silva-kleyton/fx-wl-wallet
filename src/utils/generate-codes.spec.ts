import { generateCodeTansaction } from "./generate-codes";

describe("Generate code", () => {
  it("validate code length 10 caracteres", () => {
    const code = generateCodeTansaction();

    expect(code).toHaveLength(10);
  });
});
