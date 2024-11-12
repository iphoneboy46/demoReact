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



function SwiperModule() {
  useEffect(() => {
    const eleFree = document.querySelectorAll(".free-slide");
    console.log("asdasdSwiper");

    if (eleFree) {
      eleFree.forEach((ele, i) => {
        var swiper2 = new Swiper(ele.querySelector(".swiper"), {
          slidesPerView: "auto",
          lazy: !0,
          pagination: {
            el: ele.querySelector(".swiper-pagination"),
            clickable: !0,
          },
          centeredSlides: ele
            .querySelector(".swiper")
            .classList.contains("--center"),
          loop: ele.querySelector(".swiper").classList.contains("--loop"),
          navigation: {
            nextEl: ele.querySelector(".next"),
            prevEl: ele.querySelector(".prev"),
          },
          speed: 1000,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
        });
        if (!ele.querySelector(".swiper").classList.contains("--auto")) {
          swiper2.autoplay.stop();
        }
      });
    }

    const eleFree2 = document.querySelectorAll(".free-slide2");

    if (eleFree2) {
      eleFree2.forEach((ele2, i) => {
        var swiper2 = new Swiper(ele2.querySelector(".swiper"), {
          slidesPerView: "auto",
          lazy: !0,
          // pagination: {
          //   el: ele2.querySelector(".swiper-pagination"),
          //   clickable: !0,
          //   type: "progressbar",
          // },
          scrollbar: {
            el: ele2.querySelector(".swiper-scrollbar"),
            hide: false,
            draggable: true,
          },
          centeredSlides: ele2
            .querySelector(".swiper")
            .classList.contains("--center"),
          loop: ele2.querySelector(".swiper").classList.contains("--loop"),
          navigation: {
            nextEl: ele2.querySelector(".next"),
            prevEl: ele2.querySelector(".prev"),
          },
          speed: 1000,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
        });
        if (!ele2.querySelector(".swiper").classList.contains("--auto")) {
          swiper2.autoplay.stop();
        }
      });
    }
  }, []);
}

SwiperModule();

// window.SwiperModule = SwiperModule;
// window.LinksMain = LinksMain;
// window.Header = Header;
