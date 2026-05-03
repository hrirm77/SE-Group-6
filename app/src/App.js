//COMMENT BY ELYAS!!!
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NutritionGoals from "./pages/NutritionGoals";
import ResetPassword from "./pages/ResetPassword";
import GroceryLists from "./pages/GroceryLists";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <div className="background-img"></div>
          <div className="page-overlay"></div>
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/NutritionGoals" element={<NutritionGoals />} />
              <Route path="/GroceryLists" element={<GroceryLists />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
