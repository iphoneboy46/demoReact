import Home from "../pages/Home/Home";
import PostCt from "../pages/posts/PostCt";
import Posts from "../pages/posts/Posts";

const publicRoutes = [
  {
    path: "/",
    components: Home,
    exact: true,
  },
  {
    path: "/posts",
    components: Posts,
    exact: false,
  },
  {
    path: "/posts/:title",
    components: PostCt,
    exact: false,
  },
];

export default publicRoutes;
