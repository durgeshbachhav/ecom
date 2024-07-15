import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const VerifyEmailPage = () => {
     const [token, setToken] = useState("");
     const [verified, setVerified] = useState(false);
     const [error, setError] = useState(false);


     const verifyUserEmail = async () => {
          try {
               const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/user/verify-email`, { token })
               console.log('res', res);
               setVerified(true);
          } catch (error) {
               setError(true);
               console.log(error);

          }

     }

     useEffect(() => {
          const urlToken = window.location.search.split("=")[1];
          setToken(urlToken || "");
     }, []);
     useEffect(() => {
          if (token.length > 0) {
               verifyUserEmail();
          }
     }, [token]);

     return (
          <div className="flex flex-col items-center justify-center min-h-screen py-2">
               <h1 className="text-4xl">Verify Email</h1>
               <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>
               {verified && (
                    <div>
                         <h2 className="text-2xl">Email Verified</h2>
                         <Link to="/login">
                              Login
                         </Link>
                    </div>
               )}
               {error && (
                    <div>
                         <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    </div>
               )}
          </div>
     )
};

export default VerifyEmailPage;
