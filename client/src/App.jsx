import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";
import JobMarketplace from "./components/JobMarketplace";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute> <Marketplace /> </ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<JobMarketplace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;