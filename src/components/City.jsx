import { useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./City.module.css";

import { useCitiesContext } from "../contexts/CitiesContext";
import { formatDateWeekday } from "../helpers";

import Spinner from "./Spinner";
import Message from "./Message";
import BackButton from "./BackButton";

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />;
};

function City() {
  const { id } = useParams();
  const { isLoading, getCity, currentCity } = useCitiesContext();

  useEffect(
    function () {
      getCity(id);
      //don't add getCity() to dependency array
    },
    [id, getCity]
  );

  if (isLoading) return <Spinner />;
  if (!currentCity)
    return (
      <Message message="No data for this location, add your travels by clicking on the map." />
    );

  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{flagemojiToPNG(emoji)}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDateWeekday(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a href={`https://en.wikipedia.org/wiki/${cityName}`} target="_blank" rel="noreferrer">
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
