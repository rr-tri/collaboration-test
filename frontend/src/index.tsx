import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/404";
import DrawingBoard from "./components/Board";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="sign-in"
      signUpUrl="sign-up"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/sign-in/*" element={<Login />} />
          <Route path="/sign-up/*" element={<Register />} />
          <Route path="/board" element={<DrawingBoard />} />
          <Route  path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
      
    </ClerkProvider>
  </React.StrictMode>
);
