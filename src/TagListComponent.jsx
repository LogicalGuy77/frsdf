import { useState, useEffect } from "react";

const API_KEY = "edab8554f3a14dbaa7a6901a8f073b24"; // Replace with your actual RAWG API key
const API_BASE_URL = "https://api.rawg.io/api";

const TagListComponent = ({ onTagSelect }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tags?key=${API_KEY}&page=${page}&page_size=20`
      );
      const data = await response.json();
      setTags((prevTags) => [...prevTags, ...data.results]);
      setHasMore(!!data.next);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Browse by Tags</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect(tag)}
            style={{
              background: "#f0f0f0",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
          >
            {tag.name} ({tag.games_count})
          </button>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={fetchTags}
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
          {loading ? "Loading..." : "Load More Tags"}
        </button>
      )}
    </div>
  );
};

export default TagListComponent;
