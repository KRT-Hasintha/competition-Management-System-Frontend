
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

interface Result {
    resultId: string;
    studentNumber: string;
    studentName: string;
    schoolNumber: number;
    grade: string | number;
    marks: number | null;
    submitted: boolean;
}

interface Competition {
    number: number;
    name: string;
    grade: string | number;
    maxMarks: number;
}

const EventResults = () => {

    const { competitionNumber } = useParams();

    const [competition, setCompetition] =
        useState<Competition | null>(null);

    const [results, setResults] =
        useState<Result[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [editMarks, setEditMarks] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    // =====================================================
    // TOP 3 / FINAL RESULT STATES
    // =====================================================

    const [showTopThree, setShowTopThree] =
        useState(false);

    const [finalSubmitted, setFinalSubmitted] =
        useState(false);

    const [submittingFinal, setSubmittingFinal] =
        useState(false);


    // =====================================================
    // LOAD RESULTS
    // =====================================================

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

        } catch (error) {

            console.error(
                "Failed to load results:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadResults();

    }, [competitionNumber]);


    // =====================================================
    // LIVE UPDATE
    // Refresh every 3 seconds
    // =====================================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                loadResults();

            }, 3000);


        return () => {

            clearInterval(interval);

        };

    }, [competitionNumber]);


    // =====================================================
    // START EDIT
    // =====================================================

    const handleEdit = (result: Result) => {

        setEditingId(
            result.resultId
        );

        setEditMarks(
            result.marks?.toString() || ""
        );
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancel = () => {

        setEditingId(null);

        setEditMarks("");
    };


    // =====================================================
    // SAVE MARKS
    // =====================================================

    const handleSave = async (
        resultId: string
    ) => {

        const marks =
            Number(editMarks);


        if (
            Number.isNaN(marks) ||
            marks < 0 ||
            marks > (competition?.maxMarks || 100)
        ) {

            alert(
                `Marks must be between 0 and ${competition?.maxMarks}`
            );

            return;
        }


        try {

            setSaving(true);


            await api.put(
                `/admin/events/${competitionNumber}/results/${resultId}`,
                {
                    marks
                }
            );


            setEditingId(null);

            setEditMarks("");


            // Immediately refresh

            await loadResults();


        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update marks"
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // TOP 3 CALCULATION
    // =====================================================

    const topThree =
        [...results]
            .filter(
                result =>
                    result.marks !== null
            )
            .sort(
                (a, b) =>
                    (b.marks ?? 0) -
                    (a.marks ?? 0)
            )
            .slice(0, 3);


    // =====================================================
    // SUBMIT FINAL RESULTS
    // =====================================================

    const handleSubmitFinalResults =
        async () => {

            if (topThree.length < 3) {

                alert(
                    "There must be at least 3 students."
                );

                return;
            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to submit the Top 3 Final Results?"
                );


            if (!confirmed) {

                return;
            }


            try {

                setSubmittingFinal(true);


                await api.post(
                    `/admin/events/${competitionNumber}/final-results`
                );


                setFinalSubmitted(true);


                alert(
                    "Final results submitted successfully!"
                );


            } catch (error: any) {

                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Failed to submit final results"
                );

            } finally {

                setSubmittingFinal(false);
            }
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="p-8">

                <p>
                    Loading results...
                </p>

            </div>

        );
    }


    return (

        <div className="p-8 bg-gray-100 min-h-screen">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <h1 className="text-3xl font-bold text-gray-800">

                    Competition{" "}
                    {competition?.number}

                    {" - "}

                    {competition?.name}

                </h1>


                <div className="flex gap-6 mt-3 text-gray-600">

                    <p>

                        Grade:{" "}

                        <strong>

                            {competition?.grade}

                        </strong>

                    </p>


                    <p>

                        Maximum Marks:{" "}

                        <strong>

                            {competition?.maxMarks}

                        </strong>

                    </p>


                    <p>

                        Students:{" "}

                        <strong>

                            {results.length}

                        </strong>

                    </p>

                </div>

            </div>


            {/* =====================================================
                ALL STUDENT RESULTS TABLE
            ===================================================== */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full border-collapse">

                    <thead className="bg-gray-800 text-white">

                        <tr>

                            <th className="p-4 text-left">
                                Rank
                            </th>

                            <th className="p-4 text-left">
                                Student Number
                            </th>

                            <th className="p-4 text-left">
                                Student Name
                            </th>

                            <th className="p-4 text-left">
                                School Number
                            </th>

                            <th className="p-4 text-left">
                                Grade
                            </th>

                            <th className="p-4 text-left">
                                Marks
                            </th>

                            <th className="p-4 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {results.map(
                            (result, index) => (

                                <tr
                                    key={
                                        result.resultId
                                    }
                                    className="border-b hover:bg-gray-50"
                                >

                                    {/* RANK */}

                                    <td className="p-4 font-semibold">

                                        {index + 1}

                                    </td>


                                    {/* STUDENT NUMBER */}

                                    <td className="p-4">

                                        {
                                            result.studentNumber
                                        }

                                    </td>


                                    {/* STUDENT NAME */}

                                    <td className="p-4">

                                        {
                                            result.studentName
                                        }

                                    </td>


                                    {/* SCHOOL NUMBER */}

                                    <td className="p-4">

                                        {
                                            result.schoolNumber
                                        }

                                    </td>


                                    {/* GRADE */}

                                    <td className="p-4">

                                        {
                                            result.grade
                                        }

                                    </td>


                                    {/* MARKS */}

                                    <td className="p-4">

                                        {editingId ===
                                        result.resultId ? (

                                            <input
                                                type="number"
                                                min="0"
                                                max={
                                                    competition?.maxMarks
                                                }
                                                value={
                                                    editMarks
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setEditMarks(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-24 border border-blue-400 rounded-lg px-3 py-2 outline-none"
                                            />

                                        ) : (

                                            <span className="font-bold text-lg">

                                                {
                                                    result.marks ??
                                                    "-"
                                                }

                                            </span>

                                        )}

                                    </td>


                                    {/* ACTION */}

                                    <td className="p-4">

                                        {editingId ===
                                        result.resultId ? (

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleSave(
                                                            result.resultId
                                                        )
                                                    }
                                                    disabled={
                                                        saving
                                                    }
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                                                >

                                                    {saving
                                                        ? "Saving..."
                                                        : "Save"}

                                                </button>


                                                <button
                                                    onClick={
                                                        handleCancel
                                                    }
                                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                                >

                                                    Cancel

                                                </button>

                                            </div>

                                        ) : (

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        result
                                                    )
                                                }
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                            >

                                                Edit

                                            </button>

                                        )}

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>


                {results.length === 0 && (

                    <div className="p-10 text-center text-gray-500">

                        No results submitted yet.

                    </div>

                )}

            </div>


            {/* =====================================================
                DONE BUTTON
                Admin marks table එකට පහළින්
            ===================================================== */}

            <div className="mt-6 flex justify-end">

                {!showTopThree &&
                !finalSubmitted && (

                    <button
                        onClick={() =>
                            setShowTopThree(true)
                        }
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
                    >

                        ✓ Done - Check Top 3

                    </button>

                )}

            </div>


            {/* =====================================================
                TOP 3 FINAL RESULTS
            ===================================================== */}

            {showTopThree && (

                <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">


                    {/* HEADER */}

                    <div className="p-6 border-b">

                        <h2 className="text-2xl font-bold text-gray-800">

                            🏆 Top 3 Final Results

                        </h2>


                        <p className="text-gray-500 mt-1">

                            Please verify the top three students
                            before submitting.

                        </p>

                    </div>


                    {/* TOP 3 TABLE */}

                    <table className="w-full border-collapse">

                        <thead className="bg-gray-800 text-white">

                            <tr>

                                <th className="p-4 text-left">
                                    Rank
                                </th>

                                <th className="p-4 text-left">
                                    Student Number
                                </th>

                                <th className="p-4 text-left">
                                    Student Name
                                </th>

                                <th className="p-4 text-left">
                                    School Number
                                </th>

                                <th className="p-4 text-left">
                                    Grade
                                </th>

                                <th className="p-4 text-left">
                                    Marks
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {topThree.map(
                                (result, index) => (

                                    <tr
                                        key={
                                            result.resultId
                                        }
                                        className="border-b"
                                    >

                                        {/* RANK */}

                                        <td className="p-4 font-bold text-lg">

                                            {index === 0
                                                ? "🥇 1st"
                                                : index === 1
                                                ? "🥈 2nd"
                                                : "🥉 3rd"
                                            }

                                        </td>


                                        {/* STUDENT NUMBER */}

                                        <td className="p-4">

                                            {
                                                result.studentNumber
                                            }

                                        </td>


                                        {/* STUDENT NAME */}

                                        <td className="p-4 font-semibold">

                                            {
                                                result.studentName
                                            }

                                        </td>


                                        {/* SCHOOL NUMBER */}

                                        <td className="p-4">

                                            {
                                                result.schoolNumber
                                            }

                                        </td>


                                        {/* GRADE */}

                                        <td className="p-4">

                                            {
                                                result.grade
                                            }

                                        </td>


                                        {/* MARKS */}

                                        <td className="p-4 font-bold">

                                            {
                                                result.marks
                                            }

                                            {" / "}

                                            {
                                                competition?.maxMarks
                                            }

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>


                    {/* NO TOP 3 */}

                    {topThree.length === 0 && (

                        <div className="p-8 text-center text-gray-500">

                            No students with marks available.

                        </div>

                    )}


                    {/* SUBMIT FINAL RESULTS */}

                    <div className="p-6 flex justify-end">

                        <button
                            disabled={
                                submittingFinal ||
                                topThree.length < 3 ||
                                finalSubmitted
                            }
                            onClick={
                                handleSubmitFinalResults
                            }
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                        >

                            {submittingFinal
                                ? "Submitting..."
                                : "Submit Final Results"
                            }

                        </button>

                    </div>

                </div>

            )}


            {/* =====================================================
                FINAL SUBMITTED MESSAGE
            ===================================================== */}

            {finalSubmitted && (

                <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">

                    ✓ Final results have been submitted successfully.

                </div>

            )}

        </div>

    );
};


export default EventResults;

