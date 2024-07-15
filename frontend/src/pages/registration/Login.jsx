import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/store/slices/UserSlice"

export function LoginForm() {
     const [password, setPassword] = useState("");
     const [email, setEmail] = useState("");
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const handleLoginForm = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          const userData = { email, password };

          try {
               const response = await dispatch(loginUser(userData)).unwrap();
               console.log('response after login ', response);
               const { accessToken, refreshToken } = response;

               // Store tokens in local storage
               localStorage.setItem('accessToken', accessToken);
               localStorage.setItem('refreshToken', refreshToken);

               // Store accessToken in cookies
               document.cookie = `accessToken=${accessToken}; path=/; secure; HttpOnly`;
               navigate('/');
          } catch (err) {
               setError(err.message || 'Failed to login');
          } finally {
               setLoading(false);
          }
     };

     const handleGoogleLogin = () => {
          window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/google`;
     };

     return (
          <Card className="mx-auto max-w-sm mt-6">
               <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                         Enter your email below to login to your account
                    </CardDescription>
               </CardHeader>
               <CardContent>
                    <form onSubmit={handleLoginForm} className="grid gap-4">
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
                              <div className="flex items-center">
                                   <Label htmlFor="password">Password</Label>
                                   <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                   </Link>
                              </div>
                              <Input
                                   id="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   type="password"
                                   required
                              />
                         </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                         <Button type="submit" className="w-full" disabled={loading}>
                              {loading ? 'Logging in...' : 'Login'}
                         </Button>
                    </form>
                    <Button onClick={handleGoogleLogin} variant="outline" className="w-full mt-4">
                         Login with Google
                    </Button>
                    <div className="mt-4 text-center text-sm">
                         Don&apos;t have an account?{" "}
                         <Link to={`/signup`} className="underline">
                              Sign up
                         </Link>
                    </div>
               </CardContent>
          </Card>
     )
}