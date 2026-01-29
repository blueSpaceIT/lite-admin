import { z } from "zod";

const sliderValidationSchema = z.object({
    images: z.array(z.string()).nullable(),
});

const sliderGalleryValidationSchema = z.object({
    url: z.string(),
    destination: z.string(),
});

export const SliderResolvers = {
    sliderValidationSchema,
    sliderGalleryValidationSchema,
};
