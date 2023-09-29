import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <div>Children element</div>
      }
    ]
  }
]);

export default function AppRouterProvider() {
  return <RouterProvider router={router} />
};
