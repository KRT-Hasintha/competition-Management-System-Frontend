




import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  useTranslation
} from "react-i18next";

import Navbar from "../../components/Navbar";

import api from "../../services/api";

import type { User } from "../../types/user";


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


const Students = () => {


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
  // STUDENTS
  // =====================================================

  const [students, setStudents] =
    useState<Student[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async () => {

    try {

      const response =
        await api.get(
          "/students/my-students"
        );


      setStudents(
        response.data.students || []
      );


    } catch (err: any) {

      setError(
        err.response?.data?.message ||
        t("failedToLoadStudents")
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD USER + STUDENTS
  // =====================================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");


    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }


    loadStudents();

  }, []);


  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (
    id: string
  ) => {


    const confirmed =
      window.confirm(
        t("confirmDeleteStudent")
      );


    if (!confirmed) {

      return;

    }


    try {

      await api.delete(
        `/students/${id}`
      );


      setStudents(
        students.filter(
          student =>
            student._id !== id
        )
      );


    } catch (err: any) {

      alert(
        err.response?.data?.message ||
        t("failedToDeleteStudent")
      );

    }

  };


  // =====================================================
  // SUBMIT STUDENT
  // =====================================================

  const submitStudent = async (
    id: string
  ) => {


    const confirmed =
      window.confirm(
        t("confirmSubmitStudent")
      );


    if (!confirmed) {

      return;

    }


    try {

      await api.patch(
        `/students/${id}/submit`
      );


      setStudents(
        students.map(
          student =>

            student._id === id

              ? {
                  ...student,
                  status: "SUBMITTED"
                }

              : student
        )
      );


    } catch (err: any) {

      alert(
        err.response?.data?.message ||
        t("failedToSubmitStudent")
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


        <div className="page-container">

          {t("loading")}

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
          MAIN CONTENT
      ========================================= */}

      <div className="page-container">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="page-header-row">

          <div>

            <h1>

              {t("myStudents")}

            </h1>


            <p>

              {t(
                "studentsBelongingToSchool"
              )}

            </p>

          </div>


          {/* ADD STUDENT */}

          <Link
            to="/teacher/students/add"
            className="primary-btn"
          >

            + {t("addStudent")}

          </Link>


        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* =====================================
            NO STUDENTS
        ===================================== */}

        {students.length === 0 ? (

          <div className="empty-state">


            <h3>

              {t("noStudents")}

            </h3>


            <p>

              {t("noStudentsYet")}

            </p>


            <Link
              to="/teacher/students/add"
              className="primary-btn"
            >

              {t("addFirstStudent")}

            </Link>


          </div>

        ) : (


          /* ===================================
             STUDENTS TABLE
          =================================== */

          <div className="table-wrapper">

            <table>


              {/* =================================
                  TABLE HEADER
              ================================= */}

              <thead>

                <tr>

                  <th>

                    {t("studentId")}

                  </th>


                  <th>

                    {t("nipunathaNo")}

                  </th>


                  <th>

                    {t("name")}

                  </th>


                  <th>

                    {t("grade")}

                  </th>


                  <th>

                    {t("gender")}

                  </th>


                  <th>

                    {t("status")}

                  </th>


                  <th>

                    {t("actions")}

                  </th>

                </tr>

              </thead>


              {/* =================================
                  TABLE BODY
              ================================= */}

              <tbody>

                {students.map(
                  student => (

                    <tr
                      key={
                        student._id
                      }
                    >


                      {/* STUDENT ID */}

                      <td>

                        <strong>

                          {
                            student.studentId
                          }

                        </strong>

                      </td>


                      {/* NIPUNATHA NUMBER */}

                      <td>

                        {
                          student
                            .nipunathaNumber
                        }

                      </td>


                      {/* NAME */}

                      <td>

                        {
                          student.name
                        }

                      </td>


                      {/* GRADE */}

                      <td>

                        {
                          student.grade
                        }

                      </td>


                      {/* GENDER */}

                      <td>

                        {
                          student.gender
                        }

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            `status ${student.status.toLowerCase()}`
                          }
                        >

                          {
                            student.status
                          }

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>


                        {/* DRAFT */}

                        {student.status ===
                          "DRAFT" && (

                          <div className="action-buttons">


                            {/* EDIT */}

                            <Link
                              to={`/teacher/students/edit/${student._id}`}
                              className="edit-btn"
                            >

                              {t("edit")}

                            </Link>


                            {/* DELETE */}

                            <button
                              className="delete-btn"
                              onClick={() =>
                                deleteStudent(
                                  student._id
                                )
                              }
                            >

                              {t("delete")}

                            </button>


                            {/* SUBMIT */}

                            <button
                              className="submit-btn"
                              onClick={() =>
                                submitStudent(
                                  student._id
                                )
                              }
                            >

                              {t("submit")}

                            </button>


                          </div>

                        )}


                        {/* SUBMITTED */}

                        {student.status ===
                          "SUBMITTED" && (

                          <span className="locked">

                            🔒{" "}

                            {t("locked")}

                          </span>

                        )}


                      </td>


                    </tr>

                  )
                )}

              </tbody>


            </table>

          </div>

        )}

      </div>

    </>

  );

};


export default Students;

