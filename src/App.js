import logo from "./logo.svg";
import "./App.css";

import AppRouter from "./components/AppRouter";
import { AuthProvider } from "./Contexts/AuthContext";
import { AlertProvider } from "./Contexts/AlertContext";
import GlobalAlert from "./components/GlobalAlert"

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AlertProvider>
          <GlobalAlert />
          <AppRouter />
        </AlertProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
