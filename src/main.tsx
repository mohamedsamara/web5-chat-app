import ReactDOM from "react-dom/client";

import "./index.css";
import { Web5Provider } from "lib/contexts";
import App from "./App";

// const dbs = await window.indexedDB.databases();
// dbs.forEach((db) => {
//   window.indexedDB.deleteDatabase(db.name);
// });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web5Provider>
    <App />
  </Web5Provider>
);
