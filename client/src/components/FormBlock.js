import { useState } from "react";
import "./FormBlock.css";
import { useNavigate } from "react-router";

const FormBlock = ({ token, passCords }) => {
  const navigate = useNavigate();

  const [fromCityInput, setFromCityInput] = useState("");
  const [fromStreetInput, setFromStreetInput] = useState("");
  const [toCityInput, setToCityInput] = useState("");
  const [toStreetInput, setToStreetInput] = useState("");

  const fromCityHandler = (e) => {
    setFromCityInput(e.target.value);
  };
  const fromStreetHandler = (e) => {
    setFromStreetInput(e.target.value);
  };
  const toCityHandler = (e) => {
    setToCityInput(e.target.value);
  };
  const toStreetHandler = (e) => {
    setToStreetInput(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      fromCityInput.trim().length < 3 ||
      fromStreetInput.trim().length < 3 ||
      toCityInput.trim().length < 3 ||
      toStreetInput.trim().length < 3
    ) {
      alert("Minimum 3 characters required!");
      return;
    }

    const requestInfo = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    //I am fetching the starting point and arrival point
    const fromResponse = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${fromCityInput}, ${fromStreetInput}`,
      requestInfo
    );
    const toResponse = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${toCityInput}, ${toStreetInput}`,
      requestInfo
    );

    const fromPoint = await fromResponse.json();
    const toPoint = await toResponse.json();

    if (!fromPoint.items[0] || !toPoint.items[0]) {
      alert("Cant find such route");
      return;
    }

    const coords = {
      departure: fromPoint.items[0].position,
      arrival: toPoint.items[0].position,
    };
    //passing the route to the map component
    passCords(coords);
    navigate("/map");
  };

  return (
    <div className="form_block">
      <h2>Skąd</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>Miasto</label>
          <input onChange={fromCityHandler} />
        </div>

        <div>
          <label>Ulica</label>
          <input onChange={fromStreetHandler} />
        </div>

        <h2>Do</h2>

        <div>
          <label>Miasto</label>
          <input onChange={toCityHandler} />
        </div>

        <div>
          <label>Ulica</label>
          <input onChange={toStreetHandler} />
        </div>
        <button type="submit">Szukaj</button>
      </form>
    </div>
  );
};

export default FormBlock;
