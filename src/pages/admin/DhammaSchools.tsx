
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    status: "PENDING" | "APPROVED" | "REJECTED";
}

const DhammaSchools = () => {

    const navigate = useNavigate();

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
    // LOAD USER + SCHOOLS
    // =====================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchSchools();

    }, []);


    // =====================================================
    // LOAD SCHOOLS
    // =====================================================

    const fetchSchools = async () => {

        try {

            const response =
                await api.get("/admin/schools");

            setSchools(
                response.data.schools || []
            );

        } catch (error: any) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                t("failedToLoadSchools")
            );

        } finally {

            setLoading(false);

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
                <Navbar user={user} />

                <main className="page-container">

                    <h2>
                        {t("loadingDhammaSchools")}
                    </h2>

                </main>
            </>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <>
                <Navbar user={user} />

                <main className="page-container">

                    <h2>
                        {t("schools")}
                    </h2>

                    <p>
                        {error}
                    </p>

                </main>
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
                MAIN CONTENT
            ========================================= */}

            <main className="page-container">

                <h1>
                    {t("registeredDhammaSchools")}
                </h1>

                <p>
                    {t("totalSchools")}: {schools.length}
                </p>


                {/* =========================================
                    NO SCHOOLS
                ========================================= */}

                {schools.length === 0 ? (

                    <div>

                        <h3>
                            {t("noDhammaSchools")}
                        </h3>

                        <p>
                            {t("noDhammaSchoolsDescription")}
                        </p>

                    </div>

                ) : (

                    /* =====================================
                       SCHOOL LIST
                    ===================================== */

                    <div>

                        {schools.map((school) => (

                            <div
                                key={school._id}
                                className="school-card"
                            >

                                <h2>
                                    {school.schoolName}
                                </h2>


                                <p>

                                    <strong>
                                        {t("schoolNumber")}:
                                    </strong>{" "}

                                    {school.schoolNumber}

                                </p>


                                <p>

                                    <strong>
                                        {t("registrationNumber")}:
                                    </strong>{" "}

                                    {school.registrationNumber}

                                </p>


                                <p>

                                    <strong>
                                        {t("address")}:
                                    </strong>{" "}

                                    {school.address}

                                </p>


                                <p>

                                    <strong>
                                        {t(
                                            "regionalShasanarakshakaMandalaya"
                                        )}:
                                    </strong>{" "}

                                    {
                                        school
                                            .regionalShasanarakshakaMandalaya
                                    }

                                </p>


                                <p>

                                    <strong>
                                        {t("district")}:
                                    </strong>{" "}

                                    {school.district}

                                </p>


                                <p>

                                    <strong>
                                        {t("status")}:
                                    </strong>{" "}

                                    {school.status}

                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/dhamma-schools/${school._id}/students`
                                        )
                                    }
                                >
                                    {t("viewStudents")}
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </>

    );
};

export default DhammaSchools;

