import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Eye } from "lucide-react";
import { sampleData } from "./sampleData";
import { defaultValues, resumeSchema } from "./resumeSchema";
import { ModeToggle } from "@/components/shared/ModeToggle";
import JSONFileUpload from "./components/JSONFileUpload";
import { useAutoSave } from "@/hooks/useAutoSave";
import ArrayFormField from "@/components/FormElements/ArrayFormField";
import { Form } from "@/components/ui/form";
import BasicFormField from "@/components/FormElements/BasicFormField";
import TextAreaFormField from "@/components/FormElements/TextAreaFormField";
import { LoaderPinwheelIcon } from "lucide-react";
import GithubButton from "@/components/shared/GithubButton";
import { ChevronsUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronsDown } from "lucide-react";
import OldResumeUpload from "./components/OldResumeUpload";
const ResumeFormPage = ({ setResumeData, setViewMode }) => {
  const form = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues,
    mode: "onChange",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;
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

  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const result = resumeSchema.safeParse(parsedData);

        if (result.success) {
          reset(result.data);
        }
      } catch (error) {
        console.error("Failed to parse resume data:", error);
      }
    }
  }, [reset]);

  const onSubmit = (data) => {
    setResumeData(data);
    localStorage.setItem("resumeData", JSON.stringify(data));
    setViewMode("preview");
  };

  const loadSampleData = () => {
    reset(sampleData);
  };

  const clear = () => {
    reset(defaultValues);
  };
  const saveToLocal = () => {
    if (watch() && watch().personalInfo.name !== "") {
      localStorage.setItem("resumeData", JSON.stringify(watch()));
    }
  };
  useAutoSave(control, saveToLocal, 2000);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <div className="flex gap-2">
            <ModeToggle />
            <GithubButton />
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleSubmit(onSubmit)}>
              <Eye className="h-4 w-4 mr-2" />
              Generate Resume
            </Button>

            <Button onClick={clear} variant="destructive">
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <JSONFileUpload onUpload={(data) => reset(data)} />
            <Button onClick={loadSampleData} variant="outline">
              <LoaderPinwheelIcon />
              Load Sample Data
            </Button>
            <OldResumeUpload onUpload={(data) => reset(data)} />
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="personal" className="space-y-4">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-6 min-h-[400px] md:min-h-full">
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
                      <BasicFormField
                        name="personalInfo.name"
                        label="Full Name"
                        placeholder="Your full name"
                        required
                      />

                      <BasicFormField
                        name="personalInfo.title"
                        label="Professional Title"
                        placeholder="e.g. Senior Software Developer"
                        required
                      />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <BasicFormField
                          name="personalInfo.phone"
                          label="Phone Number"
                          placeholder="+1234567890"
                        />

                        <BasicFormField
                          name="personalInfo.portfolioWebsite"
                          label="Personal Website"
                          placeholder="personalwebsite.me"
                        />

                        <BasicFormField
                          name="personalInfo.linkedInUrl"
                          label="LinkedIn"
                          placeholder="https://www.linkedin.com/in/johndoe"
                        />
                        <BasicFormField
                          name="personalInfo.email"
                          label="Email Address"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                        <BasicFormField
                          name="personalInfo.location"
                          label="Location"
                          type="text"
                          placeholder="Thrissur,Kerala"
                          required
                        />
                      </div>

                      <TextAreaFormField
                        name="personalInfo.summary"
                        label="Professional Summary"
                        placeholder="Write a compelling summary of your professional background and expertise..."
                        rows={5}
                        required
                      />
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
                      {experienceFields.fields.map((field, expIndex) => (
                        <Card key={field.id} className="mb-4">
                          <CardContent className="pt-6">
                            <div className="grid sm:grid-cols-1 gap-4 mb-4">
                              <BasicFormField
                                name={`experience.${expIndex}.company`}
                                label={`Company ${expIndex + 1} Name`}
                                placeholder="Company name"
                                required
                              />
                            </div>

                            <Controller
                              control={control}
                              name={`experience.${expIndex}.positions`}
                              render={({ field: { value, onChange } }) => (
                                <div className="space-y-4">
                                  {value.map((position, posIndex) => (
                                    <div
                                      key={posIndex}
                                      className="border rounded-lg p-4"
                                    >
                                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <BasicFormField
                                          name={`experience.${expIndex}.positions.${posIndex}.title`}
                                          label="Position Title"
                                          placeholder="Your position"
                                          required
                                        />

                                        <BasicFormField
                                          name={`experience.${expIndex}.positions.${posIndex}.duration`}
                                          label="Duration"
                                          placeholder="e.g. Jan 2020 - Present"
                                          required
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium mb-1">
                                          Key Achievements
                                        </label>
                                        <Controller
                                          control={control}
                                          name={`experience.${expIndex}.positions.${posIndex}.achievements`}
                                          render={({
                                            field: {
                                              value: achievements,
                                              onChange: onAchievementsChange,
                                            },
                                          }) => (
                                            <div className="space-y-2">
                                              {achievements.map(
                                                (achievement, achIndex) => (
                                                  <div
                                                    key={achIndex}
                                                    className="flex gap-2"
                                                  >
                                                    <div className="flex-1">
                                                      <Textarea
                                                        value={achievement}
                                                        onChange={(e) => {
                                                          const newAchievements =
                                                            [...achievements];
                                                          newAchievements[
                                                            achIndex
                                                          ] = e.target.value;
                                                          onAchievementsChange(
                                                            newAchievements,
                                                          );
                                                        }}
                                                        placeholder="Describe a key achievement with metrics if possible..."
                                                        rows={2}
                                                      />

                                                      <span className="text-sm text-red-400">
                                                        {
                                                          errors?.experience?.[
                                                            expIndex
                                                          ]?.positions?.[
                                                            posIndex
                                                          ]?.achievements?.[
                                                            achIndex
                                                          ]?.message
                                                        }
                                                      </span>
                                                    </div>
                                                    {achievements.length >
                                                      1 && (
                                                      <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                          const newAchievements =
                                                            achievements.filter(
                                                              (_, i) =>
                                                                i !== achIndex,
                                                            );
                                                          onAchievementsChange(
                                                            newAchievements,
                                                          );
                                                        }}
                                                      >
                                                        <Minus className="h-4 w-4" />
                                                      </Button>
                                                    )}
                                                  </div>
                                                ),
                                              )}
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  onAchievementsChange([
                                                    ...achievements,
                                                    "",
                                                  ])
                                                }
                                              >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Achievement
                                              </Button>
                                            </div>
                                          )}
                                        />
                                      </div>

                                      {value.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            const newPositions = value.filter(
                                              (_, i) => i !== posIndex,
                                            );
                                            onChange(newPositions);
                                          }}
                                          className="mt-4"
                                        >
                                          Remove Position
                                        </Button>
                                      )}
                                    </div>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      onChange([
                                        ...value,
                                        {
                                          title: "",
                                          duration: "",
                                          achievements: [""],
                                        },
                                      ])
                                    }
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Position
                                  </Button>
                                </div>
                              )}
                            />

                            {experienceFields.fields.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  experienceFields.remove(expIndex)
                                }
                                className="mt-4"
                              >
                                Remove Company
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
                            positions: [
                              {
                                title: "",
                                duration: "",
                                achievements: [],
                              },
                            ],
                            id: "e95ff1f8-fb02-435e-b668-ffde0c0da3c9",
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
                      <ArrayFormField
                        fields={languageFields}
                        append={languageFields.append}
                        remove={languageFields.remove}
                        name="skills.languages"
                        placeholder="e.g. JavaScript"
                        label="Languages"
                      />

                      <ArrayFormField
                        fields={frameworkFields}
                        append={frameworkFields.append}
                        remove={frameworkFields.remove}
                        name="skills.frameworks"
                        placeholder="e.g. React.js"
                        label="Frameworks & Libraries"
                      />

                      <ArrayFormField
                        fields={databaseFields}
                        append={databaseFields.append}
                        remove={databaseFields.remove}
                        name="skills.databases"
                        placeholder="e.g. PostgreSQL"
                        label="Databases"
                      />

                      <ArrayFormField
                        fields={architectureFields}
                        append={architectureFields.append}
                        remove={architectureFields.remove}
                        name="skills.architectures"
                        placeholder="e.g. RESTful API Design"
                        label="Architectures"
                      />

                      <ArrayFormField
                        fields={toolFields}
                        append={toolFields.append}
                        remove={toolFields.remove}
                        name="skills.tools"
                        placeholder="e.g. Git"
                        label="Tools & Platforms"
                      />

                      <ArrayFormField
                        fields={methodologyFields}
                        append={methodologyFields.append}
                        remove={methodologyFields.remove}
                        name="skills.methodologies"
                        placeholder="e.g. Agile"
                        label="Methodologies"
                      />

                      <ArrayFormField
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
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                              <BasicFormField
                                name={`education.${index}.degree`}
                                label="Degree"
                                placeholder="e.g. B.Tech Computer Science"
                                type="text"
                              />
                              <BasicFormField
                                name={`education.${index}.institution`}
                                label="Institution"
                                placeholder="University/College name"
                                type="text"
                              />
                            </div>

                            <BasicFormField
                              name={`education.${index}.year`}
                              label="Year"
                              placeholder="e.g. 2019-2023"
                              type="text"
                              className="mb-4"
                            />

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
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                              <BasicFormField
                                name={`projects.${index}.name`}
                                label="Project Name"
                                placeholder="Project name"
                                type="text"
                              />
                              <BasicFormField
                                name={`projects.${index}.role`}
                                label="Your Role"
                                placeholder="e.g. Full-stack Developer"
                                type="text"
                              />
                            </div>

                            <BasicFormField
                              name={`projects.${index}.link`}
                              label="Project Link"
                              placeholder="https://tasktracker.dev"
                              type="text"
                              className="mb-4"
                            />
                            <TextAreaFormField
                              name={`projects.${index}.description`}
                              label="Project Description"
                              placeholder="Describe the project, your contributions, and the impact..."
                              rows={4}
                              className="mb-4"
                            />

                            <div className="mb-4">
                              <Label className="mb-2">Technologies Used</Label>
                              <Controller
                                control={control}
                                name={`projects.${index}.technologies`}
                                render={({ field: { value, onChange } }) => (
                                  <div className="space-y-2">
                                    {value.map((tech, techIndex) => (
                                      <div
                                        key={techIndex}
                                        className="flex gap-2"
                                      >
                                        <div className="flex-1">
                                          <Input
                                            value={tech}
                                            onChange={(e) => {
                                              const newTech = [...value];
                                              newTech[techIndex] =
                                                e.target.value;
                                              onChange(newTech);
                                            }}
                                            placeholder="e.g. React.js"
                                          />
                                        </div>
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
                              <Label className="mb-2">Key Features</Label>
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

                            <div className="flex gap-2 flex-wrap">
                              {/* Move Controls */}
                              {projectFields.fields.length > 1 && (
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() => {
                                      const currentProject =
                                        projectFields.fields[index];
                                      projectFields.remove(index);
                                      projectFields.insert(0, currentProject);
                                    }}
                                    title="Move to top"
                                  >
                                    <ChevronsUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() => {
                                      projectFields.move(index, index - 1);
                                    }}
                                    title="Move up"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                      index === projectFields.fields.length - 1
                                    }
                                    onClick={() => {
                                      projectFields.move(index, index + 1);
                                    }}
                                    title="Move down"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                      index === projectFields.fields.length - 1
                                    }
                                    onClick={() => {
                                      const currentProject =
                                        projectFields.fields[index];
                                      projectFields.remove(index);
                                      projectFields.append(currentProject);
                                    }}
                                    title="Move to bottom"
                                  >
                                    <ChevronsDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}

                              {/* Remove Button */}
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
                            </div>
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
                        <ArrayFormField
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
                        <ArrayFormField
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResumeFormPage;
