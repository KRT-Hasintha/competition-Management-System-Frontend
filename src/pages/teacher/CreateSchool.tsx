



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";
import api from "../../services/api";
import type { User } from "../../types/user";

const CreateSchool = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [user, setUser] = useState<User | null>(null);

    const [schoolName, setSchoolName] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [registrationNumber, setRegistrationNumber] =
        useState("");

    const [
        regionalShasanarakshakaMandalaya,
        setRegionalShasanarakshakaMandalaya
    ] = useState("");

    const [district, setDistrict] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD USER
    // =====================================================

    useState(() => {
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    });


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !schoolName.trim() ||
            !address.trim() ||
            !registrationNumber.trim() ||
            !regionalShasanarakshakaMandalaya.trim() ||
            !district.trim()
        ) {

            setError(
                t("fillAllFields")
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/schools",
                    {
                        schoolName:
                            schoolName.trim(),

                        address:
                            address.trim(),

                        registrationNumber:
                            registrationNumber.trim(),

                        regionalShasanarakshakaMandalaya:
                            regionalShasanarakshakaMandalaya.trim(),

                        district:
                            district.trim()
                    }
                );


            setSuccess(
                response.data.message ||
                t("dhammaSchoolRegisteredSuccessfully")
            );


            setTimeout(() => {

                navigate("/teacher");

            }, 1500);


        } catch (error: any) {

            setError(
                error.response?.data?.message ||
                t("failedToCreateSchool")
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
    // UI
    // =====================================================

    return (

        <>
            <Navbar user={user} />

            <div className="page">

                <div className="form-card">

                    <h1>
                        {t("registerNewDhammaSchool")}
                    </h1>


                    <p className="form-description">
                        {t("registerSchoolDescription")}
                    </p>


                    {/* ERROR */}

                    {error && (

                        <div className="alert error">
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="alert success">
                            {success}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* SCHOOL NAME */}

                        <div className="form-group">

                            <label>
                                {t("schoolName")}
                            </label>

                            <input
                                type="text"
                                value={schoolName}
                                onChange={(e) =>
                                    setSchoolName(
                                        e.target.value
                                    )
                                }
                                placeholder={t(
                                    "enterSchoolName"
                                )}
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="form-group">

                            <label>
                                {t("address")}
                            </label>

                            <textarea
                                value={address}
                                onChange={(e) =>
                                    setAddress(
                                        e.target.value
                                    )
                                }
                                placeholder={t(
                                    "enterSchoolAddress"
                                )}
                            />

                        </div>


                        {/* REGISTRATION NUMBER */}

                        <div className="form-group">

                            <label>
                                {t("registrationNumber")}
                            </label>

                            <input
                                type="text"
                                value={registrationNumber}
                                onChange={(e) =>
                                    setRegistrationNumber(
                                        e.target.value
                                    )
                                }
                                placeholder={t(
                                    "registrationNumberPlaceholder"
                                )}
                            />

                        </div>


                        {/* REGIONAL SHASANARAKSHAKA MANDALAYA */}

                        <div className="form-group">

                            <label>
                                {t(
                                    "pradeshiyaShasanarakshakaMandalaya"
                                )}
                            </label>

                            <input
                                type="text"
                                value={
                                    regionalShasanarakshakaMandalaya
                                }
                                onChange={(e) =>
                                    setRegionalShasanarakshakaMandalaya(
                                        e.target.value
                                    )
                                }
                                placeholder={t(
                                    "enterPradeshiyaShasanarakshakaMandalaya"
                                )}
                            />

                        </div>


                        {/* DISTRICT */}

                        <div className="form-group">

                            <label>
                                {t("district")}
                            </label>

                            <input
                                type="text"
                                value={district}
                                onChange={(e) =>
                                    setDistrict(
                                        e.target.value
                                    )
                                }
                                placeholder={t(
                                    "enterDistrict"
                                )}
                            />

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >

                            {loading
                                ? t("submitting")
                                : t("registerDhammaSchool")
                            }

                        </button>


                        {/* CANCEL */}

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() =>
                                navigate("/teacher")
                            }
                        >

                            {t("cancel")}

                        </button>

                    </form>

                </div>

            </div>
        </>

    );
};


export default CreateSchool;

