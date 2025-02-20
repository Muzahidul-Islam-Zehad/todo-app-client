import { useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const SignIn = () => {

    const { googleSignIn,} = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const handleGoogleSignIn = async () => {
        console.log("Google Sign-In Clicked");
        // Implement Google sign-in logic here

        try {
            const {user} =  await googleSignIn();
            const userData = {
                name : user.displayName,
                email : user.email
            }

            const {data} = await axiosPublic.post('/user', userData);
            console.log(data);

            navigate('/todo');

        }
        catch (err) {
            console.log(err);
        }
        finally {
            // setIsLoading(false);
        }

    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#7B2CBF] to-[#00A6FB]">
            <div className="w-[450px] p-10 bg-white rounded-2xl shadow-2xl text-center">
                {/* Logo & Branding */}
                <h1 className="text-4xl font-extrabold text-[#7B2CBF]">TaskTrek</h1>
                <p className="text-[#444] text-lg mt-2">
                    Organize your work efficiently, boost productivity.
                </p>

                {/* Welcome Text */}
                <h2 className="text-2xl font-semibold text-[#7B2CBF] mt-6">Welcome</h2>
                <p className="text-[#666] text-md mb-8">Sign in to access your task board.</p>

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-3 btn w-full bg-[#FF006E] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#D90452] transition-all"
                >
                    <FaGoogle className="text-2xl" />
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
