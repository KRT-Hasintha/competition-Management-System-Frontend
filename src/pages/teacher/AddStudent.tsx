

import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../../services/api";


const AddStudent = () => {

    const navigate =
        useNavigate();


    const [
        nipunathaNumber,
        setNipunathaNumber
    ] = useState("");

    const [grade, setGrade] =
        useState("");

    const [name, setName] =
        useState("");

    const [gender, setGender] =
        useState<
            "MALE" | "FEMALE" | ""
        >("");

    const [dateOfBirth, setDateOfBirth] =
        useState("");

    const [parentName, setParentName] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [phone, setPhone] =
        useState("");


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !nipunathaNumber ||
            !grade ||
            !name ||
            !gender ||
            !dateOfBirth ||
            !parentName ||
            !address ||
            !phone
        ) {

            setError(
                "Please fill all fields"
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/students",
                    {

                        nipunathaNumber:
                            Number(
                                nipunathaNumber
                            ),

                        grade,

                        name:

                            name.trim(),

                        gender,

                        dateOfBirth,

                        parentName:
                            parentName.trim(),

                        address:
                            address.trim(),

                        phone:
                            phone.trim()
                    }
                );


            setSuccess(
                `Student added successfully. Student ID: ${response.data.student.studentId}`
            );


            // Clear

            setNipunathaNumber("");
            setGrade("");
            setName("");
            setGender("");
            setDateOfBirth("");
            setParentName("");
            setAddress("");
            setPhone("");


        } catch (error: any) {

            setError(
                error.response?.data?.message ||
                "Failed to add student"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="page">

            <div className="form-card">

                <h1>
                    Add Student
                </h1>

                <p className="form-description">
                    Add a student to your approved
                    Dhamma School.
                </p>


                {error && (

                    <div className="alert error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="alert success">
                        {success}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                >


                    {/* NIPUNATHA NUMBER */}

                    <div className="form-group">

                        <label>
                            Nipunatha Examination Number
                        </label>

                        <input
                            type="number"
                            value={nipunathaNumber}
                            onChange={(e) =>
                                setNipunathaNumber(
                                    e.target.value
                                )
                            }
                            placeholder="Enter Nipunatha number"
                        />

                        <small>
                            Student ID will be generated
                            automatically.
                        </small>

                    </div>


                    {/* GRADE */}

                    <div className="form-group">

                        <label>
                            Grade
                        </label>

                        <input
                            type="text"
                            value={grade}
                            onChange={(e) =>
                                setGrade(
                                    e.target.value
                                )
                            }
                            placeholder="Example: Grade 5"
                        />

                    </div>


                    {/* NAME */}

                    <div className="form-group">

                        <label>
                            Student Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Enter student name"
                        />

                    </div>


                    {/* GENDER */}

                    <div className="form-group">

                        <label>
                            Gender
                        </label>

                        <select
                            value={gender}
                            onChange={(e) =>
                                setGender(
                                    e.target.value as
                                    "MALE" |
                                    "FEMALE"
                                )
                            }
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="MALE">
                                Male
                            </option>

                            <option value="FEMALE">
                                Female
                            </option>

                        </select>

                    </div>


                    {/* DOB */}

                    <div className="form-group">

                        <label>
                            Date of Birth
                        </label>

                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) =>
                                setDateOfBirth(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* PARENT */}

                    <div className="form-group">

                        <label>
                            Parent Name
                        </label>

                        <input
                            type="text"
                            value={parentName}
                            onChange={(e) =>
                                setParentName(
                                    e.target.value
                                )
                            }
                            placeholder="Enter parent name"
                        />

                    </div>


                    {/* ADDRESS */}

                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            value={address}
                            onChange={(e) =>
                                setAddress(
                                    e.target.value
                                )
                            }
                            placeholder="Enter student address"
                        />

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value
                                )
                            }
                            placeholder="Enter phone number"
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Adding Student..."
                            : "Add Student"
                        }

                    </button>


                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                            navigate("/teacher")
                        }
                    >
                        Back
                    </button>

                </form>

            </div>

        </div>

    );

};


export default AddStudent;