import axios from "axios";

const useAxiosPublic = () => {

    const axiosPublic = axios.create({
        baseURL: `${import.meta.env.VITE_baseURL}`
    })

    return axiosPublic;
};

export default useAxiosPublic;