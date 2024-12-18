// AOS.init({
//   startEvent: "DOMContentLoaded",
//   offset: 0,
//   duration: 1400,
//   delay: "200",
//   easing: "ease",
//   once: true,
//   mirror: true,
//   disable: function () {
//     return $(window).width() <= 1200;
//   },
// });

import { useEffect } from "react";
import Swiper from "swiper";

function LinksMain() {
    try {
        const scrollTop = document.querySelector(".scroll-to-top");

        if (scrollTop) {
            scrollTop.addEventListener("click", () => {
                document.body.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }

        const menuListLink = document.querySelector(".links-main");
        window.addEventListener("scroll", () => {
            if (menuListLink) {
                if (window.scrollY > 200) {
                    menuListLink.classList.add("active");
                } else {
                    menuListLink.classList.remove("active");
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

LinksMain();

// $('.gallery').each(function () {
//     const $this = $(this);
//     const $item = $this.find('.gItem');
//     $(function () {
//         $this.lightGallery({
//             selector: $item,
//             thumbnail: true,
//             zoom: true,
//         });
//     });
// });