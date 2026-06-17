// src/App.tsx
import { lazy } from "react";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { PrivateRoute } from "./app/routes/private-route";
import "./index.css";
import { LazyLoad } from "./shared/react";
import { persistor, store } from "./store";
import AppLayout from "./views/_layouts/app-layout";

const ErrorPage = LazyLoad(lazy(() => import("./views/error")));
const HomePage = LazyLoad(lazy(() => import("./views/home")));
const CartPage = LazyLoad(lazy(() => import("./views/cart")));
const ProductPage = LazyLoad(lazy(() => import("./views/product")));
const CreateProductPage = LazyLoad(lazy(() => import("./views/create-product")));
const MyOrdersPage = LazyLoad(lazy(() => import("./views/my-orders")));
const OrderPage = LazyLoad(lazy(() => import("./views/order")));
const ShopsPage = LazyLoad(lazy(() => import("./views/shops")));
const ShopPage = LazyLoad(lazy(() => import("./views/shop")));
const MyShopsPage = LazyLoad(lazy(() => import("./views/my-shops")));
const CreateShopPage = LazyLoad(lazy(() => import("./views/create-shop")));
const EditShopPage = LazyLoad(lazy(() => import("./views/edit-shop")));
const OpenAuctionsPage = LazyLoad(lazy(() => import("./views/open-auctions")));
const MyAuctionsPage = LazyLoad(lazy(() => import("./views/my-auctions")));
const AuctionPage = LazyLoad(lazy(() => import("./views/auction")));
const CreateAuctionPage = LazyLoad(lazy(() => import("./views/create-auction")));
const EditAuctionPage = LazyLoad(lazy(() => import("./views/edit-auction")));
const SignInPage = LazyLoad(lazy(() => import("./views/sign-in")));
const AuthCallbackPage = LazyLoad(lazy(() => import("./views/auth-callback")));
const ProfilePage = LazyLoad(lazy(() => import("./views/profile")));
const EditProfilePage = LazyLoad(lazy(() => import("./views/edit-profile")));

const basename = import.meta.env.BASE_URL;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: ErrorPage,
      children: [
        { path: "/", element: HomePage },
        { path: "/cart", element: CartPage },
        { path: "/product/:productId", element: ProductPage },
        { path: "/shops/all", element: ShopsPage },
        { path: "/shops/:shopId", element: ShopPage },
        { path: "/auctions/all", element: OpenAuctionsPage },
        { path: "/auction/:auctionId", element: AuctionPage },
        { path: "/signin", element: SignInPage },
        { path: "auth/callback", element: AuthCallbackPage },
        { path: "/user/:userId", element: ProfilePage },
        {
          element: <PrivateRoute />,
          children: [
            { path: "/my-orders", element: MyOrdersPage }, // profile
            { path: "/order/:orderId", element: OrderPage },
            { path: "/seller/shops", element: MyShopsPage }, // header
            { path: "/seller/shop/new", element: CreateShopPage }, // header => element owner check
            { path: "/seller/shop/:shopId/edit", element: EditShopPage }, // header => element owner check
            { path: "/seller/:shopId/products/new", element: CreateProductPage },
            { path: "/my-auctions", element: MyAuctionsPage }, // header
            { path: "/auction/new", element: CreateAuctionPage }, // header => element owner check
            { path: "/auction/edit/:auctionId", element: EditAuctionPage }, // header => profile element owner check
            { path: "/user/:userId/edit", element: EditProfilePage },
          ],
        },
      ],
    },
  ],
  { basename },
);

const AppContent = () => <RouterProvider router={router} />;

export function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
