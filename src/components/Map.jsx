import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";

import styles from "./Map.module.css";

import { useCitiesContext } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

import Spinner from "./Spinner";
import Button from "./Button";

function Map() {
  const { cities, isLoading } = useCitiesContext();
  const {
    isLoading: isLoadingGeolocation,
    position: geolocationPosition,
    getPosition: getGeolocationPosition,
  } = useGeolocation();

  const [mapPosition, setMapPosition] = useState([43, 22]);
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        const { lat, lng } = geolocationPosition;
        setMapPosition([lat, lng]);
      }
    },
    [geolocationPosition]
  );

  // if (isLoading)
  //   return (
  //     <div className={styles.mapContainer}>
  //       <Spinner />
  //     </div>
  //   );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getGeolocationPosition}>
        {isLoadingGeolocation ? "Loading..." : "Use your position"}
      </Button>
      <MapContainer className={styles.map} center={mapPosition} zoom={7} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities?.map((city) => (
          <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeMapCenter position={mapPosition} />
        <DetectMapClick />
      </MapContainer>
    </div>
  );
}

function ChangeMapCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return;
}

function DetectMapClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });

  return;
}

export default Map;
