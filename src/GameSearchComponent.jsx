import { useState } from "react";

const API_KEY = "edab8554f3a14dbaa7a6901a8f073b24"; // Replace with your actual RAWG API key
const API_BASE_URL = "https://api.rawg.io/api";

const GameSearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchGames = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(
          searchQuery
        )}&page_size=10`
      );
      const data = await response.json();
      setGames(data.results);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a game..."
          style={{
            flexGrow: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={searchGames}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{game.name}</h3>
            </div>
            <div style={{ padding: "0 16px 16px" }}>
              <img
                src={game.background_image || "/api/placeholder/320/180"}
                alt={game.name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              />
              <p style={{ margin: "4px 0" }}>
                Released: {game.released || "N/A"}
              </p>
              <p style={{ margin: "4px 0" }}>Rating: {game.rating || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSearchComponent;
