import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/login/login";
import Simulate from "../pages/simulation";
import ViewPort from "../components/viewPort/viewPort";
import DateDisplay from "../components/greet/date";
import TrafficInfo from "../components/traffic/traffic-info";
import TrafficEditBulk from "../components/traffic/traffic-edit-bulk";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Simulate />,
        children: [
          {
            path: 'dashboard/',
            element: <>
              <DateDisplay />
              <ViewPort />
            </>,
          },
          {
            path: 'ports/',
            element: <ViewPort />,
          },
          {
            path: 'traffic-info/',
            element: <>
              <TrafficEditBulk />
              <TrafficInfo />
            </>,
          }
        ],
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
