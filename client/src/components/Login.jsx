import React, { useState, useEffect,useRef } from "react";
import "../index.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mosquelogo from "../assets/mosque-svgrepo-com (1).svg";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user + " " + role);
    if (user) {
      navigate("/homeMM");
    }
  }, [user, navigate]);


  // Browser check ends

// let initOption = {
//   url: (isChina)? "https://one-teleport.cftest7.com/auth/": "https://"+process.env.REACT_APP_TELEPORT_ENV+".teleport.asia/auth/",
//   realm: "ONE-Teleport",
//   clientId: "Lane-management",
//   onLoad: "login-required",
//   //checkLoginIframe: false,
//     redirectUri: (isChina) ? "https://one-teleport.cftest7.com/back-office/#/Dashboard" : "https://"+process.env.REACT_APP_TELEPORT_ENV+".teleport.asia/back-office/#/Dashboard",
//     responseMode: 'query',  
// };
// const keycloak = new Keycloak(initOption);
// console.log(keycloak,keycloak?.token,"init keycl")
// keycloak
// .init({
//   onLoad: initOption.onLoad,
// })
// .then((auth) => {
// console.log("keycloak url","https://"+process.env.REACT_APP_TELEPORT_ENV+".teleport.asia/lane-management/#/Dashboard")
//   if (!auth) {
//     console.log("Not authenticated.");
//   } else {

//     console.log("Authenticated.");

//     console.log(keycloak);
// if(keycloak && keycloak.idTokenParsed)
// {
//   cookies.set('username', keycloak.idTokenParsed.preferred_username, { path: '/' });
//   cookies.set('hubCodes', keycloak.idTokenParsed.hubCodes, { path: '/' });
//   cookies.set('countries', keycloak.idTokenParsed.countries, { path: '/'});

//   userTrack(
//     keycloak.idTokenParsed.sub,
//     keycloak.idTokenParsed.name,
//     keycloak.idTokenParsed.given_name,
//     keycloak.idTokenParsed.family_name,
//     keycloak.idTokenParsed.email,
//   );

// }
// cookies.set('tokenOneTeleport', keycloak.token, { path: '/' });
//   }
//   let tokenExpTime = 99999;
//   if (keycloak && keycloak.idTokenParsed?.exp) {
//     tokenExpTime =
//       (keycloak.idTokenParsed.exp - keycloak.idTokenParsed.iat) * 60;
//   }
//   setInterval(function () {
//     keycloak
//       .updateToken(180)
//       .then((refreshed) => {
//         console.log("refreshed Token" , refreshed, keycloak);
//         if(refreshed)
//         cookies.set('tokenOneTeleport', keycloak.token, { path: '/' });
//        // else  keycloak.logout()
//       })
//       .catch(function () {
//         keycloak.logout()
//         console.log("Failed to refresh token");
//       });
//   }, tokenExpTime);
// });

console.log("hi")
  const handleSignUpClick = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Select Role",
      text: "Please select your role for registration",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "User",
      cancelButtonText: "Cancel",
      showDenyButton: true,
      showCloseButton: true,
      denyButtonText: "Admin",
      footer:
        '<button id="superAdminBtn" class="swal2-deny" style="margin: 0 0.5em">Super Admin</button>',
      didOpen: () => {
        document
          .getElementById("superAdminBtn")
          .addEventListener("click", () => {
            Swal.close();
            navigate("/signup/super-admin");
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/signup/user");
      } else if (result.isDenied) {
        navigate("/signup/admin");
      }
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login Failed", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-bl from-violet-500 to-fuchsia-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 sm:p-8">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="w-8 h-8 mr-2" src={mosquelogo} alt="logo" />
            Masyarakat Masjid
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex border-spacing-0 items-center text-gray-500 bg-transparent hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don't have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    onClick={handleSignUpClick}
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Login;
