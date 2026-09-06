



import {
    useEffect,
    useState
} from "react";

import {
    useTranslation
} from "react-i18next";

import Navbar from "../../components/Navbar";
import api from "../../services/api";
import type { User } from "../../types/user";


// =====================================================
// EVENT TYPE
// =====================================================

interface EventData {

    competitionNumber:
        number;

    name:
        string;

    maxMarks:
        number;
}


// =====================================================
// STUDENT TYPE
// =====================================================

interface StudentResult {

    studentId:
        string;

    studentName:
        string;

    grade:
        string;

    events:
        Record<number, number>;

    totalMarks:
        number;
}


// =====================================================
// SCHOOL RANKING TYPE
// =====================================================

interface SchoolRanking {

    schoolNumber:
        number;

    schoolName:
        string;

    events:
        Record<number, number>;

    totalMarks:
        number;

    place:
        number;
}


// =====================================================
// COMPONENT
// =====================================================

const TeacherResults = () => {

    const { t } =
        useTranslation();


    const [user, setUser] =
        useState<User | null>(null);


    const [schoolName, setSchoolName] =
        useState("");


    const [schoolNumber, setSchoolNumber] =
        useState<number | null>(null);


    const [events, setEvents] =
        useState<EventData[]>([]);


    const [students, setStudents] =
        useState<StudentResult[]>([]);


    const [schoolRanking, setSchoolRanking] =
        useState<SchoolRanking[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // =================================================
    // LOAD USER + RESULTS
    // =================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            setUser(
                JSON.parse(storedUser)
            );

        }

        loadResults();

    }, []);


    // =================================================
    // LOAD RESULTS
    // =================================================

    const loadResults = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/teacher/my-school-results"
                );


            console.log(
                "Teacher results:",
                response.data
            );


            // =========================================
            // SCHOOL
            // =========================================

            setSchoolName(
                response.data.school?.schoolName ??
                ""
            );


            setSchoolNumber(
                response.data.school?.schoolNumber ??
                null
            );


            // =========================================
            // EVENTS
            // =========================================

            setEvents(
                response.data.events ??
                []
            );


            // =========================================
            // STUDENTS
            // =========================================

            setStudents(
                response.data.students ??
                []
            );


            // =========================================
            // SCHOOL RANKING
            // =========================================

            setSchoolRanking(
                response.data.schoolRanking ??
                []
            );


        } catch (error: any) {

            console.error(
                "Failed to load results:",
                error
            );


            setError(
                error?.response?.data?.message ??
                t("failedToLoadResults")
            );


        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // USER NOT LOADED
    // =================================================

    if (!user) {

        return null;

    }


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <>
                <Navbar user={user} />

                <div
                    style={{
                        padding: "30px"
                    }}
                >

                    <h2>
                        {t("loadingResults")}
                    </h2>

                </div>
            </>

        );

    }


    // =================================================
    // ERROR
    // =================================================

    if (error) {

        return (

            <>
                <Navbar user={user} />

                <div
                    style={{
                        padding: "30px"
                    }}
                >

                    <div
                        style={{
                            padding: "15px",
                            backgroundColor:
                                "#ffebee",
                            border:
                                "1px solid #ef9a9a",
                            borderRadius:
                                "8px",
                            color:
                                "#c62828"
                        }}
                    >

                        {error}

                    </div>

                </div>
            </>

        );

    }


    // =================================================
    // NO RESULTS
    // =================================================

    if (events.length === 0) {

        return (

            <>
                <Navbar user={user} />

                <div
                    style={{
                        padding: "30px",
                        maxWidth: "1400px",
                        margin: "0 auto"
                    }}
                >

                    <h1>
                        {t("results")}
                    </h1>


                    <div
                        style={{
                            marginTop: "25px",
                            padding: "40px",
                            textAlign: "center",
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "12px"
                        }}
                    >

                        <h2>
                            {t("noPublishedResults")}
                        </h2>


                        <p>
                            {t(
                                "resultsWillAppearAfterAdminPublishes"
                            )}
                        </p>

                    </div>

                </div>
            </>

        );

    }


    // =================================================
    // PAGE
    // =================================================

    return (

        <>

            <Navbar user={user} />


            <div
                style={{
                    padding: "30px",
                    maxWidth: "1500px",
                    margin: "0 auto"
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    style={{
                        marginBottom: "30px"
                    }}
                >

                    <h1>
                        {t("competitionResults")}
                    </h1>


                    <p
                        style={{
                            fontSize: "18px",
                            marginBottom: "5px"
                        }}
                    >

                        <strong>
                            {t("dhammaSchool")}:
                        </strong>{" "}

                        {schoolName}

                    </p>


                    <p>

                        <strong>
                            {t("schoolNumber")}:
                        </strong>{" "}

                        {schoolNumber}

                    </p>

                </div>


                {/* =================================================
                    MY SCHOOL STUDENTS
                ================================================= */}

                <div
                    style={{
                        marginBottom: "50px"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "15px"
                        }}
                    >
                        {t("mySchoolStudentsResults")}
                    </h2>


                    <div
                        style={{
                            overflowX:
                                "auto",
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "10px"
                        }}
                    >

                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth:
                                    "900px"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        backgroundColor:
                                            "#111827",
                                        color:
                                            "white"
                                    }}
                                >

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        #
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        {t("studentId")}
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        {t("studentName")}
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        {t("grade")}
                                    </th>


                                    {events.map(
                                        event => (

                                            <th
                                                key={
                                                    event.competitionNumber
                                                }
                                                style={
                                                    thStyle
                                                }
                                            >

                                                {t("event")}{" "}

                                                {
                                                    event.competitionNumber
                                                }

                                            </th>

                                        )
                                    )}


                                    <th
                                        style={{
                                            ...thStyle,
                                            fontWeight:
                                                "bold"
                                        }}
                                    >
                                        {t("totalMarks")}
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
                                                student.studentId
                                            }
                                        >

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {index + 1}
                                            </td>


                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    student.studentId
                                                }
                                            </td>


                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    student.studentName
                                                }
                                            </td>


                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    student.grade
                                                }
                                            </td>


                                            {events.map(
                                                event => (

                                                    <td
                                                        key={
                                                            event.competitionNumber
                                                        }
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        {
                                                            student.events[
                                                                event.competitionNumber
                                                            ] ??
                                                            "-"
                                                        }

                                                    </td>

                                                )
                                            )}


                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >
                                                {
                                                    student.totalMarks
                                                }
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =================================================
                    SCHOOL RANKING
                ================================================= */}

                <div>

                    <h2
                        style={{
                            marginBottom:
                                "15px"
                        }}
                    >
                        {t("dhammaSchoolRanking")}
                    </h2>


                    <p
                        style={{
                            marginBottom:
                                "20px"
                        }}
                    >
                        {t(
                            "schoolsAutomaticallyRanked"
                        )}
                    </p>


                    <div
                        style={{
                            overflowX:
                                "auto",
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "10px"
                        }}
                    >

                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth:
                                    "900px"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        backgroundColor:
                                            "#111827",
                                        color:
                                            "white"
                                    }}
                                >

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        {t("place")}
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        {t("dhammaSchool")}
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        {t("schoolNo")}
                                    </th>


                                    {events.map(
                                        event => (

                                            <th
                                                key={
                                                    event.competitionNumber
                                                }
                                                style={
                                                    thStyle
                                                }
                                            >

                                                {t("event")}{" "}

                                                {
                                                    event.competitionNumber
                                                }

                                            </th>

                                        )
                                    )}


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        {t("totalMarks")}
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {schoolRanking.map(
                                    (
                                        school
                                    ) => (

                                        <tr
                                            key={
                                                school.schoolNumber
                                            }
                                            style={{
                                                backgroundColor:
                                                    school.schoolNumber ===
                                                    schoolNumber
                                                        ? "#fff8dc"
                                                        : "white"
                                            }}
                                        >

                                            {/* PLACE */}

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold",
                                                    textAlign:
                                                        "center",
                                                    fontSize:
                                                        "18px"
                                                }}
                                            >

                                                {
                                                    school.place
                                                }

                                            </td>


                                            {/* SCHOOL NAME */}

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        school.schoolNumber ===
                                                        schoolNumber
                                                            ? "bold"
                                                            : "normal"
                                                }}
                                            >

                                                {
                                                    school.schoolName
                                                }


                                                {school.schoolNumber ===
                                                    schoolNumber && (

                                                    <span
                                                        style={{
                                                            marginLeft:
                                                                "8px",
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#1976d2"
                                                        }}
                                                    >

                                                        (
                                                        {t("mySchool")}
                                                        )

                                                    </span>

                                                )}

                                            </td>


                                            {/* SCHOOL NUMBER */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {
                                                    school.schoolNumber
                                                }
                                            </td>


                                            {/* EVENT MARKS */}

                                            {events.map(
                                                event => (

                                                    <td
                                                        key={
                                                            event.competitionNumber
                                                        }
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        {
                                                            school.events[
                                                                event.competitionNumber
                                                            ] ??
                                                            0
                                                        }

                                                    </td>

                                                )
                                            )}


                                            {/* TOTAL */}

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold",
                                                    fontSize:
                                                        "17px"
                                                }}
                                            >

                                                {
                                                    school.totalMarks
                                                }

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </>

    );

};


// =====================================================
// TABLE STYLES
// =====================================================

const thStyle:
    React.CSSProperties = {

    border:
        "1px solid #374151",

    padding:
        "12px",

    textAlign:
        "left",

    whiteSpace:
        "nowrap"
};


const tdStyle:
    React.CSSProperties = {

    border:
        "1px solid #ddd",

    padding:
        "12px",

    whiteSpace:
        "nowrap"
};


export default TeacherResults;

