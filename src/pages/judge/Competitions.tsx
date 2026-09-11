// import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, HeadingLevel } from "docx";
// import { saveAs } from "file-saver";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import Navbar from "../../components/Navbar";
// import api from "../../services/api";
// import type { User } from "../../types/user";
// import * as XLSX from "xlsx";
// interface Student {
//     registrationId: string;
//     studentNumber: string;
//     studentName: string;
//     schoolName: string;
//     marks: number | null;
//     submitted: boolean;
// }

// interface Competition {
//     number: number;
//     name: string;
//     maxMarks: number;
// }

// const Competitions = () => {

//     const { t } = useTranslation();

//     const [user, setUser] =
//         useState<User | null>(null);

//     const [competitionNumber, setCompetitionNumber] =
//         useState("");

//     const [competition, setCompetition] =
//         useState<Competition | null>(null);

//     const [students, setStudents] =
//         useState<Student[]>([]);

//     const [loading, setLoading] =
//         useState(false);

//     const [message, setMessage] =
//         useState("");


//     // ===============================
//     // LOAD USER
//     // ===============================

//     useState(() => {
//         const storedUser =
//             localStorage.getItem("user");

//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//     });


//     // ===============================
//     // SEARCH COMPETITION
//     // ===============================

//     const searchCompetition = async () => {

//         if (!competitionNumber) {

//             setMessage(
//                 t("enterCompetitionNumber")
//             );

//             return;
//         }

//         try {

//             setLoading(true);
//             setMessage("");

//             const response =
//                 await api.get(
//                     `/judge/competitions/${competitionNumber}/students`
//                 );

//             setCompetition(
//                 response.data.competition
//             );

//             setStudents(
//                 response.data.students
//             );

//         } catch (error: any) {

//             setCompetition(null);
//             setStudents([]);

//             setMessage(
//                 error.response?.data?.message ||
//                 t("failedToLoadCompetition")
//             );

//         } finally {

//             setLoading(false);
//         }
//     };


//     // ===============================
//     // UPDATE MARKS
//     // ===============================

//     const updateMarks = (
//         index: number,
//         value: string
//     ) => {

//         const updated =
//             [...students];

//         updated[index] = {

//             ...updated[index],

//             marks:
//                 value === ""
//                     ? null
//                     : Number(value)
//         };

//         setStudents(updated);
//     };


//     // ===============================
//     // SUBMIT RESULTS
//     // ===============================

//     const submitResults = async () => {

//         if (!competition) {
//             return;
//         }

//         const missingMarks =
//             students.some(
//                 student =>
//                     student.marks === null
//             );

//         if (missingMarks) {

//             setMessage(
//                 t("enterMarksForAllStudents")
//             );

//             return;
//         }

//         const confirmSubmit =
//             window.confirm(
//                 t("confirmSubmitMarks")
//             );

//         if (!confirmSubmit) {
//             return;
//         }

//         try {

//             setLoading(true);

//             const results =
//                 students.map(
//                     student => ({
//                         studentNumber:
//                             student.studentNumber,

//                         marks:
//                             student.marks
//                     })
//                 );

//             await api.post(
//                 `/judge/competitions/${competition.number}/submit`,
//                 {
//                     results
//                 }
//             );

//             setMessage(
//                 t("resultsSubmittedSuccessfully")
//             );

//             setStudents(
//                 students.map(
//                     student => ({
//                         ...student,
//                         submitted: true
//                     })
//                 )
//             );

//         } catch (error: any) {

//             setMessage(
//                 error.response?.data?.message ||
//                 t("failedToSubmitResults")
//             );

//         } finally {

//             setLoading(false);
//         }
//     };


//     // ===============================
//     // DOWNLOAD STUDENT LIST
//     // ===============================

//     // const downloadStudentList = () => {

//     //     if (!competition || students.length === 0) {
//     //         return;
//     //     }

//     //     const headers = [
//     //         t("studentNumber"),
//     //         t("studentName"),
//     //         t("schoolName"),
//     //         t("marks")
//     //     ];

//     //     const rows = students.map(
//     //         student => [
//     //             student.studentNumber,
//     //             student.studentName,
//     //             student.schoolName,
//     //             student.marks ?? ""
//     //         ]
//     //     );

//     //     const csvContent = [
//     //         headers,
//     //         ...rows
//     //     ]
//     //         .map(row =>
//     //             row
//     //                 .map(value =>
//     //                     `"${String(value).replace(/"/g, '""')}"`
//     //                 )
//     //                 .join(",")
//     //         )
//     //         .join("\n");

//     //     const blob =
//     //         new Blob(
//     //             [csvContent],
//     //             {
//     //                 type: "text/csv;charset=utf-8;"
//     //             }
//     //         );

//     //     const url =
//     //         URL.createObjectURL(blob);

//     //     const link =
//     //         document.createElement("a");

//     //     link.href = url;

//     //     link.download =
//     //         `competition-${competition.number}-students.csv`;

//     //     document.body.appendChild(link);

//     //     link.click();

//     //     document.body.removeChild(link);

//     //     URL.revokeObjectURL(url);
//     // };






// // const downloadStudentList = () => {

// //     if (!competition || students.length === 0) {
// //         return;
// //     }

// //     const data = students.map(
// //         (student, index) => ({
// //             No: index + 1,
// //             "Student Number": student.studentNumber,
// //             "Student Name": student.studentName,
// //             "School Name": student.schoolName,
// //             Marks: student.marks ?? "",
// //         })
// //     );

// const downloadStudentList = async () => {
//     if (!competition || students.length === 0) {
//         return;
//     }

//     // Document එක Create කිරීම
//     const doc = new Document({
//         sections: [
//             {
//                 properties: {},
//                 children: [
//                     // Title Header Section
//                     new Paragraph({
//                         text: `${competition.number} - ${competition.name}`,
//                         heading: HeadingLevel.HEADING_1,
//                         alignment: AlignmentType.CENTER,
//                         spacing: { after: 200 }
//                     }),
//                     new Paragraph({
//                         children: [
//                             new TextRun({ text: `${t("maximumMarks")}: `, bold: true }),
//                             new TextRun(`${competition.maxMarks}`),
//                         ],
//                         alignment: AlignmentType.CENTER,
//                         spacing: { after: 400 }
//                     }),

//                     // Students Table
//                     new Table({
//                         width: {
//                             size: 100,
//                             type: WidthType.PERCENTAGE,
//                         },
//                         rows: [
//                             // Table Header Row
//                             new TableRow({
//                                 children: [
//                                     new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No", bold: true })] })] }),
//                                     new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t("studentNumber"), bold: true })] })] }),
//                                     new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t("studentName"), bold: true })] })] }),
//                                     new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t("schoolName"), bold: true })] })] }),
//                                     new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t("marks"), bold: true })] })] }),
//                                 ],
//                             }),
//                             // Table Data Rows
//                             ...students.map((student, index) =>
//                                 new TableRow({
//                                     children: [
//                                         new TableCell({ children: [new Paragraph(`${index + 1}`)] }),
//                                         new TableCell({ children: [new Paragraph(student.studentNumber || "")] }),
//                                         new TableCell({ children: [new Paragraph(student.studentName || "")] }),
//                                         new TableCell({ children: [new Paragraph(student.schoolName || "")] }),
//                                         new TableCell({ children: [new Paragraph(student.marks !== null ? String(student.marks) : "-")] }),
//                                     ],
//                                 })
//                             ),
//                         ],
//                     }),
//                 ],
//             },
//         ],
//     });

//     // Word File එක Generate කර Download කිරීම
//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, `competition-${competition.number}-students.docx`);
// };


//     // Create worksheet
//     const worksheet =
//         XLSX.utils.json_to_sheet(data);


//     // Column widths
//     worksheet["!cols"] = [
//         { wch: 8 },
//         { wch: 18 },
//         { wch: 30 },
//         { wch: 45 },
//         { wch: 12 },
//     ];


//     // Create workbook
//     const workbook =
//         XLSX.utils.book_new();


//     XLSX.utils.book_append_sheet(
//         workbook,
//         worksheet,
//         "Students"
//     );


//     // Download XLSX
//     XLSX.writeFile(
//         workbook,
//         `competition-${competition.number}-students.xlsx`
//     );
// };



//     // ===============================
//     // CHECK SUBMITTED
//     // ===============================

//     const alreadySubmitted =
//         students.length > 0 &&
//         students.every(
//             student =>
//                 student.submitted
//         );


//     // ===============================
//     // USER NOT LOADED
//     // ===============================

//     if (!user) {
//         return null;
//     }


//     // ===============================
//     // UI
//     // ===============================

//     return (

//         <>
//             <Navbar user={user} />

//             <div
//                 style={{
//                     padding: "30px"
//                 }}
//             >

//                 <h1>
//                     {t("competitions")}
//                 </h1>


//                 {/* SEARCH */}

//                 <div
//                     style={{
//                         display: "flex",
//                         gap: "10px",
//                         marginBottom: "20px",
//                         flexWrap: "wrap"
//                     }}
//                 >

//                     <input
//                         type="number"
//                         placeholder={t(
//                             "competitionNumber"
//                         )}
//                         value={
//                             competitionNumber
//                         }
//                         onChange={(e) =>
//                             setCompetitionNumber(
//                                 e.target.value
//                             )
//                         }
//                     />

//                     <button
//                         onClick={
//                             searchCompetition
//                         }
//                         disabled={loading}
//                     >
//                         {loading
//                             ? t("searching")
//                             : t("search")}
//                     </button>

//                 </div>


//                 {/* MESSAGE */}

//                 {message && (
//                     <p>
//                         {message}
//                     </p>
//                 )}


//                 {/* COMPETITION */}

//                 {competition && (
//                     <>

//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent:
//                                     "space-between",
//                                 alignItems:
//                                     "center",
//                                 gap: "15px",
//                                 flexWrap: "wrap",
//                                 marginBottom: "15px"
//                             }}
//                         >

//                             <div>

//                                 <h2>
//                                     {
//                                         competition.number
//                                     }
//                                     {" - "}
//                                     {
//                                         competition.name
//                                     }
//                                 </h2>

//                                 <p>
//                                     {
//                                         t("maximumMarks")
//                                     }
//                                     {": "}
//                                     {
//                                         competition.maxMarks
//                                     }
//                                 </p>

//                             </div>


//                             {/* DOWNLOAD BUTTON */}

//                             {students.length > 0 && (
//                                 <button
//                                     onClick={
//                                         downloadStudentList
//                                     }
//                                     style={{
//                                         padding:
//                                             "10px 16px",
//                                         cursor:
//                                             "pointer"
//                                     }}
//                                 >
//                                     📥{" "}
//                                     {t(
//                                         "downloadStudentList"
//                                     )}
//                                 </button>
//                             )}

//                         </div>


//                         {/* STUDENT TABLE */}

//                         <table
//                             border={1}
//                             cellPadding={10}
//                             style={{
//                                 width: "100%",
//                                 borderCollapse:
//                                     "collapse"
//                             }}
//                         >

//                             <thead>

//                                 <tr>

//                                     <th>
//                                         {t(
//                                             "studentNumber"
//                                         )}
//                                     </th>

//                                     <th>
//                                         {t(
//                                             "studentName"
//                                         )}
//                                     </th>

//                                     <th>
//                                         {t(
//                                             "schoolName"
//                                         )}
//                                     </th>

//                                     <th>
//                                         {t("marks")}
//                                     </th>

//                                 </tr>

//                             </thead>


//                             <tbody>

//                                 {students.map(
//                                     (
//                                         student,
//                                         index
//                                     ) => (

//                                         <tr
//                                             key={
//                                                 student.registrationId
//                                             }
//                                         >

//                                             <td>
//                                                 {
//                                                     student.studentNumber
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     student.studentName
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     student.schoolName
//                                                 }
//                                             </td>

//                                             <td>

//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     max={
//                                                         competition.maxMarks
//                                                     }
//                                                     value={
//                                                         student.marks ??
//                                                         ""
//                                                     }
//                                                     disabled={
//                                                         alreadySubmitted
//                                                     }
//                                                     onChange={(
//                                                         e
//                                                     ) =>
//                                                         updateMarks(
//                                                             index,
//                                                             e.target.value
//                                                         )
//                                                     }
//                                                 />

//                                             </td>

//                                         </tr>

//                                     )
//                                 )}

//                             </tbody>

//                         </table>


//                         {/* SUBMIT */}

//                         {!alreadySubmitted && (
//                             <button
//                                 onClick={
//                                     submitResults
//                                 }
//                                 disabled={
//                                     loading
//                                 }
//                                 style={{
//                                     marginTop:
//                                         "20px",
//                                     padding:
//                                         "10px 18px"
//                                 }}
//                             >
//                                 {loading
//                                     ? t("submitting")
//                                     : t(
//                                         "submitResults"
//                                     )}
//                             </button>
//                         )}


//                         {/* ALREADY SUBMITTED */}

//                         {alreadySubmitted && (
//                             <h3>
//                                 {t(
//                                     "resultsAlreadySubmitted"
//                                 )}
//                             </h3>
//                         )}

//                     </>
//                 )}

//             </div>
//         </>
//     );
// };

// export default Competitions;




import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import type { User } from "../../types/user";

interface Student {
  registrationId: string;
  studentNumber: string;
  studentName: string;
  schoolName: string;
  marks: number | null;
  submitted: boolean;
}

interface Competition {
  number: number;
  name: string;
  maxMarks: number;
}

const Competitions = () => {
  const { t } = useTranslation();

  // Load user directly in state initializer
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [competitionNumber, setCompetitionNumber] = useState("");
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===============================
  // SEARCH COMPETITION
  // ===============================
  const searchCompetition = async () => {
    if (!competitionNumber) {
      setMessage(t("enterCompetitionNumber"));
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(
        `/judge/competitions/${competitionNumber}/students`
      );

      setCompetition(response.data.competition);
      setStudents(response.data.students);
    } catch (error: any) {
      setCompetition(null);
      setStudents([]);
      setMessage(
        error.response?.data?.message || t("failedToLoadCompetition")
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UPDATE MARKS
  // ===============================
  const updateMarks = (index: number, value: string) => {
    const updated = [...students];
    updated[index] = {
      ...updated[index],
      marks: value === "" ? null : Number(value),
    };
    setStudents(updated);
  };

  // ===============================
  // SUBMIT RESULTS
  // ===============================
  const submitResults = async () => {
    if (!competition) return;

    const missingMarks = students.some((student) => student.marks === null);
    if (missingMarks) {
      setMessage(t("enterMarksForAllStudents"));
      return;
    }

    const confirmSubmit = window.confirm(t("confirmSubmitMarks"));
    if (!confirmSubmit) return;

    try {
      setLoading(true);

      const results = students.map((student) => ({
        studentNumber: student.studentNumber,
        marks: student.marks,
      }));

      await api.post(`/judge/competitions/${competition.number}/submit`, {
        results,
      });

      setMessage(t("resultsSubmittedSuccessfully"));
      setStudents(
        students.map((student) => ({
          ...student,
          submitted: true,
        }))
      );
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || t("failedToSubmitResults")
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DOWNLOAD DOCX
  // ===============================
  const downloadDocx = async () => {
    if (!competition || students.length === 0) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `${competition.number} - ${competition.name}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${t("maximumMarks")}: `, bold: true }),
                new TextRun(`${competition.maxMarks}`),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "No", bold: true })],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: t("studentNumber"),
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: t("studentName"),
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: t("schoolName"),
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: t("marks"), bold: true }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                ...students.map(
                  (student, index) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph(`${index + 1}`)],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(student.studentNumber || ""),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(student.studentName || ""),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(student.schoolName || ""),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(
                              student.marks !== null
                                ? String(student.marks)
                                : "-"
                            ),
                          ],
                        }),
                      ],
                    })
                ),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `competition-${competition.number}-students.docx`);
  };

  // ===============================
  // DOWNLOAD EXCEL
  // ===============================
  const downloadExcel = () => {
    if (!competition || students.length === 0) return;

    const data = students.map((student, index) => ({
      No: index + 1,
      "Student Number": student.studentNumber,
      "Student Name": student.studentName,
      "School Name": student.schoolName,
      Marks: student.marks ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 18 },
      { wch: 30 },
      { wch: 45 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(
      workbook,
      `competition-${competition.number}-students.xlsx`
    );
  };

  // ===============================
  // CHECK SUBMITTED
  // ===============================
  const alreadySubmitted =
    students.length > 0 && students.every((student) => student.submitted);

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar user={user} />

      <div style={{ padding: "30px" }}>
        <h1>{t("competitions")}</h1>

        {/* SEARCH */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="number"
            placeholder={t("competitionNumber")}
            value={competitionNumber}
            onChange={(e) => setCompetitionNumber(e.target.value)}
          />

          <button onClick={searchCompetition} disabled={loading}>
            {loading ? t("searching") : t("search")}
          </button>
        </div>

        {/* MESSAGE */}
        {message && <p>{message}</p>}

        {/* COMPETITION */}
        {competition && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <div>
                <h2>
                  {competition.number} - {competition.name}
                </h2>
                <p>
                  {t("maximumMarks")}: {competition.maxMarks}
                </p>
              </div>

              {/* DOWNLOAD BUTTONS */}
              {students.length > 0 && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={downloadDocx}
                    style={{ padding: "10px 16px", cursor: "pointer" }}
                  >
                    📄 {t("downloadWord")}
                  </button>
                  <button
                    onClick={downloadExcel}
                    style={{ padding: "10px 16px", cursor: "pointer" }}
                  >
                    📊 {t("downloadExcel")}
                  </button>
                </div>
              )}
            </div>

            {/* STUDENT TABLE */}
            <table
              border={1}
              cellPadding={10}
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>{t("studentNumber")}</th>
                  <th>{t("studentName")}</th>
                  <th>{t("schoolName")}</th>
                  <th>{t("marks")}</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student.registrationId}>
                    <td>{student.studentNumber}</td>
                    <td>{student.studentName}</td>
                    <td>{student.schoolName}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max={competition.maxMarks}
                        value={student.marks ?? ""}
                        disabled={alreadySubmitted}
                        onChange={(e) => updateMarks(index, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* SUBMIT */}
            {!alreadySubmitted && (
              <button
                onClick={submitResults}
                disabled={loading}
                style={{
                  marginTop: "20px",
                  padding: "10px 18px",
                }}
              >
                {loading ? t("submitting") : t("submitResults")}
              </button>
            )}

            {/* ALREADY SUBMITTED */}
            {alreadySubmitted && (
              <h3>{t("resultsAlreadySubmitted")}</h3>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Competitions;