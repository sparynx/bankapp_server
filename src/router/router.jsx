import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Register from "../component/Register";
import Login from "../component/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import TransferPage from "../pages/TransferPage";
import TransactionHistory from "../pages/TransactionHistory";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/register",
                element: <Register/>
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/dashboard",
                element: <Dashboard/>
            },
            {
                path: "/profile",
                element: <Profile/>
            }, 
            {
                path: "/transfer",
                element: <TransferPage/>
            },
            {
                path: "/history",
                element: <TransactionHistory/>
            }
        ]
    }
]);


export default router;