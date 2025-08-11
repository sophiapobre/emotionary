import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Timecapsule from "./pages/Timecapsule";
import NavigationBar from "./components/navigation";
import Insights from "./pages/Insights";
import Entries from "./pages/Entries";
import SearchResults from "./pages/SearchResults";
import Letter from "./pages/Letter";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntries } from "./features/entries/entriesSlice";
import { useEffect, useMemo, useState } from "react";
import { setUserId } from "./features/users/usersSlice";
import { Navigate } from "react-router-dom";
import { lightTheme, darkTheme } from "./utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { getKey } from "./utils/crypto";
import {
  ShepherdTourContext,
  shepherdTourInstance,
} from "./utils/tour/ShepherdContext";
import "shepherd.js/dist/css/shepherd.css";
import "./utils/tour/shepherd.css";

function MainLayout({ cryptoKey }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ShepherdTourContext.Provider value={shepherdTourInstance}>
        <NavigationBar />
        <Routes>
          <Route path="/dashboard" element={<Home cryptoKey={cryptoKey} />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/entries" element={<Entries cryptoKey={cryptoKey} />} />
          <Route
            path="/search"
            element={<SearchResults cryptoKey={cryptoKey} />}
          />
          <Route path="/timecapsule" element={<Timecapsule />} />
          <Route path="/write-letter" element={<Letter />} />
        </Routes>
      </ShepherdTourContext.Provider>
    </>
  );
}

function App() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  );
  const [cryptoKey, setCryptoKey] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    if (storedUserId && storedUserName && storedUserEmail) {
      dispatch(
        setUserId({
          userId: storedUserId,
          userName: storedUserName,
          userEmail: storedUserEmail,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchEntries());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    async function loadKey() {
      const key = await getKey();
      setCryptoKey(key);
    }
    loadKey();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing setCryptoKey={setCryptoKey} />} />
          <Route path="/*" element={<MainLayout cryptoKey={cryptoKey} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
