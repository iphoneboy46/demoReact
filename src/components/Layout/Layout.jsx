import React, { useEffect, useState } from 'react'
import "../../sass/components/_layout.scss"
import SiteBar from '../Menu/SiteBar'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollToTopInContainer from '../ScrollToTop/ScrollToTopInContainer'
const Layout = ({ children }) => {



    const [menu, setMenu] = useState(false)
    const handleMenu = () => {
        setMenu(!menu)
    }
   
    

    useEffect(() => {
        const siteBar = document.querySelector(".siteBar");
        if (siteBar) {
            const top = siteBar.querySelector(".siteBar_top");
            const wrap = siteBar.querySelector(".siteBar_wrap");
            const box = siteBar.querySelector(".siteBar_wrap--box");
            const login = siteBar.querySelector(".siteBar_login");
            const style = getComputedStyle(wrap);
            const style2 = getComputedStyle(siteBar);
            const style3 = getComputedStyle(box);
            const list = siteBar.querySelector(".siteBar_bottom .menu-list");

            const total = siteBar.clientHeight - top.clientHeight - parseInt(style.rowGap) - parseInt(style2.paddingBottom) - parseInt(style2.paddingTop) - login?.clientHeight - parseInt(style3.rowGap);

            list.style.maxHeight = total + "px";




        }


    }, [menu])


    const handleLeave = () => {
        const menuItemDropdowns = document.querySelectorAll(".menu-item.dropdown")
        menuItemDropdowns.forEach((menuItemDropdown)=>{
            const menuList = menuItemDropdown.querySelector(".menu-list");
            menuList.style.display = "none";
        })

    }




    return (
        <div className="layoutMain">

            <div className="layoutMain_wrap">
                <div className={`layoutMain_lf ${menu ? "actived" : ""}`} onMouseLeave={()=>{
                    handleLeave()
                }}>
                    <div className="layoutMain_btn" onClick={handleMenu}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                    <div className="layoutMain_lf--wrap">
                        <SiteBar  />
                    </div>
                </div>
                <div className="layoutMain_rt">
                    <ScrollToTopInContainer />
                    <div className="layoutMain_rt--wrap">
                        {children}
                        <div className="layoutMain_rt--bottom">
                            <p className="note-sm t-center cl-gray6">eCommerce Platform @ 2020. All right reserved</p>
                        </div>
                    </div>

                </div>
            </div>
            <div className={`layoutMain_modal ${menu ? "showed" : ""}`}></div>
        </div>
    )
}

export default Layout
