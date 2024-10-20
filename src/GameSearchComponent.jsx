import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TagListComponent from "./TagListComponent";
import GameChatbotComponent from "./GameChatBotComponent";

const API_KEY = "edab8554f3a14dbaa7a6901a8f073b24"; // Replace with your actual RAWG API key
const API_BASE_URL = "https://api.rawg.io/api";

const GameSearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  const searchGames = async () => {
    if (!searchQuery.trim() && !selectedTag) return;

    setLoading(true);
    try {
      let url = `${API_BASE_URL}/games?key=${API_KEY}&page_size=10`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (selectedTag) {
        url += `&tags=${selectedTag.id}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setGames(data.results);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    searchGames();
  };

  return (
    <>
      <div style={{ padding: "16px" }}>
        <div className="flex justify-center">
          <div className="button-49 mb-5 text-center w-1/3">
            Vapor: AI Game Search Engine
          </div>
        </div>
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

        {selectedTag && (
          <div style={{ marginBottom: "16px" }}>
            <p>Filtered by tag: {selectedTag.name}</p>
            <button
              onClick={() => {
                setSelectedTag(null);
                searchGames();
              }}
            >
              Clear Tag Filter
            </button>
          </div>
        )}

        <TagListComponent onTagSelect={handleTagSelect} />

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
                cursor: "pointer",
              }}
              onClick={() => handleGameClick(game.id)}
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
                <p style={{ margin: "4px 0" }}>
                  Rating: {game.rating || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GameChatbotComponent />
    </>
  );
};

export default GameSearchComponent;
