import { startOfYesterday } from "date-fns";

describe("Dates", () => {
  it("Get yesterday date", () => {
    const date = new Date();
    const yesterday = startOfYesterday();

    date.setDate(date.getDate() - 1);

    expect(yesterday).toEqual(date);
  });
});
