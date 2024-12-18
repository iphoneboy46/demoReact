import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopInContainer = () => {
    const { pathname } = useLocation();

    console.log(pathname)

    useEffect(() => {
        const container = document.querySelector(".layoutMain_rt--wrap");
        if (container) {
            container.scrollTo(0, 0); // Cuộn container về đầu
        }
    }, [pathname]); // Theo dõi khi pathname thay đổi

    return null;
};

export default ScrollToTopInContainer;
