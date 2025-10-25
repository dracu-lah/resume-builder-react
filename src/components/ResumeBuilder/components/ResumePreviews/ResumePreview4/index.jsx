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
  const [showEducation, setShowEducation] = useState(true);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    pageStyle: `
    @page {
      size: A4;
      margin: 12.7mm;
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
        font-size: 9pt;
        line-height: 1.2;
      }
      
      /* Ensure borders print properly */
      .section-border {
        border-top: 1px solid #000 !important;
        margin-top: 8px !important;
        margin-bottom: 0 !important;
        page-break-inside: avoid;
      }
      
      /* Prevent page breaks in unwanted places */
      .resume-section {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      /* Control page breaks */
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
      className="bg-white p-2 max-w-4xl resume-container mx-auto text-black"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "9pt",
        lineHeight: "1.2",
      }}
    >
      {/* Header */}
      <div className="mb-2 resume-section">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1
              className="text-xl font-bold mb-1"
              style={{ fontSize: "16pt", color: "#000" }}
            >
              {data.personalInfo.name}
            </h1>
            <div className="space-y-0.5" style={{ fontSize: "9pt" }}>
              {data.personalInfo.linkedInUrl && (
                <div>
                  <span className="font-semibold text-indigo-700"></span>{" "}
                  <a
                    href={data.personalInfo.linkedInUrl}
                    className="text-indigo-600  font-semibold"
                  >
                    {!showLinks
                      ? "LinkedIn Profile"
                      : data.personalInfo.linkedInUrl.replace("https://", "")}
                  </a>
                </div>
              )}
            </div>

            {data.personalInfo.portfolioWebsite && (
              <a
                href={data.personalInfo.portfolioWebsite}
                className="font-semibold text-indigo-600"
              >
                {!showLinks ? "Website" : data.personalInfo.portfolioWebsite}
              </a>
            )}
          </div>
          <div className="text-right space-y-0.5" style={{ fontSize: "9pt" }}>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {data.personalInfo.email}
            </div>
            {data.personalInfo.phone && (
              <div>
                <span className="font-semibold">Mobile:</span>{" "}
                {data.personalInfo.phone}
              </div>
            )}
          </div>
        </div>
        <hr className="section-border border-t border-black mt-2" />
      </div>

      {/* Education */}
      {showEducation && (
        <div className="mb-2 resume-section">
          <h2
            className="text-center font-bold mb-1"
            style={{ fontSize: "11pt", letterSpacing: "1px" }}
          >
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start mb-2">
              <div style={{ fontSize: "9pt" }}>
                <div className="font-bold">{edu.institution}</div>
                <div className="mt-0.5">
                  <div>{edu.degree}</div>
                  {edu.gpa && (
                    <div>
                      {edu.specialization}; GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right" style={{ fontSize: "9pt" }}>
                <div>{edu.location}</div>
                <div className="mt-0.5">
                  <div className="font-semibold">{edu.graduationDate}</div>
                  {edu.additionalInfo && <div>{edu.additionalInfo}</div>}
                </div>
              </div>
            </div>
          ))}
          <hr className="section-border border-t border-black mt-2" />
        </div>
      )}

      {/* Skills Summary */}
      <div className="mb-2 resume-section">
        <h2
          className="text-center font-bold mb-1"
          style={{ fontSize: "11pt", letterSpacing: "1px" }}
        >
          SKILLS SUMMARY
        </h2>
        <div className="space-y-1" style={{ fontSize: "9pt" }}>
          {data.skills.languages.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-24 flex-shrink-0">• Languages:</span>
              <span>{data.skills.languages.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.frameworks.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-24 flex-shrink-0">
                • Frameworks:
              </span>
              <span>{data.skills.frameworks.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.tools.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-24 flex-shrink-0">• Tools:</span>
              <span>{data.skills.tools.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.databases.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-24 flex-shrink-0">• Platforms:</span>
              <span>{data.skills.databases.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.other.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-24 flex-shrink-0">
                • Soft Skills:
              </span>
              <span>{data.skills.other.filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
        <hr className="section-border border-t border-black mt-2" />
      </div>

      {/* Work Experience */}
      <div className="mb-2 resume-section">
        <h2
          className="text-center font-bold mb-1"
          style={{ fontSize: "11pt", letterSpacing: "1px" }}
        >
          WORK EXPERIENCE
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-3">
            {exp.positions.map((position, posIndex) => (
              <div key={posIndex} className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-bold" style={{ fontSize: "10pt" }}>
                      {position.title.toUpperCase()} |{" "}
                      {exp.company.toUpperCase()} |
                      {position.link && (
                        <span className="text-indigo-600"> LINK</span>
                      )}
                    </span>
                  </div>
                  <div
                    className="text-right font-semibold"
                    style={{ fontSize: "9pt" }}
                  >
                    {position.duration}
                  </div>
                </div>
                <ul className="space-y-0.5 ml-3">
                  {position.achievements.map((achievement, achIndex) => (
                    <li
                      key={achIndex}
                      className="text-justify"
                      style={{ fontSize: "8pt" }}
                    >
                      ○ {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
        <hr className="section-border border-t border-black mt-2" />
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-2 resume-section">
          <h2
            className="text-center font-bold mb-1"
            style={{ fontSize: "11pt", letterSpacing: "1px" }}
          >
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-bold" style={{ fontSize: "10pt" }}>
                    {project.name.toUpperCase()}
                    {project.link && (
                      <span className="">
                        {" "}
                        | &nbsp;
                        <a href={project.link} className="text-indigo-700 ">
                          {!showLinks ? "Link" : project.link}
                        </a>
                      </span>
                    )}
                  </span>
                </div>
                <div
                  className="text-right font-semibold"
                  style={{ fontSize: "9pt" }}
                >
                  {project.duration || ""}
                </div>
              </div>
              <ul className="space-y-0.5 ml-3">
                <li className="text-justify" style={{ fontSize: "8pt" }}>
                  ○ {project.description}
                </li>
                {project.features.filter(Boolean).map((feature, featIndex) => (
                  <li
                    key={featIndex}
                    className="text-justify"
                    style={{ fontSize: "8pt" }}
                  >
                    ○ {feature}
                  </li>
                ))}
                {project.technologies.filter(Boolean).length > 0 && (
                  <li style={{ fontSize: "8pt" }}>
                    ○ <strong>Technologies:</strong>{" "}
                    {project.technologies.filter(Boolean).join(", ")}
                  </li>
                )}
              </ul>
            </div>
          ))}
          <hr className="section-border border-t border-black mt-2" />
        </div>
      )}

      {/* ACHIEVEMENTS AND CERTIFICATES */}
      {data.achievements.filter(Boolean).length > 0 && (
        <div className="mb-2 resume-section">
          <h2
            className="text-center font-bold mb-1"
            style={{ fontSize: "11pt", letterSpacing: "1px" }}
          >
            ACHIEVEMENTS AND CERTIFICATES
          </h2>
          {data.achievements.filter(Boolean).map((achievement, index) => (
            <div key={index} className="flex justify-between items-start mb-1">
              <div style={{ fontSize: "9pt" }}>
                <ul className="ml-3 mt-0.5">
                  <li style={{ fontSize: "8pt" }}>○ {achievement}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky top-0 bg-white dark:bg-zinc-900 shadow-sm pb-4 px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Resume Preview</h1>
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
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-links"
              checked={showLinks}
              onCheckedChange={setShowLinks}
            />
            <Label htmlFor="show-links">Show Links</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="disable-education"
              checked={showEducation}
              onCheckedChange={setShowEducation}
            />
            <Label htmlFor="disable-education">Show Education</Label>
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
