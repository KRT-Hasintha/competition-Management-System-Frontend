



// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import type { User } from "../types/user";




// interface NavbarProps {
//   user: User;
// }

// const Navbar = ({ user }: NavbarProps) => {
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/login");
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <nav className="navbar">

//       {/* Brand */}
//       <div className="nav-brand">
//         Competition Management
//       </div>

//       {/* Burger Icon - Mobile */}
//       <button
//         className="burger-btn"
//         onClick={() => setMenuOpen(!menuOpen)}
//         aria-label="Toggle menu"
//       >
//         ☰
//       </button>

//       {/* Navigation Links */}
//       <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>

//         <Link to="/profile" onClick={closeMenu}>
//           Profile
//         </Link>

//         {/* ADMIN */}
//         {user.role === "ADMIN" && (
//           <>
//             <Link to="/admin" onClick={closeMenu}>
//               Dashboard
//             </Link>

//             <Link to="/admin/users" onClick={closeMenu}>
//               All Users
//             </Link>

//             <Link to="/admin/approvals" onClick={closeMenu}>
//               Approvals
//             </Link>

//             <Link to="/admin/dhamma-schools" onClick={closeMenu}>
//               Dhamma Schools
//             </Link>

//             <Link to="/admin/events" onClick={closeMenu}>
//               Events
//             </Link>

//             <Link
//               to="/admin/competitions/create"
//               onClick={closeMenu}
//             >
//               Create Competition
//             </Link>
//           </>
//         )}

//         {/* JUDGE */}
//         {user.role === "JUDGE" && (
//           <>
//             <Link to="/judge" onClick={closeMenu}>
//               Dashboard
//             </Link>

//             <Link
//               to="/judge/competitions"
//               onClick={closeMenu}
//             >
//               Competitions
//             </Link>

//             <Link
//               to="/judge/teachers"
//               onClick={closeMenu}
//             >
//               Teachers
//             </Link>
//           </>
//         )}

//         {/* TEACHER */}
//         {user.role === "TEACHER" && (
//           <>
//             <Link to="/teacher" onClick={closeMenu}>
//               Dashboard
//             </Link>

//             <Link
//               to="/teacher/school"
//               onClick={closeMenu}
//             >
//               My School
//             </Link>

//             <Link
//               to="/teacher/students"
//               onClick={closeMenu}
//             >
//               Students
//             </Link>
//           </>
//         )}

//         {/* Logout */}
//         <button
//           className="logout-btn"
//           onClick={() => {
//             logout();
//             closeMenu();
//           }}
//         >
//           Logout
//         </button>

//       </div>
//     </nav>
//   );
// };

// export default Navbar;




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import type { User } from "../types/user";

interface NavbarProps {
  user: User;
}

const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // Translation
  const { t } = useTranslation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Change Language
  const changeLanguage = (language: "en" | "si") => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <nav className="navbar">

      {/* Brand */}
      <div className="nav-brand">
        Competition Management
      </div>

      {/* Burger Icon - Mobile */}
      <button
        className="burger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>

        {/* Profile */}
        <Link to="/profile" onClick={closeMenu}>
          {t("profile")}
        </Link>

        {/* ADMIN */}
        {user.role === "ADMIN" && (
          <>
            <Link to="/admin" onClick={closeMenu}>
              {t("dashboard")}
            </Link>

            <Link to="/admin/users" onClick={closeMenu}>
              {t("allUsers")}
            </Link>

            <Link to="/admin/approvals" onClick={closeMenu}>
              {t("approvals")}
            </Link>

            <Link to="/admin/dhamma-schools" onClick={closeMenu}>
              {t("schools")}
            </Link>

            <Link to="/admin/events" onClick={closeMenu}>
              {t("events")}
            </Link>

            <Link
              to="/admin/competitions/create"
              onClick={closeMenu}
            >
              {t("createCompetition")}
            </Link>
          </>
        )}

        {/* JUDGE */}
        {user.role === "JUDGE" && (
          <>
            <Link to="/judge" onClick={closeMenu}>
              {t("dashboard")}
            </Link>

            <Link
              to="/judge/competitions"
              onClick={closeMenu}
            >
              {t("competitions")}
            </Link>

            <Link
              to="/judge/teachers"
              onClick={closeMenu}
            >
              {t("teachers")}
            </Link>
          </>
        )}

        {/* TEACHER */}
        {user.role === "TEACHER" && (
          <>
            <Link to="/teacher" onClick={closeMenu}>
              {t("dashboard")}
            </Link>

            <Link
              to="/teacher/school"
              onClick={closeMenu}
            >
              {t("mySchool")}
            </Link>

            <Link
              to="/teacher/students"
              onClick={closeMenu}
            >
              {t("students")}
            </Link>

            <Link to="/teacher/results">
    Results
</Link>
          </>
        )}

        {/* Language Buttons */}
        <div className="language-buttons">

          <button
            className="language-btn"
            onClick={() => changeLanguage("si")}
          >
            සිංහල
          </button>

          <button
            className="language-btn"
            onClick={() => changeLanguage("en")}
          >
            English
          </button>

        </div>

        {/* Logout */}
        <button
          className="logout-btn"
          onClick={() => {
            logout();
            closeMenu();
          }}
        >
          {t("logout")}
        </button>

      </div>
    </nav>
  );
};

export default Navbar;

