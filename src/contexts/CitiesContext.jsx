import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialState = {
  isLoading: false,
  cities: null,
  currentCity: null,
  error: "",
};

function reducer(currState, action) {
  switch (action.type) {
    case "loading":
      return { ...currState, isLoading: true };

    case "rejected":
      return { ...currState, isLoading: false, error: action.payload };
    // cities
    case "cities/loaded":
      return { ...currState, isLoading: false, cities: action.payload };
    // 1 city
    case "city/loaded":
      const currentCityData = currState.cities?.find(
        (c) => c.id.toString() === action.payload.toString()
      );
      if (currentCityData === undefined)
        return { ...currState, isLoading: false, currentCity: null };
      return { ...currState, isLoading: false, currentCity: currentCityData };

    case "city/created":
      return {
        ...currState,
        isLoading: false,
        cities: [...currState.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...currState,
        isLoading: false,
        cities: currState.cities.filter((city) => city.id != action.payload),
        currentCity: null,
      };

    default:
      throw new Error("Unknown action type for CitiesContext");
  }
}

function CitiesContextProvider({ children }) {
  const [{ isLoading, cities, currentCity, error }, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      setTimeout(async () => {
        try {
          const res = await fetch("/data/cities.json");
          const data = await res.json();

          dispatch({ type: "cities/loaded", payload: data.cities });
        } catch (err) {
          dispatch({ type: "rejected", payload: "Error fetching cities data:" + err });
          throw new Error("Error fetching cities data:", err);
        }
      }, 600);
    }
    fetchCities();

    return () => clearTimeout();
  }, []);

  // memoize value that is used in the dependency array of another hook
  // (useEffect) in City.jsx to prevent infinite loops
  const getCity = useCallback(async function getCity(cityId) {
    // if (cityId == currentCity?.id) return; //don't want this to remember last current city if visiting it again in url
    dispatch({ type: "loading" });

    setTimeout(async () => {
      try {
        // const res = await fetch("../../public/data/cities.json");
        // const data = await res.json();
        // const currentCityData = await data.cities.find((c) => c.id.toString() === cityId.toString());

        // if (currentCityData === undefined) setCurrentCity(null);
        // setCurrentCity(currentCityData);

        dispatch({ type: "city/loaded", payload: cityId });
      } catch (err) {
        dispatch({ type: "rejected", payload: "Error fetching single city data:" + err });
        throw new Error("Error fetching single city data:", err);
      }
    }, 600);
  }, []);

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    setTimeout(async () => {
      try {
        // const res = await fetch("../../public/data/cities.json", {
        //   method: "POST",
        //   body: JSON.stringify(newCity),
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        // const data = await res.json();
        // console.log(data);
        // setCities((cities) => [...cities, data]);
        //Note: re-fetch, add newCity to our state for re-fetch

        dispatch({ type: "city/created", payload: newCity });
      } catch (err) {
        dispatch({ type: "rejected", payload: "Error creating new city data:" + err });
        throw new Error("Error creating new city data:", err);
      }
    }, 600);
  }

  async function deleteCity(cityId) {
    dispatch({ type: "loading" });

    setTimeout(async () => {
      try {
        // const res = await fetch("../../public/data/cities.json/${cityId}", {
        //   method: "DELETE",
        // });
        // no need to store response variable
        // setCities((cities) => cities.filter((city) => city.id != cityId));
        dispatch({ type: "city/deleted", payload: cityId });
      } catch (err) {
        dispatch({ type: "rejected", payload: "Error deleting a city data:" + err });
        throw new Error("Error deleting a city data:", err);
      }
    }, 600);
  }

  return (
    <CitiesContext.Provider
      value={{ isLoading, error, cities, currentCity, getCity, createCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCitiesContext() {
  const contextValue = useContext(CitiesContext);
  if (contextValue === undefined)
    throw new Error("CitiesContext was used outside of the <CitiesContextProvider>");

  return contextValue;
}

export { CitiesContextProvider, useCitiesContext };
