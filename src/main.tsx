import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Web5Provider } from "./lib/contexts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web5Provider>
    <App />
  </Web5Provider>
);
