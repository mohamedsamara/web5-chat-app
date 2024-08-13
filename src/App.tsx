import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useProfile } from "lib/hooks";
import Chats from "pages/Chats";
import Chat from "pages/Chat";
import ChatSettings from "pages/ChatSettings";
import NoMatch from "pages/NoMatch";
import Profile from "pages/Profile";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Modals from "components/Modals";
import SpinnerOverlay from "components/SpinnerOverlay";

const App = () => {
  const { fetchProfile, profileFetched } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profileFetched) return <SpinnerOverlay />;

  return (
    <>
      <Modals />
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/create-profile" element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/chats" />} />
            <Route path="chats" element={<Chats />}>
              <Route path=":chatUid" element={<Chat />} />
              <Route path=":chatUid/settings" element={<ChatSettings />} />
            </Route>
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
