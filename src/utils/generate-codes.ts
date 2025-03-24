import ShortUniqueId from "short-unique-id";

export function generateCodeTansaction() {
  const part1 = new ShortUniqueId({ length: 2, dictionary: "alpha_upper" });
  const part2 = new ShortUniqueId({ length: 8, dictionary: "alphanum_upper" });
  return `${part1.rnd()}${part2.rnd()}`;
}
