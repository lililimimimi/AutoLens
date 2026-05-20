// AutoLens — App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Recommend from "./pages/Recommend";
import CustomerService from "./pages/CustomerService";
import Compare from "./pages/Compare";
import CustomerManagement from "./pages/CustomerManagement";
import VehicleManagement from "./pages/VehicleManagement";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div
        className="app-shell"
        style={{ display: "flex", minHeight: "100vh", background: "#f5f5f0" }}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="mobile-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main
          className="app-main"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "32px 40px",
            boxSizing: "border-box",
            marginLeft: 220,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/vehicles" element={<VehicleManagement />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
