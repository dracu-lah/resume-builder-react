import { useState } from "react";
import ResumePreviewPage1 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview1";
import ResumePreviewPage2 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview2";
import ResumePreviewPage3 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview3";
import ResumePreviewPage4 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview4";
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
];
export default function ResumeBuilder() {
  const [viewMode, setViewMode] = useState("edit");
  const [resumeData, setResumeData] = useState(null);
  const [template, setTemplate] = useState(templates[0]);

  if (viewMode === "preview" && resumeData) {
    return (
      <div className="bg-white dark:bg-zinc-900">
        <div className="p-4 flex flex-col justify-center items-center  gap-2">
          <h1 className="text-xl font-semibold">Available Templates</h1>
          <div className="flex gap-2">
            {templates.map((template) => (
              <Button variant="outline" onClick={() => setTemplate(template)}>
                {template.label}
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
