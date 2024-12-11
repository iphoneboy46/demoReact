import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import "../../sass/components/_siteBar.scss"
import Logo1 from "../../assets/images/logo1.png"
import mnic1 from "../../assets/images/mnic1.png"
import mnic2 from "../../assets/images/mnic2.png"
import mnic3 from "../../assets/images/mnic3.png"
import mnic4 from "../../assets/images/mnic4.png"
import mnic5 from "../../assets/images/mnic5.png"
import mnic6 from "../../assets/images/mnic6.png"
import mnic7 from "../../assets/images/mnic7.png"
import mnic8 from "../../assets/images/mnic8.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { ThemeContext } from '../../App'







const menuLists = [
    {
        title: "Trang chủ",
        link: "/",
        icon: mnic1,
    },
    {
        title: "Đơn hàng",
        link: "/order",
        icon: mnic2,
    },
    {
        title: "Sản phẩm",
        link: "/product",
        icon: mnic3,
    },
    {
        title: "Khách hàng",
        link: "/client",
        icon: mnic4,
    },
    {
        title: "Khách hàng",
        link: "/client2",
        icon: mnic5,
    },
    {
        title: "Các biến thể",
        link: "/variant",
        icon: mnic6,
    },
    {
        title: "Danh mục",
        link: "/category",
        icon: mnic7,
    },
    {
        title: "Mã khuyến mãi",
        link: "/code",
        icon: mnic8,
    },
]


const SiteBar = () => {
    const location = useLocation(); // Lấy URL hiện tại
    const { user } = useContext(ThemeContext);
    // const navigate = useNavigate();

    const data = JSON.parse(user);




    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("dataUser"); 
        window.location.href = '/signin';

    };





    return (
        <div className="siteBar">
            <div className="siteBar_wrap">
                <div className="siteBar_wrap--box">
                    <div className="siteBar_top">
                        <div className="siteBar_logo">
                            <Link to="/" className="siteBar_logo--img">
                                <img src={Logo1} alt="logo1" />
                            </Link>
                        </div>
                        {
                            user
                                ?
                                <div className="siteBar_login">
                                    <div className="siteBar_login--img">
                                        <img src={data.avatar_url} alt="" />
                                    </div>
                                    <div className="siteBar_login--name">
                                        <p className="note-text fw-7 t-up cl-white">
                                            {data.user_display_name}
                                        </p>
                                    </div>
                                </div>
                                :
                                ""
                        }
                    </div>
                    <div className="siteBar_bottom">
                        <ul className="menu-list">
                            {
                                menuLists.map((menuList, index) => {
                                    return (
                                        <li key={index} className={`menu-item ${location.pathname === menuList.link ? "actived" : ""}  `}>
                                            <Link to={menuList.link} className="menu-link">
                                                <span className="menu-link-wrap">
                                                    <span className="ic">
                                                        <img src={menuList.icon} alt="" />
                                                    </span>
                                                    <p className="note-text cl-white fw-5">{menuList.title}</p>
                                                </span>
                                            </Link>
                                        </li>

                                    )
                                })
                            }
                        </ul>

                    </div>
                </div>
                {
                    user
                        ?
                        <div className="siteBar_logout">
                            <button className="menu-link" onClick={handleLogout}>
                                <span className="menu-link-wrap">
                                    <span className="ic">
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    </span>
                                    <p className="note-text cl-red fw-5">Đăng xuất</p>
                                </span>
                            </button>
                        </div>
                        :
                        ""
                }
            </div>
        </div>
    )
}

export default SiteBar
