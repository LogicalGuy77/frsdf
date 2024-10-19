import GameSearchComponent from "./GameSearchComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameDetailsComponent from "./GameDetailsComponent";

import "./App.css";

function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/" element={<GameSearchComponent />} />
          <Route path="/game/:id" element={<GameDetailsComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
