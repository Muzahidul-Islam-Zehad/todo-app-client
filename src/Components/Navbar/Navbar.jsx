import { useContext } from "react";
import { GoHome } from "react-icons/go";
import { MdOutlineAddTask } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider/AuthProvider";

const Navbar = () => {
    const {pathname} = useLocation();
    const {user,userSignOut} = useContext(AuthContext);


    const handleSignOut = async() =>{

        try{
            await userSignOut();
        }
        catch(err)
        {
            console.log(err);
        }
    }

    return (
        <div className="bg-[#7B2CBF] shadow-md">
            <div className="navbar w-11/12 mx-auto py-2">
                {/* Logo */}
                <div className="flex-1">
                    <a className="text-2xl font-bold text-white tracking-wide">Task<span className="text-[#ff71a5]">Trek</span></a>
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
                        <NavLink to={'/todo'} className={` border-b-2 rounded-l-lg rounded-r-lg px-1  ${pathname === '/todo' ? `hidden`: `block`}`}><div className=" flex gap-1 items-center text-xs md:text-lg"><span><GoHome /></span> <p>Home</p></div></NavLink>
                        <NavLink to={'/todo/add-task'} className={`border-b-2 rounded-l-lg rounded-r-lg px-1 ${pathname === '/todo/add-task' ? `hidden`: `block`}`}><div className="flex gap-1 items-center text-xs md:text-lg"><span><MdOutlineAddTask /></span> <p> Add Task</p></div></NavLink>
                    </ul>

                    {/* Profile Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar border-2 border-[#ff71a5] hover:border-[#00F5A0] transition-all"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Profile"
                                    src={user?.photoURL}
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 w-52 p-2 shadow bg-[#E6E6FA] text-[#121212] rounded-box z-10"
                        >
                            {/* <li>
                                <a className="hover:bg-[#FF006E] hover:text-white transition-all">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="hover:bg-[#FF006E] hover:text-white transition-all">
                                    Settings
                                </a>
                            </li> */}
                            <li className="">
                                <a onClick={handleSignOut} className="hover:bg-[#ff71a5] hover:text-white transition-all">
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
