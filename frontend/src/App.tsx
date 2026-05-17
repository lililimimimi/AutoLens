// AutoLens — App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Recommend from "./pages/Recommend";
import CustomerService from "./pages/CustomerService";
import Compare from "./pages/Compare";
import CustomerManagement from "./pages/CustomerManagement";
import VehicleManagement from "./pages/VehicleManagement";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f5f5f0" }}
      >
        <Sidebar />
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: "32px 40px",
            boxSizing: "border-box",
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
