import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddLead from "./pages/AddLead";
import LeadDetails from "./pages/LeadDetails";
import Leads from "./pages/Leads";
import AI from "./pages/AI";
import Outreach from "./pages/Outreach";
import FollowUps from "./pages/FollowUps";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="leads/:leadId" element={<LeadDetails />} />
              <Route path="add-lead" element={<AddLead />} />
              <Route path="ai" element={<AI />} />
              <Route path="outreach" element={<Outreach />} />
              <Route path="follow-ups" element={<FollowUps />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
