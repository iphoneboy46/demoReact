import Layout from "../components/Layout/Layout";
import Attributes from "../pages/Attribute/Attributes";
import AttributeValue from "../pages/Attribute/AttributeValue";
import Category from "../pages/Category/Category";
import Client from "../pages/Client/Client";
import Client2 from "../pages/Client2/Client2";
import Code from "../pages/Code/Code";
import Home from "../pages/Home/Home";
import Order from "../pages/Order/Order";
import Product from "../pages/Product/Product";
import ProductCt from "../pages/Product/ProductCt";
import Forgot from "../pages/Sign/Forgot";
import SignIn from "../pages/Sign/SignIn";
import Tags from "../pages/Tags/Tags";
import Variant from "../pages/Variant/Variant";


const publicRoutes = [
  {
    path: "/",
    components: Home,
    layout:Layout,
    exact: true,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/order",
    components: Order,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/product",
    components: Product,
    layout:Layout, 
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/product/:id", // Thêm dấu ":" trước "id" để chỉ định đây là một dynamic parameter
    components: ProductCt,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/client",
    components: Client,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/client2",
    components: Client2,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/variant",
    components: Variant,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/product/categorys",
    components: Category,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/product/tags",
    components: Tags,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/product/attributes",
    components: Attributes,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/product/attributes/:id/:name/:slug",
    components: AttributeValue,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  {
    path: "/code",
    components: Code,
    layout:Layout,
    exact: false,
    protected: true, // Yêu cầu đăng nhập
  },
  // {
  //   path: "/signup",
  //   components: SignUp,
  //   layout:null,
  //   exact: false
  // },
  {
    path: "/signin",
    components: SignIn,
    layout:null,
    exact: false,
    protected: false, // Yêu cầu đăng nhập
  },
  {
    path: "/forgot",
    components: Forgot,
    layout:null,
    exact: false,
    protected: false, // Yêu cầu đăng nhập

  },
];

export default publicRoutes;
