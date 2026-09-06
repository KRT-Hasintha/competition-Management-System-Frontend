

import { useEffect, useState } from "react";
import api from "../../services/api";

// ==============================
// COMPETITION TYPE
// ==============================

interface Competition {
    _id: string;
    competitionNumber: number;
    name: string;
    maxMarks: number;
    status: string;

    totalStudents?: number;
    submittedResults?: number;
    publishedResults?: number;
}

// ==============================
// RESULT TYPE
// ==============================

interface CompetitionResult {
    _id: string;

    studentId: string;

    studentNumber: string;

    studentName: string;

    schoolNumber: number;

    schoolName: string;

    grade: string;

    marks: number;

    submitted: boolean;

    published: boolean;
}

// ==============================
// EVENTS COMPONENT
// ==============================

const Events = () => {

    // ==============================
    // EVENTS
    // ==============================

    const [competitions, setCompetitions] =
        useState<Competition[]>([]);

    const [loading, setLoading] =
        useState(true);


    // ==============================
    // SELECTED COMPETITION
    // ==============================

    const [selectedCompetition, setSelectedCompetition] =
        useState<number | null>(null);


    // ==============================
    // RESULTS
    // ==============================

    const [results, setResults] =
        useState<CompetitionResult[]>([]);

    const [resultsLoading, setResultsLoading] =
        useState(false);


    // ==============================
    // PUBLISHED
    // ==============================

    const [published, setPublished] =
        useState(false);


    // ==============================
    // PUBLISHING
    // ==============================

    const [publishing, setPublishing] =
        useState(false);


    // ==============================
    // MESSAGE
    // ==============================

    const [message, setMessage] =
        useState("");


    // ==============================
    // LOAD EVENTS
    // ==============================

    const loadEvents = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/admin/events");

            /*
             * Backend එකේ response එක
             *
             * { events: [...] }
             *
             * හෝ
             *
             * { competitions: [...] }
             *
             * දෙකෙන් එකක් වුණත් work වෙනවා.
             */

            const data =
                response.data.events ??
                response.data.competitions ??
                [];

            setCompetitions(data);

        } catch (error) {

            console.error(
                "Failed to load events:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    // ==============================
    // INITIAL LOAD
    // ==============================

    useEffect(() => {

        loadEvents();

    }, []);


    // ==============================
    // OPEN COMPETITION RESULTS
    // ==============================

    const openResults = async (
        competitionNumber: number
    ) => {

        try {

            setResultsLoading(true);

            setMessage("");

            setSelectedCompetition(
                competitionNumber
            );

            const response =
                await api.get(
                    `/admin/events/${competitionNumber}/results`
                );


            // ==============================
            // RESULTS
            // ==============================

            setResults(
                response.data.results ?? []
            );


            // ==============================
            // PUBLISHED STATUS
            // ==============================

            setPublished(
                response.data.published ?? false
            );

        } catch (error) {

            console.error(
                "Failed to load results:",
                error
            );

            setResults([]);

            setMessage(
                "Failed to load competition results."
            );

        } finally {

            setResultsLoading(false);

        }
    };


    // ==============================
    // BACK TO EVENTS
    // ==============================

    const backToEvents = () => {

        setSelectedCompetition(null);

        setResults([]);

        setPublished(false);

        setMessage("");

    };


    // ==============================
    // PUBLISH RESULTS
    // ==============================

    const publishResults = async () => {

        if (
            selectedCompetition === null
        ) {
            return;
        }


        try {

            setPublishing(true);

            setMessage("");


            const response =
                await api.patch(
                    `/admin/events/${selectedCompetition}/publish`
                );


            setMessage(
                response.data.message ??
                "Results published successfully."
            );


            // ==============================
            // RELOAD RESULTS
            // ==============================

            const resultResponse =
                await api.get(
                    `/admin/events/${selectedCompetition}/results`
                );


            setResults(
                resultResponse.data.results ?? []
            );


            setPublished(
                resultResponse.data.published ?? false
            );


            // ==============================
            // RELOAD EVENTS
            // ==============================

            await loadEvents();

        } catch (error: any) {

            console.error(
                "Failed to publish results:",
                error
            );


            setMessage(
                error?.response?.data?.message ??
                "Failed to publish results."
            );

        } finally {

            setPublishing(false);

        }
    };


    // ==============================
    // TOTAL MARKS
    // ==============================

    const totalMarks =
        results.reduce(
            (total, result) =>
                total + Number(result.marks || 0),
            0
        );


    // ==============================
    // LOADING EVENTS
    // ==============================

    if (loading) {

        return (
            <div
                style={{
                    padding: "30px"
                }}
            >
                <h2>
                    Loading events...
                </h2>
            </div>
        );

    }


    // =========================================================
    // RESULT VIEW
    // =========================================================

    if (
        selectedCompetition !== null
    ) {

        const selectedEvent =
            competitions.find(
                competition =>
                    competition.competitionNumber ===
                    selectedCompetition
            );


        return (

            <div
                style={{
                    padding: "30px",
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}
            >

                {/* =========================================
                    HEADER
                ========================================= */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px",
                        gap: "15px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h1
                            style={{
                                marginBottom: "8px"
                            }}
                        >
                            Competition Results
                        </h1>

                        {selectedEvent && (

                            <>

                                <p
                                    style={{
                                        margin: "4px 0"
                                    }}
                                >
                                    <strong>
                                        Competition:
                                    </strong>{" "}
                                    {
                                        selectedEvent.competitionNumber
                                    }
                                </p>

                                <p
                                    style={{
                                        margin: "4px 0"
                                    }}
                                >
                                    <strong>
                                        Name:
                                    </strong>{" "}
                                    {
                                        selectedEvent.name
                                    }
                                </p>

                                <p
                                    style={{
                                        margin: "4px 0"
                                    }}
                                >
                                    <strong>
                                        Maximum Marks:
                                    </strong>{" "}
                                    {
                                        selectedEvent.maxMarks
                                    }
                                </p>

                            </>

                        )}

                    </div>


                    {/* BACK BUTTON */}

                    <button
                        onClick={backToEvents}
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: "#555",
                            color: "white",
                            fontWeight: "600"
                        }}
                    >
                        ← Back to Events
                    </button>

                </div>


                {/* =========================================
                    MESSAGE
                ========================================= */}

                {message && (

                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "12px 15px",
                            borderRadius: "8px",
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            border: "1px solid #a5d6a7"
                        }}
                    >
                        {message}
                    </div>

                )}


                {/* =========================================
                    LOADING RESULTS
                ========================================= */}

                {resultsLoading ? (

                    <div>

                        <h3>
                            Loading results...
                        </h3>

                    </div>

                ) : results.length === 0 ? (

                    /* =====================================
                       NO RESULTS
                    ===================================== */

                    <div
                        style={{
                            padding: "30px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            textAlign: "center"
                        }}
                    >

                        <h2>
                            No Results Submitted
                        </h2>

                        <p>
                            Judge has not submitted
                            results for this competition yet.
                        </p>

                    </div>

                ) : (

                    /* =====================================
                       RESULTS
                    ===================================== */

                    <>

                        {/* =================================
                            STATUS + TOTAL
                        ================================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                                padding: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                flexWrap: "wrap",
                                gap: "15px"
                            }}
                        >

                            <div>

                                <strong>
                                    Result Status:
                                </strong>{" "}

                                <span
                                    style={{
                                        fontWeight: "bold",
                                        color: published
                                            ? "green"
                                            : "orange"
                                    }}
                                >
                                    {
                                        published
                                            ? "PUBLISHED"
                                            : "READY TO PUBLISH"
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Students:
                                </strong>{" "}

                                {results.length}

                            </div>


                            <div>

                                <strong>
                                    Total Marks:
                                </strong>{" "}

                                {totalMarks}

                            </div>

                        </div>


                        {/* =================================
                            RESULT TABLE
                        ================================= */}

                        <div
                            style={{
                                overflowX: "auto"
                            }}
                        >

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    minWidth: "900px"
                                }}
                            >

                                <thead>

                                    <tr
                                        style={{
                                            backgroundColor:
                                                "#f3f3f3"
                                        }}
                                    >

                                        <th
                                            style={thStyle}
                                        >
                                            #
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            Student ID
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            Student Name
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            School No
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            School Name
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            Grade
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            Marks
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {results.map(
                                        (
                                            result,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    result._id ??
                                                    result.studentId
                                                }
                                            >

                                                {/* NUMBER */}

                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        index + 1
                                                    }
                                                </td>


                                                {/* STUDENT ID */}

                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        result.studentNumber
                                                    }
                                                </td>


                                                {/* STUDENT NAME */}

                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        result.studentName
                                                    }
                                                </td>


                                                {/* SCHOOL NUMBER */}

                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        result.schoolNumber
                                                    }
                                                </td>


                                                {/* SCHOOL NAME */}

                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        result.schoolName
                                                    }
                                                </td>


                                                {/* GRADE */}

                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        result.grade
                                                    }
                                                </td>


                                                {/* MARKS */}

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight:
                                                            "bold"
                                                    }}
                                                >
                                                    {
                                                        result.marks
                                                    }
                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    style={tdStyle}
                                                >

                                                    {result.published ? (

                                                        <span
                                                            style={{
                                                                color:
                                                                    "green",
                                                                fontWeight:
                                                                    "bold"
                                                            }}
                                                        >
                                                            Published
                                                        </span>

                                                    ) : (

                                                        <span
                                                            style={{
                                                                color:
                                                                    "orange",
                                                                fontWeight:
                                                                    "bold"
                                                            }}
                                                        >
                                                            Submitted
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>


                                {/* =================================
                                    TOTAL
                                ================================= */}

                                <tfoot>

                                    <tr
                                        style={{
                                            backgroundColor:
                                                "#f8f8f8"
                                        }}
                                    >

                                        <td
                                            colSpan={6}
                                            style={{
                                                ...tdStyle,
                                                textAlign: "right",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Total Marks
                                        </td>

                                        <td
                                            style={{
                                                ...tdStyle,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {totalMarks}
                                        </td>

                                        <td
                                            style={tdStyle}
                                        />

                                    </tr>

                                </tfoot>

                            </table>

                        </div>


                        {/* =================================
                            PUBLISH BUTTON
                        ================================= */}

                        <div
                            style={{
                                marginTop: "25px",
                                display: "flex",
                                justifyContent: "flex-end"
                            }}
                        >

                            <button
                                onClick={
                                    publishResults
                                }
                                disabled={
                                    published ||
                                    publishing
                                }
                                style={{
                                    padding:
                                        "12px 25px",
                                    border: "none",
                                    borderRadius:
                                        "8px",
                                    cursor:
                                        published ||
                                        publishing
                                            ? "not-allowed"
                                            : "pointer",
                                    backgroundColor:
                                        published
                                            ? "#9e9e9e"
                                            : "#1976d2",
                                    color: "white",
                                    fontWeight:
                                        "bold",
                                    fontSize:
                                        "15px",
                                    opacity:
                                        publishing
                                            ? 0.7
                                            : 1
                                }}
                            >

                                {publishing
                                    ? "Publishing..."
                                    : published
                                    ? "✓ Results Published"
                                    : "Publish Results"}

                            </button>

                        </div>

                    </>

                )}

            </div>

        );

    }


    // =========================================================
    // EVENTS LIST VIEW
    // =========================================================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "0 auto"
            }}
        >

            {/* =============================================
                HEADER
            ============================================= */}

            <div
                style={{
                    marginBottom: "30px"
                }}
            >

                <h1>
                    Events
                </h1>

                <p>
                    Select a competition to view
                    judge submitted results.
                </p>

            </div>


            {/* =============================================
                NO COMPETITIONS
            ============================================= */}

            {competitions.length === 0 ? (

                <div
                    style={{
                        padding: "30px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        textAlign: "center"
                    }}
                >

                    <h2>
                        No competitions found.
                    </h2>

                </div>

            ) : (

                /* =========================================
                   COMPETITION CARDS
                ========================================= */

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(230px, 1fr))",
                        gap: "20px"
                    }}
                >

                    {competitions.map(
                        competition => (

                            <div
                                key={
                                    competition._id
                                }
                                onClick={() =>
                                    openResults(
                                        competition.competitionNumber
                                    )
                                }
                                style={{
                                    border:
                                        "1px solid #ddd",
                                    padding:
                                        "25px",
                                    cursor:
                                        "pointer",
                                    borderRadius:
                                        "12px",
                                    backgroundColor:
                                        "white",
                                    boxShadow:
                                        "0 2px 8px rgba(0,0,0,0.08)",
                                    transition:
                                        "0.2s"
                                }}
                            >

                                {/* =================================
                                    COMPETITION NUMBER
                                ================================= */}

                                <h2
                                    style={{
                                        marginTop: 0
                                    }}
                                >
                                    Competition{" "}
                                    {
                                        competition.competitionNumber
                                    }
                                </h2>


                                {/* NAME */}

                                <p>
                                    <strong>
                                        Name:
                                    </strong>{" "}
                                    {
                                        competition.name
                                    }
                                </p>


                                {/* MAX MARKS */}

                                <p>
                                    <strong>
                                        Max Marks:
                                    </strong>{" "}
                                    {
                                        competition.maxMarks
                                    }
                                </p>


                                {/* STATUS */}

                                <p>

                                    <strong>
                                        Status:
                                    </strong>{" "}

                                    <span
                                        style={{
                                            fontWeight:
                                                "bold",
                                            color:
                                                getStatusColor(
                                                    competition.status
                                                )
                                        }}
                                    >
                                        {
                                            competition.status
                                        }
                                    </span>

                                </p>


                                {/* COUNTS */}

                                {competition.totalStudents !==
                                    undefined && (

                                    <p>

                                        <strong>
                                            Students:
                                        </strong>{" "}

                                        {
                                            competition.totalStudents
                                        }

                                    </p>

                                )}


                                {/* VIEW */}

                                <div
                                    style={{
                                        marginTop:
                                            "20px"
                                    }}
                                >

                                    <button
                                        onClick={(
                                            event
                                        ) => {

                                            event.stopPropagation();

                                            openResults(
                                                competition.competitionNumber
                                            );

                                        }}
                                        style={{
                                            width:
                                                "100%",
                                            padding:
                                                "10px",
                                            border:
                                                "none",
                                            borderRadius:
                                                "7px",
                                            backgroundColor:
                                                "#1976d2",
                                            color:
                                                "white",
                                            cursor:
                                                "pointer",
                                            fontWeight:
                                                "bold"
                                        }}
                                    >
                                        View Results
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

};


// =========================================================
// TABLE STYLES
// =========================================================

const thStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left"
};


const tdStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "12px"
};


// =========================================================
// STATUS COLOR
// =========================================================

const getStatusColor = (
    status: string
) => {

    switch (
        status?.toUpperCase()
    ) {

        case "PUBLISHED":
            return "green";

        case "READY_TO_PUBLISH":
            return "orange";

        case "WAITING_FOR_JUDGE":
            return "red";

        default:
            return "#555";

    }

};


export default Events;