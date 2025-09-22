import { useState } from "react";
import ResumePreviewPage1 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview1";
import ResumePreviewPage2 from "@/components/ResumeBuilder/components/ResumePreviews/ResumePreview2";
import ResumeFormPage from "@/components/ResumeBuilder/components/ResumeForm";

export default function ResumeBuilder() {
  const [viewMode, setViewMode] = useState("edit");
  const [resumeData, setResumeData] = useState(null);

  if (viewMode === "preview" && resumeData) {
    return (
      <>
        {/* <ResumePreviewPage1 resumeData={resumeData} setViewMode={setViewMode} /> */}
        <ResumePreviewPage2 resumeData={resumeData} setViewMode={setViewMode} />
      </>
    );
  }

  return (
    <ResumeFormPage setResumeData={setResumeData} setViewMode={setViewMode} />
  );
}
