import z from "zod";

const createCourseValidationSchema = z
    .object({
        name: z.string().min(1, "Name cannot be empty"),
        code: z.string().min(1, "Code cannot be empty"),
        typeCode: z.string().min(1, "Type code cannot be empty"),
        shortDescription: z.string().optional(),
        description: z.string().min(1, "Description cannot be empty"),
        type: z.enum(["Online", "Offline"], {
            message: "Course type is invalid",
        }),
        category: z.string().nullable(),
        teachers: z.array(z.string()).nullable().optional(),
        price: z.number().nonnegative(),
        offerPrice: z.number().nonnegative().optional(),
        trailer: z.string().optional(),
        duration: z.tuple([z.string(), z.string()]),
        expiredTime: z.tuple([z.number(), z.string()]),
        routine: z.string().optional(),
        routinePDF: z.string().optional(),
        image: z.string().min(1, "Image cannot be empty"),
    })
    .superRefine((data, ctx) => {
        if (
            data.offerPrice !== undefined &&
            data.offerPrice > 0 &&
            data.offerPrice >= data.price
        ) {
            ctx.addIssue({
                path: ["offerPrice"],
                code: z.ZodIssueCode.custom,
                message: "Offer price must be less than price",
            });
        }
    });

const updateCourseValidationSchema = z
    .object({
        name: z.string().optional(),
        code: z.string().optional(),
        typeCode: z.string().optional(),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        type: z
            .enum(["Online", "Offline"], {
                message: "Course type is invalid",
            })
            .optional(),
        category: z.string().nullable().optional(),
        teachers: z.array(z.string()).nullable().optional(),
        price: z.number().nonnegative().optional(),
        offerPrice: z.number().nonnegative().optional(),
        trailer: z.string().optional(),
        duration: z.tuple([z.string(), z.string()]).optional(),
        expiredTime: z.tuple([z.number(), z.string()]).optional(),
        routine: z.string().optional(),
        routinePDF: z.string().optional(),
        image: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.price !== undefined &&
            data.offerPrice !== undefined &&
            data.offerPrice > 0 &&
            data.offerPrice >= data.price
        ) {
            ctx.addIssue({
                path: ["offerPrice"],
                code: z.ZodIssueCode.custom,
                message: "Offer price must be less than price",
            });
        }
    });

const courseDetailsValidationSchema = z.object({
    details: z
        .object({
            totalClasses: z.number().nonnegative().optional(),
            totalLiveClasses: z.number().nonnegative().optional(),
            totalLectures: z.number().nonnegative().optional(),
            totalNotes: z.number().nonnegative().optional(),
            totalExams: z.number().nonnegative().optional(),
        })
        .optional(),
});

export const CourseResolvers = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
    courseDetailsValidationSchema,
};
