import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// =====================================================
// WEBSITE PAGES
// =====================================================

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
import StudentCourses from "./pages/StudentCourses";
import StudentCategories from "./pages/StudentCategories";

import MyCourses from "./pages/MyCourses";
import StudentEnrollment from "./pages/StudentEnrollment";
import OnlineClasses from "./pages/OnlineClasses";
import OfflineBatch from "./pages/OfflineBatch";
import Certificate from "./pages/Certificate";
import Payment from "./pages/Payment";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentReceipt from "./pages/PaymentReceipt";
import MyProfile from "./pages/MyProfile";
import CourseDetails1 from "./pages/CourseDetails1";
import CourseLearning from "./pages/CourseLearning"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


// =====================================================
// ADMIN LOGIN
// =====================================================

import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminVerifyOTP from "./pages/AdminVerifyOTP";
import AdminResetPassword from "./pages/AdminResetPassword";


// =====================================================
// ADMIN DASHBOARD
// =====================================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminBatches from "./pages/AdminBatches";
import AdminCategories from "./pages/AdminCategories";
import AdminCourses from "./pages/AdminCourses";
import AdminEnrollment from "./pages/AdminEnrollment";
import AdminPayments from "./pages/AdminPayments";
import AdminVideos from "./pages/AdminVideos";
import AdminStudyMaterial from "./pages/AdminStudyMaterial";
import AdminCertificate from "./pages/AdminCertificate";


// =====================================================
// OTHER ADMIN PAGES
// =====================================================

import AdminFeedback from "./pages/AdminFeedback";
import AdminGallery from "./pages/AdminGallery";
import AdminContacts from "./pages/AdminContacts";
import AdminReports from "./pages/AdminReports";


function App() {

  const location = useLocation();


  // =====================================================
  // STUDENT DASHBOARD PAGES
  // =====================================================

  const studentDashboardPages = [
    "/student-dashboard",
    "/student-courses",
    "/online",
    "/offline",
    "/payment",
    "/payment-details",
    "/certificate",
    "/my-profile",
    "/categories",
    "/my-courses",
    "/course-details",
    "/CourseLearning",
    "/student-enrollment",
    "/payment-details/receipt",

  ];


  // =====================================================
  // ADMIN DASHBOARD PAGES
  // =====================================================

  const adminDashboardPages = [
    "/admin-dashboard",
    "/admin-students",
    "/admin-batches",
    "/admin-categories",
    "/admin-courses",
    "/admin-enrollments",
    "/admin-payments",
    "/admin-videos",
    "/admin-materials",
    "/admin-certificates",
    "/admin-feedback",
    "/admin-gallery",
    "/admin-contacts",
    "/admin-reports"
  ];


  // =====================================================
  // CHECK DASHBOARD
  // =====================================================

  const isStudentDashboard =
  studentDashboardPages.includes(location.pathname) ||

  location.pathname.startsWith(
    "/student-courses/category/"
  ) ||

  location.pathname.startsWith(
    "/course-details/"
  ) ||

  location.pathname.startsWith(
    "/my-courses/"
  )||
  location.pathname.startsWith(
    "/CourseLearning/"
  )||
  location.pathname.startsWith(
    "/student-enrollment/"
  )
  const isAdminDashboard =
    adminDashboardPages.includes(location.pathname);


  // =====================================================
  // HIDE NAVBAR AND FOOTER
  // =====================================================

  const hideNavbarFooter =
    isStudentDashboard ||
    isAdminDashboard;


  return (

    <>

      {/* =================================================
          NAVBAR
      ================================================= */}

      {!hideNavbarFooter && (
        <Navbar />
      )}


      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>


        {/* =================================================
            WEBSITE
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =================================================
            LOGIN / REGISTRATION
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registration"
          element={<Registration />}
        />

        <Route
          path="/course-details"
          element={<CourseDetails />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:uid/:token"
          element={<ResetPassword />}
        />


        {/* =================================================
            STUDENT DASHBOARD
        ================================================= */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />


        {/* =================================================
            EXPLORE COURSES
        ================================================= */}

        <Route
          path="/categories"
          element={<StudentCategories />}
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
          path="/student-enrollment"
          element={<StudentEnrollment />}
        />
        <Route
          path="/CourseLearning"
          element={<CourseLearning />}
        />

        {/* =================================================
            COURSES OF SELECTED CATEGORY
        ================================================= */}

        <Route
          path="/student-courses/category/:categoryId"
          element={<StudentCourses />}
        />


        {/* =================================================
            MY COURSES
        ================================================= */}

        <Route
          path="/my-courses"
          element={<MyCourses />}
        />


        {/* =================================================
            ONLINE CLASSES
        ================================================= */}

        <Route
          path="/online"
          element={<OnlineClasses />}
        />


        {/* =================================================
            OFFLINE BATCH
        ================================================= */}

        <Route
          path="/offline"
          element={<OfflineBatch />}
        />


        
          {/* =================================================
              PAYMENT
          ================================================= */}

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


        {/* =================================================
            CERTIFICATE
        ================================================= */}

        <Route
          path="/certificate"
          element={<Certificate />}
        />


        {/* =================================================
            MY PROFILE
        ================================================= */}

        <Route
          path="/my-profile"
          element={<MyProfile />}
        />


        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
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


        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

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
          path="/admin-payments"
          element={<AdminPayments />}
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


        {/* =================================================
            OTHER ADMIN PAGES
        ================================================= */}

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

      </Routes>


      {/* =================================================
          FOOTER
      ================================================= */}

      {!hideNavbarFooter && (
        <Footer />
      )}

    </>

  );
}


export default App;