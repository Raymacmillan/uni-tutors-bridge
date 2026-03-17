import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RootLayout from "./components/layout/RootLayout";
import Dashboard from "./pages/Dashboard";
import Book from "./pages/Book";
import TutorDetail from "./pages/TutorDetail";
import Welcome from "./pages/Welcome";
import UpdatePassword from "./pages/UpdatePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "welcome", element: <Welcome /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "book/:id", element: <Book /> },
      { path: "tutor/:id", element: <TutorDetail /> },
      { path: "update-password", element: <UpdatePassword /> }
    ],
  },
]);
