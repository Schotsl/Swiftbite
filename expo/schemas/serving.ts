import { z } from "zod";

export const servingSchema = z.object({
  sizeOption: z.string().min(1, "Please select a serving size"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (val) => {
        const number = parseFloat(val);
        const numberPositive = number > 0;

        return numberPositive;
      },
      {
        message: "Quantity must be a positive number",
      }
    ),
});

export type ServingData = z.infer<typeof servingSchema>;
