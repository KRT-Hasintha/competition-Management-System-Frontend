




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const CreateCompetition = () => {

    const navigate = useNavigate();

    const [competitionNumber, setCompetitionNumber] = useState("");
    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [maxMarks, setMaxMarks] = useState("100");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Validation
        if (
            !competitionNumber ||
            !name.trim() ||
            !grade
        ) {
            setError(
                "Competition number, name and grade are required"
            );
            return;
        }

        if (Number(competitionNumber) <= 0) {
            setError(
                "Competition number must be greater than 0"
            );
            return;
        }

        if (Number(maxMarks) <= 0) {
            setError(
                "Maximum marks must be greater than 0"
            );
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/admin/competitions",
                {
                    competitionNumber: Number(
                        competitionNumber
                    ),

                    name: name.trim(),

                    grade: Number(grade),

                    maxMarks: Number(maxMarks)
                }
            );

            setSuccess(
                response.data.message ||
                "Competition created successfully"
            );

            // Clear form
            setCompetitionNumber("");
            setName("");
            setGrade("");
            setMaxMarks("100");

            // Redirect after success
            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1000);

        } catch (error: any) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create competition"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* <Navbar /> */}

            <div className="flex justify-center px-4 py-10">

                <div className="w-full max-w-xl">

                    <div className="bg-white rounded-2xl shadow-lg p-8">

                        {/* Header */}

                        <div className="mb-8">

                            <h1 className="text-3xl font-bold text-gray-800">
                                Create Competition
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Add a new competition to the system
                            </p>

                        </div>

                        {/* Error */}

                        {error && (
                            <div className="mb-5 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Success */}

                        {success && (
                            <div className="mb-5 rounded-lg bg-green-100 border border-green-300 px-4 py-3 text-green-700">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* Competition Number */}

                            <div className="mb-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Competition Number
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={competitionNumber}
                                    onChange={(e) =>
                                        setCompetitionNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter competition number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Competition Name */}

                            <div className="mb-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Competition Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter competition name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Grade */}

                            <div className="mb-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Grade
                                </label>

                                <select
                                    value={grade}
                                    onChange={(e) =>
                                        setGrade(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >

                                    <option value="">
                                        Select Grade
                                    </option>

                                    <option value="1">
                                        "Grade 1"
                                    </option>

                                    <option value="2">
                                        "Grade 2"
                                    </option>

                                    <option value="3">
                                        "Grade 3"
                                    </option>

                                    <option value="4">
                                        "Grade 4"
                                    </option>

                                    <option value="5">
                                        "Grade 5"
                                    </option>

                                    <option value="6">
                                        "Grade 6"
                                    </option>

                                    <option value="7">
                                        "Grade 7"
                                    </option>

                                    <option value="8">
                                        "Grade 8"
                                    </option>

                                    <option value="9">
                                        "Grade 9"
                                    </option>

                                    <option value="10">
                                        "Grade 10"
                                    </option>

                                    <option value="11">
                                        "Grade 11"
                                    </option>

                                    <option value="12">
                                        "Grade 12"
                                    </option>

                                    <option value="13">
                                        "Grade 13"
                                    </option>

                                    <option value="13">
                                        "Awasana"
                                    </option>

                                    <option value="13">
                                        "Darmacharya"
                                    </option>

                                </select>

                            </div>

                            {/* Maximum Marks */}

                            <div className="mb-7">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Maximum Marks
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={maxMarks}
                                    onChange={(e) =>
                                        setMaxMarks(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter maximum marks"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Buttons */}

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/dashboard")
                                    }
                                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Competition"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CreateCompetition;

