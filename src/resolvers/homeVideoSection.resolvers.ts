import z from "zod";

const homeVideoValidationSchema = z.object({
    videoUrl: z.string().min(1, "Video URL is required"),
    title: z.string().min(1, "Video title is required"),
    description: z.string().min(1, "Video description is required"),
});

const homeVideoSectionValidationSchema = z.object({
    title: z.string().min(1, "Section title is required"),
    description: z.string().min(1, "Section description is required"),
    videos: z.array(homeVideoValidationSchema).min(1, "At least one video is required"),
    ctaButtonLabel: z.string().min(1, "CTA button label is required"),
    ctaButtonLink: z.string().min(1, "CTA button link is required"),
});

const updateHomeVideoSectionValidationSchema = homeVideoSectionValidationSchema.partial();

export const HomeVideoSectionResolvers = {
    homeVideoSectionValidationSchema,
    updateHomeVideoSectionValidationSchema,
};
