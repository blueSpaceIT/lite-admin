import { z } from "zod";

const marqueeValidationSchema = z.object({
    messages: z.array(z.string()).nullable(),
});

export const MarqueeResolvers = {
    marqueeValidationSchema,
};
