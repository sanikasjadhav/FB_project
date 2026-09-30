import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ================= PUBLIC PAGES =================

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import CourseDetails from "./pages/CourseDetails";
// =====================================================
// STUDENT PAGES
// =====================================================

import StudentDashboard from "./pages/StudentDashboard";
import StudentCategories from "./pages/StudentCategories";
import StudentCourses from "./pages/StudentCourses";
import MyCourses from "./pages/MyCourses";
import StudentEnrollment from "./pages/StudentEnrollment";
import Payment from "./pages/Payment";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentReceipt from "./pages/PaymentReceipt";
import Certificate from "./pages/Certificate";
import MyProfile from "./pages/MyProfile";
import CourseDetails1 from "./pages/CourseDetails1";
import CourseLearning from "./pages/CourseLearning";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentFeedback from "./pages/StudentFeedback";
// =====================================================
// ADMIN LOGIN
// =====================================================

import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminVerifyOTP from "./pages/AdminVerifyOTP";
import AdminResetPassword from "./pages/AdminResetPassword";
// ================= ADMIN PAGES =================

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminBatches from "./pages/AdminBatches";
import AdminCategories from "./pages/AdminCategories";
import AdminCourses from "./pages/AdminCourses";
import AdminEnrollment from "./pages/AdminEnrollment";
import AdminVideos from "./pages/AdminVideos";
import AdminStudyMaterial from "./pages/AdminStudyMaterial";
import AdminCertificate from "./pages/AdminCertificate";
import AdminFeedback from "./pages/AdminFeedback";
import AdminGallery from "./pages/AdminGallery";
import AdminContacts from "./pages/AdminContacts";
import AdminReports from "./pages/AdminReports";
import AdminPayments from "./pages/AdminPayments";

function App() {
  const location = useLocation();

  // Hide public Navbar/Footer on admin pages
const isAdminPage =
  location.pathname.startsWith("/admin-") &&
  location.pathname !== "/admin-login";
  
const isStudentPage =
  location.pathname === "/student-dashboard" ||
  location.pathname === "/categories" ||
  location.pathname === "/my-courses" ||
  location.pathname === "/online" ||
  location.pathname === "/offline" ||
  location.pathname === "/payment" ||
  location.pathname === "/payment-details" ||
  location.pathname === "/certificate" ||
  location.pathname === "/my-profile" ||
  location.pathname === "/student-enrollment" ||
  location.pathname === "/CourseLearning" ||
  location.pathname === "/payment-details/receipt" ||
  location.pathname.startsWith("/student-courses/category/") ||
  location.pathname.startsWith("/my-courses/") ||
  location.pathname.startsWith("/course-details/")||
  location.pathname === "/student-feedback";
  return (
    <>
      {/* PUBLIC NAVBAR */}
      {!isAdminPage && !isStudentPage && <Navbar />}
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/gallery" element={<Gallery />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/registration"
          element={<Registration />}
        />

        <Route
          path="/course-details"
          element={<CourseDetails />}
        />
         {/* =================================================
            STUDENT DASHBOARD
        ================================================= */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />
        <Route
          path="/categories"
          element={<StudentCategories />}
        />
         <Route
          path="/student-courses/category/:categoryId"
          element={<StudentCourses />}
        />
        <Route
          path="/my-courses"
          element={<MyCourses />}
        />
        <Route
          path="/student-enrollment"
          element={<StudentEnrollment />}
        />
        <Route
          path="/payment"
          element={<Payment />}
        />
        <Route
          path="/payment-details"
          element={<PaymentDetails />}
        />
        <Route
          path="/payment-details/receipt"
          element={<PaymentReceipt />}
        />
        <Route
            path="/certificate"
            element={<Certificate />}
          />
        <Route
          path="/my-profile"
          element={<MyProfile />}
        />
        <Route
          path="/course-details/:courseId"
          element={<CourseDetails1 />}
        />
        <Route
          path="/my-courses/:enrollmentId"
          element={<CourseLearning />}
        />

        <Route
          path="/CourseLearning"
          element={<CourseLearning />}
        />
        <Route path="/student-feedback" element={<StudentFeedback />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password/:uid/:token"
          element={<ResetPassword />}
        />


        <Route
          path="/admin-forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route
          path="/admin-verify-otp"
          element={<AdminVerifyOTP />}
        />
        <Route
          path="/admin-reset-password"
          element={<AdminResetPassword />}
        />
        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-students"
          element={<AdminStudents />}
        />
        <Route
        path="/admin-batches"
        element={<AdminBatches />}
      />
      <Route
        path="/admin-categories"
        element={<AdminCategories />}
      />
      <Route
        path="/admin-courses"
        element={<AdminCourses />}
      />
      <Route
        path="/admin-enrollments"
        element={<AdminEnrollment />}
      />
      <Route
        path="/admin-videos"
        element={<AdminVideos />}
      />
      <Route
        path="/admin-materials"
        element={<AdminStudyMaterial />}
      />
      <Route
        path="/admin-certificates"
        element={<AdminCertificate />}
      />
      <Route
        path="/admin-feedback"
        element={<AdminFeedback />}
      />
      <Route
        path="/admin-gallery"
        element={<AdminGallery />}
      />
      <Route
        path="/admin-contacts"
        element={<AdminContacts />}
      />
      <Route
        path="/admin-reports"
        element={<AdminReports />}
      />
      <Route
        path="/admin-payments"
        element={<AdminPayments />}
      />
      </Routes>

      {/* PUBLIC FOOTER */}
      {!isAdminPage && !isStudentPage && <Footer />}    </>
  );
}

export default App;