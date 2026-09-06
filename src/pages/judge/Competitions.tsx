
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import type { User } from "../../types/user";
import * as XLSX from "xlsx";
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

    const [user, setUser] =
        useState<User | null>(null);

    const [competitionNumber, setCompetitionNumber] =
        useState("");

    const [competition, setCompetition] =
        useState<Competition | null>(null);

    const [students, setStudents] =
        useState<Student[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");


    // ===============================
    // LOAD USER
    // ===============================

    useState(() => {
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    });


    // ===============================
    // SEARCH COMPETITION
    // ===============================

    const searchCompetition = async () => {

        if (!competitionNumber) {

            setMessage(
                t("enterCompetitionNumber")
            );

            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const response =
                await api.get(
                    `/judge/competitions/${competitionNumber}/students`
                );

            setCompetition(
                response.data.competition
            );

            setStudents(
                response.data.students
            );

        } catch (error: any) {

            setCompetition(null);
            setStudents([]);

            setMessage(
                error.response?.data?.message ||
                t("failedToLoadCompetition")
            );

        } finally {

            setLoading(false);
        }
    };


    // ===============================
    // UPDATE MARKS
    // ===============================

    const updateMarks = (
        index: number,
        value: string
    ) => {

        const updated =
            [...students];

        updated[index] = {

            ...updated[index],

            marks:
                value === ""
                    ? null
                    : Number(value)
        };

        setStudents(updated);
    };


    // ===============================
    // SUBMIT RESULTS
    // ===============================

    const submitResults = async () => {

        if (!competition) {
            return;
        }

        const missingMarks =
            students.some(
                student =>
                    student.marks === null
            );

        if (missingMarks) {

            setMessage(
                t("enterMarksForAllStudents")
            );

            return;
        }

        const confirmSubmit =
            window.confirm(
                t("confirmSubmitMarks")
            );

        if (!confirmSubmit) {
            return;
        }

        try {

            setLoading(true);

            const results =
                students.map(
                    student => ({
                        studentNumber:
                            student.studentNumber,

                        marks:
                            student.marks
                    })
                );

            await api.post(
                `/judge/competitions/${competition.number}/submit`,
                {
                    results
                }
            );

            setMessage(
                t("resultsSubmittedSuccessfully")
            );

            setStudents(
                students.map(
                    student => ({
                        ...student,
                        submitted: true
                    })
                )
            );

        } catch (error: any) {

            setMessage(
                error.response?.data?.message ||
                t("failedToSubmitResults")
            );

        } finally {

            setLoading(false);
        }
    };


    // ===============================
    // DOWNLOAD STUDENT LIST
    // ===============================

    // const downloadStudentList = () => {

    //     if (!competition || students.length === 0) {
    //         return;
    //     }

    //     const headers = [
    //         t("studentNumber"),
    //         t("studentName"),
    //         t("schoolName"),
    //         t("marks")
    //     ];

    //     const rows = students.map(
    //         student => [
    //             student.studentNumber,
    //             student.studentName,
    //             student.schoolName,
    //             student.marks ?? ""
    //         ]
    //     );

    //     const csvContent = [
    //         headers,
    //         ...rows
    //     ]
    //         .map(row =>
    //             row
    //                 .map(value =>
    //                     `"${String(value).replace(/"/g, '""')}"`
    //                 )
    //                 .join(",")
    //         )
    //         .join("\n");

    //     const blob =
    //         new Blob(
    //             [csvContent],
    //             {
    //                 type: "text/csv;charset=utf-8;"
    //             }
    //         );

    //     const url =
    //         URL.createObjectURL(blob);

    //     const link =
    //         document.createElement("a");

    //     link.href = url;

    //     link.download =
    //         `competition-${competition.number}-students.csv`;

    //     document.body.appendChild(link);

    //     link.click();

    //     document.body.removeChild(link);

    //     URL.revokeObjectURL(url);
    // };






const downloadStudentList = () => {

    if (!competition || students.length === 0) {
        return;
    }

    const data = students.map(
        (student, index) => ({
            No: index + 1,
            "Student Number": student.studentNumber,
            "Student Name": student.studentName,
            "School Name": student.schoolName,
            Marks: student.marks ?? "",
        })
    );


    // Create worksheet
    const worksheet =
        XLSX.utils.json_to_sheet(data);


    // Column widths
    worksheet["!cols"] = [
        { wch: 8 },
        { wch: 18 },
        { wch: 30 },
        { wch: 45 },
        { wch: 12 },
    ];


    // Create workbook
    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Students"
    );


    // Download XLSX
    XLSX.writeFile(
        workbook,
        `competition-${competition.number}-students.xlsx`
    );
};



    // ===============================
    // CHECK SUBMITTED
    // ===============================

    const alreadySubmitted =
        students.length > 0 &&
        students.every(
            student =>
                student.submitted
        );


    // ===============================
    // USER NOT LOADED
    // ===============================

    if (!user) {
        return null;
    }


    // ===============================
    // UI
    // ===============================

    return (

        <>
            <Navbar user={user} />

            <div
                style={{
                    padding: "30px"
                }}
            >

                <h1>
                    {t("competitions")}
                </h1>


                {/* SEARCH */}

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="number"
                        placeholder={t(
                            "competitionNumber"
                        )}
                        value={
                            competitionNumber
                        }
                        onChange={(e) =>
                            setCompetitionNumber(
                                e.target.value
                            )
                        }
                    />

                    <button
                        onClick={
                            searchCompetition
                        }
                        disabled={loading}
                    >
                        {loading
                            ? t("searching")
                            : t("search")}
                    </button>

                </div>


                {/* MESSAGE */}

                {message && (
                    <p>
                        {message}
                    </p>
                )}


                {/* COMPETITION */}

                {competition && (
                    <>

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                gap: "15px",
                                flexWrap: "wrap",
                                marginBottom: "15px"
                            }}
                        >

                            <div>

                                <h2>
                                    {
                                        competition.number
                                    }
                                    {" - "}
                                    {
                                        competition.name
                                    }
                                </h2>

                                <p>
                                    {
                                        t("maximumMarks")
                                    }
                                    {": "}
                                    {
                                        competition.maxMarks
                                    }
                                </p>

                            </div>


                            {/* DOWNLOAD BUTTON */}

                            {students.length > 0 && (
                                <button
                                    onClick={
                                        downloadStudentList
                                    }
                                    style={{
                                        padding:
                                            "10px 16px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    📥{" "}
                                    {t(
                                        "downloadStudentList"
                                    )}
                                </button>
                            )}

                        </div>


                        {/* STUDENT TABLE */}

                        <table
                            border={1}
                            cellPadding={10}
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th>
                                        {t(
                                            "studentNumber"
                                        )}
                                    </th>

                                    <th>
                                        {t(
                                            "studentName"
                                        )}
                                    </th>

                                    <th>
                                        {t(
                                            "schoolName"
                                        )}
                                    </th>

                                    <th>
                                        {t("marks")}
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {students.map(
                                    (
                                        student,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                student.registrationId
                                            }
                                        >

                                            <td>
                                                {
                                                    student.studentNumber
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.studentName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.schoolName
                                                }
                                            </td>

                                            <td>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={
                                                        competition.maxMarks
                                                    }
                                                    value={
                                                        student.marks ??
                                                        ""
                                                    }
                                                    disabled={
                                                        alreadySubmitted
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMarks(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>


                        {/* SUBMIT */}

                        {!alreadySubmitted && (
                            <button
                                onClick={
                                    submitResults
                                }
                                disabled={
                                    loading
                                }
                                style={{
                                    marginTop:
                                        "20px",
                                    padding:
                                        "10px 18px"
                                }}
                            >
                                {loading
                                    ? t("submitting")
                                    : t(
                                        "submitResults"
                                    )}
                            </button>
                        )}


                        {/* ALREADY SUBMITTED */}

                        {alreadySubmitted && (
                            <h3>
                                {t(
                                    "resultsAlreadySubmitted"
                                )}
                            </h3>
                        )}

                    </>
                )}

            </div>
        </>
    );
};

export default Competitions;




