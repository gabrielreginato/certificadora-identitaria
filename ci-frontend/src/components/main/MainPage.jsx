import { OficinasGrid } from "./OficinasGrid";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { PageNavigator } from "./PageNavigator";
import "../style.css";

import { usePageContext } from "../../contexts/MainContext";

export function MainPage() {
  const { state } = usePageContext();

  return (
    <div className="body">
      <div className="app-main">
        <Header page="main" />
        <div className="main">
          <OficinasGrid oficinas={state.oficinas} />
        </div>
        {/* <PageNavigator /> */}
        <Footer />
      </div>
    </div>
  );
}
