import { OficinasGrid } from "./OficinasGrid";
import { PageProvider } from "../../contexts/MainContext";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { PageNavigator } from "./PageNavigator";
import '../style.css';

export function MainPage() {
    return <div className="body">
        <PageProvider>
            <Header />
            <div className="main">
                <OficinasGrid />
            </div>
            {/* <PageNavigator /> */}
            <Footer />
        </PageProvider>
    </div>
}