import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useNavigate, useNavigationType } from 'react-router-dom';

const PagiWeb = () => {
    const navigate = useNavigate();
    const navigationType = useNavigationType();

    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    useEffect(() => {
        // Lấy trạng thái từ sessionStorage khi tải trang
        const savedState = JSON.parse(sessionStorage.getItem('navigationState')) || {};
        setCanGoBack(savedState.canGoBack || false);
        setCanGoForward(savedState.canGoForward || false);

        // Cập nhật trạng thái dựa trên hành động điều hướng
        checkHistory();
    }, [navigationType]);

    useEffect(() => {
        // Lưu trạng thái vào sessionStorage khi thay đổi
        sessionStorage.setItem(
            'navigationState',
            JSON.stringify({ canGoBack, canGoForward })
        );
    }, [canGoBack, canGoForward]);

    const checkHistory = () => {
        // Cập nhật trạng thái back và forward
        const historyLength = window.history.length;
        setCanGoBack(historyLength > 1);
        setCanGoForward(false); // Trình duyệt không cung cấp thông tin "tiến tới"
    };

    const handleBack = () => {
        if (canGoBack) {
            navigate(-1);
        }
    };

    const handleForward = () => {
        if (canGoForward) {
            navigate(1);
        }
    };
    return (
        <div className="layout_top--pagis">
            <button
                disabled={!canGoBack}
                onClick={handleBack}
                className={`layout_top--pagi prev ${!canGoBack && 'disable'}`}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
                disabled={!canGoForward}
                onClick={handleForward}
                className={`layout_top--pagi next ${!canGoForward && 'disable'}`}
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    )
}

export default PagiWeb
