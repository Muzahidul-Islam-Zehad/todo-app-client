import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Home from "../Pages/Home";
import AddTask from "../Pages/AddTask/AddTask";
import SignIn from "../Pages/SignIn/SignIn";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import PrivateRouteSignin from "../PrivateRoute/PrivateRouteSignin";

const router = createBrowserRouter([
    {
        path:'/',
        element: <PrivateRoute><SignIn></SignIn></PrivateRoute>
    },
    {
        path:'/todo',
        element: <PrivateRouteSignin><MainLayout></MainLayout></PrivateRouteSignin>,
        children: [
            {
                path:'/todo',
                element:<Home></Home>
            },
            {
                path: '/todo/add-task',
                element: <AddTask></AddTask>
            }
        ]
    },
])

export default router;