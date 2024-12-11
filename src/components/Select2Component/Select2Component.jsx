import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'select2/dist/css/select2.css';  // Đảm bảo đã import CSS của Select2
import 'select2';  // Import Select2 sau khi đã import jQuery
import "../../sass/components/_input.scss"


const Select2Component = ({ options, onChange, value }) => {
    const selectRef = useRef(null);  // Dùng useRef để tham chiếu trực tiếp tới DOM

    useEffect(() => {
        if (selectRef.current) {
            // Khởi tạo Select2
            $(selectRef.current).select2({
                // placeholder: "Chọn một lựa chọn",  // Tùy chỉnh placeholder
                width: '100%',  // Đảm bảo width của select2 là 100%
                minimumResultsForSearch: -1  // Vô hiệu hóa ô input tìm kiếm
            });

            // Thêm sự kiện change khi lựa chọn thay đổi
            $(selectRef.current).on('change', (e) => {
                onChange(e.target.value); // Gọi hàm onChange từ cha
            });

            // Cleanup: huỷ bỏ Select2 khi component unmount
            return () => {
                $(selectRef.current).select2('destroy');
            };
        }
    }, []);  // Chỉ chạy 1 lần khi component mount

    // Reset dữ liệu khi `value` thay đổi
    useEffect(() => {
        if (selectRef.current) {
            $(selectRef.current).val(value).trigger("change"); // Reset giá trị của Select2
        }
    }, [value]); // Lắng nghe sự thay đổi của `value`
    // Render thẻ select với các options
    return (
        <select ref={selectRef} value={value} onChange={() => { }} className="select2 form-item-op">
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select2Component;
