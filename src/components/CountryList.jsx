import styles from "./CountryList.module.css";

import { useCitiesContext } from "../contexts/CitiesContext";

import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";

function CountryList() {
  const { isLoading, cities } = useCitiesContext();

  if (isLoading) return <Spinner />;
  if (!cities) return <Message message="Error msg if there no Cities, if they are NUll in database" />;
  if (Array.isArray(cities) && !cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  const uniqueCountries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji, id: city.id }];
    } else return arr;
  }, []);
  // in this initialValue=[] we will store the new unique Objects
  // probaj sa .push() dal ce radi !!! i probaj bez initialValue=[]
  return (
    <ul className={styles.countryList}>
      {uniqueCountries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
