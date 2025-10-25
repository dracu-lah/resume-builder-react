// For docx download feature 
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

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
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef, // ✅ restored working approach
    preserveAfterPrint: true,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
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
          font-size: 10pt;
          line-height: 1.1;
        }
        .resume-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .page-break {
          page-break-before: always;
        }
        .no-print {
          display: none !important;
        }
        a {
          color: blue !important; /* ✅ force links to stay blue in print */
          text-decoration: underline;
        }
      }
    `,
    documentTitle: "Resume",
  });

  // Docx download function
  const generateWordDocument = (data = {}) => {
    // Default structure to prevent undefined errors
    const safeData = {
      personalInfo: {
        name: "",
        phone: "",
        email: "",
        linkedInUrl: "",
        portfolioWebsite: "",
        title: "",
        summary: "",
        ...(data.personalInfo || {}),
      },
      experience: data.experience || [],
      skills: {
        languages: [],
        frameworks: [],
        databases: [],
        architectures: [],
        tools: [],
        methodologies: [],
        other: [],
        ...(data.skills || {}),
      },
      projects: data.projects || [],
      education: data.education || [],
      achievements: data.achievements || [],
      interests: data.interests || [],
    };

    // Array to collect ALL paragraph objects for the single document section
    const documentChildren = [];

    // --- Helpers (remain the same) ---
    const heading = (text, size = 28) =>
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text, bold: true, size })],
      });

    const textPara = (text, options = {}) =>
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text, size: 22, ...options })],
      });
    // ----------------------------------

    // === 1. HEADER ===
    documentChildren.push(
      new Paragraph({
        alignment: "center",
        children: [new TextRun({ text: safeData.personalInfo.name, bold: true, size: 32 })],
      }),
      new Paragraph({
        alignment: "center",
        children: [
          new TextRun({
            text: [
              safeData.personalInfo.phone,
              safeData.personalInfo.email,
              safeData.personalInfo.linkedInUrl,
              safeData.personalInfo.portfolioWebsite,
            ]
              .filter(Boolean)
              .join(" | "),
          }),
        ],
      }),
    );

    // === 2. PROFILE SUMMARY ===
    documentChildren.push(
      heading("PROFILE SUMMARY"),
      textPara(safeData.personalInfo.title || ""),
      textPara(safeData.personalInfo.summary || ""),
    );

    // === 3. EXPERIENCE ===
    if (safeData.experience.length) {
      documentChildren.push(heading("EXPERIENCE"));

      const expParas = safeData.experience.flatMap((exp) => [
        textPara(exp.company || "", { bold: true }),
        ...(exp.positions || []).flatMap((pos) => [
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: `${pos.title || ""} `, bold: true }),
              new TextRun({ text: pos.duration ? `(${pos.duration})` : "" }),
            ],
          }),
          ...(pos.achievements || []).map(
            (ach) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: ach, size: 20 })],
              })
          ),
        ]),
      ]);
      documentChildren.push(...expParas);
    }

    // === 4. TECHNICAL SKILLS ===
    const skillCategories = [
      ["Languages", safeData.skills.languages],
      ["Frameworks & Libraries", safeData.skills.frameworks],
      ["Databases", safeData.skills.databases],
      ["Architectures", safeData.skills.architectures],
      ["Tools & Platforms", safeData.skills.tools],
      ["Methodologies", safeData.skills.methodologies],
      ["Other Skills", safeData.skills.other],
    ];

    const skillTexts = skillCategories
      .filter(([_, list]) => list?.filter(Boolean).length > 0)
      .map(([label, list]) => `${label}: ${list.filter(Boolean).join(", ")}`);

    if (skillTexts.length) {
      documentChildren.push(heading("TECHNICAL SKILLS"));
      documentChildren.push(...skillTexts.map((t) => textPara(t)));
    }

    // === 5. PROJECTS ===
    if (safeData.projects.length) {
      documentChildren.push(heading("PROJECTS"));

      const projectParas = safeData.projects.flatMap((p) => [
        textPara(`${p.name || ""} ${p.link ? `(${p.link})` : ""}`, { bold: true }),
        ...(p.role ? [textPara(`Role: ${p.role}`)] : []),
        textPara(p.description || ""),
        ...(p.technologies?.filter(Boolean).length
          ? [textPara(`Technologies: ${p.technologies.join(", ")}`)]
          : []),
        ...(p.features?.filter(Boolean).length
          ? [textPara(`Features: ${p.features.join(", ")}`)]
          : []),
        new Paragraph(""), // Add a small break between projects
      ]);
      documentChildren.push(...projectParas);
    }

    // === 6. EDUCATION ===
    if (safeData.education.length) {
      documentChildren.push(heading("EDUCATION"));

      const eduParas = safeData.education.map((edu) =>
        textPara(`${edu.degree || ""} — ${edu.institution || ""}`, { bold: true })
      );
      documentChildren.push(...eduParas);
    }

    // === 7. ACHIEVEMENTS ===
    if (safeData.achievements.filter(Boolean).length > 0) {
      documentChildren.push(heading("ACHIEVEMENTS AND CERTIFICATES"));

      const achParas = safeData.achievements.filter(Boolean).map(
        (ach) =>
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: ach, size: 20 })],
          })
      );
      documentChildren.push(...achParas);
    }

    // === 8. INTERESTS ===
    if (safeData.interests.filter(Boolean).length > 0) {
      documentChildren.push(
        heading("INTERESTS"),
        textPara(safeData.interests.filter(Boolean).join(", ")),
      );
    }

    // === CREATE & DOWNLOAD DOC ===
    // We create a Document with a single 'section' that contains all content.
    const doc = new Document({
      sections: [{ children: documentChildren }]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${safeData.personalInfo.name || "Resume"}.docx`);
    });
  };

  const ResumePreview = ({ data }) => (
    <div
      ref={contentRef}
      className="bg-white p-4 max-w-4xl resume-container mx-auto text-black"
      style={{
        fontFamily: 'Times, "Times New Roman", serif',
        fontSize: "11pt",
        lineHeight: "1.15",
      }}
    >
      {/* Header with location and contact */}
      <div
        className="flex justify-between items-start mb-1"
        style={{ fontSize: "10pt" }}
      >
        <div>
          {data.personalInfo.location || ""}
          <br />
          {data.personalInfo.portfolioWebsite && (
            <a
              href={data.personalInfo.portfolioWebsite}
              target="_blank"
              className="text-indigo-700"
              rel="noopener noreferrer"
            >
              {!showLinks
                ? "Portfolio"
                : data.personalInfo.portfolioWebsite.replace(
                  /^https?:\/\//,
                  "",
                )}
            </a>
          )}
          {data.personalInfo.linkedInUrl && (
            <>
              <br />
              <a
                href={data.personalInfo.linkedInUrl}
                target="_blank"
                className="text-indigo-700"
                rel="noopener noreferrer"
              >
                {!showLinks
                  ? "LinkedIn"
                  : data.personalInfo.linkedInUrl.replace(/^https?:\/\//, "")}
              </a>
            </>
          )}
        </div>
        <div className="text-right">
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-2">
        <h1
          className="font-bold"
          style={{ fontSize: "14pt", letterSpacing: "1pt" }}
        >
          {data.personalInfo.name?.toUpperCase()}
        </h1>
        <div style={{ fontSize: "10pt" }}>{data.personalInfo.title}</div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-3">
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            SUMMARY
          </h2>
          <p
            style={{
              fontSize: "10pt",
              textAlign: "justify",
              lineHeight: "1.2",
            }}
          >
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      <div className="mb-3">
        <div
          className="space-y-0.5"
          style={{ fontSize: "10pt", lineHeight: "1.2" }}
        >
          {data.skills.languages?.length > 0 && (
            <div>
              <span className="font-bold">Programming Languages: </span>
              {data.skills.languages.join(", ")}
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <span className="font-bold">Frameworks & Libraries: </span>
              {data.skills.frameworks.join(", ")}
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <span className="font-bold">Databases: </span>
              {data.skills.databases.join(", ")}
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div>
              <span className="font-bold">Cloud & DevOps Tools: </span>
              {data.skills.tools.join(", ")}
            </div>
          )}
          {data.skills.architectures?.length > 0 && (
            <div>
              <span className="font-bold">Architectures: </span>
              {data.skills.architectures.join(", ")}
            </div>
          )}
          {data.skills.methodologies?.length > 0 && (
            <div>
              <span className="font-bold">Practices: </span>
              {data.skills.methodologies.join(", ")}
            </div>
          )}
          {data.skills.other?.length > 0 && (
            <div>
              <span className="font-bold">Other Skills: </span>
              {data.skills.other.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-2">
        <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
          EMPLOYMENT
        </h2>
        {data.experience.map((exp, index) =>
          exp.positions.map((position, posIndex) => (
            <div key={`${index}-${posIndex}`} className="mb-2">
              <div className="flex justify-between items-baseline mb-0.5">
                <div style={{ fontSize: "10pt" }}>
                  <span className="font-bold">{position.title}</span> |{" "}
                  {exp.company}
                </div>
                <div style={{ fontSize: "10pt" }}>{position.duration}</div>
              </div>
              <ul
                className="ml-0 mb-1"
                style={{ fontSize: "10pt", lineHeight: "1.2" }}
              >
                {position.achievements.map((achievement, achIndex) => (
                  <li
                    key={achIndex}
                    className="mb-0.5"
                    style={{ textAlign: "justify" }}
                  >
                    - {achievement}
                  </li>
                ))}
              </ul>
              {position.techStack?.length > 0 && (
                <div style={{ fontSize: "10pt" }} className="mb-1">
                  <span className="italic">Tech Stack: </span>
                  {position.techStack.join(", ")}
                </div>
              )}
            </div>
          )),
        )}
      </div>

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div className="mb-2">
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div
              key={index}
              className="mb-1"
              style={{ fontSize: "10pt", lineHeight: "1.2" }}
            >
              <div>
                {project.link ? (
                  <a href={project.link} target="_blank" className="text-indigo-700">
                    <span className="font-bold">- {project.name}</span>
                  </a>
                ) : (
                  <span className="font-bold">- {project.name}</span>
                )}
                : {project.description}
              </div>
              {project.technologies?.length > 0 && (
                <div className="italic">
                  Tech Stack: {project.technologies.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {showEducation && (
        <div className="mb-3">
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} style={{ fontSize: "10pt", lineHeight: "1.2" }}>
              <div>{edu.institution}</div>
              <div>
                - {edu.degree} ({edu.year})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements?.length > 0 && (
        <div className="mb-2">
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            ADDITIONAL EXPERIENCE & AWARDS
          </h2>
          <ul style={{ fontSize: "10pt", lineHeight: "1.2" }}>
            {data.achievements.map((achievement, index) => (
              <li key={index} className="mb-0.5">
                - {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interests */}
      {data.interests?.length > 0 && (
        <div>
          <h2 className="font-bold mb-1" style={{ fontSize: "11pt" }}>
            INTERESTS
          </h2>
          <p style={{ fontSize: "10pt" }}>{data.interests.join(", ")}</p>
        </div>
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
              <Button onClick={() => generateWordDocument(resumeData)} >
                <Download className="h-4 w-4 mr-2" />
                Download DOCX
              </Button>
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
        </div>
      </div>
      <div className="p-4 overflow-scroll">
        <ResumePreview data={resumeData} />
      </div>
    </div>
  );
};

export default ResumePreviewPage;
