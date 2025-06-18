import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArrivalPage from "./pages/stage/Arrival";
import HostelPage from "./pages/stage/Hostel";
import DocumentsPage from "./pages/stage/Documents";
import KitPage from "./pages/stage/Kit";
import ArrivalScan from "./pages/scan/ArrivalScan";
import HostelScan from "./pages/scan/HostelScan";
import DocumentsScan from "./pages/scan/DocumentsScan";
import KitScan from "./pages/scan/KitScan";
import SendQR from "./pages/SendQR";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import PageTransition from "./components/PageTransition";

// Component to handle automatic redirection for authenticated users
const AuthRedirect = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTransition>
          <Routes>
            <Route 
              path="/" 
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Stage Landing Pages */}
            <Route
              path="/arrival"
              element={
                <ProtectedRoute>
                  <ArrivalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hostel"
              element={
                <ProtectedRoute>
                  <HostelPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kit"
              element={
                <ProtectedRoute>
                  <KitPage />
                </ProtectedRoute>
              }
            />

            {/* Scanner Tabs */}
            <Route
              path="/arrival/scan"
              element={
                <ProtectedRoute>
                  <ArrivalScan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hostel/scan"
              element={
                <ProtectedRoute>
                  <HostelScan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/scan"
              element={
                <ProtectedRoute>
                  <DocumentsScan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kit/scan"
              element={
                <ProtectedRoute>
                  <KitScan />
                </ProtectedRoute>
              }
            />

            {/* QR Mailer Page */}
            <Route
              path="/sendqr"
              element={
                <ProtectedRoute>
                  <SendQR />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to dashboard if authenticated, otherwise to login */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
