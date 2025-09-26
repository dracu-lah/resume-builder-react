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
      // Optional: You can modify content before printing
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print completed");
    },
    removeAfterPrint: true,
  });
  const handlePrint = () => {
    // Check if running on mobile
    const isMobile = window.innerWidth < 769;
    if (isMobile) {
      // Create a new window/iframe for printing
      const printWindow = window.open("", "_blank");

      if (printWindow && contentRef.current) {
        // Get all stylesheets from the current document
        const styles = Array.from(document.styleSheets)
          .map((styleSheet) => {
            try {
              if (styleSheet.cssRules) {
                return Array.from(styleSheet.cssRules)
                  .map((rule) => rule.cssText)
                  .join("\n");
              }
              return null;
            } catch (e) {
              // Stylesheets from different origins will throw security errors
              return null;
            }
          })
          .filter(Boolean)
          .join("\n");

        // Clone your component content
        const contentToPrint = contentRef.current.cloneNode(true);

        // Set up the new document with all styles
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              ${styles}
              body { margin: 0; padding: 0; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div id="print-container"></div>
          </body>
        </html>
      `);

        // Append your content
        const container = printWindow.document.getElementById('print-container');
        if (container) {
          container.appendChild(contentToPrint);
        }

        // Trigger print after content is loaded
        printWindow.document.close();
        printWindow.onload = function () {
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            // Don't close immediately to allow printing
            setTimeout(() => printWindow.close(), 500);
          }, 300);
        };
      } else {
        console.error("Print reference is null or window could not be opened");
      }
    } else {
      // Use react-to-print for desktop browsers
      reactToPrintFn();
    }
  };
  const ResumePreview = ({ data }) => (
    <div
      ref={contentRef}
      className="bg-white   p-8 max-w-4xl resume-container mx-auto text-black"
    >
      {/* Header */}
      <div className="flex flex-col  justify-between mb-6 resume-section">
        <h1 className="text-2xl font-bold mb-2" style={{ fontSize: "18pt" }}>
          {data.personalInfo.name}
        </h1>
        <div className="text-sm gap-x-4 flex ">
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          <div>{data.personalInfo.email}</div>
          {data.personalInfo.linkedInUrl && (
            <a href={data.personalInfo.linkedInUrl} className="text-indigo-700">
              {!showLinks ? "LinkedIn" : data.personalInfo.linkedInUrl}
            </a>
          )}

          {data.personalInfo.portfolioWebsite && (
            <a
              href={data.personalInfo.portfolioWebsite}
              className="text-indigo-700"
            >
              {!showLinks ? "Website" : data.personalInfo.portfolioWebsite}
            </a>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="mb-6 resume-section">
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
      <div className="mb-6 resume-section">
        <h2
          className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
          style={{ fontSize: "14pt" }}
        >
          EXPERIENCE
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold" style={{ fontSize: "12pt" }}>
                {exp.company}
              </h3>
            </div>

            {exp.positions.map((position, posIndex) => (
              <div key={posIndex} className="ml-4 mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold" style={{ fontSize: "11pt" }}>
                    {position.title}
                  </h4>
                  <span
                    className="text-sm font-medium"
                    style={{ fontSize: "10pt" }}
                  >
                    {position.duration}
                  </span>
                </div>
                <ul className="space-y-1">
                  {position.achievements.map((achievement, achIndex) => (
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
        ))}
      </div>

      {/* Technical Skills */}
      <div className="mb-6 ">
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

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6 ">
          <h2
            className="text-lg font-bold mb-3 pb-1 border-b border-gray-300"
            style={{ fontSize: "14pt" }}
          >
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4 resume-section">
              <h3 className="font-bold" style={{ fontSize: "12pt" }}>
                {project.name}
                {project.link && (
                  <>
                    &nbsp;
                    <a
                      href={project.link}
                      className="text-indigo-700 font-normal"
                    >
                      {!showLinks ? "Link" : project.link}
                    </a>
                  </>
                )}
              </h3>
              {project.role && (
                <p className="font-semibold mb-1" style={{ fontSize: "11pt" }}>
                  Role: {project.role}
                </p>
              )}
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
      )}

      {/* Education */}
      <div className="mb-6 resume-section">
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
      {/* Achievements */}
      {data.achievements.filter(Boolean).length > 0 && (
        <div className="mb-6 resume-section">
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
        <div className="mb-6 resume-section">
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
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky top-0 bg-white dark:bg-zinc-900  shadow-sm pb-4 px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Default Resume Preview</h1>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex gap-2 flex-row">
              <Button onClick={handlePrint}>
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
