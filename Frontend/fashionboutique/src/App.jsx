import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

import StudentDashboard from "./pages/StudentDashboard";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// Admin Dashboard
// Uncomment this after creating AdminDashboard.jsx
// import AdminDashboard from "./pages/AdminDashboard";


function App() {

  const location = useLocation();

  /*
    ================================
    DASHBOARD PAGES
    ================================

    Navbar and Footer are hidden
    on student/admin dashboard pages.
  */

  const dashboardPages = [
    "/student-dashboard",

    // Student dashboard pages
    "/mycourses",
    "/online",
    "/offline",
    "/payment",
    "/quiz",
    "/certificate",
    "/profile",

    // Admin pages
    "/admin-dashboard"
  ];


  const isDashboardPage =
    dashboardPages.includes(location.pathname);


  return (
    <>

      {/* =========================
          WEBSITE NAVBAR
          ========================= */}

      {!isDashboardPage && <Navbar />}


      {/* =========================
          ROUTES
          ========================= */}

      <Routes>

        {/* =========================
            WEBSITE PAGES
            ========================= */}

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />


        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />


        {/* Courses */}
        <Route
          path="/courses"
          element={<Courses />}
        />


        {/* Gallery */}
        <Route
          path="/gallery"
          element={<Gallery />}
        />


        {/* Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =========================
            STUDENT LOGIN
            ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            STUDENT REGISTRATION
            ========================= */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword />}
        />

        <Route
          path="/registration"
          element={<Registration />}
        />
        

        {/* =========================
            STUDENT DASHBOARD
            ========================= */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />


        {/* =========================
            STUDENT DASHBOARD PAGES
            ========================= */}

        {/*
        <Route
          path="/mycourses"
          element={<MyCourses />}
        />

        <Route
          path="/online"
          element={<OnlineClasses />}
        />

        <Route
          path="/offline"
          element={<OfflineBatch />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/quiz"
          element={<Quiz />}
        />

        <Route
          path="/certificate"
          element={<Certificate />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
        */}


        {/* =========================
            ADMIN LOGIN
            ========================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* =========================
            ADMIN DASHBOARD
            ========================= */}

        {/*
        Uncomment after creating
        AdminDashboard.jsx

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        */}


      </Routes>


      {/* =========================
          WEBSITE FOOTER
          ========================= */}

      {!isDashboardPage && <Footer />}

    </>
  );
}

export default App;