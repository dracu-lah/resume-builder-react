import { useState } from "react";
import ResumePreviewPage from "@/pages/resume-preview";
import ResumeForm from "./ResumeForm";

export default function ResumeBuilder() {
  const [viewMode, setViewMode] = useState("edit");
  const [resumeData, setResumeData] = useState(null);

  if (viewMode === "preview" && resumeData) {
    return (
      <ResumePreviewPage resumeData={resumeData} setViewMode={setViewMode} />
    );
  }

  return <ResumeForm setResumeData={setResumeData} setViewMode={setViewMode} />;
}
