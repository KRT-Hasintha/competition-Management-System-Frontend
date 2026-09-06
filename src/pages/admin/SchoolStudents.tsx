import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

interface Student {

    _id: string;

    studentId: string;

    nipunathaNumber: number;

    schoolNumber: number;

    grade: string;

    name: string;

    gender: "MALE" | "FEMALE";

    dateOfBirth: string;

    parentName: string;

    address: string;

    phone: string;

    status:
        | "DRAFT"
        | "SUBMITTED"
        | "APPROVED"
        | "REJECTED";
}


interface SchoolInfo {

    id: string;

    schoolNumber: number;

    schoolName: string;
}


const SchoolStudents = () => {

    const { schoolId } = useParams();

    const navigate = useNavigate();


    const [students, setStudents] =
        useState<Student[]>([]);

    const [school, setSchool] =
        useState<SchoolInfo | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD SCHOOL STUDENTS
    // =====================================================

    useEffect(() => {

        const loadStudents = async () => {

            try {

                if (!schoolId) {

                    setError(
                        "School ID not found"
                    );

                    return;
                }


                const response =
                    await api.get(
                        `/admin/schools/${schoolId}/students`
                    );


                setSchool(
                    response.data.school
                );


                setStudents(
                    response.data.students
                );


            } catch (error: any) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load students"
                );

            } finally {

                setLoading(false);
            }
        };


        loadStudents();

    }, [schoolId]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="page-container">

                <h2>
                    Loading Students...
                </h2>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="page-container">

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate(
                            "/admin/dhamma-schools"
                        )
                    }
                >
                    ← Back
                </button>

                <p className="error-message">
                    {error}
                </p>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page-container">

            <button
                className="back-btn"
                onClick={() =>
                    navigate(
                        "/admin/dhamma-schools"
                    )
                }
            >
                ← Back to Dhamma Schools
            </button>


            {school && (

                <div className="school-title">

                    <h1>
                        {school.schoolName}
                    </h1>

                    <p>
                        School Number:
                        {" "}
                        <strong>
                            {school.schoolNumber}
                        </strong>
                    </p>

                    <p>
                        Total Students:
                        {" "}
                        <strong>
                            {students.length}
                        </strong>
                    </p>

                </div>

            )}


            {students.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No Students Found
                    </h3>

                    <p>
                        No students have been
                        added to this Dhamma School.
                    </p>

                </div>

            ) : (

                <div className="students-table-container">

                    <table className="students-table">

                        <thead>

                            <tr>

                                <th>
                                    Student ID
                                </th>

                                <th>
                                    Nipunatha No.
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Grade
                                </th>

                                <th>
                                    Gender
                                </th>

                                <th>
                                    Date of Birth
                                </th>

                                <th>
                                    Parent Name
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {students.map(
                                (student) => (

                                    <tr
                                        key={
                                            student._id
                                        }
                                    >

                                        <td>
                                            <strong>
                                                {
                                                    student.studentId
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                student.nipunathaNumber
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.grade
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.gender
                                            }
                                        </td>

                                        <td>
                                            {new Date(
                                                student.dateOfBirth
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            {
                                                student.parentName
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.phone
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={`status ${student.status.toLowerCase()}`}
                                            >
                                                {
                                                    student.status
                                                }
                                            </span>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
};


export default SchoolStudents;