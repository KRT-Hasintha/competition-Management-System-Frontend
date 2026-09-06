import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import ApprovalManagement from "./pages/ApprovalManagement";

import JudgeDashboard from "./pages/JudgeDashboard";
import JudgeTeachers from "./pages/JudgeTeachers";

import TeacherDashboard from "./pages/TeacherDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import SchoolManagement
  from "./pages/teacher/SchoolManagement";

import Students
  from "./pages/teacher/Students";

import AddStudent
  from "./pages/teacher/AddStudent";

import EditStudent
  from "./pages/teacher/EditStudent";

import DhammaSchoolApprovals
  from "./pages/admin/SchoolApprovals";


import DhammaSchools
    from "./pages/admin/DhammaSchools";

import SchoolStudents
    from "./pages/admin/SchoolStudents";
import Competitions from "./pages/judge/Competitions";


import Events
    from "./pages/admin/Events";

import EventResults
    from "./pages/admin/EventResults";


import CreateCompetition from "./pages/admin/CreateCompetition";


import AdminEvents
    from "./pages/admin/AdminEvents";

import AdminEventResults
    from "./pages/admin/AdminEventResults";

import TeacherResults from "./pages/teacher/TeacherResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ApprovalManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/judge"
          element={
            <ProtectedRoute allowedRoles={["JUDGE"]}>
              <JudgeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/judge/teachers"
          element={
            <ProtectedRoute allowedRoles={["JUDGE"]}>
              <JudgeTeachers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />


        <Route
  path="/teacher/school"
  element={
    <SchoolManagement />
  }
/>

<Route
  path="/teacher/students"
  element={
    <Students />
  }
/>

<Route
  path="/teacher/students/add"
  element={
    <AddStudent />
  }
/>

<Route
  path="/teacher/students/edit/:id"
  element={
    <EditStudent />
  }
/>

<Route
  path="/admin/dhamma-schools"
  element={
    <DhammaSchoolApprovals />
  }
/>


<Route
    path="/admin/dhamma-schools"
    element={<DhammaSchools />}
/>

<Route
    path="/admin/dhamma-schools/:schoolId/students"
    element={<SchoolStudents />}
/>

<Route
    path="/judge/competitions"
    element={
        <Competitions />
    }
/>


<Route
    path="/admin/events"
    element={
        <Events />
    }
/>

<Route
    path="/admin/events/:competitionNumber"
    element={
        <EventResults />
    }
/>


<Route path="/admin/competitions/create"
 element={
 <CreateCompetition />
 } 
 />



 <Route
    path="/admin/events"
    element={<AdminEvents />}
/>

<Route
    path="/admin/events/:competitionNumber"
    element={<AdminEventResults />}
/>

<Route
    path="/teacher/results"
    element={<TeacherResults />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;