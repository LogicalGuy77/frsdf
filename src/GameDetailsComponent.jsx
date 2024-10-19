import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_KEY = "edab8554f3a14dbaa7a6901a8f073b24"; // Replace with your actual RAWG API key
const API_BASE_URL = "https://api.rawg.io/api";

const GameDetailsComponent = () => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/games/${id}?key=${API_KEY}`
        );
        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div>
      <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#007bff",
            marginBottom: "16px",
            display: "inline-block",
          }}
        >
          &larr; Back to Search
        </Link>
        <h1>{game.name}</h1>
        <img
          src={game.background_image || "/api/placeholder/800/450"}
          alt={game.name}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div>
            <p>
              <strong>Released:</strong> {game.released || "N/A"}
            </p>
            <p>
              <strong>Rating:</strong> {game.rating || "N/A"} (
              {game.ratings_count} ratings)
            </p>
            <p>
              <strong>Metacritic Score:</strong> {game.metacritic || "N/A"}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {game.genres.map((g) => g.name).join(", ")}
            </p>
          </div>
          <div>
            <p>
              <strong>Platforms:</strong>{" "}
              {game.platforms.map((p) => p.platform.name).join(", ")}
            </p>
            <p>
              <strong>Developers:</strong>{" "}
              {game.developers.map((d) => d.name).join(", ")}
            </p>
            <p>
              <strong>Publishers:</strong>{" "}
              {game.publishers.map((p) => p.name).join(", ")}
            </p>
            <p>
              <strong>ESRB Rating:</strong>{" "}
              {game.esrb_rating ? game.esrb_rating.name : "Not rated"}
            </p>
          </div>
        </div>
        <h2>About</h2>
        <div dangerouslySetInnerHTML={{ __html: game.description }} />
        {game.website && (
          <p>
            <strong>Official Website: </strong>
            <a href={game.website} target="_blank" rel="noopener noreferrer">
              {game.website}
            </a>
          </p>
        )}
        <h2>Tags</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {game.tags.map((tag) => (
            <span
              key={tag.id}
              style={{
                background: "#f0f0f0",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.9em",
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameDetailsComponent;
