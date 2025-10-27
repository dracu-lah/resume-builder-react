import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { DownloadJSONButton } from "@/components/ResumeBuilder/components/DownloadJSONButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

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
      
      .resume-section {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  `,
    documentTitle: "Resume",
    onAfterPrint: () => console.log("Print completed"),
  });

  const ResumePreview = ({ data }) => (
    <div
      contentEditable={isDesignMode}
      ref={contentRef}
      className="bg-white p-8 max-w-4xl resume-container mx-auto text-black font-sans"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header - Top aligned contact info */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-2">
        <tbody>
          <tr>
            <td width="50%" valign="top" style={{ fontSize: "10pt" }}>
              {data.personalInfo.location}
            </td>
            <td
              width="50%"
              valign="top"
              align="right"
              style={{ fontSize: "10pt" }}
            >
              LinkedIn |{" "}
              {data.personalInfo.portfolioWebsite
                ?.replace("https://", "")
                .replace("http://", "")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Name - Large and centered */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-2">
        <tbody>
          <tr>
            <td align="center">
              <h1
                style={{
                  fontSize: "18pt",
                  fontWeight: "bold",
                  fontFamily: "Arial, sans-serif",
                  margin: 0,
                  padding: 0,
                }}
              >
                {data.personalInfo.name?.toUpperCase()}
              </h1>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Contact info - centered below name */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-6">
        <tbody>
          <tr>
            <td align="center" style={{ fontSize: "10pt" }}>
              {data.personalInfo.phone} | {data.personalInfo.email}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary Section */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        className="mb-4 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Summary
              </h2>
              <p
                style={{
                  fontSize: "10pt",
                  lineHeight: "1.4",
                  textAlign: "left",
                  margin: 0,
                }}
              >
                {data.personalInfo.summary}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Skills in multiple columns */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        className="mb-4 resume-section"
      >
        <tbody>
          <tr>
            <td width="33%" valign="top">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                      <strong>Languages:</strong>
                      <br />
                      {data.skills.languages.filter(Boolean).join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td width="33%" valign="top">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                      <strong>Frameworks & Libraries:</strong>
                      <br />
                      {data.skills.frameworks.filter(Boolean).join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td width="33%" valign="top">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                      <strong>Tools & Platforms:</strong>
                      <br />
                      {data.skills.tools.filter(Boolean).join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan="3" height="6"></td>
          </tr>
          <tr>
            <td valign="top">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                      <strong>Architectures & Methodologies:</strong>
                      <br />
                      {data.skills.architectures.filter(Boolean).join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Horizontal Line */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-4">
        <tbody>
          <tr>
            <td style={{ borderBottom: "1px solid #000", height: "1px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Employment Section */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        className="mb-4 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Frontend Developer
              </h2>

              {data.experience.map((exp, index) => (
                <table
                  key={index}
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  className="mb-3"
                >
                  <tbody>
                    <tr>
                      <td
                        width="70%"
                        valign="top"
                        style={{ fontSize: "10pt", fontStyle: "italic" }}
                      >
                        {exp.company}
                      </td>
                      <td
                        width="30%"
                        valign="top"
                        align="right"
                        style={{ fontSize: "10pt", fontWeight: "bold" }}
                      >
                        {exp.positions?.[0]?.duration}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" height="6"></td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            {exp.positions?.[0]?.achievements?.map(
                              (achievement, achIndex) => (
                                <tr key={achIndex}>
                                  <td
                                    width="20"
                                    valign="top"
                                    style={{ fontSize: "10pt" }}
                                  >
                                    •
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "10pt",
                                      lineHeight: "1.4",
                                      textAlign: "left",
                                    }}
                                  >
                                    {achievement}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Horizontal Line */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-4">
        <tbody>
          <tr>
            <td style={{ borderBottom: "1px solid #000", height: "1px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Projects Section */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        className="mb-4 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Projects
              </h2>

              {data.projects.map((project, index) => (
                <table
                  key={index}
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  className="mb-3"
                >
                  <tbody>
                    <tr>
                      <td style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                        <strong>{project.name}</strong>
                        {project.link && (
                          <>
                            &nbsp;
                            <a
                              href={project.link}
                              className="text-indigo-700"
                              style={{ fontSize: "10pt", fontWeight: "normal" }}
                            >
                              {!showLinks ? "Link" : project.link}
                            </a>
                          </>
                        )}
                        {project.description && <>: {project.description}</>}
                        {project.technologies.filter(Boolean).length > 0 && (
                          <>
                            <br />
                            <span style={{ fontStyle: "italic" }}>
                              <strong>Tech Stack:</strong>{" "}
                              {project.technologies.filter(Boolean).join(", ")}
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Horizontal Line */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-4">
        <tbody>
          <tr>
            <td style={{ borderBottom: "1px solid #000", height: "1px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Achievements & Leadership */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        className="resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Achievements & Leadership
              </h2>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  {data.achievements
                    .filter(Boolean)
                    .map((achievement, index) => (
                      <tr key={index}>
                        <td
                          width="20"
                          valign="top"
                          style={{ fontSize: "10pt" }}
                        >
                          •
                        </td>
                        <td
                          style={{
                            fontSize: "10pt",
                            lineHeight: "1.4",
                            textAlign: "left",
                          }}
                        >
                          {achievement}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
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
        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-links"
              checked={showLinks}
              onCheckedChange={setShowLinks}
            />
            <Label htmlFor="show-links">Show Links</Label>
          </div>
          <div className="hidden md:flex items-center space-x-2">
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
            <Label htmlFor="design-mode">Live Text Edit Mode</Label>
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
