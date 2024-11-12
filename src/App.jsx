import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import "./sass/style.scss";
import publicRoutes from "./routes/publicRoutes";

function App() {
  return (
    <div className="App">
      <Header />
        <Routes>
          {publicRoutes.map((publicRoute, index) => {
            const Page = publicRoute.components;
            return (
              <Route 
                exact={publicRoute.exact} 
                key={index} 
                path={publicRoute.path}
                element={<Page />}
                >
              </Route>
            )
          })}

        </Routes>
      <Footer />
    </div>
  );
}

export default App;
