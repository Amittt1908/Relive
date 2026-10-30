import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout, { BareLayout, ScrollToTop } from './layouts/MainLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import { LogoMark } from './components/Logo';
import Landing from './pages/Landing';

const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Category = lazy(() => import('./pages/Category'));
const Product = lazy(() => import('./pages/Product'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Orders = lazy(() => import('./pages/account/Orders'));
const Profile = lazy(() => import('./pages/account/Profile'));
const Donations = lazy(() => import('./pages/account/Donations'));
const Sell = lazy(() => import('./pages/sell/Sell'));
const CreateListing = lazy(() => import('./pages/sell/CreateListing'));
const SellerDashboard = lazy(() => import('./pages/sell/SellerDashboard'));
const Donate = lazy(() => import('./pages/donate/Donate'));
const DonateSchedule = lazy(() => import('./pages/donate/DonateSchedule'));
const Reuse = lazy(() => import('./pages/Reuse'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Help = lazy(() => import('./pages/Help'));
const Policy = lazy(() => import('./pages/policies/Policy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="Loading page">
      <LogoMark size={56} />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Loader />
      <Cursor />
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<BareLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/reuse" element={<Reuse />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/policies/:slug" element={<Policy />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/account" element={<Navigate to="/account/profile" replace />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/orders" element={<Orders />} />
              <Route path="/account/donations" element={<Donations />} />
              <Route path="/sell/create" element={<CreateListing />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/donate/schedule" element={<DonateSchedule />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
