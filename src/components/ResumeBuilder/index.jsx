import { useState } from "react";
import ResumePreviewPage1 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview1";
import ResumePreviewPage2 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview2";
import ResumePreviewPage3 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview3";
import ResumePreviewPage4 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview4";
import ResumePreviewPage5 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview5";
import ResumePreviewPage6 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview6";
import ResumePreviewPage7 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview7";
import ResumeFormPage from "@/components/ResumeBuilder/components/ResumeForm";
import { Button } from "../ui/button";

const templates = [
  {
    label: "Default Template",
    template: ResumePreviewPage1,
  },

  {
    label: "FAANG Inspired Template",
    template: ResumePreviewPage2,
  },

  {
    label: "FAANG Inspired 2 Template",
    template: ResumePreviewPage3,
  },

  {
    label: "Vikas Gupta Inspired Template",
    template: ResumePreviewPage4,
  },

  {
    label: "Resume Preview 5",
    template: ResumePreviewPage5,
  },

  {
    label: "Resume Preview 6",
    template: ResumePreviewPage6,
  },

  {
    label: "Resume with Image",
    template: ResumePreviewPage7,
  },
];
export default function ResumeBuilder() {
  const [viewMode, setViewMode] = useState("edit");
  const [resumeData, setResumeData] = useState(null);
  const [template, setTemplate] = useState(templates[0]);

  if (viewMode === "preview" && resumeData) {
    return (
      <div className="bg-white dark:bg-zinc-900">
        <div className="p-4 flex   flex-col justify-center items-center  gap-2">
          <h1 className="text-xl font-semibold">Available Templates</h1>
          <div className="flex flex-col overflow-auto w-full justify-center md:flex-row gap-2 ">
            {templates.map((temp) => (
              <Button
                variant={template === temp ? "" : "outline"}
                onClick={() => setTemplate(temp)}
              >
                {temp.label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <template.template
            resumeData={resumeData}
            setViewMode={setViewMode}
          />
        </div>
      </div>
    );
  }

  return (
    <ResumeFormPage setResumeData={setResumeData} setViewMode={setViewMode} />
  );
}
