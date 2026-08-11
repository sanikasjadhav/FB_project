import React from "react";
import "./Gallery.css";

function Gallery() {
  const gallery = [
    {
      image: "/images/hero.jpg",
      title: "Fashion Designing"
    },
    {
      image: "/images/emd.jpg",
      title: "Tailoring Classes"
    },
    {
      image: "/images/aboutus.jpg",
      title: "Embroidery Work"
    },
    {
      image: "/images/about.avif",
      title: "Boutique Collection"
    },
    {
      image: "/images/bg3.jpg",
      title: "Designer Dresses"
    },
    {
      image: "/images/bg1.png",
      title: "Student Workshop"
    },
    {
      image: "/images/bg2.png",
      title: "Fashion Event"
    },
    {
      image: "/images/hero.jpg",
      title: "Creative Designs"
    }
  ];

  return (
    <div className="gallery-page">

      <section className="gallery-hero">
        <h1>Gallery</h1>
        <p>
          Explore our fashion creations, student activities,
          workshops, and boutique collections.
        </p>
      </section>

      <section className="gallery-section">

        <h2>Fashion Showcase</h2>

        <div className="gallery-grid">

          {gallery.map((item, index) => (
            <div className="gallery-card" key={index}>

              <img src={item.image} alt={item.title} />

              <div className="overlay">
                <h3>{item.title}</h3>
              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default Gallery;