import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {

    const { googleSignIn, setIsloading } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const handleGoogleSignIn = async () => {
        // console.log("Google Sign-In Clicked");
        // Implement Google sign-in logic here

        try {
            const { user } = await googleSignIn();
            const userData = {
                name: user.displayName,
                email: user.email
            }

            await axiosPublic.post('/user', userData);
            // console.log(data);

            navigate('/todo');

        }
        catch (err) {
            console.log(err);
        }
        finally {
            setIsloading(false);
        }

    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[url(https://i.ibb.co.com/DfH0MpyC/19187761.jpg)] bg-cover">
            <div className="w-[450px] p-10 bg-white rounded-2xl shadow-2xl text-center">
                {/* Logo & Branding */}
                <h1 className="text-4xl font-extrabold text-[#7B2CBF]">Task<span className="text-[#ff71a5]">Trek</span></h1>
                <p className="text-[#444] text-lg mt-2">
                    Organize your work efficiently, boost productivity.
                </p>

                {/* Welcome Text */}
                <h2 className="text-2xl font-semibold text-[#7B2CBF] mt-6">Welcome</h2>
                <p className="text-[#666] text-md mb-8">Sign in to access your task board.</p>

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-3 btn w-full bg-[#7B2CBF] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#ff71a5] transition-all"
                >
                    <FcGoogle className="text-2xl" />
                    Continue with Google
                </button>

                {/* Footer Text */}
                <p className="text-sm text-[#777] mt-6">
                    By signing in, you agree to our{" "}
                    <span className="text-[#7B2CBF] font-medium cursor-pointer">Terms of Service</span> &{" "}
                    <span className="text-[#7B2CBF] font-medium cursor-pointer">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
};

export default SignIn;
