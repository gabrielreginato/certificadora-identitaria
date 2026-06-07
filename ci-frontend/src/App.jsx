import "./App.css";
import { PageProvider } from "./contexts/MainContext";
import { MainPage } from "./components/main/MainPage";
import { PerfilPage } from "./components/perfil/PerfilPage";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/perfil",
    element: <PerfilPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

function App() {
  return (
    <PageProvider>
      <RouterProvider router={router} />
    </PageProvider>
  );
}

export default App;
