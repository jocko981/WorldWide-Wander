import { Link } from "react-router-dom";

import styles from "./CityItem.module.css";

import { useCitiesContext } from "../contexts/CitiesContext";
import { convertToEmoji, formatDate } from "../helpers";

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCitiesContext();
  const {
    position: { lat, lng },
    id,
    cityName,
    emoji,
    date,
  } = city;

  function handleDeleteClick(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id.toString() === currentCity?.id.toString() ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{convertToEmoji(emoji)}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDeleteClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
