
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import api from "../../services/api";

interface School {
  id: string;
  schoolNumber: number;
  schoolName: string;
  address: string;
  registrationNumber: string;
  regionalShasanarakshakaMandalaya: string;
  district: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const SchoolManagement = () => {

  // ==========================================
  // TRANSLATION
  // ==========================================

  const { t } = useTranslation();


  // ==========================================
  // SCHOOL
  // ==========================================

  const [school, setSchool] =
    useState<School | null>(null);


  const [loading, setLoading] =
    useState(true);


  const [showCreate, setShowCreate] =
    useState(false);


  const [showJoin, setShowJoin] =
    useState(false);


  const [message, setMessage] =
    useState("");


  const [error, setError] =
    useState("");


  // ==========================================
  // CREATE SCHOOL FORM
  // ==========================================

  const [form, setForm] = useState({

    schoolName: "",
    address: "",
    registrationNumber: "",
    regionalShasanarakshakaMandalaya: "",
    district: ""

  });


  // ==========================================
  // JOIN SCHOOL
  // ==========================================

  const [schoolNumber, setSchoolNumber] =
    useState("");


  // ==========================================
  // GET MY SCHOOL
  // ==========================================

  const getMySchool = async () => {

    try {

      const response =
        await api.get("/schools/my-school");

      setSchool(
        response.data.school
      );

    } catch (err: any) {

      if (
        err.response?.status !== 404
      ) {

        setError(
          err.response?.data?.message ||
          t("failedToLoadSchool")
        );

      }

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    getMySchool();

  }, []);


  // ==========================================
  // CREATE SCHOOL
  // ==========================================

  const createSchool = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");
    setMessage("");


    try {

      const response =
        await api.post(
          "/schools",
          form
        );


      setSchool(
        response.data.school
      );


      setMessage(
        t("dhammaSchoolRegisteredSuccessfully")
      );


      setShowCreate(false);


      setForm({

        schoolName: "",
        address: "",
        registrationNumber: "",
        regionalShasanarakshakaMandalaya: "",
        district: ""

      });


    } catch (err: any) {

      setError(
        err.response?.data?.message ||
        t("failedToCreateSchool")
      );

    }

  };


  // ==========================================
  // JOIN SCHOOL
  // ==========================================

  const joinSchool = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");
    setMessage("");


    try {

      const response =
        await api.post(
          "/schools/join",
          {
            schoolNumber:
              Number(schoolNumber)
          }
        );


      setSchool(
        response.data.school
      );


      setMessage(
        t("joinedDhammaSchoolSuccessfully")
      );


      setShowJoin(false);


      setSchoolNumber("");


    } catch (err: any) {

      setError(
        err.response?.data?.message ||
        t("failedToJoinSchool")
      );

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="page-container">

        {t("loading")}

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="page-container">


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="page-header">

        <h1>
          {t("dhammaSchool")}
        </h1>

        <p>
          {t("manageDhammaSchool")}
        </p>

      </div>


      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {message && (

        <div className="success-message">

          {message}

        </div>

      )}


      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* ======================================
          NO SCHOOL
      ====================================== */}

      {!school && (

        <div className="school-actions">


          {/* REGISTER SCHOOL */}

          <button
            className="primary-btn"
            onClick={() =>
              setShowCreate(true)
            }
          >

            {t("registerNewDhammaSchool")}

          </button>


          {/* JOIN SCHOOL */}

          <button
            className="secondary-btn"
            onClick={() =>
              setShowJoin(true)
            }
          >

            {t("joinExistingSchool")}

          </button>


        </div>

      )}


      {/* ======================================
          SCHOOL DETAILS
      ====================================== */}

      {school && (

        <div className="school-card">


          {/* HEADER */}

          <div className="school-card-header">

            <div>

              <h2>
                {school.schoolName}
              </h2>


              <p>

                {t("schoolNumber")}:

                <strong>

                  {" "}
                  {school.schoolNumber}

                </strong>

              </p>

            </div>


            {/* STATUS */}

            <span
              className={`status ${school.status.toLowerCase()}`}
            >

              {school.status}

            </span>

          </div>


          {/* ==================================
              SCHOOL DETAILS
          ================================== */}

          <div className="school-details">


            {/* REGISTRATION NUMBER */}

            <div>

              <label>
                {t("registrationNumber")}
              </label>

              <p>
                {school.registrationNumber}
              </p>

            </div>


            {/* ADDRESS */}

            <div>

              <label>
                {t("address")}
              </label>

              <p>
                {school.address}
              </p>

            </div>


            {/* DISTRICT */}

            <div>

              <label>
                {t("district")}
              </label>

              <p>
                {school.district}
              </p>

            </div>


            {/* REGIONAL SHASANARAKSHAKA MANDALAYA */}

            <div>

              <label>
                {t(
                  "regionalShasanarakshakaMandalaya"
                )}
              </label>

              <p>

                {
                  school
                    .regionalShasanarakshakaMandalaya
                }

              </p>

            </div>


          </div>


          {/* ==================================
              PENDING
          ================================== */}

          {school.status === "PENDING" && (

            <div className="pending-box">

              <strong>
                {t("waitingForAdminApproval")}
              </strong>

              <p>
                {t("addStudentsAfterApproval")}
              </p>

            </div>

          )}


          {/* ==================================
              APPROVED
          ================================== */}

          {school.status === "APPROVED" && (

            <div className="approved-box">

              ✓ {t("dhammaSchoolApproved")}

            </div>

          )}


        </div>

      )}


      {/* ======================================
          CREATE SCHOOL MODAL
      ====================================== */}

      {showCreate && (

        <div className="modal-overlay">

          <div className="modal">


            <h2>
              {t("registerDhammaSchool")}
            </h2>


            <form
              onSubmit={createSchool}
            >


              {/* SCHOOL NAME */}

              <input

                placeholder={t("schoolName")}

                value={form.schoolName}

                onChange={(e) =>
                  setForm({

                    ...form,

                    schoolName:
                      e.target.value

                  })
                }

                required

              />


              {/* ADDRESS */}

              <input

                placeholder={t("address")}

                value={form.address}

                onChange={(e) =>
                  setForm({

                    ...form,

                    address:
                      e.target.value

                  })
                }

                required

              />


              {/* REGISTRATION NUMBER */}

              <input

                placeholder={t("registrationNumber")}

                value={
                  form.registrationNumber
                }

                onChange={(e) =>
                  setForm({

                    ...form,

                    registrationNumber:
                      e.target.value

                  })
                }

                required

              />


              {/* REGIONAL SHASANARAKSHAKA MANDALAYA */}

              <input

                placeholder={t(
                  "regionalShasanarakshakaMandalaya"
                )}

                value={
                  form
                    .regionalShasanarakshakaMandalaya
                }

                onChange={(e) =>
                  setForm({

                    ...form,

                    regionalShasanarakshakaMandalaya:
                      e.target.value

                  })
                }

                required

              />


              {/* DISTRICT */}

              <input

                placeholder={t("district")}

                value={form.district}

                onChange={(e) =>
                  setForm({

                    ...form,

                    district:
                      e.target.value

                  })
                }

                required

              />


              {/* MODAL ACTIONS */}

              <div className="modal-actions">


                {/* CANCEL */}

                <button

                  type="button"

                  className="cancel-btn"

                  onClick={() =>
                    setShowCreate(false)
                  }

                >

                  {t("cancel")}

                </button>


                {/* REGISTER */}

                <button

                  type="submit"

                  className="primary-btn"

                >

                  {t("registerSchool")}

                </button>


              </div>


            </form>

          </div>

        </div>

      )}


      {/* ======================================
          JOIN SCHOOL MODAL
      ====================================== */}

      {showJoin && (

        <div className="modal-overlay">

          <div className="modal">


            <h2>

              {t("joinDhammaSchool")}

            </h2>


            <form
              onSubmit={joinSchool}
            >


              {/* SCHOOL NUMBER */}

              <input

                type="number"

                placeholder={t("schoolNumber")}

                value={schoolNumber}

                onChange={(e) =>
                  setSchoolNumber(
                    e.target.value
                  )
                }

                required

              />


              {/* MODAL ACTIONS */}

              <div className="modal-actions">


                {/* CANCEL */}

                <button

                  type="button"

                  className="cancel-btn"

                  onClick={() =>
                    setShowJoin(false)
                  }

                >

                  {t("cancel")}

                </button>


                {/* JOIN */}

                <button

                  type="submit"

                  className="primary-btn"

                >

                  {t("joinSchool")}

                </button>


              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default SchoolManagement;
