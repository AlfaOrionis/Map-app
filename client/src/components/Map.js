import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { latLng } from "leaflet";
import "leaflet-routing-machine";

import MarkerIcon from "../images/marker-icon-2x.png";
import MarkerShadow from "../images/marker-shadow.png";
import CurrentLocIMG from "../images/CurrentLoc.png";
import { Link } from "react-router-dom";

const Map = ({ coords }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState("");
  console.log(coords);
  //Idk why, GetRoute function doesnt work if its normally called but it works through button, so i came up with assignin this function to the button, and then imitate the clicking
  const GetRoute = () => {
    console.log(coords);
    const { arrival } = coords;
    const { departure } = coords;

    L.Routing.control({
      waypoints: [
        L.latLng(departure.lat, departure.lng),
        L.latLng(arrival.lat, arrival.lng),
      ],
      createMarker: function (i, waypoint, n) {
        const marker = L.marker(waypoint.latLng, {
          draggable: true,
          bounceOnAdd: false,
          bounceOnAddOptions: {
            duration: 1000,
            height: 800,
          },
          icon: L.icon({
            iconUrl: MarkerIcon,
            iconSize: [19, 47.5],
            iconAnchor: [11, 47],
            shadowUrl: MarkerShadow,
            shadowSize: [34, 47.5],
            shadowAnchor: [11, 47],
          }),
        });
        return marker;
      },
    }).addTo(map);
  };

  useEffect(() => {
    setTimeout(() => {
      const RoutingBtn = document.getElementById("RoutingBtn");

      RoutingBtn.click();
    }, 1000);
  }, []);

  //  Getting the current position
  const getCurrentPosition = (cb) => {
    // If user agree
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        cb([coords.latitude, coords.longitude]);
      },
      // If user doesnt agree
      () => {
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((userPosition) => {
            cb([userPosition.latitude, userPosition.longitude]);
          });
      }
    );
  };

  //  Refreshing the current position and setting the view
  const onClick = () => {
    const setCurrPosition = (LatLng) => {
      const myIcon = L.icon({
        iconUrl: CurrentLocIMG,
        iconSize: [19, 47.5],
        iconAnchor: [11, 47],
        shadowUrl: MarkerShadow,
        shadowSize: [34, 47.5],
        shadowAnchor: [11, 47],
      });
      //Adding the current location marker
      if (!marker) {
        setMarker(
          L.marker(LatLng, {
            icon: myIcon,
          }).addTo(map)
        );
        // If the marker already exists i'll just update its coords
      } else {
        marker.setLatLng(LatLng);
      }

      map.setView(LatLng);
    };
    getCurrentPosition(setCurrPosition);
  };

  return (
    <div>
      <MapContainer
        className="Map"
        center={[51, 19]}
        zoom={10}
        ref={setMap}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <button hidden id="RoutingBtn" onClick={GetRoute} />
      <button onClick={onClick}>Get current location</button>
      <Link to="/">Change the route</Link>
    </div>
  );
};

export default Map;
