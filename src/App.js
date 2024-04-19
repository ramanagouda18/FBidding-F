import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { getStartProduct, getStartLiveProducts, startGetUpComingProducts, getStartCompletedProducts } from './actions/product-actions'
import './App.css'
import { useDispatch } from 'react-redux'
import Home from './components/pages/home/Home'
import Header from './components/headers/header'
import LoginForm from './components/pages/registration/login'
import RegistrationForm from './components/pages/registration/registration'
import ForgotPassword from './components/pages/registration/forgotPassword'
import Dashboard from './components/pages/dashboard/dashboard'
import Orders from './components/pages/dashboard/orders'
import Rolebased from './components/pages/dashboard/Rolebased'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import { setTokenData } from './actions/auth-actions'

import Sections from './components/headers/sections'
import UpcomingProducts from './components/pages/UpcomingProducts'
import LiveProducts from './components/pages/LiveProducts'
import CompletedProducts from './components/pages/CompletedProducts'
import CreateProduct from './components/pages/CreateProduct'
import MyProduct from './components/pages/bid/MyProduct'
import Bid from './components/pages/bid/Bid'
import Cart from './components/pages/cart/Cart'
import PaymentSuccess from './components/payments/PaymentSuccess'
import { startGetWallet } from './actions/user-actions'
import Customers from './components/pages/dashboard/customer/Customers'
import { startGetAllProfiles } from './actions/admin-actions'
import ViewCustomer from './components/pages/dashboard/customer/ViewCustomer'
import ViewCustomerBids from './components/pages/dashboard/customer/ViewCustomerBids'
import Sellers from './components/pages/dashboard/sellers/Sellers'
import AllProducts from './components/pages/dashboard/sellers/allProducts'
import ViewSeller from './components/pages/dashboard/sellers/viewSeller'
import BlockedSellers from './components/pages/dashboard/sellers/BlockedSellers'
import CreateProfile from './components/pages/Profile/Profile'
function App() {
  const auth = useSelector((state) => {
    return state.auth.data
  })
  const dispatch = useDispatch()
  useEffect(() => {
    // checking the token 
    const token = localStorage.getItem('token')
    if (token) {
      // decoding the token
      const user = jwtDecode(token)
      dispatch(setTokenData(user))
      // conditionally dispatching the functions to get data based on role
      if (user.role !== 'admin') {
        dispatch(getStartLiveProducts(user.role))
        dispatch(getStartCompletedProducts(user.role))
        dispatch(startGetUpComingProducts(user.role))
        // passing id is optional
        dispatch(startGetWallet(user.id))
      }
      if (user.role == 'admin') {
        dispatch(startGetAllProfiles())
      }
    } else {
      // dispatch after page is mounted
      dispatch(getStartProduct())
    }
  }, [dispatch])
  return (
    <div className="App">
      <Header />
      {auth.role !== 'admin' && <Sections />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginPage" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/view/:id/seller" element={<ViewSeller />} />
        <Route path="/blocked/sellers" element={<BlockedSellers />} />
        <Route path="/view/:id/products" element={<AllProducts />} />
        <Route path="/login-success" element={<Rolebased />} />
        <Route path="/createProfile" element={<CreateProfile />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path='/upcoming' element={<UpcomingProducts />} />
        <Route path='/live' element={<LiveProducts />} />
        <Route path='/completed' element={<CompletedProducts />} />
        <Route path='/live/:id/myProduct' element={<MyProduct />} />
        <Route path='/live/:id/bid' element={<Bid />} />
        <Route path='/cart' element={auth?.role == 'buyer' && <Cart />} />
        {/* <Route path='/view/:id/details' element={}/> */}

        <Route path='/create-product' element={<CreateProduct />} />
      </Routes>
    </div>
  )
}

export default App;