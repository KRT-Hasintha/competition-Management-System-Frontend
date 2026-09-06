




import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useTranslation
} from "react-i18next";

import Navbar from "../../components/Navbar";
import api from "../../services/api";
import type { User } from "../../types/user";


interface School {

    id: string;

    schoolNumber: number;

    schoolName: string;

    address: string;

    registrationNumber: string;

    regionalShasanarakshakaMandalaya: string;

    district: string;

    status:
        | "PENDING"
        | "APPROVED"
        | "REJECTED";
}


const TeacherDashboard = () => {

    const navigate =
        useNavigate();

    const { t } =
        useTranslation();


    const [user, setUser] =
        useState<User | null>(null);

    const [school, setSchool] =
        useState<School | null>(null);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // LOAD USER
    // =====================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            setUser(
                JSON.parse(storedUser)
            );

        }

        getMySchool();

    }, []);


    // =====================================================
    // GET MY SCHOOL
    // =====================================================

    const getMySchool = async () => {

        try {

            const response =
                await api.get(
                    "/schools/my-school"
                );

            setSchool(
                response.data.school
            );

        } catch (error: any) {

            if (
                error.response?.status === 404
            ) {

                setSchool(null);

            } else {

                console.error(error);

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // WAIT FOR USER
    // =====================================================

    if (!user) {

        return null;

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <>
                <Navbar user={user} />

                <div className="page">

                    <div className="loading">

                        {t("loading")}

                    </div>

                </div>
            </>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <>

            <Navbar user={user} />


            <div className="page">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="dashboard-header">

                    <div>

                        <h1>
                            {t("teacherDashboard")}
                        </h1>

                        <p>
                            {t("manageYourDhammaSchool")}
                        </p>

                    </div>

                </div>


                {/* =====================================================
                    NO SCHOOL
                ===================================================== */}

                {!school && (

                    <div className="empty-card">

                        <div className="empty-icon">
                            🏫
                        </div>


                        <h2>
                            {t("noDhammaSchoolRegistered")}
                        </h2>


                        <p>
                            {t("youHaveNotRegisteredSchool")}
                        </p>


                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate(
                                    "/teacher/create-school"
                                )
                            }
                        >

                            {t("createDhammaSchool")}

                        </button>

                    </div>

                )}


                {/* =====================================================
                    SCHOOL
                ===================================================== */}

                {school && (

                    <div className="school-card">


                        {/* =================================================
                            SCHOOL HEADER
                        ================================================= */}

                        <div className="school-card-header">

                            <div>

                                <h2>
                                    {school.schoolName}
                                </h2>


                                <span>

                                    {t("schoolNo")}:{" "}

                                    {school.schoolNumber}

                                </span>

                            </div>


                            <span
                                className={
                                    `status-badge ${school.status.toLowerCase()}`
                                }
                            >

                                {school.status}

                            </span>

                        </div>


                        {/* =================================================
                            SCHOOL DETAILS
                        ================================================= */}

                        <div className="school-details">


                            {/* ADDRESS */}

                            <div className="detail">

                                <span>
                                    {t("address")}
                                </span>

                                <strong>
                                    {school.address}
                                </strong>

                            </div>


                            {/* REGISTRATION NUMBER */}

                            <div className="detail">

                                <span>
                                    {t("registrationNumber")}
                                </span>

                                <strong>
                                    {school.registrationNumber}
                                </strong>

                            </div>


                            {/* PRADESHIYA SHASANARAKSHAKA MANDALAYA */}

                            <div className="detail">

                                <span>
                                    {
                                        t(
                                            "pradeshiyaShasanarakshakaMandalaya"
                                        )
                                    }
                                </span>

                                <strong>

                                    {
                                        school.regionalShasanarakshakaMandalaya
                                    }

                                </strong>

                            </div>


                            {/* DISTRICT */}

                            <div className="detail">

                                <span>
                                    {t("district")}
                                </span>

                                <strong>
                                    {school.district}
                                </strong>

                            </div>


                        </div>


                        {/* =================================================
                            PENDING
                        ================================================= */}

                        {school.status === "PENDING" && (

                            <div className="status-message pending">

                                <h3>
                                    ⏳{" "}
                                    {t(
                                        "waitingForAdminApproval"
                                    )}
                                </h3>


                                <p>
                                    {t(
                                        "schoolRegistrationSubmitted"
                                    )}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            APPROVED
                        ================================================= */}

                        {school.status === "APPROVED" && (

                            <div className="approved-area">


                                <div className="status-message approved">

                                    <h3>
                                        ✓{" "}
                                        {t(
                                            "dhammaSchoolApproved"
                                        )}
                                    </h3>


                                    <p>
                                        {t(
                                            "youCanRegisterStudents"
                                        )}
                                    </p>

                                </div>


                                <div className="action-buttons">


                                    {/* ADD STUDENT */}

                                    <button
                                        className="primary-btn"
                                        onClick={() =>
                                            navigate(
                                                "/teacher/students/add"
                                            )
                                        }
                                    >

                                        {t("addStudent")}

                                    </button>


                                    {/* VIEW STUDENTS */}

                                    <button
                                        className="secondary-btn"
                                        onClick={() =>
                                            navigate(
                                                "/teacher/students"
                                            )
                                        }
                                    >

                                        {t("viewStudents")}

                                    </button>


                                </div>

                            </div>

                        )}


                        {/* =================================================
                            REJECTED
                        ================================================= */}

                        {school.status === "REJECTED" && (

                            <div className="status-message rejected">

                                <h3>
                                    ✕{" "}
                                    {t(
                                        "schoolRegistrationRejected"
                                    )}
                                </h3>


                                <p>
                                    {t(
                                        "schoolRegistrationRejectedDescription"
                                    )}
                                </p>

                            </div>

                        )}


                    </div>

                )}

            </div>

        </>

    );

};


export default TeacherDashboard;
