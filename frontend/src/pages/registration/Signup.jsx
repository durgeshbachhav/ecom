import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/slices/UserSlice";

export function SignupForm() {
     const [password, setPassword] = useState("");
     const [email, setEmail] = useState("");
     const [fullName, setFullName] = useState("");
     const [avatar, setAvatar] = useState(null);

     const [phone, setPhone] = useState("");

     // for display purposes only in signup form
     const [avatarImageUrl, setAvatarImageUrl] = useState(null);

     const [loading, setLoading] = useState(false)
     const [error, setError] = useState("")

     const dispatch = useDispatch();

     const navigate = useNavigate();

     const handleSignupForm = async (e) => {
          e.preventDefault();
          setLoading(true)
          const userData = new FormData();
          userData.append("fullName", fullName);
          userData.append("email", email);
          userData.append("password", password);

          userData.append("phone", phone);
          if (avatar) userData.append("avatar", avatar);


          dispatch(registerUser(userData))
               .then((response) => {
                    console.log('response after registration ', response)
                    if (response.meta.requestStatus === "fulfilled") {
                         navigate('/login')
                    }
               })

          setLoading(false);

     };

     const handleAvatarChange = (e) => {
          const file = e.target.files[0];
          setAvatar(file);
          setAvatarImageUrl(URL.createObjectURL(file));
     };

     const handleGoogleLogin = () => {
          window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/google`;
     };

     return (
          <Card className="mx-auto max-w-sm my-auto mt-6">
               <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                         Enter your information to create an account
                    </CardDescription>
               </CardHeader>
               <CardContent>
                    <form onSubmit={handleSignupForm} className="grid gap-4">
                         <div>
                              <Label>Avatar</Label>
                              <button
                                   type="button"
                                   className="flex items-center justify-center h-20 w-full rounded-md border border-dashed"
                                   onClick={() => document.getElementById("avatarInput").click()}
                              >
                                   {avatarImageUrl ? (
                                        <img className="h-20 rounded-full flex items-center justify-center p-4" src={avatarImageUrl} alt="" />
                                   ) : (
                                        <>
                                             <Upload className="h-4 w-4 mr-2" />
                                             <span className="sr-only">Upload Avatar</span>
                                        </>
                                   )}
                              </button>
                              <input
                                   id="avatarInput"
                                   type="file"
                                   className="hidden"
                                   onChange={handleAvatarChange}
                              />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                   <Label htmlFor="phone">Phone</Label>
                                   <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}

                                        required
                                   />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="full-name">Full name</Label>
                                   <Input
                                        id="full-name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                   />
                              </div>
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                   id="email"
                                   type="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   required
                              />
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                   id="password"
                                   type="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   required
                              />
                         </div>


                         {error && <p className="text-red-500">{error}</p>}
                         <Button type="submit" className="w-full" disabled={loading}>
                              {loading ? "Creating account..." : "Create an account"}
                         </Button>


                    </form>
                    <Button onClick={handleGoogleLogin} variant="outline" className="w-full mt-4">
                         Sign up with Google
                    </Button>
                    <div className="mt-4 text-center text-sm">
                         Already have an account?{" "}
                         <Link to="/login" className="underline">
                              Log in
                         </Link>
                    </div>
               </CardContent>
          </Card>
     );
}
