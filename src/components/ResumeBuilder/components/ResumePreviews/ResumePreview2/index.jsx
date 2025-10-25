import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { DownloadJSONButton } from "@/components/ResumeBuilder/components/DownloadJSONButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const ResumePreviewPage = ({ resumeData, setViewMode }) => {
  const [showLinks, setShowLinks] = useState(false);
  const [isDesignMode, setIsDesignMode] = useState(false);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    pageStyle: `
    @page {
      size: A4;
      margin: 0.5in;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .resume-container {
        width: 100%;
        max-width: none;
        margin: 0;
        padding: 0;
        font-size: 10pt;
        line-height: 1.1;
      }
      
      .resume-section {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
  `,
    documentTitle: "Resume",
    onBeforeGetContent: () => {
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print completed");
    },
    removeAfterPrint: true,
  });

  const ResumePreview = ({ data }) => (
    <div
      ref={contentRef}
      contentEditable={isDesignMode}
      className="bg-white p-4 max-w-4xl resume-container mx-auto text-black"
      style={{
        fontFamily: 'Times, "Times New Roman", serif',
        fontSize: "11pt",
        lineHeight: "1.15",
      }}
    >
      {/* Header with location and contact - matching exact format */}
      <div
        className="flex justify-between items-start mb-1"
        style={{ fontSize: "10pt" }}
      >
        <div>
          Kerala, India
          <br />
          {data.personalInfo.portfolioWebsite && (
            <a
              href={data.personalInfo.portfolioWebsite}
              className="text-indigo-700"
            >
              {showLinks
                ? "Portfolio"
                : data.personalInfo.portfolioWebsite
                    .replace("https://", "")
                    .replace("http://", "")}
            </a>
          )}
        </div>
        <div className="text-right">
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          <div>{data.personalInfo.email}</div>
        </div>
      </div>

      {/* Name - Centered and Bold */}
      <div className="text-center mb-2">
        <h1
          className="font-bold"
          style={{ fontSize: "14pt", letterSpacing: "1pt" }}
        >
          {data.personalInfo.name.toUpperCase()}
        </h1>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-3">
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            SUMMARY
          </h2>
          <p
            style={{
              fontSize: "10pt",
              textAlign: "justify",
              lineHeight: "1.2",
            }}
          >
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills - Compact format */}
      <div className="mb-3">
        <div
          className="space-y-0.5"
          style={{ fontSize: "10pt", lineHeight: "1.2" }}
        >
          {data.skills.languages.filter(Boolean).length > 0 && (
            <div>
              <span className="font-bold">
                Programming Languages & Frameworks:{" "}
              </span>
              {data.skills.languages.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.frameworks.filter(Boolean).length > 0 && (
            <div>
              <span className="font-bold">Frameworks & Libraries: </span>
              {data.skills.frameworks.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.databases.filter(Boolean).length > 0 && (
            <div>
              <span className="font-bold">Databases & ORM: </span>
              {data.skills.databases.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.tools.filter(Boolean).length > 0 && (
            <div>
              <span className="font-bold">Cloud & DevOps Tools: </span>
              {data.skills.tools.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.architectures.filter(Boolean).length > 0 && (
            <div>
              <span className="font-bold">Architectures: </span>
              {data.skills.architectures.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.methodologies.filter(Boolean).length > 0 && (
            <div>
              <span className="font-bold">Software Practices: </span>
              {data.skills.methodologies.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills.other.filter(Boolean).length > 0 && (
            <div>
              <span className="font-bold">Other Skills: </span>
              {data.skills.other.filter(Boolean).join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Experience - Matching exact format */}
      <div className="mb-2">
        <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
          EMPLOYMENT
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-2">
            {exp.positions.map((position, posIndex) => (
              <div key={posIndex}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <div style={{ fontSize: "10pt" }}>
                    <span className="font-bold">{position.title}</span>
                    <span> | {exp.company}</span>
                  </div>
                  <div style={{ fontSize: "10pt" }}>{position.duration}</div>
                </div>

                {/* Client/Project name in italics if available */}
                {position.client && (
                  <div className="italic mb-0.5" style={{ fontSize: "10pt" }}>
                    {position.client}
                  </div>
                )}

                <ul
                  className="ml-0 mb-1"
                  style={{ fontSize: "10pt", lineHeight: "1.2" }}
                >
                  {position.achievements.map((achievement, achIndex) => (
                    <li
                      key={achIndex}
                      className="mb-0.5"
                      style={{ textAlign: "justify" }}
                    >
                      ● {achievement}
                    </li>
                  ))}
                </ul>

                {/* Tech Stack line */}
                <div style={{ fontSize: "10pt" }} className="mb-1">
                  <span className="italic">Tech Stack: </span>
                  {position.techStack || exp.techStack || "Not specified"}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Projects - Matching format */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-2">
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div
              key={index}
              className="mb-1"
              style={{ fontSize: "10pt", lineHeight: "1.2" }}
            >
              <div>
                <span className="font-bold">● {project.name}</span>
                {project.yearRange && <span> ({project.yearRange})</span>}:{" "}
                {project.description}
              </div>
              {project.technologies.filter(Boolean).length > 0 && (
                <div className="italic">
                  Tech Stack: {project.technologies.filter(Boolean).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      <div className="mb-3">
        <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
          EDUCATION
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} style={{ fontSize: "10pt", lineHeight: "1.2" }}>
            <div>{edu.institution}</div>
            <div>● {edu.degree}</div>
          </div>
        ))}
      </div>

      {/* Achievements - Final section */}
      {data.achievements.filter(Boolean).length > 0 && (
        <div className="mb-2">
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            ADDITIONAL EXPERIENCE AND AWARDS
          </h2>
          <ul style={{ fontSize: "10pt", lineHeight: "1.2" }}>
            {data.achievements.filter(Boolean).map((achievement, index) => (
              <li key={index} className="mb-0.5">
                ● {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interests */}
      {data.interests.filter(Boolean).length > 0 && (
        <div>
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            INTERESTS
          </h2>
          <p style={{ fontSize: "10pt" }}>
            {data.interests.filter(Boolean).join(", ")}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky top-0 bg-white dark:bg-zinc-900  shadow-sm pb-4 px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">FAANG Inspired Resume Preview</h1>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex gap-2 flex-row">
              <Button onClick={reactToPrintFn}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <DownloadJSONButton data={resumeData} />
            </div>

            <Button onClick={() => setViewMode("edit")} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-links"
              checked={showLinks}
              onCheckedChange={setShowLinks}
            />
            <Label htmlFor="show-links">Show Links</Label>
          </div>
          <div className="hidden md:flex  items-center space-x-2">
            <Switch
              id="design-mode"
              checked={isDesignMode}
              onCheckedChange={(e) => {
                setIsDesignMode(e);
                if (e) {
                  toast.info("These changes won't be persisted!");
                }
              }}
            />
            <Label htmlFor="design-mode">Design Mode</Label>
          </div>
        </div>
      </div>
      <div className="p-4 overflow-scroll">
        <ResumePreview data={resumeData} />
      </div>
    </div>
  );
};

export default ResumePreviewPage;
