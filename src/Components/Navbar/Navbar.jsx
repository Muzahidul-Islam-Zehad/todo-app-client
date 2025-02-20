import { GoHome } from "react-icons/go";
import { MdOutlineAddTask } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
    const {pathname} = useLocation();
    return (
        <div className="bg-[#7B2CBF] shadow-md">
            <div className="navbar w-11/12 mx-auto py-2">
                {/* Logo */}
                <div className="flex-1">
                    <a className="text-2xl font-bold text-white tracking-wide">TaskTrek</a>
                </div>

                {/* Search & Profile */}
                <div className="flex gap-6 items-center">
                    {/* Search Bar */}
                    {/* <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-24 md:w-40 bg-[#00A6FB] text-white placeholder-white border-none focus:ring-2 focus:ring-[#FF006E] transition-all"
                    /> */}
                    <ul className="flex items-center text-white">
                        <NavLink to={'/'} className={` ${pathname === '/' ? `hidden`: `block`}`}><div className="flex gap-1 items-center text-lg"><span><GoHome /></span> <p>Home</p></div></NavLink>
                        <NavLink to={'/add-task'} className={`${pathname === '/add-task' ? `hidden`: `block`}`}><div className="flex gap-1 items-center text-lg"><span><MdOutlineAddTask /></span> <p>Add Task</p></div></NavLink>
                    </ul>

                    {/* Profile Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar border-2 border-[#FF006E] hover:border-[#00F5A0] transition-all"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Profile"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 w-52 p-2 shadow bg-[#E6E6FA] text-[#121212] rounded-box z-10"
                        >
                            <li>
                                <a className="hover:bg-[#FF006E] hover:text-white transition-all">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="hover:bg-[#FF006E] hover:text-white transition-all">
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a className="hover:bg-[#FF006E] hover:text-white transition-all">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
