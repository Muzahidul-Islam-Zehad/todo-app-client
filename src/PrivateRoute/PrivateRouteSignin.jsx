import PropTypes from "prop-types";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider/AuthProvider";

const PrivateRouteSignin = ({children}) => {
    const {user, isLoading} = useContext(AuthContext);

    if(isLoading)
    {
        return <LoadingSpinner></LoadingSpinner>
    }

    if(!user?.email)
    {
        return <Navigate to={'/'}></Navigate>
    }
    return (
        <div>
            {
                children
            }
        </div>
    );
};

PrivateRouteSignin.propTypes ={
    children: PropTypes.element
}

export default PrivateRouteSignin;