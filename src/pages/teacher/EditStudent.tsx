import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../../services/api";

const EditStudent = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();


  const [form, setForm] =
    useState({

      nipunathaNumber: "",
      grade: "",
      name: "",
      gender: "MALE",
      dateOfBirth: "",
      parentName: "",
      address: "",
      phone: ""

    });


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadStudent =
      async () => {

        try {

          const response =
            await api.get(
              `/students/${id}`
            );

          const student =
            response.data.student;


          if (
            student.status !== "DRAFT"
          ) {

            setError(
              "This student has already been submitted and cannot be edited."
            );

            return;
          }


          setForm({

            nipunathaNumber:
              String(
                student.nipunathaNumber
              ),

            grade:
              student.grade,

            name:
              student.name,

            gender:
              student.gender,

            dateOfBirth:
              student.dateOfBirth
                .split("T")[0],

            parentName:
              student.parentName,

            address:
              student.address,

            phone:
              student.phone

          });

        } catch (err: any) {

          setError(
            err.response?.data?.message ||
            "Failed to load student"
          );

        } finally {

          setLoading(false);

        }

      };


    loadStudent();

  }, [id]);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };


  const updateStudent = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setSaving(true);
    setError("");


    try {

      await api.put(
        `/students/${id}`,
        {
          ...form,
          nipunathaNumber:
            Number(
              form.nipunathaNumber
            )
        }
      );


      navigate(
        "/teacher/students"
      );

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
        "Failed to update student"
      );

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (
      <div className="page-container">
        Loading...
      </div>
    );

  }


  if (error) {

    return (
      <div className="page-container">

        <div className="error-message">
          {error}
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            navigate(
              "/teacher/students"
            )
          }
        >
          Back
        </button>

      </div>
    );

  }


  return (

    <div className="page-container">

      <div className="page-header">

        <h1>
          Edit Student
        </h1>

      </div>


      <form
        className="student-form"
        onSubmit={
          updateStudent
        }
      >

        <div className="form-group">

          <label>
            Nipunatha Examination Number
          </label>

          <input
            type="number"
            name="nipunathaNumber"
            value={
              form.nipunathaNumber
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-group">

          <label>
            Grade
          </label>

          <input
            name="grade"
            value={
              form.grade
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-group">

          <label>
            Student Name
          </label>

          <input
            name="name"
            value={
              form.name
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-group">

          <label>
            Gender
          </label>

          <select
            name="gender"
            value={
              form.gender
            }
            onChange={
              handleChange
            }
          >

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

          </select>

        </div>


        <div className="form-group">

          <label>
            Date of Birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={
              form.dateOfBirth
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-group">

          <label>
            Parent Name
          </label>

          <input
            name="parentName"
            value={
              form.parentName
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-group">

          <label>
            Address
          </label>

          <textarea
            name="address"
            value={
              form.address
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-group">

          <label>
            Phone Number
          </label>

          <input
            name="phone"
            value={
              form.phone
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(
                "/teacher/students"
              )
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Update Student"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditStudent;