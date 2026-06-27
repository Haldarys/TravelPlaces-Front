import { Routes, Route, Navigate } from "react-router-dom";
import LocationCreate from "./pages/LocationCreate";
import LocationList from "./pages/LocationList";
import Location from "./pages/Location";
import NavBar from "./components/navbar";
import LocationEdit from "./pages/LocationEdit";
import AdminLayout from "./components/layout/AdminLayout";
import FullscreenLayout from "./components/layout/FullscreenLayout";
import Explore from "./pages/Explore";
import { ToastContainer, Slide } from "react-toastify";
import { IconContext } from "@phosphor-icons/react";

function App() {
  return (
    <>
      <IconContext.Provider
        value={{
          size: 16,
          weight: "bold",
        }}
      >
        <div className="h-screen w-screen flex flex-col">
          <header>
            {/* Navigation simple */}
            <NavBar></NavBar>
          </header>

          <main
            className="flex flex-col items-center flex-1
        bg-[url(/src/assets/background_world_map.png)] bg-cover bg-center
        "
          >
            <Routes>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/locations" replace />} />
                <Route path="/locations" element={<LocationList />} />
                <Route path="/locations/new" element={<LocationCreate />} />
                <Route path="/locations/:id" element={<Location />} />
                <Route path="/locations/:id/edit/" element={<LocationEdit />} />
              </Route>
              <Route element={<FullscreenLayout />}>
                <Route path="/explore" element={<Explore />} />
              </Route>
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            closeOnClick={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
          />
        </div>
      </IconContext.Provider>
    </>
  );
}

export default App;
