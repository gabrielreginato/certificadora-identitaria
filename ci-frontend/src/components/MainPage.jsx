import { OficinasGrid } from "./OficinasGrid";
import { PageProvider } from "../contexts/MainContext";
import { Header } from "./header/Header";
import { PageNavigator } from "./PageNavigator";
import './style.css';

export function MainPage() {
    return <div className="body">
        <PageProvider>
            <Header />
            <OficinasGrid />
            {/* <PageNavigator /> */}
        </PageProvider>
    </div>
}