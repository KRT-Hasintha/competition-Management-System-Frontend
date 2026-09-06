import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

interface Result {
    resultId: string;
    studentNumber: string;
    studentName: string;
    grade: string;
    schoolNumber: number;
    schoolName: string;
    marks: number;
    published: boolean;
}

interface Competition {
    competitionNumber: number;
    name: string;
    maxMarks: number;
}

const AdminEventResults = () => {

    const { competitionNumber } =
        useParams();

    const navigate = useNavigate();


    const [competition, setCompetition] =
        useState<Competition | null>(null);

    const [results, setResults] =
        useState<Result[]>([]);

    const [published, setPublished] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [publishing, setPublishing] =
        useState(false);


    useEffect(() => {

        loadResults();

    }, [competitionNumber]);


    const loadResults = async () => {

        try {

            const response =
                await api.get(
                    `/admin/events/${competitionNumber}/results`
                );

            setCompetition(
                response.data.competition
            );

            setResults(
                response.data.results
            );

            setPublished(
                response.data.published
            );

        } catch (error) {

            console.error(
                "Failed to load results",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    const publishResults = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to publish these results?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setPublishing(true);


            await api.patch(
                `/admin/events/${competitionNumber}/publish`
            );


            alert(
                "Results published successfully!"
            );


            setPublished(true);


            await loadResults();


        } catch (error: any) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to publish results"
            );

        } finally {

            setPublishing(false);

        }
    };


    if (loading) {

        return (
            <div style={{
                padding: "30px"
            }}>
                Loading result sheet...
            </div>
        );
    }


    if (!competition) {

        return (
            <div style={{
                padding: "30px"
            }}>
                Competition not found.
            </div>
        );
    }


    return (

        <div style={{
            padding: "30px"
        }}>

            <button
                onClick={() =>
                    navigate("/admin/events")
                }
            >
                ← Back
            </button>


            <h1>
                {competition.name}
            </h1>

            <h3>
                Competition Number:
                {" "}
                {competition.competitionNumber}
            </h3>


            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "25px"
                }}
            >

                <thead>

                    <tr>

                        <th>Student No.</th>

                        <th>Student</th>

                        <th>Grade</th>

                        <th>School No.</th>

                        <th>School</th>

                        <th>Marks</th>

                    </tr>

                </thead>


                <tbody>

                    {results.map(result => (

                        <tr key={result.resultId}>

                            <td>
                                {result.studentNumber}
                            </td>

                            <td>
                                {result.studentName}
                            </td>

                            <td>
                                {result.grade}
                            </td>

                            <td>
                                {result.schoolNumber}
                            </td>

                            <td>
                                {result.schoolName}
                            </td>

                            <td>
                                {result.marks}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


            <div style={{
                marginTop: "30px"
            }}>

                {published ? (

                    <div>

                        <h2>
                            ✓ Results Published
                        </h2>

                        <p>
                            These results are now
                            visible to teachers.
                        </p>

                    </div>

                ) : (

                    <button
                        onClick={publishResults}
                        disabled={
                            publishing ||
                            results.length === 0
                        }
                        style={{
                            padding: "12px 25px",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >

                        {publishing
                            ? "Publishing..."
                            : "Publish Results"}

                    </button>

                )}

            </div>

        </div>

    );
};

export default AdminEventResults;