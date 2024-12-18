import axios from 'axios';
import React, { useEffect, useState } from 'react'



const TotalPro = ({ totalProduct }) => {
    const token = localStorage.getItem('authToken');
    // API endpoint
    const apiUrl = 'https://managewoostore.monamedia.net/wp-json/wc/v3/reports/sales';

    // Dữ liệu bạn muốn gửi trong body
    const requestData = {
        period: "year"
    };

    const [dataTotal, setDataTotal] = useState()
    useEffect(() => {
        // Tạo query string từ requestData
        const urlWithParams = `${apiUrl}?${new URLSearchParams(requestData).toString()}`;

        // Gửi GET request
        axios({
            method: 'get',
            url: urlWithParams, // URL với tham số lọc
            headers: {
                'Authorization': `Bearer ${token}`, // Header xác thực
            },
        })
            .then(response => {
                console.log('Dữ liệu trả về:', response.data); // Hiển thị dữ liệu trong console
                setDataTotal(response.data); // Lưu dữ liệu vào state
            })
            .catch(error => {
                console.error('Lỗi:', error); // Xử lý lỗi
            });
    }, []); // Chỉ chạy khi component được render lần đầu


    const totalSale = dataTotal && dataTotal.length > 0 ? Number(dataTotal[0].total_sales) : 0;

    const formatTotalSale = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(totalSale);





    return (
        <div className='totalPro'>
            <div className="totalPro_wrap">
                <div className="totalPro_list d-wrap">
                    <div className="totalPro_item d-item d-4">
                        <div className="totalPro_item--wrap">
                            <p className="note-text cl-gray fw-4">
                                <span className="num cl-pri fw-6">
                                    {totalProduct === "Null" ? 0 : totalProduct}
                                </span>
                                Sản phẩm
                            </p>
                        </div>
                    </div>
                    <div className="totalPro_item d-item d-4">
                        <div className="totalPro_item--wrap ">
                            <p className="note-text cl-gray fw-4">
                                <span className="num cl-pri fw-6">
                                    {
                                        dataTotal && dataTotal.length > 0 ? Number(dataTotal[0].total_items) : 0
                                    }
                                </span>
                                Hàng đã bán
                            </p>
                        </div>
                    </div>
                    <div className="totalPro_item d-item d-4">
                        <div className="totalPro_item--wrap">
                            <p className="note-text cl-gray fw-4">
                                <span className="num cl-pri fw-6">
                                    {formatTotalSale}
                                </span>
                                Doanh số bán hàng
                            </p>
                        </div>
                    </div>
                    <div className="totalPro_item d-item d-4">
                        <div className="totalPro_item--wrap">
                            <p className="note-text cl-gray fw-4">
                                <span className="num cl-pri fw-6">
                                    {
                                        dataTotal && dataTotal.length > 0 ? Number(dataTotal[0].total_orders) : 0
                                    }
                                </span>
                                Đơn hàng
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalPro
