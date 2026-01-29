import { z } from "zod";

/* =========================
   COMMON SCHEMAS
========================= */

const durationSchema = z.object({
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
  seconds: z.number().min(0).max(59),
});

/* =========================
   LIVE CLASS
========================= */

const createLiveClassValidationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  joinURL: z.string(),
  joinID: z.string().optional(),
  passcode: z.string().optional(),
  startTime: z.iso.datetime({ offset: true }),
  endTime: z.iso.datetime({ offset: true }),
});

const updateLiveClassValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  joinURL: z.string().optional(),
  joinID: z.string().optional(),
  passcode: z.string().optional(),
  startTime: z.iso.datetime({ offset: true }).optional(),
  endTime: z.iso.datetime({ offset: true }).optional(),
});

/* =========================
   LECTURE (WITH OTHER)
========================= */

const createLectureValidationSchema = z
  .object({
    title: z.string(),
    server: z.enum(["YouTube", "Vimeo", "Bunny", "Other"]),
    video: z.string().optional(),
    videoFile: z.instanceof(File).optional(),
    duration: durationSchema,
    isFree: z.boolean(),
    tags: z.array(z.string()),
  })
  .refine(
    (data) => (data.server === "Other" ? !!data.videoFile : !!data.video),
    {
      message: "Video is required",
      path: ["video"],
    },
  );

const updateLectureValidationSchema = z
  .object({
    title: z.string().optional(),
    server: z.enum(["YouTube", "Vimeo", "Bunny", "Other"]).optional(),
    video: z.string().optional(),
    videoFile: z.instanceof(File).optional(),
    duration: durationSchema.partial().optional(),
    isFree: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.server === "Other") {
        return !!data.videoFile;
      }
      if (data.server) {
        return !!data.video;
      }
      return true;
    },
    {
      message: "Video is required",
      path: ["video"],
    },
  );

/* =========================
   NOTE
========================= */

const createNoteValidationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pdfURL: z.string(),
});

const updateNoteValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  pdfURL: z.string().optional(),
});

/* =========================
   EXAM
========================= */

const createExamValidationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["MCQ", "CQ", "Gaps"]),
  totalQuestions: z.number(),
  totalMarks: z.number(),
  passingMarks: z.number(),
  positiveMarks: z.number(),
  negativeMarks: z.number(),
  duration: durationSchema,
  validity: z.iso.datetime({ offset: true }),
  questions: z.array(z.string()).optional(),
});

const updateExamValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["MCQ", "CQ", "Gaps"]).optional(),
  totalQuestions: z.number().optional(),
  totalMarks: z.number().optional(),
  passingMarks: z.number().optional(),
  positiveMarks: z.number().optional(),
  negativeMarks: z.number().optional(),
  duration: durationSchema.partial().optional(),
  result: z.boolean().optional(),
  validity: z.iso.datetime({ offset: true }).optional(),
  questions: z.array(z.string()).optional(),
});

/* =========================
   COURSE CONTENT
========================= */

const createCourseContentValidationSchema = z.object({
  course: z.string(),
  module: z.string(),
  type: z.enum(["Live Class", "Lecture", "Note", "Exam"]),
  content: z.object({
    liveClass: createLiveClassValidationSchema.optional(),
    lecture: createLectureValidationSchema.optional(),
    note: createNoteValidationSchema.optional(),
    exam: createExamValidationSchema.optional(),
  }),
  scheduledAt: z.iso.datetime({ offset: true }).nullable().optional(),
});

const updateCourseContentValidationSchema = z.object({
  content: z
    .object({
      liveClass: updateLiveClassValidationSchema.optional(),
      lecture: updateLectureValidationSchema.optional(),
      note: updateNoteValidationSchema.optional(),
      exam: updateExamValidationSchema.optional(),
    })
    .optional(),
  scheduledAt: z.iso.datetime({ offset: true }).nullable().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

/* =========================
   EXPORT
========================= */

export const CourseContentResolvers = {
  createCourseContentValidationSchema,
  updateCourseContentValidationSchema,
};
