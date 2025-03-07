import './App.css';
import Home from './home'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Sign_log from './Sign_log';
import Seller_acc from './Seller_acc';
import Seller_Home from './Seller_Home';
import Shop from './Shop';
import Myprofile from './Myprofile';
import EditProfile from './EditProfile';
import Additem from './Additem';
import Seller_inventory from './Seller_inventory';
import ProductDetails from './ProductDetails';
import Products from './Products';
import Cart from './Cart';
import SubcategoryPage from './SubcategoryPage';
import SellerOrder from './SellerOrder';
import ImgUpload from './ImgUpload';
import Seller_review from './Seller_review';
import Favorites from './Favorites';
import OrderHistory from './OrderHistory';


function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route exact path="/home" element={ <Home></Home> } />
        <Route exact path="/shop/:subCategory" element={<SubcategoryPage />}/>
        <Route exact path="/" element={ <Sign_log/>} />
        <Route exact path="/sellerAcc" element={ <Seller_acc/>} />
        <Route exact path="/sellerHome" element={ <Seller_Home/>} />
        <Route exact path="/shop" element={ <Shop/>} />
        <Route exact path="/myProfile" element={ <Myprofile/>} />
        <Route exact path="/edit-profile" element={ <EditProfile/>} />
        <Route exact path="/addItem" element={ <Additem/>} />
        <Route exact path="/sellerinventory" element={ <Seller_inventory/>} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products/>} />
        <Route exact path="/cart" element={<Cart/>} />
        <Route exact path="/seller_order" element={<SellerOrder/>} />
        <Route exact path="/prac" element={<ImgUpload/>} />
        <Route exact path="/seller_review" element={<Seller_review/>} />
        <Route exact path="/wishlist" element={<Favorites/>} />
        <Route exact path="/myOrders" element={<OrderHistory/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

//<Route exact path="/signup" element={ <Sign/>} />
//<Route exact path="/login" element={ <Loginn/>} />