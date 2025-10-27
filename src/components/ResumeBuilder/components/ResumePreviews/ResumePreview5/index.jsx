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
      
      .page-break {
        page-break-before: always;
      }
    }
  `,
    documentTitle: "Resume",
    onBeforeGetContent: () => Promise.resolve(),
    onAfterPrint: () => console.log("Print completed"),
    removeAfterPrint: true,
  });

  const ResumePreview = ({ data }) => (
    <div
      contentEditable={isDesignMode}
      ref={contentRef}
      className="bg-white p-8 max-w-4xl resume-container mx-auto text-black font-sans"
    >
      {/* Header Section */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-6">
        <tbody>
          <tr>
            <td width="50%" valign="top">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td>
                      <h1
                        className="text-2xl font-bold mb-1"
                        style={{
                          fontSize: "18pt",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {data.personalInfo?.name || "Your Name"}
                      </h1>
                    </td>
                  </tr>
                  {data.personalInfo?.location && (
                    <tr>
                      <td className="text-sm" style={{ fontSize: "10pt" }}>
                        {data.personalInfo.location}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
            <td width="50%" valign="top" align="right">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td
                      align="right"
                      className="text-sm"
                      style={{ fontSize: "10pt" }}
                    >
                      {data.personalInfo?.linkedInUrl && (
                        <div>
                          <a
                            href={data.personalInfo.linkedInUrl}
                            className="text-indigo-600"
                          >
                            {!showLinks
                              ? "LinkedIn"
                              : data.personalInfo.linkedInUrl.replace(
                                  "https://",
                                  "",
                                )}
                          </a>
                        </div>
                      )}
                      {data.personalInfo?.portfolioWebsite && (
                        <div>
                          <a
                            href={data.personalInfo.portfolioWebsite}
                            className="text-indigo-600"
                          >
                            {!showLinks
                              ? "Portfolio"
                              : data.personalInfo.portfolioWebsite.replace(
                                  "https://",
                                  "",
                                )}
                          </a>
                        </div>
                      )}
                      {data.personalInfo?.phone && (
                        <div>{data.personalInfo.phone}</div>
                      )}
                      {data.personalInfo?.email && (
                        <div>{data.personalInfo.email}</div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary Section */}
      {data.personalInfo?.summary && (
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          className="mb-6 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ fontSize: "14pt", fontFamily: "Arial, sans-serif" }}
                >
                  Summary
                </h2>
                <p
                  className="text-justify"
                  style={{ fontSize: "11pt", lineHeight: "1.4" }}
                >
                  {data.personalInfo.summary}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Skills Section */}
      {data.skills && (
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          className="mb-6 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ fontSize: "14pt", fontFamily: "Arial, sans-serif" }}
                >
                  Technical Skills
                </h2>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr>
                      {data.skills.languages?.filter(Boolean).length > 0 && (
                        <td width="33%" valign="top">
                          <table cellPadding="0" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "10pt",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  <strong>Languages:</strong>
                                  <br />
                                  {data.skills.languages
                                    .filter(Boolean)
                                    .join(", ")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      )}
                      {data.skills.frameworks?.filter(Boolean).length > 0 && (
                        <td width="33%" valign="top">
                          <table cellPadding="0" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "10pt",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  <strong>Frameworks & Libraries:</strong>
                                  <br />
                                  {data.skills.frameworks
                                    .filter(Boolean)
                                    .join(", ")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      )}
                      {data.skills.tools?.filter(Boolean).length > 0 && (
                        <td width="33%" valign="top">
                          <table cellPadding="0" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "10pt",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  <strong>Tools & Platforms:</strong>
                                  <br />
                                  {data.skills.tools.filter(Boolean).join(", ")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      )}
                    </tr>
                    {data.skills.databases?.filter(Boolean).length > 0 && (
                      <>
                        <tr>
                          <td colSpan="3" height="8"></td>
                        </tr>
                        <tr>
                          <td width="33%" valign="top">
                            <table cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      fontSize: "10pt",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    <strong>Databases:</strong>
                                    <br />
                                    {data.skills.databases
                                      .filter(Boolean)
                                      .join(", ")}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </>
                    )}
                    {data.skills.other?.filter(Boolean).length > 0 && (
                      <>
                        <tr>
                          <td colSpan="3" height="8"></td>
                        </tr>
                        <tr>
                          <td colSpan="2" valign="top">
                            <table cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      fontSize: "10pt",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    <strong>Other Skills:</strong>
                                    <br />
                                    {data.skills.other
                                      .filter(Boolean)
                                      .join(", ")}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Horizontal Line */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-6">
        <tbody>
          <tr>
            <td style={{ borderBottom: "1px solid #000", height: "1px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Employment Section */}
      {data.experience && data.experience.length > 0 && (
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          className="mb-6 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ fontSize: "14pt", fontFamily: "Arial, sans-serif" }}
                >
                  Work Experience
                </h2>

                {data.experience.map((exp, index) => (
                  <table
                    key={index}
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    className="mb-4"
                  >
                    <tbody>
                      {exp.positions?.map((position, posIndex) => (
                        <tbody key={posIndex}>
                          <tr>
                            <td width="70%" valign="top">
                              <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12pt",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {position.title}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td width="30%" valign="top" align="right">
                              <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td
                                      align="right"
                                      style={{
                                        fontSize: "10pt",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {position.duration}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="2"
                              style={{ fontSize: "11pt", fontStyle: "italic" }}
                            >
                              {exp.company}
                              {position.link && (
                                <>
                                  {" | "}
                                  <a
                                    href={position.link}
                                    className="text-indigo-600"
                                  >
                                    {!showLinks ? "Link" : position.link}
                                  </a>
                                </>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2" height="8"></td>
                          </tr>
                          <tr>
                            <td colSpan="2">
                              <table
                                width="100%"
                                cellPadding="0"
                                cellSpacing="0"
                              >
                                <tbody>
                                  {position.achievements?.map(
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
                                            textAlign: "justify",
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
                          {position.techStack && (
                            <>
                              <tr>
                                <td colSpan="2" height="8"></td>
                              </tr>
                              <tr>
                                <td colSpan="2" style={{ fontSize: "10pt" }}>
                                  <strong>Tech Stack:</strong>{" "}
                                  {position.techStack}
                                </td>
                              </tr>
                            </>
                          )}
                          {posIndex < exp.positions.length - 1 && (
                            <tr>
                              <td colSpan="2" height="12"></td>
                            </tr>
                          )}
                        </tbody>
                      ))}
                    </tbody>
                  </table>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          className="mb-6 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ fontSize: "14pt", fontFamily: "Arial, sans-serif" }}
                >
                  Projects
                </h2>

                {data.projects.map((project, index) => (
                  <table
                    key={index}
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    className="mb-4"
                  >
                    <tbody>
                      <tr>
                        <td style={{ fontSize: "12pt", fontWeight: "bold" }}>
                          {project.name}
                          {project.link && (
                            <>
                              {" | "}
                              <a
                                href={project.link}
                                className="text-indigo-700 font-normal"
                                style={{
                                  fontSize: "10pt",
                                  fontWeight: "normal",
                                }}
                              >
                                {!showLinks ? "Link" : project.link}
                              </a>
                            </>
                          )}
                        </td>
                      </tr>
                      {project.technologies?.filter(Boolean).length > 0 && (
                        <tr>
                          <td style={{ fontSize: "10pt" }}>
                            <strong>Tech Stack:</strong>{" "}
                            {project.technologies.filter(Boolean).join(", ")}
                          </td>
                        </tr>
                      )}
                      {project.description && (
                        <>
                          <tr>
                            <td height="8"></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "10pt",
                                lineHeight: "1.4",
                                textAlign: "justify",
                              }}
                            >
                              {project.description}
                            </td>
                          </tr>
                        </>
                      )}
                      {project.features?.filter(Boolean).length > 0 && (
                        <>
                          <tr>
                            <td height="8"></td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                width="100%"
                                cellPadding="0"
                                cellSpacing="0"
                              >
                                <tbody>
                                  {project.features
                                    .filter(Boolean)
                                    .map((feature, featIndex) => (
                                      <tr key={featIndex}>
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
                                            textAlign: "justify",
                                          }}
                                        >
                                          {feature}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Achievements & Leadership Section */}
      {data.achievements?.filter(Boolean).length > 0 && (
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          className="mb-6 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ fontSize: "14pt", fontFamily: "Arial, sans-serif" }}
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
                              textAlign: "justify",
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky top-0 bg-white dark:bg-zinc-900 shadow-sm pb-4 px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Professional Resume Template</h1>
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
