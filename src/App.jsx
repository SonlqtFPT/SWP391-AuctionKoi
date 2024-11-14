import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/features/Home.jsx";
import AdminPage from "../src/features/admin/pages/index.jsx";
import { AuthProvider } from "./features/protectedRoutes/AuthContext.jsx";
import ProtectedRoute from "./features/protectedRoutes/ProtectedRoute.jsx";
import LoginPage from "./features/user/pages/Login.jsx";
import RegisterPage from "./features/user/pages/Register.jsx";
import StaffPage from "./features/staff/pages/index.jsx";
import Auction from "./features/auction/List-auction.jsx";
import Lot from "./features/lot/lot.jsx";
import Bid from "./features/bid/bid.jsx";
import PastAuction from "./features/past-auction/past-auction.jsx";
import Payment from "./payment/Payment.jsx";
import ForgotPassPage from "./features/user/pages/ForgotPassPage.jsx";
import ChangePassPage from "./features/user/pages/ChangePassPage.jsx";
import AddRequestPage from "./features/breeder/pages/AddRequestPage.jsx";
import BreederProfilePage from "./features/breeder/pages/BreederProfilePage.jsx";
import BreederProfileDetails from "./features/breeder/components/BreederProfileDetails.jsx";
import BreederRequest from "./features/breeder/components/BreederRequest.jsx";
import Upcommming from "./features/Upcomming-auction/Upcomming-auction.jsx";
import UpdateRequest from "./features/breeder/pages/UpdateRequestPage.jsx";
import BreederRequestDetailsPage from "./features/breeder/pages/BreederRequestDetailsPage.jsx";
import MemberProfilePage from "./features/user/pages/MemberProfilePage.jsx";
import MemberProfileDetails from "./features/user/components/MemberProfileDetails.jsx";
import UpdatePassword from "./features/user/components/UpdatePassword.jsx";
import PaymentSuccess from "./features/bid/components-bid/PaymentSuccess.jsx";
import AboutUs from "./features/user/pages/AboutUs.jsx";
import Saki from "./components/Farms/saki.jsx";
import Isa from "./components/Farms/Isa.jsx";
import Dainichi from "./components/Farms/dainichi.jsx";
import Marushin from "./components/Farms/marushin.jsx";
import Kanno from "./components/Farms/kanno.jsx";
import InvoiceList from "./features/user/components/InvoiceList.jsx";
import TransportDetail from "./features/staff/components/TransportDetail.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} /> {/* Home Page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page*/}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/lot/:auctionId" element={<Lot />} />
          <Route path="/bid/:lotId/:auctionId" element={<Bid />} />
          <Route path="/payment/:lotId" element={<Payment />} />
          <Route path="/upcomming" element={<Upcommming />} />
          <Route path="/auctioned" element={<PastAuction />} />
          <Route path="/forgotPass" element={<ForgotPassPage />} />
          <Route path="/reset-password" element={<ChangePassPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/saki" element={<Saki />} />
          <Route path="/isa" element={<Isa />} />
          <Route path="/dainichi" element={<Dainichi />} />
          <Route path="/marushin" element={<Marushin />} />
          <Route path="/kanno" element={<Kanno />} />
          {/* Protected Routes */}
          {/* Admin Page */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/viewrequestdetail/:requestId"></Route>
          {/* Member Page */}
          <Route
            path="/member/profile"
            element={
              <ProtectedRoute allowedRoles={["MEMBER"]}>
                <MemberProfilePage />
              </ProtectedRoute>
            }
          >
            <Route
              path="details" // Nested path, becomes /breeder/profile/details
              element={
                <ProtectedRoute allowedRoles={["MEMBER"]}>
                  <MemberProfileDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="update-password" // Nested path, becomes /breeder/profile/details
              element={
                <ProtectedRoute allowedRoles={["MEMBER"]}>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="invoice-list"
            element={
              <ProtectedRoute allowedRoles={["MEMBER"]}>
                <InvoiceList />
              </ProtectedRoute>
            }
          />
          {/* Breeder Page */}
          <Route
            path="/breeder/add-request"
            element={
              <ProtectedRoute allowedRoles={["BREEDER"]}>
                <AddRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/breeder/viewdetail/:requestId"
            element={
              <ProtectedRoute allowedRoles={["BREEDER"]}>
                <BreederRequestDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/breeder/update-request/:requestId"
            element={
              <ProtectedRoute allowedRoles={["BREEDER"]}>
                <UpdateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/breeder/profile"
            element={
              <ProtectedRoute allowedRoles={["BREEDER"]}>
                <BreederProfilePage />
              </ProtectedRoute>
            }
          >
            <Route
              path="details" // Nested path, becomes /breeder/profile/details
              element={
                <ProtectedRoute allowedRoles={["BREEDER"]}>
                  <BreederProfileDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="view-request"
              element={
                <ProtectedRoute allowedRoles={["BREEDER"]}>
                  <BreederRequest />
                </ProtectedRoute>
              }
            />
          </Route>
          {/* Staff Page */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["STAFF"]}>
                <StaffPage />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/staff/transportdetail/:transportId"
            element={
              <ProtectedRoute allowedRoles={["STAFF"]}>
                <TransportDetail />
              </ProtectedRoute>
            }
          />{" "}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
