
import {
    useEffect,
    useState
} from "react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import api from "../../services/api";

import type { User } from "../../types/user";


interface School {

    _id: string;

    schoolNumber: number;

    schoolName: string;

    address: string;

    registrationNumber: string;

    regionalShasanarakshakaMandalaya: string;

    district: string;

    status: string;

    createdBy?: {
        name: string;
        email: string;
    };

}


const SchoolApprovals = () => {


    // =====================================================
    // TRANSLATION
    // =====================================================

    const { t } = useTranslation();


    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] =
        useState<User | null>(null);


    // =====================================================
    // SCHOOLS
    // =====================================================

    const [schools, setSchools] =
        useState<School[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


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


        loadSchools();

    }, []);


    // =====================================================
    // LOAD SCHOOLS
    // =====================================================

    const loadSchools = async () => {

        try {

            setLoading(true);


            const response =
                await api.get(
                    "/admin/schools/pending"
                );


            setSchools(
                response.data.schools || []
            );


        } catch (error: any) {

            setError(
                error.response?.data?.message ||
                t("failedToLoadSchools")
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // APPROVE SCHOOL
    // =====================================================

    const approveSchool = async (
        id: string
    ) => {

        try {

            await api.patch(
                `/admin/schools/${id}/approve`
            );


            setSchools(
                schools.filter(
                    (school) =>
                        school._id !== id
                )
            );


        } catch (error: any) {

            alert(
                error.response?.data?.message ||
                t("failedToApproveSchool")
            );

        }

    };


    // =====================================================
    // REJECT SCHOOL
    // =====================================================

    const rejectSchool = async (
        id: string
    ) => {


        const confirmReject =
            window.confirm(
                t("confirmRejectSchool")
            );


        if (!confirmReject) {

            return;

        }


        try {

            await api.patch(
                `/admin/schools/${id}/reject`
            );


            setSchools(
                schools.filter(
                    (school) =>
                        school._id !== id
                )
            );


        } catch (error: any) {

            alert(
                error.response?.data?.message ||
                t("failedToRejectSchool")
            );

        }

    };


    // =====================================================
    // USER NOT LOADED
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

                {/* NAVBAR */}

                <Navbar user={user} />


                <div className="page">

                    <div className="loading">

                        {t(
                            "loadingSchoolApprovals"
                        )}

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

            {/* =========================================
                NAVBAR
            ========================================= */}

            <Navbar user={user} />


            {/* =========================================
                PAGE
            ========================================= */}

            <div className="page">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="dashboard-header">

                    <div>

                        <h1>

                            {t(
                                "schoolApprovals"
                            )}

                        </h1>


                        <p>

                            {t(
                                "reviewApproveSchools"
                            )}

                        </p>

                    </div>

                </div>


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (

                    <div className="alert error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    NO PENDING SCHOOLS
                ===================================== */}

                {schools.length === 0 && (

                    <div className="empty-card">


                        <div className="empty-icon">

                            ✓

                        </div>


                        <h2>

                            {t(
                                "noPendingSchools"
                            )}

                        </h2>


                        <p>

                            {t(
                                "noSchoolsWaitingApproval"
                            )}

                        </p>


                    </div>

                )}


                {/* =====================================
                    APPROVAL LIST
                ===================================== */}

                <div className="approval-list">


                    {schools.map(
                        (school) => (

                            <div
                                className="approval-card"
                                key={school._id}
                            >


                                {/* =================================
                                    SCHOOL HEADER
                                ================================= */}

                                <div className="school-card-header">


                                    <div>

                                        <h2>

                                            {
                                                school.schoolName
                                            }

                                        </h2>


                                        <span>

                                            {t("schoolNo")}:{" "}

                                            {
                                                school.schoolNumber
                                            }

                                        </span>

                                    </div>


                                    {/* STATUS */}

                                    <span className="status-badge pending">

                                        {t("pending")}

                                    </span>


                                </div>


                                {/* =================================
                                    SCHOOL DETAILS
                                ================================= */}

                                <div className="school-details">


                                    {/* ADDRESS */}

                                    <div className="detail">

                                        <span>

                                            {t("address")}

                                        </span>


                                        <strong>

                                            {
                                                school.address
                                            }

                                        </strong>

                                    </div>


                                    {/* REGISTRATION NUMBER */}

                                    <div className="detail">

                                        <span>

                                            {
                                                t(
                                                    "registrationNumber"
                                                )
                                            }

                                        </span>


                                        <strong>

                                            {
                                                school.registrationNumber
                                            }

                                        </strong>

                                    </div>


                                    {/* REGIONAL SHASANARAKSHAKA */}

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
                                                school
                                                    .regionalShasanarakshakaMandalaya
                                            }

                                        </strong>

                                    </div>


                                    {/* DISTRICT */}

                                    <div className="detail">

                                        <span>

                                            {t("district")}

                                        </span>


                                        <strong>

                                            {
                                                school.district
                                            }

                                        </strong>

                                    </div>


                                    {/* REGISTERED BY */}

                                    {school.createdBy && (

                                        <div className="detail">

                                            <span>

                                                {
                                                    t(
                                                        "registeredBy"
                                                    )
                                                }

                                            </span>


                                            <strong>

                                                {
                                                    school
                                                        .createdBy
                                                        .name
                                                }

                                            </strong>

                                        </div>

                                    )}


                                </div>


                                {/* =================================
                                    ACTIONS
                                ================================= */}

                                <div className="approval-actions">


                                    {/* APPROVE */}

                                    <button
                                        className="approve-btn"
                                        onClick={() =>
                                            approveSchool(
                                                school._id
                                            )
                                        }
                                    >

                                        ✓{" "}

                                        {t("approve")}

                                    </button>


                                    {/* REJECT */}

                                    <button
                                        className="reject-btn"
                                        onClick={() =>
                                            rejectSchool(
                                                school._id
                                            )
                                        }
                                    >

                                        ✕{" "}

                                        {t("reject")}

                                    </button>


                                </div>


                            </div>

                        )
                    )}


                </div>


            </div>

        </>

    );

};


export default SchoolApprovals;

