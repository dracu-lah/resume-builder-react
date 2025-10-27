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
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);

  // Print handler
  const reactToPrintFn = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    pageStyle: `
      @page { size: A4; margin: 12.7mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; color-adjust: exact; }
        .resume-container { width:100%; max-width:none; margin:0; padding:0; font-size:12px; line-height:1.4; }
        .resume-section { break-inside: avoid; page-break-inside: avoid; }
        .page-break { page-break-before: always; }
        a { color: blue !important; text-decoration: underline; }
        .passport-photo { display:block; }
        .print\\:hidden { display: none !important; }
      }
    `,
    documentTitle: "Resume",
    onBeforeGetContent: () => Promise.resolve(),
    onAfterPrint: () => console.log("Print completed"),
    removeAfterPrint: true,
  });

  // Load stored image from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("resume_passport_image");
      if (stored) setImageSrc(stored);
    } catch (e) {
      // ignore localStorage errors
      console.warn("Could not load stored image", e);
    }
  }, []);

  // Handle file read + persist to localStorage
  const handleImagePick = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setImageSrc(dataUrl);
      try {
        localStorage.setItem("resume_passport_image", dataUrl);
      } catch (e) {
        console.warn("Could not save image to localStorage", e);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    handleImagePick(f);
  };

  const clearImage = () => {
    setImageSrc(null);
    try {
      localStorage.removeItem("resume_passport_image");
    } catch (e) {
      console.warn("Could not remove image from localStorage", e);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const ResumePreview = ({ data }) => (
    <div
      ref={contentRef}
      contentEditable={isDesignMode}
      className="bg-white p-8 max-w-4xl resume-container mx-auto text-black"
      style={{
        fontFamily: 'Times, "Times New Roman", serif',
        fontSize: "11pt",
        lineHeight: 1.4,
      }}
    >
      {/* ---------- Header: name/links left, passport photo right with overlay controls ---------- */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-6 resume-section"
        style={{ tableLayout: "fixed" }}
      >
        <tbody>
          <tr className="relative">
            {/* LEFT: name + links */}
            <td
              width="60%"
              valign="top"
              style={{ fontSize: "18pt", verticalAlign: "top" }}
            >
              <div style={{ fontWeight: 700, fontSize: "18pt", lineHeight: 1 }}>
                {data.personalInfo?.name}
              </div>

              <div style={{ marginTop: 6, fontSize: "10pt" }}>
                {data.personalInfo?.title && (
                  <div style={{ fontSize: "11pt", fontWeight: 600 }}>
                    {data.personalInfo.title}
                  </div>
                )}

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    fontSize: "11pt",
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
                <div style={{ marginTop: 6 }}>
                  <div className="flex gap-4">
                    {data.personalInfo?.linkedInUrl && (
                      <div>
                        <a
                          href={data.personalInfo.linkedInUrl}
                          className="text-indigo-700"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: "11pt",
                          }}
                        >
                          {showLinks
                            ? data.personalInfo.linkedInUrl.replace(
                                /^https?:\/\//,
                                "",
                              )
                            : "LinkedIn"}
                        </a>
                      </div>
                    )}

                    {data.personalInfo?.portfolioWebsite && (
                      <div>
                        <a
                          href={data.personalInfo.portfolioWebsite}
                          className="text-indigo-700"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: "11pt",
                          }}
                        >
                          {showLinks
                            ? data.personalInfo.portfolioWebsite.replace(
                                /^https?:\/\//,
                                "",
                              )
                            : "Website"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </td>

            {/* RIGHT: passport photo (far right) */}
            <td className="absolute right-0 top-0 ">
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    position: "relative",
                    width: 120,
                    minWidth: 120,
                    height: 150,
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    background: "#f6f6f6",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  {/* image or placeholder */}
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="passport"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "#666",
                        padding: 6,
                        textAlign: "center",
                      }}
                    >
                      Passport photo
                    </div>
                  )}

                  {/* overlay controls (hidden when printing) */}
                  <div
                    className="print:hidden"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 6,
                      display: "flex",
                      justifyContent: "center",
                      gap: 6,
                      pointerEvents: "auto",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      style={{ display: "none" }}
                    />

                    <button
                      type="button"
                      onClick={triggerFile}
                      className="inline-block text-xs px-2 py-1 border rounded"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      {imageSrc ? "Change" : "Upload"}
                    </button>

                    {imageSrc && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="inline-block text-xs px-2 py-1 border rounded"
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ---------- PROFILE SUMMARY ---------- */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-6 mt-10 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <div
                style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}
              >
                PROFILE SUMMARY
              </div>
              {data.personalInfo?.title && (
                <div
                  style={{ fontSize: "12pt", fontWeight: 600, marginBottom: 6 }}
                >
                  {data.personalInfo.title}
                </div>
              )}
              {data.personalInfo?.summary && (
                <p
                  style={{ fontSize: "11pt", textAlign: "justify", margin: 0 }}
                >
                  {data.personalInfo.summary}
                </p>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ---------- EXPERIENCE ---------- */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-6 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <div
                style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}
              >
                EXPERIENCE
              </div>

              {Array.isArray(data.experience) &&
                data.experience.map((exp, idx) => (
                  <table
                    key={idx}
                    width="100%"
                    cellPadding={4}
                    cellSpacing={0}
                    style={{ marginBottom: 12 }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ fontSize: "12pt", fontWeight: 700 }}>
                          {exp.company}
                        </td>
                        <td
                          align="right"
                          style={{ fontSize: "10pt", whiteSpace: "nowrap" }}
                        ></td>
                      </tr>

                      {Array.isArray(exp.positions) &&
                        exp.positions.map((position, pIdx) => (
                          <tr key={pIdx}>
                            <td colSpan={2} style={{ paddingTop: 8 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "baseline",
                                  gap: 12,
                                }}
                              >
                                <div
                                  style={{ fontSize: "11pt", fontWeight: 600 }}
                                >
                                  {position.title}
                                </div>
                                <div
                                  style={{ fontSize: "10pt", fontWeight: 500 }}
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
                                  }}
                                >
                                  {position.client}
                                </div>
                              )}

                              <ul
                                style={{
                                  marginTop: 8,
                                  paddingLeft: 18,
                                  fontSize: "10pt",
                                  lineHeight: 1.3,
                                }}
                              >
                                {(position.achievements || [])
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

                              {Array.isArray(position.techStack) && (
                                <div
                                  style={{
                                    marginTop: 6,
                                    fontSize: "10pt",
                                    fontStyle: "italic",
                                  }}
                                >
                                  <strong>Tech Stack:</strong>{" "}
                                  {Array.isArray(position.techStack)
                                    ? position.techStack.join(", ")
                                    : position.techStack || exp.techStack}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ---------- TECHNICAL SKILLS ---------- */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-6 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <div
                style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}
              >
                TECHNICAL SKILLS
              </div>
              <div style={{ fontSize: "10pt", lineHeight: 1.35 }}>
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
            </td>
          </tr>
        </tbody>
      </table>

      {/* ---------- PROJECTS ---------- */}
      {Array.isArray(data.projects) && data.projects.length > 0 && (
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          className="mb-6 resume-section"
        >
          <tbody>
            <tr>
              <td>
                <div
                  style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}
                >
                  PROJECTS
                </div>
                {data.projects.map((project, pIdx) => (
                  <table
                    key={pIdx}
                    width="100%"
                    cellPadding={4}
                    cellSpacing={0}
                    style={{ marginBottom: 12 }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ fontSize: "12pt", fontWeight: 700 }}>
                          {project.name}
                          {project.link && (
                            <span style={{ marginLeft: 8 }}>
                              <a
                                href={project.link}
                                className="text-indigo-700"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {showLinks ? project.link : "Link"}
                              </a>
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: "10pt", paddingTop: 8 }}>
                          {project.role && (
                            <div style={{ fontWeight: 600, marginBottom: 6 }}>
                              Role: {project.role}
                            </div>
                          )}
                          <div
                            style={{ marginBottom: 6, textAlign: "justify" }}
                          >
                            {project.description}
                          </div>
                          {project.technologies?.filter(Boolean).length > 0 && (
                            <div style={{ fontStyle: "italic" }}>
                              Technologies:{" "}
                              {project.technologies.filter(Boolean).join(", ")}
                            </div>
                          )}
                          {project.features?.filter(Boolean).length > 0 && (
                            <div style={{ marginTop: 6 }}>
                              Features:
                              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                                {project.features
                                  .filter(Boolean)
                                  .map((f, i) => (
                                    <li key={i} style={{ marginBottom: 6 }}>
                                      {f}
                                    </li>
                                  ))}
                              </ul>
                            </div>
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
      )}

      {/* ---------- EDUCATION ---------- */}
      <table
        width="100%"
        cellPadding={6}
        cellSpacing={0}
        className="mb-6 resume-section"
      >
        <tbody>
          <tr>
            <td>
              <div
                style={{ fontSize: "14pt", fontWeight: 700, marginBottom: 8 }}
              >
                EDUCATION
              </div>
              {data.education?.map((edu, eIdx) => (
                <div key={eIdx} style={{ marginBottom: 10, fontSize: "11pt" }}>
                  <div style={{ fontWeight: 700 }}>
                    {edu.degree} [{edu.year}]
                  </div>
                  <div>{edu.institution}</div>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ---------- ACHIEVEMENTS / INTERESTS ---------- */}
      {(data.achievements?.filter(Boolean).length > 0 ||
        data.interests?.filter(Boolean).length > 0) && (
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          className="mb-6 resume-section"
        >
          <tbody>
            <tr>
              <td>
                {data.achievements?.filter(Boolean).length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: "14pt",
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      ACHIEVEMENTS AND CERTIFICATES
                    </div>
                    <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
                      {data.achievements.filter(Boolean).map((ach, aIdx) => (
                        <li
                          key={aIdx}
                          style={{ marginBottom: 6, fontSize: "10pt" }}
                        >
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {data.interests?.filter(Boolean).length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: "14pt",
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      INTERESTS
                    </div>
                    <div style={{ fontSize: "10pt" }}>
                      {data.interests.filter(Boolean).join(", ")}
                    </div>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky z-40  top-0 bg-white dark:bg-zinc-900 shadow-sm pb-4 px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
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

        <div className="flex gap-6 items-center">
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
