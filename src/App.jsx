import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Download, Eye, Edit } from "lucide-react";

// Validation Schema
const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    title: z.string().min(2, "Title is required"),
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Valid email required"),
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
      role: z.string().min(2, "Role required"),
      description: z.string().min(20, "Description must be detailed"),
      technologies: z.array(z.string()),
      features: z.array(z.string()),
    }),
  ),
  achievements: z.array(z.string()),
  interests: z.array(z.string()),
});

const defaultValues = {
  personalInfo: {
    name: "",
    title: "",
    phone: "",
    email: "",
    summary: "",
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
      role: "",
      description: "",
      technologies: [""],
      features: [""],
    },
  ],
  achievements: [""],
  interests: [""],
};

export default function ResumeBuilder() {
  const [viewMode, setViewMode] = useState("edit");
  const [resumeData, setResumeData] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues,
    mode: "onChange",
  });

  const experienceFields = useFieldArray({ control, name: "experience" });
  const educationFields = useFieldArray({ control, name: "education" });
  const projectFields = useFieldArray({ control, name: "projects" });
  const achievementFields = useFieldArray({ control, name: "achievements" });
  const interestFields = useFieldArray({ control, name: "interests" });

  // Skill field arrays
  const languageFields = useFieldArray({ control, name: "skills.languages" });
  const frameworkFields = useFieldArray({ control, name: "skills.frameworks" });
  const databaseFields = useFieldArray({ control, name: "skills.databases" });
  const architectureFields = useFieldArray({
    control,
    name: "skills.architectures",
  });
  const toolFields = useFieldArray({ control, name: "skills.tools" });
  const methodologyFields = useFieldArray({
    control,
    name: "skills.methodologies",
  });
  const otherFields = useFieldArray({ control, name: "skills.other" });

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      reset(parsedData);
    }
  }, [reset]);

  const onSubmit = (data) => {
    setResumeData(data);
    localStorage.setItem("resumeData", JSON.stringify(data));
    setViewMode("preview");
  };

  const loadSampleData = () => {
    const sampleData = {
      personalInfo: {
        name: "ARUN GOKUL K",
        title: "Junior Software Developer",
        phone: "+917012227129",
        email: "arungokul36@gmail.com",
        summary:
          "Results-driven Backend Developer with 1.5 years of experience in building scalable web applications and RESTful APIs using Node.js and Express.js. Proficient in database design and management with PostgreSQL and MongoDB. Experienced in implementing real-time features using Socket.io and integrating frontend components using React.js. Adept at designing clean, maintainable code and collaborating with cross-functional teams to deliver robust backend solutions. Eager to contribute technical expertise and problem-solving skills to a growth-focused development team.",
      },
      experience: [
        {
          company: "UDYATA INFORMATION SYSTEMS PVT LTD",
          position: "Junior Software Developer",
          duration: "NOV 2023- Present",
          achievements: [
            "Built and maintained RESTful APIs using Node.js and Express.js, powering core features of web applications and improving integration efficiency by 30%.",
            "Developed and deployed real-time features with Socket.io, enhancing user interaction and reducing data sync latency by 40%.",
            "Managed 100% of backend development tasks, collaborating closely with frontend and QA teams to ensure seamless functionality and deployment.",
            "Optimized PostgreSQL and MongoDB queries, improving database performance and reducing API response times by 25%.",
            "Delivered all assigned projects within deadlines, contributing across the full SDLC including planning, development, testing, and production release.",
            "Implemented basic frontend components using React.js to support fullstack features and enhance UI integration.",
            "Participated in daily Agile Scrum ceremonies and sprint planning, contributing to an efficient and communicative development cycle.",
            "Collaborated with cross-functional teams and clients to gather requirements, resolve issues, and align project goals with business needs.",
            "Supported and mentored interns/new team members, fostering a collaborative team environment and smooth onboarding.",
          ],
        },
      ],
      skills: {
        languages: ["JavaScript", "SQL", "HTML", "CSS"],
        frameworks: ["Node.js", "Express.js", "React.js", "Socket.io"],
        databases: ["PostgreSQL", "MongoDB"],
        architectures: [
          "MVC Architecture",
          "RESTful API Design",
          "Real-time Applications",
        ],
        tools: ["Git", "Docker", "Postman", "VS Code"],
        methodologies: ["Agile", "Scrum"],
        other: [
          "API Integration",
          "Authentication (JWT, OAuth)",
          "Basic Frontend Development",
          "Debugging & Performance Optimization",
        ],
      },
      education: [
        {
          degree:
            "B.TECH IN COMPUTER SCIENCE AND ENGINEERING – KTU (2019–2023)",
          institution: "Universal Engineering College",
          year: "2019-2023",
        },
      ],
      projects: [
        {
          name: "TUKTUKO - Ride Sharing App",
          role: "Full-stack Developer (Backend-focused)",
          description:
            "Designed and developed a ride-hailing platform with real-time capabilities, enabling seamless interactions between drivers and riders via dedicated web and mobile apps. Implemented secure authentication using OAuth and JWT, and real-time trip tracking and messaging using Socket.io. Developed RESTful APIs for trip creation, driver-rider matching, and ride history management. Built an admin panel for driver verification, trip monitoring, and system management. Integrated OpenStreetMap (OSM) with Nominatim for geolocation and routing features. Utilized MVC architecture for maintainable code structure and integrated Redis for efficient caching and improved performance.",
          technologies: [
            "Node.js",
            "Express.js",
            "PostgreSQL",
            "MongoDB",
            "Redis",
            "Socket.io",
            "OAuth",
            "JWT",
            "React.js",
            "HTML",
            "CSS",
            "OSM (Nominatim)",
          ],
          features: [
            "Driver & Rider Apps",
            "Real-time Trip Tracking",
            "Live Messaging",
            "Admin Panel",
            "Authentication & Authorization",
            "Redis Caching",
          ],
        },
        {
          name: "Delivery System Integration with Simphony – GSS",
          role: "Backend Developer",
          description:
            "Designed and developed backend APIs to integrate a custom delivery management system with Oracle Simphony POS for seamless order handling and logistics operations. Implemented endpoints for customer creation, order placement, driver registration, driver assignment, delivery status updates. Ensured secure and efficient communication between the delivery platform and Simphony POS using robust API structures and data validation. Supported real-time order flow visibility for admins and optimized driver workflows to improve delivery accuracy and speed.",
          technologies: ["Node.js", "Express.js", "PostgreSQL", "RESTful APIs"],
          features: [
            "Order-to-driver auto-matching",
            "Status-based delivery tracking",
            "Event-driven notifications",
          ],
        },
      ],
      achievements: [
        "Full Stack Developer Program – Luminar Technolab, Kochi | May 2023",
        "Full Stack Development Certification – NACTET | 2023",
      ],
      interests: ["Maths", "Learn New Languages", "Social networking"],
    };
    reset(sampleData);
  };

  const ArrayFieldComponent = ({
    fields,
    append,
    remove,
    name,
    placeholder,
    label,
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Controller
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <Input {...field} placeholder={placeholder} className="flex-1" />
            )}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.slice(0, -1)}
      </Button>
    </div>
  );

  const ResumePreview = ({ data }) => (
    <div
      className="bg-white p-8 max-w-4xl mx-auto text-black"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "11pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ fontSize: "18pt" }}>
          {data.personalInfo.name}
        </h1>
        <div className="text-sm space-y-1">
          <div>{data.personalInfo.phone}</div>
          <div>{data.personalInfo.email}</div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="mb-6">
        <h2
          className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
          style={{ fontSize: "14pt" }}
        >
          PROFILE SUMMARY
        </h2>
        <h3 className="font-bold mb-2" style={{ fontSize: "12pt" }}>
          {data.personalInfo.title}
        </h3>
        <p className="text-justify" style={{ fontSize: "11pt" }}>
          {data.personalInfo.summary}
        </p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2
          className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
          style={{ fontSize: "14pt" }}
        >
          EXPERIENCE
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold" style={{ fontSize: "12pt" }}>
                {exp.company}
              </h3>
              <span
                className="text-sm font-medium"
                style={{ fontSize: "11pt" }}
              >
                {exp.duration}
              </span>
            </div>
            <h4 className="font-semibold mb-2" style={{ fontSize: "11pt" }}>
              {exp.position}
            </h4>
            <ul className="space-y-1">
              {exp.achievements.map((achievement, achIndex) => (
                <li
                  key={achIndex}
                  className="text-justify"
                  style={{ fontSize: "10pt", marginLeft: "15px" }}
                >
                  • {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Technical Skills */}
      <div className="mb-6">
        <h2
          className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
          style={{ fontSize: "14pt" }}
        >
          TECHNICAL SKILLS
        </h2>
        <div className="space-y-2" style={{ fontSize: "10pt" }}>
          {data.skills.languages.filter(Boolean).length > 0 && (
            <div>
              <strong>Languages:</strong>{" "}
              {data.skills.languages.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.frameworks.filter(Boolean).length > 0 && (
            <div>
              <strong>Frameworks & Libraries:</strong>{" "}
              {data.skills.frameworks.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.databases.filter(Boolean).length > 0 && (
            <div>
              <strong>Databases:</strong>{" "}
              {data.skills.databases.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.architectures.filter(Boolean).length > 0 && (
            <div>
              <strong>Architectures:</strong>{" "}
              {data.skills.architectures.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.tools.filter(Boolean).length > 0 && (
            <div>
              <strong>Tools & Platforms:</strong>{" "}
              {data.skills.tools.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.methodologies.filter(Boolean).length > 0 && (
            <div>
              <strong>Methodologies:</strong>{" "}
              {data.skills.methodologies.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.other.filter(Boolean).length > 0 && (
            <div>
              <strong>Other Skills:</strong>{" "}
              {data.skills.other.filter(Boolean).join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2
          className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
          style={{ fontSize: "14pt" }}
        >
          EDUCATION
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-2" style={{ fontSize: "11pt" }}>
            <div className="font-bold">{edu.degree}</div>
            <div>{edu.institution}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h2
          className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
          style={{ fontSize: "14pt" }}
        >
          PROJECTS
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-bold" style={{ fontSize: "12pt" }}>
              {project.name}
            </h3>
            <p className="font-semibold mb-1" style={{ fontSize: "11pt" }}>
              Role: {project.role}
            </p>
            <p className="text-justify mb-2" style={{ fontSize: "10pt" }}>
              {project.description}
            </p>
            {project.technologies.filter(Boolean).length > 0 && (
              <p style={{ fontSize: "10pt" }}>
                <strong>Technologies:</strong>{" "}
                {project.technologies.filter(Boolean).join(", ")}
              </p>
            )}
            {project.features.filter(Boolean).length > 0 && (
              <p style={{ fontSize: "10pt" }}>
                <strong>Features:</strong>{" "}
                {project.features.filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Achievements */}
      {data.achievements.filter(Boolean).length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
            style={{ fontSize: "14pt" }}
          >
            ACHIEVEMENTS AND CERTIFICATES
          </h2>
          <ul className="space-y-1">
            {data.achievements.filter(Boolean).map((achievement, index) => (
              <li key={index} style={{ fontSize: "10pt", marginLeft: "15px" }}>
                • {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(Boolean).length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
            style={{ fontSize: "14pt" }}
          >
            INTERESTS
          </h2>
          <p style={{ fontSize: "10pt" }}>
            {data.interests.filter(Boolean).join(", ")}
          </p>
        </div>
      )}
    </div>
  );

  if (viewMode === "preview" && resumeData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Preview</h1>
          <div className="flex gap-2">
            <Button onClick={() => setViewMode("edit")} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
            <Button onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        <div className="p-4">
          <ResumePreview data={resumeData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <div className="flex gap-2">
            <Button onClick={loadSampleData} variant="outline">
              Load Sample Data
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              <Eye className="h-4 w-4 mr-2" />
              Generate Resume
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Controller
                      control={control}
                      name="personalInfo.name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="name"
                          placeholder="Your full name"
                        />
                      )}
                    />
                    {errors.personalInfo?.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.personalInfo.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Controller
                      control={control}
                      name="personalInfo.title"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="title"
                          placeholder="e.g. Senior Software Developer"
                        />
                      )}
                    />
                    {errors.personalInfo?.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.personalInfo.title.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Controller
                        control={control}
                        name="personalInfo.phone"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phone"
                            placeholder="+1234567890"
                          />
                        )}
                      />
                      {errors.personalInfo?.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.personalInfo.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Controller
                        control={control}
                        name="personalInfo.email"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                          />
                        )}
                      />
                      {errors.personalInfo?.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.personalInfo.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Controller
                      control={control}
                      name="personalInfo.summary"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="summary"
                          placeholder="Write a compelling summary of your professional background and expertise..."
                          rows={5}
                        />
                      )}
                    />
                    {errors.personalInfo?.summary && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.personalInfo.summary.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience */}
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {experienceFields.fields.map((field, index) => (
                    <Card key={field.id} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Company Name</Label>
                            <Controller
                              control={control}
                              name={`experience.${index}.company`}
                              render={({ field }) => (
                                <Input {...field} placeholder="Company name" />
                              )}
                            />
                          </div>
                          <div>
                            <Label>Position</Label>
                            <Controller
                              control={control}
                              name={`experience.${index}.position`}
                              render={({ field }) => (
                                <Input {...field} placeholder="Your position" />
                              )}
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label>Duration</Label>
                          <Controller
                            control={control}
                            name={`experience.${index}.duration`}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="e.g. Jan 2020 - Present"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <Label>Key Achievements</Label>
                          <Controller
                            control={control}
                            name={`experience.${index}.achievements`}
                            render={({ field: { value, onChange } }) => (
                              <div className="space-y-2">
                                {value.map((achievement, achIndex) => (
                                  <div key={achIndex} className="flex gap-2">
                                    <Textarea
                                      value={achievement}
                                      onChange={(e) => {
                                        const newAchievements = [...value];
                                        newAchievements[achIndex] =
                                          e.target.value;
                                        onChange(newAchievements);
                                      }}
                                      placeholder="Describe a key achievement with metrics if possible..."
                                      rows={2}
                                      className="flex-1"
                                    />
                                    {value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newAchievements = value.filter(
                                            (_, i) => i !== achIndex,
                                          );
                                          onChange(newAchievements);
                                        }}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onChange([...value, ""])}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Achievement
                                </Button>
                              </div>
                            )}
                          />
                        </div>

                        {experienceFields.fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => experienceFields.remove(index)}
                            className="mt-4"
                          >
                            Remove Experience
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      experienceFields.append({
                        company: "",
                        position: "",
                        duration: "",
                        achievements: [""],
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ArrayFieldComponent
                    fields={languageFields}
                    append={languageFields.append}
                    remove={languageFields.remove}
                    name="skills.languages"
                    placeholder="e.g. JavaScript"
                    label="Languages"
                  />

                  <ArrayFieldComponent
                    fields={frameworkFields}
                    append={frameworkFields.append}
                    remove={frameworkFields.remove}
                    name="skills.frameworks"
                    placeholder="e.g. React.js"
                    label="Frameworks & Libraries"
                  />

                  <ArrayFieldComponent
                    fields={databaseFields}
                    append={databaseFields.append}
                    remove={databaseFields.remove}
                    name="skills.databases"
                    placeholder="e.g. PostgreSQL"
                    label="Databases"
                  />

                  <ArrayFieldComponent
                    fields={architectureFields}
                    append={architectureFields.append}
                    remove={architectureFields.remove}
                    name="skills.architectures"
                    placeholder="e.g. RESTful API Design"
                    label="Architectures"
                  />

                  <ArrayFieldComponent
                    fields={toolFields}
                    append={toolFields.append}
                    remove={toolFields.remove}
                    name="skills.tools"
                    placeholder="e.g. Git"
                    label="Tools & Platforms"
                  />

                  <ArrayFieldComponent
                    fields={methodologyFields}
                    append={methodologyFields.append}
                    remove={methodologyFields.remove}
                    name="skills.methodologies"
                    placeholder="e.g. Agile"
                    label="Methodologies"
                  />

                  <ArrayFieldComponent
                    fields={otherFields}
                    append={otherFields.append}
                    remove={otherFields.remove}
                    name="skills.other"
                    placeholder="e.g. API Integration"
                    label="Other Skills"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {educationFields.fields.map((field, index) => (
                    <Card key={field.id} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Degree</Label>
                            <Controller
                              control={control}
                              name={`education.${index}.degree`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="e.g. B.Tech Computer Science"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <Label>Institution</Label>
                            <Controller
                              control={control}
                              name={`education.${index}.institution`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="University/College name"
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label>Year</Label>
                          <Controller
                            control={control}
                            name={`education.${index}.year`}
                            render={({ field }) => (
                              <Input {...field} placeholder="e.g. 2019-2023" />
                            )}
                          />
                        </div>

                        {educationFields.fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => educationFields.remove(index)}
                          >
                            Remove Education
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      educationFields.append({
                        degree: "",
                        institution: "",
                        year: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {projectFields.fields.map((field, index) => (
                    <Card key={field.id} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Project Name</Label>
                            <Controller
                              control={control}
                              name={`projects.${index}.name`}
                              render={({ field }) => (
                                <Input {...field} placeholder="Project name" />
                              )}
                            />
                          </div>
                          <div>
                            <Label>Your Role</Label>
                            <Controller
                              control={control}
                              name={`projects.${index}.role`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="e.g. Full-stack Developer"
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label>Project Description</Label>
                          <Controller
                            control={control}
                            name={`projects.${index}.description`}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Describe the project, your contributions, and the impact..."
                                rows={4}
                              />
                            )}
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Technologies Used</Label>
                          <Controller
                            control={control}
                            name={`projects.${index}.technologies`}
                            render={({ field: { value, onChange } }) => (
                              <div className="space-y-2">
                                {value.map((tech, techIndex) => (
                                  <div key={techIndex} className="flex gap-2">
                                    <Input
                                      value={tech}
                                      onChange={(e) => {
                                        const newTech = [...value];
                                        newTech[techIndex] = e.target.value;
                                        onChange(newTech);
                                      }}
                                      placeholder="e.g. React.js"
                                      className="flex-1"
                                    />
                                    {value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newTech = value.filter(
                                            (_, i) => i !== techIndex,
                                          );
                                          onChange(newTech);
                                        }}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onChange([...value, ""])}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Technology
                                </Button>
                              </div>
                            )}
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Key Features</Label>
                          <Controller
                            control={control}
                            name={`projects.${index}.features`}
                            render={({ field: { value, onChange } }) => (
                              <div className="space-y-2">
                                {value.map((feature, featureIndex) => (
                                  <div
                                    key={featureIndex}
                                    className="flex gap-2"
                                  >
                                    <Input
                                      value={feature}
                                      onChange={(e) => {
                                        const newFeatures = [...value];
                                        newFeatures[featureIndex] =
                                          e.target.value;
                                        onChange(newFeatures);
                                      }}
                                      placeholder="e.g. Real-time messaging"
                                      className="flex-1"
                                    />
                                    {value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newFeatures = value.filter(
                                            (_, i) => i !== featureIndex,
                                          );
                                          onChange(newFeatures);
                                        }}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onChange([...value, ""])}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Feature
                                </Button>
                              </div>
                            )}
                          />
                        </div>

                        {projectFields.fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => projectFields.remove(index)}
                          >
                            Remove Project
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      projectFields.append({
                        name: "",
                        role: "",
                        description: "",
                        technologies: [""],
                        features: [""],
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other (Achievements & Interests) */}
            <TabsContent value="other">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Certificates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ArrayFieldComponent
                      fields={achievementFields}
                      append={achievementFields.append}
                      remove={achievementFields.remove}
                      name="achievements"
                      placeholder="e.g. AWS Certified Developer | 2023"
                      label="Achievements"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ArrayFieldComponent
                      fields={interestFields}
                      append={interestFields.append}
                      remove={interestFields.remove}
                      name="interests"
                      placeholder="e.g. Machine Learning"
                      label="Interests"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
