import { useState } from "react";
import ResumePreviewPage from "@/components/ResumeBuilder/components/ResumePreview";
import ResumeFormPage from "@/components/ResumeBuilder/components/ResumeForm";

export default function ResumeBuilder() {
  const [viewMode, setViewMode] = useState("edit");
  const [resumeData, setResumeData] = useState(null);

  if (viewMode === "preview" && resumeData) {
    return (
      <ResumePreviewPage resumeData={resumeData} setViewMode={setViewMode} />
    );
  }

  return (
    <ResumeFormPage setResumeData={setResumeData} setViewMode={setViewMode} />
  );
}
