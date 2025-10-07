import { useRoutes } from "react-router";
import App from "../App";
import Home from "../pages/home";

function Router() {
  const routes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
