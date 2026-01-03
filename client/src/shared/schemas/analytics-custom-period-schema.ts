import z from "zod";

const parseMs = (s: string) => {
    const ms = Date.parse(s);
    return Number.isNaN(ms) ? null : ms;
  };

export const analyticsCustomPeriodSchema = z
  .object({
    from: z.string().min(1, "Required"),
    to: z.string().min(1, "Required"),
  })
  .refine((v) => new Date(v.to).getTime() >= new Date(v.from).getTime(), {
    path: ["to"],
    message: "To must be after From",
  })
  .refine(
    (v) => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return new Date(v.from).getTime() >= oneYearAgo.getTime();
    },
    { path: ["from"], message: "From can’t be older than 1 year" }
  );

export type AnalyticsPeriodInput = z.input<typeof analyticsCustomPeriodSchema>;
export type AnalyticsPeriodOutput = z.output<
  typeof analyticsCustomPeriodSchema
>;
