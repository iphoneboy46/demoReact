import React from 'react'
import { Link } from 'react-router-dom'
import "./ChartAround.scss"

const ChartAround = () => {
    return (
        <div className="chartLayout">
            <div className="chartLayout_wrap">
                <div className="chartLayout_top">
                    <h2 className="note-lg fw-6 cl-text">
                        Doanh thu theo sản phẩm
                    </h2>
                    <Link to="/order" className='title-link'>
                        Xem chi tiết
                    </Link>
                </div>
                <div className="chartLayout_bottom">

                </div>
            </div>

        </div>
    )
}

export default ChartAround
