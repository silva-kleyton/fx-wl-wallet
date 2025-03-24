import removeSpaceString from "./remove-space-string";

export default function removeMaskRG(text: string): string {
  return removeSpaceString(
    text.replace(/,/g, "").replace(/\./g, "").replace(/\-/g, "")
  );
}
