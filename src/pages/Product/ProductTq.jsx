import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'


const ProductTq = ({ data }) => {
    return (
        <div className="productTq">
            <div className="productTq_wrap">
                <div className="productTq_alb">
                    <div className="productTq_alb--wrap">
                        <div className="productTq_alb--title">
                            <p className="note-text fw-6 cl-text">
                                Thư viện hình ảnh
                            </p>
                        </div>
                        <ul className="productTq_alb--list d-wrap">
                            {
                                data?.product?.galleryImages?.nodes.length > 0
                                    ?
                                    data?.product?.galleryImages?.nodes.map((data, index) => {
                                        return (
                                            <li className="productTq_alb--item d-item">
                                                <div className="productTq_alb--item-img">
                                                    <img src={data.sourceUrl} alt={data.id} />
                                                </div>
                                            </li>
                                        )

                                    })
                                    :
                                    ""
                            }
                            <li className="productTq_alb--item d-item">
                                <div className="productTq_alb--item-up">
                                    <div className="productTq_alb--item-up-wrap">
                                        <span className="ic">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                        <p className="note-sm cl-pri t-center fw-5">
                                            Tải lên
                                            <br />
                                            hình ảnh/video
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductTq
