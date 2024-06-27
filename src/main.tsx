import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { Web5Provider } from "lib/contexts";
import Root from "pages/Root";
import ChatPage from "@/pages/ChatPage";
import ErrorPage from "pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "chats/:chatId",
        element: <ChatPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web5Provider>
    <RouterProvider router={router} />
  </Web5Provider>
);
