import React from 'react'
import "./ChartDS.scss"
import { Link } from 'react-router-dom'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const ChartDS = () => {
    // Dữ liệu biểu đồ
    const data = {
        labels: ["20", "22", "24", "26", "28", "30", "02", "04", "06", "08", "10", "12", "14", "16"],
        datasets: [
            {
                label: "Doanh thu",
                data: [5000, 8500, 4000, 6000, 3500, 4500, 7000, 9000, 2500, 5000, 8500, 4000, 5000, 7500],
                backgroundColor: "#007AFF",
                hoverBackgroundColor: "#007AFF95",
                borderRadius: 5,
                barPercentage: 0.5, // Độ rộng của các cột
                barThickness: 10, // Độ dày của cột
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false, // Ẩn lưới trên trục X
                },
                ticks: {
                    color: "#8795A8", // Màu sắc nhãn trên trục X
                    font: {
                        size: 14, // Cỡ chữ trục X
                    },
                },
            },
            y: {
                grid: {
                    drawBorder: true, // Ẩn đường viền lưới
                    color: "#ffffff", // Màu sắc đường lưới trục Y
                },
                ticks: {
                    color: "#8795A8", // Màu sắc nhãn trên trục Y
                    stepSize: 1000, // Khoảng cách giữa các giá trị
                    font: {
                        size: 14, // Cỡ chữ trục X
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Ẩn chú thích
            },
            tooltip: {
                backgroundColor: "#f5f5f5",
                bodyColor: "#000",
                borderWidth: 1,
                borderColor: "#ddd",
                titleColor: "#007AFF"
            },
        },
    };

    return (
        <div className="chartLayout">
            <div className="chartLayout_wrap">
                <div className="chartLayout_top">
                    <h2 className="note-lg fw-6 cl-text">
                        Doanh số bán hàng
                    </h2>
                    <Link to="/order" className='title-link'>
                        Báo cáo nâng cao
                    </Link>
                </div>
                <div className="chartLayout_bottom">
                    <div className="chartLayout_canvas">
                        <Bar data={data} options={options} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ChartDS
