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
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
    @page {
      size: A4;
      margin: 20mm;
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
        font-size: 12px;
        line-height: 1.4;
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
      className="bg-white p-8 max-w-4xl resume-container mx-auto text-black"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="mb-6 resume-section">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontSize: "24pt", color: "#000" }}>
              {data.personalInfo.name}
            </h1>
            <div className="space-y-1" style={{ fontSize: "11pt" }}>
              {data.personalInfo.linkedInUrl && (
                <div>
                  <span className="font-semibold text-blue-600">LinkedIn:</span>{" "}
                  <a href={data.personalInfo.linkedInUrl} className="text-blue-600 underline">
                    {showLinks ? "LinkedIn Profile" : data.personalInfo.linkedInUrl.replace('https://', '')}
                  </a>
                </div>
              )}
              {data.personalInfo.portfolioWebsite && (
                <div>
                  <span className="font-semibold text-blue-600">GitHub/</span>
                  <span className="font-semibold text-blue-600"> Behance /</span>
                  <span className="font-semibold text-blue-600"> Dribbble</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right space-y-2" style={{ fontSize: "11pt" }}>
            <div>
              <span className="font-semibold">Email:</span> {data.personalInfo.email}
            </div>
            {data.personalInfo.phone && (
              <div>
                <span className="font-semibold">Mobile:</span> {data.personalInfo.phone}
              </div>
            )}
          </div>
        </div>
        <hr className="border-t-2 border-black" />
      </div>

      {/* Education */}
      <div className="mb-6 resume-section">
        <h2
          className="text-center font-bold mb-4"
          style={{ fontSize: "14pt", letterSpacing: "2px" }}
        >
          EDUCATION
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="flex justify-between items-start mb-3">
            <div style={{ fontSize: "11pt" }}>
              <div className="font-bold">{edu.institution}</div>
              <div className="mt-1">
                <div>{edu.degree}</div>
                {edu.gpa && <div>{edu.specialization}; GPA: {edu.gpa}</div>}
              </div>
            </div>
            <div className="text-right" style={{ fontSize: "11pt" }}>
              <div>{edu.location}</div>
              <div className="mt-1">
                <div className="font-semibold">{edu.graduationDate}</div>
                {edu.additionalInfo && <div>{edu.additionalInfo}</div>}
              </div>
            </div>
          </div>
        ))}
        <hr className="border-t border-black mt-4" />
      </div>

      {/* Skills Summary */}
      <div className="mb-6 resume-section">
        <h2
          className="text-center font-bold mb-4"
          style={{ fontSize: "14pt", letterSpacing: "2px" }}
        >
          SKILLS SUMMARY
        </h2>
        <div className="space-y-2" style={{ fontSize: "11pt" }}>
          {data.skills.languages.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-32 flex-shrink-0">• Languages:</span>
              <span>{data.skills.languages.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.frameworks.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-32 flex-shrink-0">• Frameworks:</span>
              <span>{data.skills.frameworks.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.tools.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-32 flex-shrink-0">• Tools:</span>
              <span>{data.skills.tools.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.databases.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-32 flex-shrink-0">• Platforms:</span>
              <span>{data.skills.databases.filter(Boolean).join(", ")}</span>
            </div>
          )}
          {data.skills.other.filter(Boolean).length > 0 && (
            <div className="flex">
              <span className="font-bold w-32 flex-shrink-0">• Soft Skills:</span>
              <span>{data.skills.other.filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
        <hr className="border-t border-black mt-4" />
      </div>

      {/* Work Experience */}
      <div className="mb-6 resume-section">
        <h2
          className="text-center font-bold mb-4"
          style={{ fontSize: "14pt", letterSpacing: "2px" }}
        >
          WORK EXPERIENCE
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            {exp.positions.map((position, posIndex) => (
              <div key={posIndex} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold" style={{ fontSize: "12pt" }}>
                      {position.title.toUpperCase()} | {exp.company.toUpperCase()} |
                      {position.link && (
                        <span className="text-blue-600"> LINK</span>
                      )}
                    </span>
                  </div>
                  <div className="text-right font-semibold" style={{ fontSize: "11pt" }}>
                    {position.duration}
                  </div>
                </div>
                <ul className="space-y-1 ml-4">
                  {position.achievements.map((achievement, achIndex) => (
                    <li
                      key={achIndex}
                      className="text-justify"
                      style={{ fontSize: "10pt" }}
                    >
                      ○ {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
        <hr className="border-t border-black mt-4" />
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6 resume-section">
          <h2
            className="text-center font-bold mb-4"
            style={{ fontSize: "14pt", letterSpacing: "2px" }}
          >
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold" style={{ fontSize: "12pt" }}>
                    {project.name.toUpperCase()}
                    {project.link && (
                      <span className="text-blue-600"> | LINK</span>
                    )}
                  </span>
                </div>
                <div className="text-right font-semibold" style={{ fontSize: "11pt" }}>
                  {project.duration || ""}
                </div>
              </div>
              <ul className="space-y-1 ml-4">
                <li className="text-justify" style={{ fontSize: "10pt" }}>
                  ○ {project.description}
                </li>
                {project.features.filter(Boolean).map((feature, featIndex) => (
                  <li
                    key={featIndex}
                    className="text-justify"
                    style={{ fontSize: "10pt" }}
                  >
                    ○ {feature}
                  </li>
                ))}
                {project.technologies.filter(Boolean).length > 0 && (
                  <li style={{ fontSize: "10pt" }}>
                    ○ <strong>Technologies:</strong> {project.technologies.filter(Boolean).join(", ")}
                  </li>
                )}
              </ul>
            </div>
          ))}
          <hr className="border-t border-black mt-4" />
        </div>
      )}

      {/* Certificates */}
      {data.achievements.filter(Boolean).length > 0 && (
        <div className="mb-6 resume-section">
          <h2
            className="text-center font-bold mb-4"
            style={{ fontSize: "14pt", letterSpacing: "2px" }}
          >
            CERTIFICATES
          </h2>
          {data.achievements.filter(Boolean).map((achievement, index) => (
            <div key={index} className="flex justify-between items-start mb-2">
              <div style={{ fontSize: "11pt" }}>
                <div className="font-bold">{achievement.split(' | ')[0]} | CERTIFICATE</div>
                <ul className="ml-4 mt-1">
                  <li style={{ fontSize: "10pt" }}>
                    ○ {achievement.includes('|') ? achievement.split(' | ').slice(1).join(' | ') : 'Certificate details'}
                  </li>
                </ul>
              </div>
              <div className="text-right font-semibold" style={{ fontSize: "11pt" }}>
                {achievement.includes('March 2023') ? 'March 2023' : 'Date'}
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
        <div className="flex items-center space-x-2">
          <Switch
            id="show-links"
            checked={showLinks}
            onCheckedChange={setShowLinks}
          />
          <Label htmlFor="show-links">Show Links</Label>
        </div>
      </div>
      <div className="p-4 overflow-scroll">
        <ResumePreview data={resumeData} />
      </div>
    </div>
  );
};

export default ResumePreviewPage;
