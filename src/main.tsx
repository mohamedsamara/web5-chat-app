import ReactDOM from "react-dom/client";

import "./index.css";
import { Web5Provider } from "lib/contexts";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web5Provider>
    <App />
  </Web5Provider>
);
