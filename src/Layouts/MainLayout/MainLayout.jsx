import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

const MainLayout = () => {
    return (
        <div>
            <div className="sticky top-0">
                <Navbar></Navbar>
            </div>
            <div className="min-h-screen">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default MainLayout;