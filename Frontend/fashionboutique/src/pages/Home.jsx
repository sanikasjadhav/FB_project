import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";


function Home(){

return(

<div className="home">


{/* HERO */}

<section className="hero">


<div className="hero-left">


<div className="badge">
🏆 Trusted Fashion Learning Platform
</div>



<h1>

Build Skills That

<span
  style={{
    fontSize: "60px",
  }}
>
  Transform Your
</span>

Future

</h1>



<p>

Learn Fashion Boutique, Stitching,
Embroidery, Boutique Management and
Creative Skills with practical training.

</p>



<div className="stats">


<div>
<h2>50+</h2>
<p>Students</p>
</div>


<div>
<h2>10+</h2>
<p>Courses</p>
</div>

</div>



<Link to="/courses" className="main-btn">
Explore Courses →
</Link>


</div>





<div className="hero-video">


<video autoPlay muted loop playsInline>
  <source src="/images/video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<div className="video-overlay">

Transforming Lives...

</div>


</div>



</section>







{/* COURSES */}


<section className="courses">


<h2>
Popular Courses
</h2>



<div className="course-grid">


<div className="course-card">

<img src="/images/bg1.png"/>

<h3>
Fashion Boutiue
</h3>

<p>
Learn creative designof boutique, styling and fashion illustration.
</p>

</div>





<div className="course-card">

<img src="/images/tailor.avif"/>


<h3>
Tailoring Course
</h3>


<p>
Master stitching and garment making skills.
</p>

</div>






<div className="course-card">

<img src="/images/emd2.jpg"/>


<h3>
Embroidery
</h3>


<p>
Create beautiful handmade fashion designs.
</p>

</div>



</div>


</section>









{/* WHY CHOOSE */}


<section className="why">


<h2>
Why Choose Fashion Boutique?
</h2>



<div className="why-grid">


<div>

<h3>
👩‍🏫 Expert Trainer
</h3>

<p>
Learn from experienced designers.
</p>

</div>



<div>

<h3>
💻 Online Learning
</h3>

<p>
Study anytime anywhere.
</p>

</div>



<div>

<h3>
🏆 Certificate
</h3>

<p>
Get course completion certificate.
</p>

</div>


<div>

<h3>
✂ Practical Training
</h3>

<p>
Real fashion projects and practice.
</p>

</div>



</div>


</section>

<section className="gallery-section">
  <h2 style={{ color: "#07575A" }}>Student Work</h2>

  <div className="gallery-slider">
    <div className="gallery-track">

      <div className="gallery-card">
        <img src="/images/bg1.png" alt="Gallery 1" />
      </div>

      <div className="gallery-card">
        <img src="/images/bg2.png" alt="Gallery 2" />
      </div>

      <div className="gallery-card">
        <img src="/images/bg3.jpg" alt="Gallery 3" />
      </div>

      <div className="gallery-card">
        <img src="/images/course1.jpg" alt="Gallery 4" />
      </div>

      <div className="gallery-card">
        <img src="/images/emd.jpg" alt="Gallery 5" />
      </div>

      {/* Duplicate the images for seamless looping */}
      <div className="gallery-card">
        <img src="/images/emd2.jpg" alt="Gallery 1" />
      </div>

      <div className="gallery-card">
        <img src="/images/hero.jpg" alt="Gallery 2" />
      </div>

      <div className="gallery-card">
        <img src="/images/tailor.avif" alt="Gallery 3" />
      </div>

      <div className="gallery-card">
        <img src="/images/about.avif" alt="Gallery 4" />
      </div>

    </div>
  </div>
</section>


{/* CTA */}

<section className="cta">


<h2>
Start Your Fashion Journey Today
</h2>


<p>
Join our professional fashion courses.
</p>


<Link>
Join Now
</Link>


</section>



</div>

)

}


export default Home;