import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/login/login";
import Simulate from "../pages/simulation";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Simulate />
      },
      {
        path: 'user/',
        element: <Login />
      },
    ]
  }
]);

export default function AppRouterProvider() {
  return <RouterProvider router={router} />
};
