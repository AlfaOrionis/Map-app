import { useEffect, useState } from "react";
import "./App.css";

import Map from "./components/Map";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";

const App = () => {
  const [token, setToken] = useState("");
  const [cords, setCords] = useState({});
  console.log(cords);
  const getCords = (coords) => {
    setCords(coords);
  };
  useEffect(() => {
    fetch("/get_token")
      .then((res) => res.json())
      .then((res) => setToken(res));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={<Home token={token} passCords={getCords} />}
        />
        <Route path="/map" element={<Map coords={cords} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
