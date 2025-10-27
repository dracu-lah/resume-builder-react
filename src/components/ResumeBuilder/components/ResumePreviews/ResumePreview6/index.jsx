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
        font-size: 9px;
        line-height: 1.5;
      }
      
      .resume-section {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      .link-blue {
        color: #2563eb !important;
        text-decoration: underline;
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
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-2">
        <tbody>
          <tr>
            {/* Left side: location (top) + website (bottom) */}
            <td width="33%" valign="middle" style={{ fontSize: "9pt" }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "2px" }}>
                      {data.personalInfo.location}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {data.personalInfo.portfolioWebsite && (
                        <a
                          href={data.personalInfo.portfolioWebsite}
                          className="link-blue"
                          style={{
                            color: "#2563eb",
                            textDecoration: "underline",
                          }}
                        >
                          {showLinks
                            ? data.personalInfo.portfolioWebsite
                                .replace("https://", "")
                                .replace("http://", "")
                            : "Website"}
                        </a>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Center: name */}
            <td width="64%" align="center" valign="middle">
              <h1
                style={{
                  fontSize: "20pt",
                  fontWeight: "bold",
                  fontFamily: "Arial, sans-serif",
                  margin: 0,
                  padding: 0,
                  letterSpacing: "2px",
                }}
              >
                {data.personalInfo.name?.toUpperCase()}
              </h1>
            </td>

            {/* Right side: phone (top) + email (bottom) */}
            <td
              width="33%"
              valign="middle"
              align="right"
              style={{ fontSize: "9pt" }}
            >
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td align="right" style={{ paddingBottom: "2px" }}>
                      {data.personalInfo.phone}
                    </td>
                  </tr>
                  <tr>
                    <td align="right">
                      <a
                        href={`mailto:${data.personalInfo.email}`}
                        className="link-blue"
                        style={{
                          color: "#2563eb",
                          textDecoration: "underline",
                        }}
                      >
                        {data.personalInfo.email}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Horizontal line under name */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-3">
        <tbody>
          <tr>
            <td style={{ borderBottom: "1px solid #000", height: "1px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Summary Section */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        className="mb-3 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                style={{
                  fontSize: "10pt",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Summary
              </h2>
              <p
                style={{
                  fontSize: "9pt",
                  lineHeight: "1.5",
                  textAlign: "justify",
                  margin: 0,
                }}
              >
                {data.personalInfo.summary}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Horizontal Line */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-3">
        <tbody>
          <tr>
            <td style={{ borderBottom: "1px solid #000", height: "1px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Skills in multiple columns */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        className="mb-3 resume-section"
      >
        <tbody>
          <tr>
            <td colSpan="2">
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: "9pt",
                        lineHeight: "1.5",
                        paddingBottom: "4px",
                      }}
                    >
                      <strong>Languages:</strong>{" "}
                      {data.skills.languages.filter(Boolean).join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: "9pt",
                        lineHeight: "1.5",
                        paddingBottom: "4px",
                      }}
                    >
                      <strong>Frameworks & Libraries:</strong>{" "}
                      {data.skills.frameworks.filter(Boolean).join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: "9pt",
                        lineHeight: "1.5",
                        paddingBottom: "4px",
                      }}
                    >
                      <strong>Tools & Platforms:</strong>{" "}
                      {data.skills.tools.filter(Boolean).join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "9pt", lineHeight: "1.5" }}>
                      <strong>Architectures & Methodologies:</strong>{" "}
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
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-3">
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
        className="mb-3 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                style={{
                  fontSize: "10pt",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Employment
              </h2>

              {data.experience.map((exp, index) => (
                <table
                  key={index}
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  className="mb-2"
                >
                  <tbody>
                    <tr>
                      <td colSpan="2" height="4"></td>
                    </tr>
                    <tr>
                      <td
                        width="70%"
                        valign="top"
                        style={{ fontSize: "9pt", fontWeight: "bold" }}
                      >
                        {exp.positions?.[0]?.title}
                      </td>
                      <td
                        width="30%"
                        valign="top"
                        align="right"
                        style={{ fontSize: "9pt" }}
                      >
                        {exp.positions?.[0]?.duration}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          fontSize: "9pt",
                          fontStyle: "italic",
                          paddingBottom: "2px",
                        }}
                      >
                        {exp.company}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            {exp.positions?.[0]?.achievements?.map(
                              (achievement, achIndex) => (
                                <tr key={achIndex}>
                                  <td
                                    width="15"
                                    valign="top"
                                    style={{ fontSize: "9pt" }}
                                  >
                                    •
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "9pt",
                                      lineHeight: "1.5",
                                      textAlign: "justify",
                                      paddingBottom: "2px",
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
                    {exp.positions?.[0]?.techStack && (
                      <tr>
                        <td
                          colSpan="2"
                          style={{ fontSize: "9pt", paddingTop: "2px" }}
                        >
                          <strong>Tech Stack:</strong>{" "}
                          {exp.positions[0].techStack}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Horizontal Line */}
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-3">
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
        className="mb-3 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                style={{
                  fontSize: "10pt",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
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
                  className="mb-2"
                >
                  <tbody>
                    <tr>
                      <td colSpan="2" height="4"></td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: "9pt", lineHeight: "1.5" }}>
                        •&nbsp;
                        {project.link ? (
                          <a
                            href={project.link}
                            className="link-blue"
                            style={{
                              fontSize: "9pt",
                              fontWeight: "bold",
                              color: "#2563eb",
                              textDecoration: "underline",
                            }}
                          >
                            {project.name}
                          </a>
                        ) : (
                          <strong>{project.name}</strong>
                        )}
                        {project.year && <span> ({project.year})</span>}
                        {project.description && <>: {project.description}</>}
                        {project.technologies.filter(Boolean).length > 0 && (
                          <>
                            <br />
                            &nbsp;&nbsp;&nbsp;
                            <strong>Tech Stack:</strong>{" "}
                            {project.technologies.filter(Boolean).join(", ")}
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
      <table width="100%" cellPadding="0" cellSpacing="0" className="mb-3">
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
                  fontSize: "10pt",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
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
                        <td width="15" valign="top" style={{ fontSize: "9pt" }}>
                          •
                        </td>
                        <td
                          style={{
                            fontSize: "9pt",
                            lineHeight: "1.5",
                            textAlign: "justify",
                            paddingBottom: "2px",
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
