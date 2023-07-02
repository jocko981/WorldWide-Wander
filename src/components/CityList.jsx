import styles from "./CityList.module.css";

import { useCitiesContext } from "../contexts/CitiesContext";

import Spinner from "./Spinner";
import Message from "./Message";
import CityItem from "./CityItem";

function CityList() {
  const { isLoading, cities } = useCitiesContext();

  if (isLoading) return <Spinner />;
  if (!cities) return <Message message="Error msg if there no Cities, if they are NUll in database" />;
  if (Array.isArray(cities) && !cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
