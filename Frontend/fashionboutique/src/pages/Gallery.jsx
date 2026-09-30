
import React, { useEffect, useState } from "react";
import "./Gallery.css";

const API_URL = "http://127.0.0.1:8000/api";
const BACKEND_URL = "http://127.0.0.1:8000";

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch gallery images added by admin
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/gallery/`);

      if (!response.ok) {
        throw new Error("Failed to fetch gallery");
      }

      const data = await response.json();

      // DRF pagination support
      if (Array.isArray(data)) {
        setGallery(data);
      } else if (Array.isArray(data.results)) {
        setGallery(data.results);
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error("Gallery fetch error:", error);
      setError("Unable to load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  // Get correct image URL
  const getImageUrl = (item) => {
    const imageUrl = item.image_url || item.image;

    if (!imageUrl) {
      return "/images/hero.jpg";
    }

    // If Django already returns complete URL
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If Django returns /media/Gallery/...
    if (imageUrl.startsWith("/")) {
      return `${BACKEND_URL}${imageUrl}`;
    }

    return `${BACKEND_URL}/${imageUrl}`;
  };

  return (
    <div className="gallery-page">

      {/* Hero Section */}
      <section className="gallery-hero">
        <h1>Gallery</h1>

        <p>
          Explore our fashion creations, student activities,
          workshops, and boutique collections.
        </p>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">

        <h2>Fashion Showcase</h2>

        {/* Loading */}
        {loading && (
          <div className="gallery-message">
            Loading gallery...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="gallery-message error">
            {error}
          </div>
        )}

        {/* No Images */}
        {!loading && !error && gallery.length === 0 && (
          <div className="gallery-message">
            No gallery images available.
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && gallery.length > 0 && (
          <div className="gallery-grid">

            {gallery.map((item) => (
              <div
                className="gallery-card"
                key={item.id}
              >

                <img
                  src={getImageUrl(item)}
                  alt={item.title || "Fashion Gallery"}
                  onError={(e) => {
                    e.target.src = "/images/hero.jpg";
                  }}
                />

                <div className="overlay">
                  <h3>
                    {item.title || "Fashion Boutique"}
                  </h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Gallery;
