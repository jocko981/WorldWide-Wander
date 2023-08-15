import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { CitiesContextProvider } from "./contexts/CitiesContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CityList from "./components/CityList";
import City from "./components/City";
import CountryList from "./components/CountryList";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import PageNotFound from "./pages/PageNotFound";
// import Product from "./pages/Product";
// import Login from "./pages/Login";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import AppLayout from "./pages/AppLayout";

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Product = lazy(() => import("./pages/Product"));
const Login = lazy(() => import("./pages/Login"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Homepage = lazy(() => import("./pages/Homepage"));
const AppLayout = lazy(() => import("./pages/AppLayout"));

function App() {
  return (
    <AuthContextProvider>
      <CitiesContextProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="cities" element={<CityList />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesContextProvider>
    </AuthContextProvider>
  );
}

export default App;
