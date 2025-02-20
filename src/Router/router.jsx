import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Home from "../Pages/Home";
import AddTask from "../Pages/AddTask/AddTask";

const router = createBrowserRouter([
    {
        path:'/',
        element: <MainLayout></MainLayout>,
        children: [
            {
                path:'/',
                element:<Home></Home>
            },
            {
                path: '/add-task',
                element: <AddTask></AddTask>
            }
        ]
    }
])

export default router;