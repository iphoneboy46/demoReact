import React, { useState } from 'react'
import "./PopupPrice.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Select2Component from '../Select2Component/Select2Component';

const optionsMoney = [
    { value: "&nbsp;₫", label: 'Đ' },
    { value: "&nbsp;$", label: 'USD' },
];




const PopupPrice1 = ({ showPopup, setShowPopup }) => {
    const [selectedValueMoney, setSelectedValueMoney] = useState("&nbsp;₫");

    const handleSelectChangeMoney = (value) => {
        setSelectedValueMoney(value);
    }
    return (
        <div className="popupPriceBox">
            <div className={`popupPrice ${showPopup ? "showed" : ""}`}>
                <div className="popupPrice_wrap">
                    <div className="popupPrice_top">
                        <div className="popupPrice_ex" onClick={() => {
                            setShowPopup(false)
                        }}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                        <p className="title-mn2 cl-pri fw-6">
                            Tăng giá sản phẩm
                            <span className="number note-md">
                                (0)
                            </span>
                        </p>
                        <p className="note-sm fw-5 cl-text">
                            Tăng giá theo giá trị cố định hoặc theo % của giá hiện tại.
                            <br />
                            Bạn có thể điều chỉnh giá mới lên / xuống khi thêm phần trăm
                        </p>
                    </div>
                    <div className="popupPrice_center">
                        <div className="popupPrice_ip">
                            <input type="text" className='form-item-ip' placeholder="Nhập giá muốn thay đổi" />
                            <div className="popupPrice_unit">
                                <p className="note-sm fw-5">Đ</p>
                            </div>
                        </div>
                        <p className='note-sm fw-i'>
                            <strong className='cl-red'>*</strong>Giá trị của bạn sẽ được thay đổi theo cách này:
                            <br />
                            Giá hiện tại+ Giá bạn nhập= Giá mới
                        </p>
                    </div>
                    <div className="popupPrice_bottom">
                        <div className="popupPrice_btns">
                            <button className="btn ">
                                <span className="btn-text">
                                    Áp dụng
                                </span>
                            </button>
                            <button className="btn cl-3">
                                <span className="btn-text">
                                    Hủy
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="popupPrice_modal" onClick={() => {
                setShowPopup(false)
            }}></div>
        </div>
    )
}

export default PopupPrice1
