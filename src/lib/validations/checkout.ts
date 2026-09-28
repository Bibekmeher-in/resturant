import { z } from "zod";

const customerInformationSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters)."),
  mobile: z
    .string()
    .trim()
    .regex(
      /^(?:(?:\+91|91|0)[\s-]?)?[6-9]\d{9}$/,
      "Enter a valid 10-digit Indian mobile number.",
    ),
  email: z.string().trim().email("Enter a valid email address."),
  address: z
    .string()
    .trim()
    .min(8, "Enter a complete delivery address (at least 8 characters)."),
});

export const checkoutSchema = customerInformationSchema.extend({
  items: z
    .array(
      z.object({
        menuItemId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Add at least one item before placing your order."),
});

export const customerInformationResolverSchema = customerInformationSchema;

export type CheckoutFormValues = z.infer<typeof customerInformationSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
