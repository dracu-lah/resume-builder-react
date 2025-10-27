import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { DownloadJSONButton } from "@/components/ResumeBuilder/components/DownloadJSONButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ResumePreviewPage = ({ resumeData, setViewMode }) => {
  const [showLinks, setShowLinks] = useState(false);
  const [showEducation, setShowEducation] = useState(true);
  const [isDesignMode, setIsDesignMode] = useState(false);
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    pageStyle: `
      @page { size: A4; margin: 0.5in; }
      @media print {
        body { -webkit-print-color-adjust: exact; color-adjust: exact; }
        .resume-container { width:100%; max-width:none; margin:0; padding:0; font-size:10pt; line-height:1.1; }
        .resume-section { break-inside: avoid; page-break-inside: avoid; }
        .no-print { display: none !important; }
        a { color: blue !important; text-decoration: underline; }
      }
    `,
    documentTitle: "Resume",
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
      {/* Header table: left = location/links, center = name/title, right = contact */}
      <table width="100%" cellPadding={6} cellSpacing={0} className="mb-4">
        <tbody>
          <tr>
            <td width="33%" valign="top" style={{ fontSize: "10pt" }}>
              {/* left: location + links */}
              <div>{data.personalInfo.location || "Kerala, India"}</div>

              {data.personalInfo.portfolioWebsite && (
                <div style={{ marginTop: 6 }}>
                  <a
                    href={data.personalInfo.portfolioWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-700"
                  >
                    {showLinks
                      ? data.personalInfo.portfolioWebsite.replace(
                          /^https?:\/\//,
                          "",
                        )
                      : "Portfolio"}
                  </a>
                </div>
              )}
            </td>

            <td
              width="34%"
              align="center"
              valign="middle"
              style={{ paddingTop: 6, paddingBottom: 6 }}
            >
              {/* center: name (uppercase) */}
              <div style={{ textAlign: "center" }}>
                <h1
                  className="font-bold"
                  style={{ fontSize: "14pt", letterSpacing: "1pt", margin: 0 }}
                >
                  {data.personalInfo.name
                    ? data.personalInfo.name.toUpperCase()
                    : ""}
                </h1>
              </div>
            </td>

            <td
              width="33%"
              valign="top"
              align="right"
              style={{ fontSize: "10pt" }}
            >
              {/* right: contact */}
              {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
              {data.personalInfo.email && (
                <div style={{ marginTop: 6 }}>{data.personalInfo.email}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary */}
      {data.personalInfo.summary && (
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          className="mb-3 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="font-bold mb-1"
                  style={{ fontSize: "11pt", margin: 0 }}
                >
                  SUMMARY
                </h2>
                <p
                  style={{
                    fontSize: "10pt",
                    textAlign: "justify",
                    lineHeight: "1.2",
                    marginTop: 6,
                  }}
                >
                  {data.personalInfo.summary}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Skills */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-3 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <div style={{ fontSize: "10pt", lineHeight: "1.2" }}>
                {data.skills.languages?.filter(Boolean).length > 0 && (
                  <div>
                    <span className="font-bold">
                      Programming Languages & Frameworks:{" "}
                    </span>
                    {data.skills.languages.filter(Boolean).join(", ")}
                  </div>
                )}
                {data.skills.frameworks?.filter(Boolean).length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span className="font-bold">Frameworks & Libraries: </span>
                    {data.skills.frameworks.filter(Boolean).join(", ")}
                  </div>
                )}
                {data.skills.databases?.filter(Boolean).length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span className="font-bold">Databases & ORM: </span>
                    {data.skills.databases.filter(Boolean).join(", ")}
                  </div>
                )}
                {data.skills.tools?.filter(Boolean).length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span className="font-bold">Cloud & DevOps Tools: </span>
                    {data.skills.tools.filter(Boolean).join(", ")}
                  </div>
                )}
                {data.skills.architectures?.filter(Boolean).length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span className="font-bold">Architectures: </span>
                    {data.skills.architectures.filter(Boolean).join(", ")}
                  </div>
                )}
                {data.skills.methodologies?.filter(Boolean).length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span className="font-bold">Software Practices: </span>
                    {data.skills.methodologies.filter(Boolean).join(", ")}
                  </div>
                )}
                {data.skills.other?.filter(Boolean).length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <span className="font-bold">Other Skills: </span>
                    {data.skills.other.filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Employment */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-2 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <h2
                className="font-bold mb-1"
                style={{ fontSize: "11pt", margin: 0 }}
              >
                EMPLOYMENT
              </h2>

              {data.experience.map((exp, idx) =>
                exp.positions.map((position, pIdx) => (
                  <table
                    key={`${idx}-${pIdx}`}
                    width="100%"
                    cellPadding={4}
                    cellSpacing={0}
                    style={{ marginTop: 10 }}
                  >
                    <tbody>
                      <tr>
                        <td valign="top" style={{ fontSize: "10pt" }}>
                          <span className="font-bold">{position.title}</span>{" "}
                          <span> | {exp.company}</span>
                        </td>
                        <td
                          valign="top"
                          align="right"
                          style={{ fontSize: "10pt", whiteSpace: "nowrap" }}
                        >
                          {position.duration}
                        </td>
                      </tr>

                      {position.client && (
                        <tr>
                          <td
                            colSpan={2}
                            style={{
                              fontSize: "10pt",
                              paddingTop: 6,
                              fontStyle: "italic",
                            }}
                          >
                            {position.client}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td colSpan={2} style={{ paddingTop: 6 }}>
                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: 16,
                              fontSize: "10pt",
                              lineHeight: "1.2",
                            }}
                          >
                            {position.achievements?.map((ach, aIdx) => (
                              <li
                                key={aIdx}
                                style={{
                                  marginBottom: 6,
                                  textAlign: "justify",
                                }}
                              >
                                ● {ach}
                              </li>
                            ))}
                          </ul>

                          <div style={{ marginTop: 6, fontSize: "10pt" }}>
                            <span className="italic">Tech Stack: </span>
                            {Array.isArray(position.techStack)
                              ? position.techStack.join(", ")
                              : position.techStack ||
                                exp.techStack ||
                                "Not specified"}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )),
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Projects */}
      {data.projects?.length > 0 && (
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          className="mb-2 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="font-bold mb-1"
                  style={{ fontSize: "11pt", margin: 0 }}
                >
                  PROJECTS
                </h2>

                <div style={{ marginTop: 8 }}>
                  {data.projects.map((project, pIdx) => (
                    <table
                      key={pIdx}
                      width="100%"
                      cellPadding={4}
                      cellSpacing={0}
                      style={{ marginBottom: 8 }}
                    >
                      <tbody>
                        <tr>
                          <td valign="top" style={{ fontSize: "10pt" }}>
                            <span className="font-bold">● {project.name}</span>
                            {project.yearRange && (
                              <span> ({project.yearRange})</span>
                            )}
                            : {project.description}
                          </td>
                        </tr>
                        {project.technologies?.filter(Boolean).length > 0 && (
                          <tr>
                            <td style={{ fontSize: "10pt", paddingTop: 6 }}>
                              <div className="italic">
                                Tech Stack:{" "}
                                {project.technologies
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Education */}
      {showEducation && (
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          className="mb-3 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="font-bold mb-1"
                  style={{ fontSize: "11pt", margin: 0 }}
                >
                  EDUCATION
                </h2>

                <div style={{ marginTop: 8 }}>
                  {data.education.map((edu, eIdx) => (
                    <table
                      key={eIdx}
                      width="100%"
                      cellPadding={4}
                      cellSpacing={0}
                      style={{ marginBottom: 8 }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "10pt" }}>
                            {edu.institution}
                          </td>
                          <td
                            align="right"
                            style={{ fontSize: "10pt", whiteSpace: "nowrap" }}
                          >
                            {edu.year || ""}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={2}
                            style={{ fontSize: "10pt", paddingTop: 4 }}
                          >
                            ● {edu.degree}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Achievements */}
      {data.achievements?.filter(Boolean).length > 0 && (
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          className="mb-2 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="font-bold mb-1"
                  style={{ fontSize: "11pt", margin: 0 }}
                >
                  ADDITIONAL EXPERIENCE AND AWARDS
                </h2>
                <ul
                  style={{
                    marginTop: 8,
                    paddingLeft: 16,
                    fontSize: "10pt",
                    lineHeight: "1.2",
                  }}
                >
                  {data.achievements.filter(Boolean).map((ach, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      ● {ach}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Interests */}
      {data.interests?.filter(Boolean).length > 0 && (
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          className="resume-section"
        >
          <tbody>
            <tr>
              <td>
                <h2
                  className="font-bold mb-1"
                  style={{ fontSize: "11pt", margin: 0 }}
                >
                  INTERESTS
                </h2>
                <p style={{ fontSize: "10pt", marginTop: 8 }}>
                  {data.interests.filter(Boolean).join(", ")}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky top-0 bg-white dark:bg-zinc-900 shadow-sm pb-4 px-4 flex flex-col md:flex-row gap-4 justify-between items-center no-print">
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

          <div className="flex items-center space-x-2">
            <Switch
              id="disable-education"
              checked={showEducation}
              onCheckedChange={setShowEducation}
            />
            <Label htmlFor="disable-education">Show Education</Label>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Switch
              id="design-mode"
              checked={isDesignMode}
              onCheckedChange={(e) => {
                setIsDesignMode(e);
                if (e) toast.info("These changes won't be persisted!");
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
