import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider/AuthProvider";
import {  Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";

const PrivateRoute = ({children}) => {
    const {user, isLoading} = useContext(AuthContext);

    if(isLoading)
    {
        return <LoadingSpinner></LoadingSpinner>
    }

    if(user?.email)
    {
        return <Navigate to={'/todo'}></Navigate>
    }
    return (
        <div>
            {
                children
            }
        </div>
    );
};

PrivateRoute.propTypes ={
    children: PropTypes.element
}

export default PrivateRoute;