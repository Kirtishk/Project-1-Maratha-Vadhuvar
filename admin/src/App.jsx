import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./app/home/index";
import Users from "./app/users/index";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLogin from "./app/auth/login";

// PrivateRoute ensures only logged-in admin can access
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// AppContent handles layout
function AppContent() {
  const location = useLocation();

  // Hide sidebar on login page
  const showSidebar = location.pathname !== "/login";

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
