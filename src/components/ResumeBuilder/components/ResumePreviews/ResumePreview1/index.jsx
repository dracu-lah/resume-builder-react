import { useReactToPrint } from "react-to-print";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { DownloadJSONButton } from "@/components/ResumeBuilder/components/DownloadJSONButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const ResumePreviewPage = ({ resumeData, setViewMode }) => {
  const [showLinks, setShowLinks] = useState(false);
  const [isDesignMode, setIsDesignMode] = useState(false);
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; color-adjust: exact; -webkit-font-smoothing: antialiased; }
        .resume-container { width:100%; max-width:none; margin:0; padding:0; font-size:12px; line-height:1.35; }
        .resume-section { break-inside: avoid; page-break-inside: avoid; }
        .page-break { page-break-before: always; }
        a { color: blue !important; text-decoration: underline; }
        ul { list-style-type: disc !important; margin: 0 0 8px 18px !important; padding: 0 !important; }
        li { margin-bottom: 6px !important; display: list-item !important; }
        .print\\:hidden { display: none !important; }
      }
    `,
    documentTitle: "Resume",
    onBeforeGetContent: () => Promise.resolve(),
    onAfterPrint: () => console.log("Print completed"),
    removeAfterPrint: true,
  });

  useEffect(() => {
    // reserved for future side effects
  }, []);

  const ResumePreview = ({ data }) => (
    <div
      ref={contentRef}
      contentEditable={isDesignMode}
      className="bg-white p-8 max-w-4xl resume-container mx-auto text-black"
      style={{
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        fontSize: "11pt",
        lineHeight: 1.35,
        color: "#111",
      }}
    >
      {/* Force list styles in preview (overrides global resets that remove bullets) */}
      <style>{`
        .resume-container ul {
          list-style-type: disc !important;
          list-style-position: outside !important;
          margin: 8px 0 8px 18px !important;
          padding: 0 !important;
        }
        .resume-container li {
          margin-bottom: 6px !important;
          display: list-item !important;
        }
        /* nested lists spacing */
        .resume-container ul ul {
          margin-left: 24px !important;
        }
      `}</style>

      {/* Header: name/links left, contact right */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-6 resume-section"
        style={{ tableLayout: "fixed" }}
      >
        <tbody>
          <tr>
            <td
              width="60%"
              valign="top"
              style={{ fontSize: "18pt", verticalAlign: "top" }}
            >
              <div style={{ fontWeight: 800, fontSize: "20pt", lineHeight: 1 }}>
                {data.personalInfo?.name || ""}
              </div>

              <div style={{ marginTop: 6, fontSize: "10pt", color: "#333" }}>
                {data.personalInfo?.title && (
                  <div
                    style={{ fontSize: "11pt", fontWeight: 600, color: "#222" }}
                  >
                    {data.personalInfo.title}
                  </div>
                )}

                <div style={{ marginTop: 6 }}>
                  {data.personalInfo?.portfolioWebsite && (
                    <span style={{ marginRight: 12 }}>
                      <a
                        href={data.personalInfo.portfolioWebsite}
                        className="text-indigo-700"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#1f6feb", textDecoration: "none" }}
                      >
                        {showLinks
                          ? data.personalInfo.portfolioWebsite.replace(
                              /^https?:\/\//,
                              "",
                            )
                          : "Website"}
                      </a>
                    </span>
                  )}

                  {data.personalInfo?.linkedInUrl && (
                    <span>
                      <a
                        href={data.personalInfo.linkedInUrl}
                        className="text-indigo-700"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#1f6feb", textDecoration: "none" }}
                      >
                        {showLinks
                          ? data.personalInfo.linkedInUrl.replace(
                              /^https?:\/\//,
                              "",
                            )
                          : "LinkedIn"}
                      </a>
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    fontSize: "11pt",
                    color: "#222",
                  }}
                >
                  {data.personalInfo?.phone && (
                    <div>{data.personalInfo.phone}</div>
                  )}
                  {data.personalInfo?.phone && data.personalInfo?.email && (
                    <div>|</div>
                  )}
                  {data.personalInfo?.email && (
                    <div>{data.personalInfo.email}</div>
                  )}
                </div>
              </div>
            </td>

            <td
              width="40%"
              valign="top"
              align="right"
              style={{ fontSize: "10pt", verticalAlign: "top" }}
            >
              <div
                style={{ color: "#222", textAlign: "right", fontSize: "11pt" }}
              >
                {data.personalInfo?.phone && (
                  <div>{data.personalInfo.phone}</div>
                )}
                {data.personalInfo?.email && (
                  <div style={{ marginTop: 6 }}>{data.personalInfo.email}</div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Profile Summary */}
      <section style={{ marginBottom: 18 }}>
        <div style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}>
          PROFILE SUMMARY
        </div>
        {data.personalInfo?.title && (
          <div style={{ fontSize: "12pt", fontWeight: 600, marginBottom: 6 }}>
            {data.personalInfo.title}
          </div>
        )}
        {data.personalInfo?.summary && (
          <p style={{ fontSize: "11pt", textAlign: "justify", margin: 0 }}>
            {data.personalInfo.summary}
          </p>
        )}
      </section>

      {/* Experience */}
      <section style={{ marginBottom: 18 }}>
        <div style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}>
          EXPERIENCE
        </div>

        {Array.isArray(data.experience) &&
          data.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div style={{ fontSize: "12pt", fontWeight: 700 }}>
                  {exp.company}
                </div>
                <div style={{ fontSize: "10pt", color: "#444" }}>
                  {exp.range || ""}
                </div>
              </div>

              {Array.isArray(exp.positions) &&
                exp.positions.map((position, pIdx) => (
                  <div key={pIdx} style={{ paddingTop: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                      }}
                    >
                      <div style={{ fontSize: "11pt", fontWeight: 600 }}>
                        {position.title}
                      </div>
                      <div
                        style={{
                          fontSize: "10pt",
                          fontWeight: 500,
                          color: "#444",
                        }}
                      >
                        {position.duration}
                      </div>
                    </div>

                    {position.client && (
                      <div
                        style={{
                          fontStyle: "italic",
                          marginTop: 6,
                          fontSize: "10pt",
                          color: "#444",
                        }}
                      >
                        {position.client}
                      </div>
                    )}

                    {Array.isArray(position.achievements) &&
                      position.achievements.filter(Boolean).length > 0 && (
                        <ul
                          style={{
                            marginTop: 8,
                            paddingLeft: 18,
                            fontSize: "10pt",
                            lineHeight: 1.4,
                          }}
                        >
                          {position.achievements
                            .filter(Boolean)
                            .map((ach, aIdx) => (
                              <li
                                key={aIdx}
                                style={{
                                  marginBottom: 6,
                                  textAlign: "justify",
                                }}
                              >
                                {ach}
                              </li>
                            ))}
                        </ul>
                      )}

                    {/* Tech Stack: show only if present */}
                    {((Array.isArray(position.techStack) &&
                      position.techStack.filter(Boolean).length > 0) ||
                      (Array.isArray(exp.techStack) &&
                        exp.techStack.filter(Boolean).length > 0) ||
                      (typeof position.techStack === "string" &&
                        position.techStack.trim()) ||
                      (typeof exp.techStack === "string" &&
                        exp.techStack.trim())) && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: "10pt",
                          fontStyle: "italic",
                          color: "#333",
                        }}
                      >
                        <strong>Tech Stack:</strong>{" "}
                        {Array.isArray(position.techStack) &&
                        position.techStack.filter(Boolean).length > 0
                          ? position.techStack.filter(Boolean).join(", ")
                          : Array.isArray(exp.techStack) &&
                              exp.techStack.filter(Boolean).length > 0
                            ? exp.techStack.filter(Boolean).join(", ")
                            : (typeof position.techStack === "string" &&
                                position.techStack) ||
                              (typeof exp.techStack === "string" &&
                                exp.techStack) ||
                              ""}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
      </section>

      {/* Technical Skills */}
      <section style={{ marginBottom: 18 }}>
        <div style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}>
          TECHNICAL SKILLS
        </div>
        <div style={{ fontSize: "10pt", lineHeight: 1.35, color: "#222" }}>
          {data.skills?.languages?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Languages:</strong>{" "}
              {data.skills.languages.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills?.frameworks?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Frameworks & Libraries:</strong>{" "}
              {data.skills.frameworks.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills?.databases?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Databases:</strong>{" "}
              {data.skills.databases.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills?.architectures?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Architectures:</strong>{" "}
              {data.skills.architectures.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills?.tools?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Tools & Platforms:</strong>{" "}
              {data.skills.tools.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills?.methodologies?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Methodologies:</strong>{" "}
              {data.skills.methodologies.filter(Boolean).join(", ")}
            </div>
          )}
          {data.skills?.other?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Other Skills:</strong>{" "}
              {data.skills.other.filter(Boolean).join(", ")}
            </div>
          )}
        </div>
      </section>

      {/* Projects */}
      {Array.isArray(data.projects) && data.projects.length > 0 && (
        <section style={{ marginBottom: 18 }}>
          <div style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}>
            PROJECTS
          </div>
          {data.projects.map((project, pIdx) => (
            <div key={pIdx} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "12pt", fontWeight: 700 }}>
                {project.name}
                {project.link && (
                  <span style={{ marginLeft: 8 }}>
                    <a
                      href={project.link}
                      className="text-indigo-700"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#1f6feb", textDecoration: "none" }}
                    >
                      {showLinks ? project.link : "Link"}
                    </a>
                  </span>
                )}
              </div>

              <div style={{ fontSize: "10pt", paddingTop: 8 }}>
                {project.role && (
                  <div
                    style={{ fontWeight: 600, marginBottom: 6 }}
                  >{`Role: ${project.role}`}</div>
                )}
                <div style={{ marginBottom: 6, textAlign: "justify" }}>
                  {project.description}
                </div>
                {project.technologies?.filter(Boolean).length > 0 && (
                  <div style={{ fontStyle: "italic" }}>
                    Technologies:{" "}
                    {project.technologies.filter(Boolean).join(", ")}
                  </div>
                )}
                {project.features?.filter(Boolean).length > 0 && (
                  <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                    {project.features.filter(Boolean).map((f, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      <section style={{ marginBottom: 18 }}>
        <div style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}>
          EDUCATION
        </div>
        {data.education?.map((edu, eIdx) => (
          <div key={eIdx} style={{ marginBottom: 10, fontSize: "11pt" }}>
            <div style={{ fontWeight: 700 }}>
              {edu.degree}
              {edu.year ? ` [${edu.year}]` : ""}
            </div>
            <div>{edu.institution}</div>
          </div>
        ))}
      </section>

      {/* Achievements and Interests */}
      {(data.achievements?.filter(Boolean).length > 0 ||
        data.interests?.filter(Boolean).length > 0) && (
        <section style={{ marginBottom: 18 }}>
          {data.achievements?.filter(Boolean).length > 0 && (
            <>
              <div
                style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}
              >
                ACHIEVEMENTS AND CERTIFICATES
              </div>
              <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
                {data.achievements.filter(Boolean).map((ach, aIdx) => (
                  <li key={aIdx} style={{ marginBottom: 6, fontSize: "10pt" }}>
                    {ach}
                  </li>
                ))}
              </ul>
            </>
          )}

          {data.interests?.filter(Boolean).length > 0 && (
            <>
              <div
                style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}
              >
                INTERESTS
              </div>
              <div style={{ fontSize: "10pt" }}>
                {data.interests.filter(Boolean).join(", ")}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky top-0 bg-white dark:bg-zinc-900 shadow-sm pb-4 px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Default Resume Preview</h1>

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
