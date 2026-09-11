import React, { useEffect, useState } from "react";

import StudentSidebar from "../components/StudentSidebar";

import "./Certificate.css";

const API_URL = "http://127.0.0.1:8000/api";

function Certificate() {

  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  const student =
    JSON.parse(
      localStorage.getItem("student")
    ) || null;


  useEffect(() => {

    fetchCertificates();

  }, []);


  const fetchCertificates = async () => {

    try {

      if (!student?.id) {
        return;
      }


      const response =
        await fetch(
          `${API_URL}/certificates/`
        );


      if (!response.ok) {
        throw new Error(
          "Unable to load certificates."
        );
      }


      const data =
        await response.json();


      const allCertificates =
        Array.isArray(data)
          ? data
          : data.results || [];


      const studentCertificates =
        allCertificates.filter(
          (certificate) =>
            Number(
              typeof certificate.student === "object"
                ? certificate.student.id
                : certificate.student
            ) === Number(student.id)
        );


      setCertificates(
        studentCertificates
      );


    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="certificate-page">

      <StudentSidebar />

      <main className="certificate-main">

        <div className="certificate-header">

          <h1>
            My Certificates
          </h1>

          <p>
            Certificates earned after completing your courses.
          </p>

        </div>


        {loading && (

          <div className="certificate-message">
            Loading certificates...
          </div>

        )}


        {!loading &&
          certificates.length === 0 && (

            <div className="certificate-empty">

              <div>
                🏆
              </div>

              <h2>
                No Certificates Yet
              </h2>

              <p>
                Complete your enrolled course to receive
                your certificate.
              </p>

            </div>

          )}


        {!loading &&
          certificates.length > 0 && (

            <div className="certificate-grid">

              {certificates.map(
                (certificate) => {

                  const course =
                    certificate.course;

                  return (

                    <div
                      className="certificate-card"
                      key={certificate.id}
                    >

                      <div className="certificate-icon">
                        🏆
                      </div>

                      <h2>
                        Certificate of Completion
                      </h2>

                      <p>
                        This certificate is awarded for
                        successfully completing
                      </p>

                      <h3>

                        {typeof course === "object"
                          ? course.course_name
                          : `Course #${course}`}

                      </h3>

                      <div className="certificate-number">

                        Certificate No:
                        <strong>
                          {" "}
                          {certificate.certificate_number}
                        </strong>

                      </div>

                      <div className="certificate-date">

                        Issue Date:
                        {" "}
                        {certificate.issue_date}

                      </div>

                      <button
                        onClick={() =>
                          window.print()
                        }
                      >
                        Print Certificate
                      </button>

                    </div>

                  );

                }
              )}

            </div>

          )}

      </main>

    </div>

  );

}

export default Certificate;