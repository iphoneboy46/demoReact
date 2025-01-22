import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import $ from 'jquery'; // Import jQuery
import "../../sass/components/_siteBar.scss";
import Logo1 from "../../assets/images/logo1.png";
import mnic1 from "../../assets/images/mnic1.png";
import mnic2 from "../../assets/images/mnic2.png";
import mnic3 from "../../assets/images/mnic3.png";
import mnic4 from "../../assets/images/mnic4.png";
import mnic5 from "../../assets/images/mnic5.png";
import mnic6 from "../../assets/images/mnic6.png";
import mnic7 from "../../assets/images/mnic7.png";
import mnic8 from "../../assets/images/mnic8.png";
import mnic9 from "../../assets/images/mnic9.png";
import mnic10 from "../../assets/images/mnic10.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../App';

const menuLists = [
    {
        title: "Trang chủ",
        link: "/",
        icon: mnic1,
        children: []
    },
    {
        title: "Đơn hàng",
        link: "/order",
        icon: mnic2,
        children: []
    },
    {
        title: "Sản phẩm",
        link: "/product",
        icon: mnic3,
        children: [
            {
                title: "Danh mục",
                link: "/product/categorys",
                icon: mnic7,
                children: []
            },
            {
                title: "Thẻ",
                link: "/product/tags",
                icon: mnic9,
                children: []
            },
            {
                title: "Thuộc tính",
                link: "/product/attributes",
                icon: mnic10,
                children: []
            },
        ]
    },
    {
        title: "Khách hàng",
        link: "/client",
        icon: mnic4,
        children: []
    },
    {
        title: "Các biến thể",
        link: "/variant",
        icon: mnic6,
        children: []
    },
    {
        title: "Mã khuyến mãi",
        link: "/code",
        icon: mnic8,
        children: []
    },
];

const SiteBar = () => {
    const location = useLocation(); // Lấy URL hiện tại
    const { user } = useContext(ThemeContext);
    const data = JSON.parse(user);
    const componentRefs = useRef([]);


    // Xử lý toggle dropdown
    const handleDropDown = (index) => {
        // Kiểm tra nếu componentRefs.current[index] tồn tại
        if (componentRefs.current[index]) {
            $(componentRefs.current[index]).slideToggle(500);
         
        }
    };

 
    

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("dataUser");
        window.location.href = '#/signin';
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
                            user &&
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
                        }
                    </div>
                    <div className="siteBar_bottom">
                        <ul className="menu-list">
                            {
                                menuLists.map((menuList, index) => {
                                    const isActive = menuList.link === "/"
                                        ? location.pathname === "/"
                                        : location.pathname.startsWith(menuList.link) && menuList.link !== "/";
                                    return (
                                        <li key={index} className={`menu-item ${isActive ? "actived" : ""} ${menuList.children.length > 0 ? "dropdown" : ""}`}>
                                            <Link to={menuList.link} className="menu-link">
                                                <span className="menu-link-wrap">
                                                    <span className="ic">
                                                        <img src={menuList.icon} alt="" />
                                                    </span>
                                                    <p className="note-text cl-white fw-5">{menuList.title}</p>
                                                </span>
                                                {
                                                    menuList.children.length > 0 &&
                                                    <span
                                                        className="menu-ic"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDropDown(index)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faAngleDown} />
                                                    </span>
                                                }
                                            </Link>
                                            {
                                                menuList.children.length > 0 &&
                                                <ul className="menu-list" ref={(el) => componentRefs.current[index] = el}>
                                                    {
                                                        menuList.children.map((menuListChild, childIndex) => (
                                                            <li key={childIndex} className={`menu-item ${location.pathname === menuListChild.link ? "actived" : ""}`}>
                                                                <Link to={menuListChild.link} className="menu-link">
                                                                    <span className="menu-link-wrap">
                                                                        <span className="ic">
                                                                            <img src={menuListChild.icon} alt="" />
                                                                        </span>
                                                                        <p className="note-text cl-white fw-5">{menuListChild.title}</p>
                                                                    </span>
                                                                </Link>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            }
                                        </li>
                                    );
                                })
                            }

                        </ul>
                    </div>
                </div>
                {
                    user &&
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
                }
            </div>
        </div>
    );
}

export default SiteBar;
