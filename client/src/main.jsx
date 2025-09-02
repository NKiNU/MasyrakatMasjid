import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import Keycloak from "keycloak-js";
import Cookies from "universal-cookie";

  const cookies = new Cookies();
    const keycloak = new Keycloak({
      url: "http://localhost:8080/",
      realm: "MM2",
      clientId: "mmClient",
    });

    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        redirectUri:"http://localhost:5173/homeMM",
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        if (authenticated) {
          try {
            cookies.set("MM", keycloak.token, {path:"/"})
            cookies.set("username", keycloak.idTokenParsed.given_name,{ path:"/" })
            const roles = keycloak.tokenParsed?.resource_access?.['mmClient']?.roles[0] || [];
            cookies.set("role", JSON.stringify(roles), { path: "/" });
          } catch (error) {
            console.error("Failed to decode JWT:", error);
          }
        }
      }).catch((error) => {
        console.error("Keycloak initialization error:", error);
      });

          ReactDOM.createRoot(document.getElementById("root")).render(
            <AuthProvider>
              <App keycloak={keycloak}/>
            </AuthProvider>
          );