import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./app/home/index";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./app/auth/login/index";
import Signup from "./app/auth/signup";
import PageTwo from "./app/details/pageTwo";
import PageThree from "./app/details/pageThree";
import PageOne from "./app/details/pageOne";
import PageFour from "./app/details/pageFour";
import PageFive from "./app/details/pageFive";
import PageSix from "./app/details/pageSix";
import Payment from "./app/payment";
import PaidRoute from "./utils/utils";
import Pending from "./app/pending";
import Boys from "./app/boys";
import Girls from "./app/girls";
import Contact from "./app/contact";
import About from "./app/about";
import UserDetialsPage from "./app/modal/userDetail";
import Profile from "./app/profile";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/details-1"
            element={
              <PrivateRoute>
                <PageOne />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PaidRoute>
                <Home />
              </PaidRoute>
            }
          />
          <Route
            path="/details-2"
            element={
              <PrivateRoute>
                <PageTwo />
              </PrivateRoute>
            }
          />
          <Route
            path="/details-3"
            element={
              <PrivateRoute>
                <PageThree />
              </PrivateRoute>
            }
          />
          <Route
            path="/details-4"
            element={
              <PrivateRoute>
                <PageFour />
              </PrivateRoute>
            }
          />
          <Route
            path="/details-5"
            element={
              <PrivateRoute>
                <PageFive />
              </PrivateRoute>
            }
          />
          <Route
            path="/details-6"
            element={
              <PrivateRoute>
                <PageSix />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/pending"
            element={
              <PrivateRoute>
                <Pending />
              </PrivateRoute>
            }
          />
          <Route
            path="/male"
            element={
              <PrivateRoute>
                <Boys />
              </PrivateRoute>
            }
          />
          <Route
            path="/female"
            element={
              <PrivateRoute>
                <Girls />
              </PrivateRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <Contact />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <PrivateRoute>
                <UserDetialsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
