import {z} from "zod"

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(5, "Name must be at least 5 characters!!"),
  password: z.string().min(6, "Password must be at least 6 characters!!"),
  role: z.enum(["ADMIN", "STUDENT"]).default("STUDENT")
});


export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters!!")
});

export const otpVerifySchema=z.object({
    email:z.string().email(),
    otp:z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
})

export const uploadNoteSchema = z.object({
  title: z.string().min(1),
  branch: z.union([z.string(), z.array(z.string())]), // <-- allow array or string
  semester: z.string(),
  subjectId: z.string().uuid(),
  fileUrl: z.string().url(),
});

export const tipSchema= z.object({
    title: z.string().min(5),
    content: z.string().min(10)
})

export const feedbackSchema = z.object({
  content: z.string().min(5),
  noteId: z.string().uuid().optional(),
  tipId: z.string().uuid().optional()
}).refine((data) => data.noteId || data.tipId, {
  message: "Either noteId or tipId must be provided"
});

// by admin
export const subjectSchema = z.object({
  name: z.string().min(1),
  branch: z.string().min(1),
  semester: z.number().min(1).max(8)
});


export const announcementSchema = z.object({//admin
  title: z.string().min(3),
  message: z.string().min(10)
});


export const eventSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  })
});


export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6)
});

// admin
export const moderateTipSchema = z.object({
  tipId: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"])
});

// admin
export const moderateNoteSchema = z.object({
  noteId: z.string().uuid(),
  approved: z.boolean()
});

// admin
export const deleteUserSchema = z.object({
  userId: z.string().uuid()
});

//admin
export const deleteContentSchema = z.object({
  type: z.enum(["TIP", "NOTE", "FILE", "FEEDBACK"]),
  id: z.string().uuid()
});
