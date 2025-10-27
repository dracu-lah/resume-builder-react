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
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [showEducation, setShowEducation] = useState(true);
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    pageStyle: `
      @page { size: A4; margin: 12.7mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; color-adjust: exact; }
        .resume-container { width: 100%; font-size: 9.5pt; line-height: 1.35; }
        .section-border { border-top: 1px solid #000 !important; margin: 10px 0 !important; }
        .resume-section { page-break-inside: avoid; margin-bottom: 8px !important; }
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
        fontFamily: "Arial, sans-serif",
        fontSize: "9.5pt",
        lineHeight: "1.35",
      }}
    >
      {/* HEADER */}
      <table width="100%" cellPadding="4" cellSpacing="0" className="mb-2">
        <tbody>
          <tr>
            <td width="70%" valign="top" style={{ fontSize: "10pt" }}>
              <h1
                className="font-bold mb-1"
                style={{ fontSize: "16pt", color: "#000" }}
              >
                {data.personalInfo.name}
              </h1>
              {data.personalInfo.portfolioWebsite && (
                <div>
                  <a
                    href={data.personalInfo.portfolioWebsite}
                    className="font-semibold text-indigo-600"
                  >
                    {!showLinks
                      ? "Website"
                      : data.personalInfo.portfolioWebsite}
                  </a>
                </div>
              )}
              {data.personalInfo.linkedInUrl && (
                <div>
                  <a
                    href={data.personalInfo.linkedInUrl}
                    className="text-indigo-600 font-semibold"
                  >
                    {!showLinks
                      ? "LinkedIn"
                      : data.personalInfo.linkedInUrl.replace("https://", "")}
                  </a>
                </div>
              )}
            </td>
            <td
              width="30%"
              align="right"
              valign="top"
              style={{ fontSize: "10pt", lineHeight: "1.4" }}
            >
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
            </td>
          </tr>
        </tbody>
      </table>
      <hr className="section-border border-t border-black mt-2 mb-2" />

      {/* SKILLS */}
      <table width="100%" className="resume-section" cellPadding="3">
        <tbody>
          <tr>
            <td align="center" colSpan={2}>
              <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
                SKILLS SUMMARY
              </h2>
            </td>
          </tr>
          {Object.entries(data.skills).map(([key, value]) =>
            value.filter(Boolean).length > 0 ? (
              <tr key={key}>
                <td width="28%" valign="top" className="font-bold pr-2">
                  • {key.charAt(0).toUpperCase() + key.slice(1)}:
                </td>
                <td>{value.filter(Boolean).join(", ")}</td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
      <hr className="section-border border-t border-black mt-2 mb-2" />

      {/* EXPERIENCE */}
      <table width="100%" className="resume-section" cellPadding="3">
        <tbody>
          <tr>
            <td align="center" colSpan={2}>
              <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
                WORK EXPERIENCE
              </h2>
            </td>
          </tr>
          {data.experience.map((exp, i) =>
            exp.positions.map((pos, j) => (
              <tr key={`${i}-${j}`}>
                <td colSpan={2}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold" style={{ fontSize: "10pt" }}>
                      {pos.title.toUpperCase()} | {exp.company.toUpperCase()}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ fontSize: "9.5pt" }}
                    >
                      {pos.duration}
                    </span>
                  </div>
                  <ul className="ml-4 mt-1 space-y-0.5">
                    {pos.achievements.map((a, k) => (
                      <li
                        key={k}
                        style={{ fontSize: "9pt", textAlign: "justify" }}
                      >
                        ○ {a}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
      <hr className="section-border border-t border-black mt-2 mb-2" />

      {/* PROJECTS */}
      {data.projects?.length > 0 && (
        <>
          <table width="100%" className="resume-section" cellPadding="3">
            <tbody>
              <tr>
                <td align="center" colSpan={2}>
                  <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
                    PROJECTS
                  </h2>
                </td>
              </tr>
              {data.projects.map((p, i) => (
                <tr key={i}>
                  <td colSpan={2}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold" style={{ fontSize: "10pt" }}>
                        {p.name.toUpperCase()}{" "}
                        {p.link && (
                          <>
                            |{" "}
                            <a
                              href={p.link}
                              className="text-indigo-700 font-semibold"
                            >
                              {!showLinks ? "Link" : p.link}
                            </a>
                          </>
                        )}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ fontSize: "9.5pt" }}
                      >
                        {p.duration || ""}
                      </span>
                    </div>
                    <ul className="ml-4 mt-1 space-y-0.5">
                      <li style={{ fontSize: "9pt", textAlign: "justify" }}>
                        ○ {p.description}
                      </li>
                      {p.features.filter(Boolean).map((f, j) => (
                        <li
                          key={j}
                          style={{ fontSize: "9pt", textAlign: "justify" }}
                        >
                          ○ {f}
                        </li>
                      ))}
                      {p.technologies.filter(Boolean).length > 0 && (
                        <li style={{ fontSize: "9pt" }}>
                          ○ <strong>Technologies:</strong>{" "}
                          {p.technologies.join(", ")}
                        </li>
                      )}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="section-border border-t border-black mt-2 mb-2" />
        </>
      )}

      {/* EDUCATION */}
      {showEducation && (
        <>
          <table width="100%" className="resume-section" cellPadding="3">
            <tbody>
              <tr>
                <td align="center" colSpan={2}>
                  <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
                    EDUCATION
                  </h2>
                </td>
              </tr>
              {data.education.map((edu, i) => (
                <tr key={i}>
                  <td width="65%" valign="top" style={{ paddingRight: "10px" }}>
                    <div className="font-bold">{edu.institution}</div>
                    <div>{edu.degree}</div>
                    {edu.gpa && (
                      <div>
                        {edu.specialization}; GPA: {edu.gpa}
                      </div>
                    )}
                  </td>
                  <td
                    width="35%"
                    align="right"
                    valign="top"
                    style={{ lineHeight: "1.4" }}
                  >
                    <div>{edu.location}</div>
                    <div className="font-semibold">{edu.graduationDate}</div>
                    {edu.additionalInfo && <div>{edu.additionalInfo}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="section-border border-t border-black mt-2 mb-2" />
        </>
      )}

      {/* ACHIEVEMENTS */}
      {data.achievements.filter(Boolean).length > 0 && (
        <table width="100%" className="resume-section" cellPadding="3">
          <tbody>
            <tr>
              <td align="center" colSpan={2}>
                <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
                  ACHIEVEMENTS AND CERTIFICATES
                </h2>
              </td>
            </tr>
            {data.achievements.map((a, i) => (
              <tr key={i}>
                <td colSpan={2}>
                  <ul className="ml-4 mt-1 space-y-0.5">
                    <li style={{ fontSize: "9pt", textAlign: "justify" }}>
                      ○ {a}
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
