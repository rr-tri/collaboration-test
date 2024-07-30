import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import { CollaborationProvider } from "@/context/collaborationCTX";
import App from "./App";

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <CollaborationProvider>
                <App />
              </CollaborationProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
