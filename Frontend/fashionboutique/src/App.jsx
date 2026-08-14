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


function App() {

  const location = useLocation();

  /*
    Dashboard pages

    Navbar and Footer will be hidden
    on these pages.
  */

  const dashboardPages = [
    "/dashboard",
    "/mycourses",
    "/online",
    "/offline",
    "/payment",
    "/quiz",
    "/certificate",
    "/profile"
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


        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Registration */}
        <Route
          path="/registration"
          element={<Registration />}
        />


        {/* =========================
            STUDENT DASHBOARD
            ========================= */}

        <Route
          path="/dashboard"
          element={<StudentDashboard />}
        />


        {/* =========================
            DASHBOARD OTHER PAGES
            ========================= */}

        {/* Add these components later */}

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

      </Routes>


      {/* =========================
          WEBSITE FOOTER
          ========================= */}

      {!isDashboardPage && <Footer />}

    </>
  );
}

export default App;