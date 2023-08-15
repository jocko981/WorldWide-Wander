// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";

import { useCitiesContext } from "../contexts/CitiesContext";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useGeolocation } from "../hooks/useGeolocation";
import { convertToEmoji } from "../helpers";

import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />;
};

const BASE_URL_REVERSE_GEOCODE = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const { createCity, isLoading } = useCitiesContext();
  const { position: geolocationPosition } = useGeolocation();
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  // TODO - use your location, da se u Formu doda lat/lng

  useEffect(
    function () {
      if (!lat || !lng) return;

      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(`${BASE_URL_REVERSE_GEOCODE}?latitude=${lat}&longitude=${lng}`);
          const data = await res.json();

          if (!data.countryCode)
            throw new Error("Please click on something that is not outside the borders 😄");

          setCityName(data.city || data.locality || "");
          setCountryName(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng, geolocationPosition]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country: countryName,
      emoji,
      date,
      notes,
      position: { lat, lng },
      id: Math.floor(10000000 + Math.random() * 90000000),
    };
    await createCity(newCity);
    navigate("/app");
    setNotes("");
  }

  if (isLoadingGeocoding) return <Spinner />;
  // if (isLoadingGeocoding || isLoading) return <Spinner />;

  if (!lat || !lng) return <Message message={"Click to mark your travels on the map!"} />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input id="cityName" onChange={(e) => setCityName(e.target.value)} value={cityName} />
        <span className={styles.flag}>{flagemojiToPNG(emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input id="date" onChange={(e) => setDate(e.target.value)} value={date} /> */}
        <ReactDatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
