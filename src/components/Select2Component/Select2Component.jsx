import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'select2/dist/css/select2.css';  // Đảm bảo đã import CSS của Select2
import 'select2';  // Import Select2 sau khi đã import jQuery
import "../../sass/components/_input.scss"


const Select2Component = ({ options, onChange, value, isSearchable }) => {
    const selectRef = useRef(null);

    useEffect(() => {
        if (selectRef.current) {
            // Khởi tạo Select2
            $(selectRef.current).select2({
                width: '100%', // Đảm bảo width của Select2 là 100%
                minimumResultsForSearch: isSearchable ? 0 : -1, // Bật hoặc tắt ô tìm kiếm
            });

            // Thêm sự kiện change
            $(selectRef.current).on('change', (e) => {
                onChange(e.target.value); // Gọi hàm onChange từ cha
            });

            // Cleanup khi component unmount
            return () => {
                $(selectRef.current).select2('destroy');
            };
        }
    }, [isSearchable]); // Lắng nghe sự thay đổi của isSearchable

    useEffect(() => {
        if (selectRef.current) {
            $(selectRef.current).val(value).trigger("change"); // Reset giá trị Select2
        }
    }, [value]);

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

