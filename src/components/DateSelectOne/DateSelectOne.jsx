import React, { useEffect, useState } from 'react';
import "./DateSelectOne.scss";
import dateIc from "../../assets/images/dateic.svg";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // styles for date picker
import "react-date-range/dist/theme/default.css"; // theme for date picker
import vi from "date-fns/locale/vi"; // Import ngôn ngữ tiếng Việt

const DateSelectOne = () => {

    const [compareYear, setCompareYear] = useState(false);
    const [tab, setTab] = useState(0);
    const [dropdown,setDropdown] = useState(false);

    const [selectedRange, setSelectedRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    // Lưu ngày đã chọn vào useState
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    

    // Xử lý khi ngày thay đổi
    const handleDateChange = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setSelectedRange(ranges.selection);

        setSelectedEndDate(format(endDate, "dd/MM/yyyy"));
        setSelectedStartDate(format(startDate, "dd/MM/yyyy"));

    };

    // Xử lý nút Áp dụng
    const handleApply = () => {
        console.log("Ngày bắt đầu ", selectedStartDate)
        console.log("Ngày kết thúc ", selectedEndDate)

    };

    // Xử lý nút Hủy
    const handleCancel = () => {
        setSelectedRange({
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        });
        setSelectedEndDate(""); // Xóa dữ liệu ngày tháng
        setSelectedStartDate(""); // Xóa dữ liệu ngày tháng

        console.log("Ngày bắt đầu ", selectedStartDate)
        console.log("Ngày kết thúc ", selectedEndDate)

    };


    const handleDropdown = () =>{
        setDropdown(!dropdown)
    }

    useEffect(()=>{
        window.addEventListener("click",(e)=>{
            if(!e.target.closest(".chooseDate")){
                setDropdown(false)
            }
        })
    },[dropdown])

    return (

        <div className="chooseDate">
            <div className="chooseDate_wrap" onClick={handleDropdown}>
                <div className="chooseDate_title">
                    <p className="note-sm cl-text date">
                        Chọn ngày
                    </p>
                    {
                        compareYear
                            ?
                            <p className="note-mn cl-gray date">
                                so với năm trước (2023)
                            </p>
                            :
                            ""
                    }
                </div>
                <span className="chooseDate_ic">
                    <img src={dateIc} alt="" />
                </span>
            </div>
            <div className={`chooseDate_dropdown ${dropdown ? "showed" : ""}`}>
                <div className="chooseDate_dropdown--wrap">
                    <div className="chooseDate_dropdown--tabs">
                        <div className={`chooseDate_dropdown--tab ${tab === 0 ? "actived" : ""} `} onClick={() => {
                            setTab(0)
                        }}>
                            Cài đặt trước
                        </div>
                        <div className={`chooseDate_dropdown--tab ${tab === 1 ? "actived" : ""} `} onClick={() => {
                            setTab(1)
                        }}>
                            Tùy chỉnh
                        </div>
                    </div>
                    <div className="chooseDate_dropdown--list">
                        <div className={`chooseDate_dropdown--item  ${tab === 0 ? "showed" : ""}`}>
                            <div className="chooseDate_dropdown--item-wrap">
                                <div className="chooseDate_dropdown--item-box">
                                    <ul className="chooseDate_dropdown--sl">
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="ngay" value="homnay" checked={true} />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Hôm nay
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="ngay" value="homqua" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Hôm qua
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="ngay" value="dautuantoinay" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Đầu tuần tới nay
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="ngay" value="tuantruoc" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Tuần trước
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="ngay" value="thangtruoc" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Tháng trước
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="ngay" value="dauquy" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Từ đầu quý tới nay
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="ngay" value="daunam" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Từ đầu năm tới nay
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                    </ul>
                                    <div className="chooseDate_dropdown--title">
                                        <p className="note-sm cl-text fw-6">
                                            So sánh với
                                        </p>
                                    </div>
                                    <ul className="chooseDate_dropdown--sl">
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="gd" value="giaidoantruoc" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Giai đoạn trước
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="chooseDate_dropdown--op">
                                            <label className="chooseDate_dropdown--lb">
                                                <input type="radio" name="gd" value="namtruoc" />
                                                <span className="chooseDate_dropdown--op-wrap">
                                                    <span className="box"></span>
                                                    <p className="note-sm cl-text fw-6">
                                                        Năm trước
                                                    </p>
                                                </span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <div className="chooseDate_dropdown--item-btn">
                                    <button onClick={() => { }} className='btn trans'>
                                        <span className="btn-text">
                                            Hủy
                                        </span>
                                    </button>
                                    <button onClick={() => { }} className='btn'>
                                        <span className="btn-text">
                                            Áp dụng
                                        </span>
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className={`chooseDate_dropdown--item  ${tab === 1 ? "showed" : ""}`}>
                            <div className="chooseDate_dropdown--item-wrap">
                                <div className="chooseDate_dropdown--date">
                                    <DateRange
                                        ranges={[selectedRange]}
                                        onChange={handleDateChange}
                                        locale={vi} // Sử dụng tiếng Việt
                                        dateDisplayFormat="dd/MM/yyyy" // Định dạng ngày hiển thị
                                    />
                                </div>
                                <div className="chooseDate_dropdown--item-btn">
                                    <button onClick={handleCancel} className='btn trans'>
                                        <span className="btn-text">
                                            Hủy
                                        </span>
                                    </button>
                                    <button onClick={handleApply} className='btn'>
                                        <span className="btn-text">
                                            Áp dụng
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateSelectOne;
