import { z } from "zod";

// Validation Schema
export const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    title: z.string().min(2, "Title is required"),
    phone: z.string().nullable().optional(),
    email: z.string().email("Valid email required"),
    portfolioWebsite: z.string().nullable().optional(),
    linkedInUrl: z.string().nullable().optional(),
    summary: z.string().min(50, "Summary must be at least 50 characters"),
  }),
  experience: z.array(
    z.object({
      company: z.string().min(2, "Company name required"),
      position: z.string().min(2, "Position required"),
      duration: z.string().min(2, "Duration required"),
      achievements: z.array(
        z.string().min(10, "Achievement must be descriptive"),
      ),
    }),
  ),
  skills: z.object({
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    databases: z.array(z.string()),
    architectures: z.array(z.string()),
    tools: z.array(z.string()),
    methodologies: z.array(z.string()),
    other: z.array(z.string()),
  }),
  education: z.array(
    z.object({
      degree: z.string().min(2, "Degree required"),
      institution: z.string().min(2, "Institution required"),
      year: z.string().min(4, "Year required"),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string().min(2, "Project name required"),
      link: z.string().nullable().optional(),
      role: z.string().min(2, "Role required"),
      description: z.string().min(20, "Description must be detailed"),
      technologies: z.array(z.string()),
      features: z.array(z.string()),
    }),
  ),
  achievements: z.array(z.string()),
  interests: z.array(z.string()),
});

export const defaultValues = {
  personalInfo: {
    name: "",
    title: "",
    phone: "",
    email: "",
    summary: "",
    portfolioWebsite: "",
    linkedInUrl: "",
  },
  experience: [
    {
      company: "",
      position: "",
      duration: "",
      achievements: [""],
    },
  ],
  skills: {
    languages: [""],
    frameworks: [""],
    databases: [""],
    architectures: [""],
    tools: [""],
    methodologies: [""],
    other: [""],
  },
  education: [
    {
      degree: "",
      institution: "",
      year: "",
    },
  ],
  projects: [
    {
      name: "",
      link: "",
      role: "",
      description: "",
      technologies: [""],
      features: [""],
    },
  ],
  achievements: [""],
  interests: [""],
};
