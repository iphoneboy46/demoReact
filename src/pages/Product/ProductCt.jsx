import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_ID, GET_PRODUCT_CATEGORIES, GET_PRODUCT_CATEGORIES_MUCH } from '../../Query/getPosts';
import ictitle from '../../assets/images/ictitle.svg';
import PagiWeb from '../../components/PagiWeb/PagiWeb';
import { UPDATE_PRODUCT_STATUS } from '../../Query/update';
import { toast } from 'react-toastify';
import { ScaleLoader } from 'react-spinners';
import icChangeImg from "../../assets/images/icChangeImg.png";
import icXb1 from "../../assets/images/icxb1.png";
import icXb2 from "../../assets/images/icxb2.png";
import icXb3 from "../../assets/images/icxb3.png";
import control1 from "../../assets/images/control1.png";
import control2 from "../../assets/images/control2.png";
import control3 from "../../assets/images/control3.png";
import editProCt from "../../assets/images/editProCt.png";
import Select2Component from '../../components/Select2Component/Select2Component';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import $ from 'jquery'; // Import jQuery
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';
import "../../sass/pages/product.scss"
import ProductTq from './ProductTq';


const optionsStatus = [
    { value: 'PUBLISH', label: 'Đã xuất bản' },
    { value: 'DRAFT', label: 'Bản nháp' },
];

const optionsView = [
    { value: 'PUBLIC', label: "Công khai" },
    { value: 'true', label: 'Bảo vệ bằng mật khẩu' },
    { value: 'PRIVATE', label: 'Riêng tư' }
];

const ProductCt = () => {
    const componentRef1 = useRef(null);
    const componentRef2 = useRef(null);
    const componentRef3 = useRef(null);
    const componentRef4 = useRef(null);
    const componentRef5 = useRef(null);
    const componentRef6 = useRef(null);
    const componentRef7 = useRef(null);




    const { id } = useParams();
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [checkedDm, setCheckedDm] = useState([]);
    const [tab, setTab] = useState(1)
    const [tabLfContent, setTabLfContent] = useState(1)
    const [selectedValueStatus, setSelectedValueStatus] = useState("PUBLISH")
    const [selectedValueView, setSelectedValueView] = useState("PUBLIC")
    const [selectedValueRangeView, setSelectedValueRangeView] = useState("store&result")
    const [actived1, setActived1] = useState(true)
    const [actived2, setActived2] = useState(true)
    const [actived3, setActived3] = useState(true)
    const [actived4, setActived4] = useState(true)







    const { data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        variables: { id: id },
    });

    console.log(data)

    const [dateView, setDateView] = useState("");
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());

    useEffect(() => {
        // Thời gian UTC ban đầu
        const utcTime = new Date(data?.product?.dateGmt);

        // Tính giờ với múi giờ +7
        const timezoneOffset = 7; // +7 hours
        const localTime = new Date(utcTime.getTime() + timezoneOffset * 60 * 60 * 1000);
        setDateView(localTime.toLocaleString())
    }, [data])






    const { data: dataProductCate } = useQuery(GET_PRODUCT_CATEGORIES)
    const { data: dataProductCateMuch } = useQuery(GET_PRODUCT_CATEGORIES_MUCH)



    useEffect(() => {
        // Kiểm tra nếu có danh mục trong data?.product?.terms
        if (data) {
            // Lấy danh sách ID từ danh mục đã có trong sản phẩm
            const initialCheckedIds = data?.product?.terms.nodes.map(term => term.id);
            setCheckedDm(initialCheckedIds);
        }
    }, [data]);


    // Mutation để cập nhật trạng thái sản phẩm
    const [updateProductStatus] = useMutation(UPDATE_PRODUCT_STATUS);

    // Hàm xử lý khi thay đổi trạng thái checkbox
    const handleStatusChange = (productId, currentStatus, e) => {
        // Thay đổi trạng thái từ publish sang draft và ngược lại
        let newStatus;

        if (currentStatus === 'publish') {
            newStatus = 'DRAFT';  // Nếu trạng thái hiện tại là 'PUBLISH', thay đổi thành 'DRAFT'
        } else if (currentStatus === 'draft') {
            newStatus = 'PUBLISH';  // Nếu trạng thái hiện tại là 'DRAFT', thay đổi thành 'PUBLISH'
        } else {
            console.error('Invalid current status:', currentStatus);
            return;  // Nếu trạng thái không phải 'PUBLISH' hoặc 'DRAFT', không làm gì cả
        }

        // Set trạng thái loading cho sản phẩm hiện tại
        setLoadingStatus(prevState => ({
            ...prevState,
            [productId]: true
        }));

        updateProductStatus({
            variables: {
                id: productId,
                status: newStatus  // Sử dụng PostStatusEnum thay vì chuỗi
            }
        }).then(response => {
            // console.log('Product status updated:', response.data.updateProduct.product);
            setLoadingStatus(false)
            toast.success("Thao tác thành công", {
                autoClose: 3000,
            })

        }).catch(error => {
            setLoadingStatus(false)
            console.error('Error updating product status:', error);
            toast.error("Thao tác thất bại", {
                autoClose: 3000,
            })

        });
    };


    const handleCheckedDm = (categoryId) => {
        setCheckedDm((prev) => (
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Bỏ checked
                : [...prev, categoryId] // Thêm checked
        ))
    }

    const handleSelectStatus = (value) => {
        setSelectedValueStatus(value)
    }

    const handleSelectView = (value) => {
        setSelectedValueView(value)
    }

    const handleChange = (date) => {
        setSelectedDateTime(date);
        // Tùy chỉnh định dạng ngày giờ
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        const formatted = new Intl.DateTimeFormat("en-GB", options).format(date);
        // setFormattedDate(formatted);
        setDateView(formatted)
    };

    return (
        <div className="product">
            <div className="product_wrap">
                <div className="layout_top">
                    <div className="layout_top--title">
                        {loading ? (
                            <div className="skeleton"></div>
                        ) : (
                            <>
                                <span className="ic">
                                    <img src={ictitle} alt="ictitle" />
                                </span>
                                <h1 className="title-mn fw-6 cl-text">
                                    {data?.product?.name}
                                </h1>
                            </>
                        )}
                    </div>
                    <div className="layout_top--pro proCt">
                        {
                            loading
                                ?
                                <div className="skeleton"></div>
                                :
                                <>
                                    <div className="layout_top--pro-lf">
                                        <div className="layout_top--pro-btns d-wrap">
                                            <div className="layout_top--pro-btn d-item">
                                                <button className="btn">
                                                    <span className="btn-ic">
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>
                                                    <span className="btn-text">Thêm sản phẩm mới</span>
                                                </button>
                                            </div>
                                            <div className="layout_top--pro-btn d-item">
                                                <button className="btn btnPro">
                                                    <span className="btn-text">Sản phẩm trùng lặp</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="layout_top--pro-rt">
                                        <PagiWeb />
                                    </div>
                                </>
                        }
                    </div>
                    <div className="layout_top--br">
                        {loading ? (
                            <div className="skeleton"></div>
                        ) : (
                            <div className="breadcrumbs">
                                <ul className="breadcrumbs-list">
                                    <li className="breadcrumbs-item">
                                        <Link className="breadcrumbs-link" to="/product">Danh sách sản phẩm</Link>
                                    </li>
                                    <li className="breadcrumbs-item last">
                                        <p className="breadcrumbs-link" >{data?.product?.name}</p>
                                    </li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
                <div className="productEdit">
                    <div className="productEdit_wrap d-wrap">
                        <div className="productEdit_lf d-item">
                            <div className="productEdit_lf--wrap">
                                <div className="productEdit_lf--tab">
                                    <div className="productEdit_lf--tab-list">
                                        <Swiper
                                            slidesPerView="auto"
                                            spaceBetween={0} // Đây phải là một giá trị số
                                            className="custom-class"
                                            scrollbar={{ draggable: true }}  // Kích hoạt thanh cuộn
                                            modules={[Scrollbar]}  // Cần khai báo module Scrollbar
                                        >
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 1 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(1)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Tổng quan
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 2 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(2)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Thuộc tính
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 3 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(3)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Tùy chọn
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 4 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(4)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Tập tin
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 5 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(5)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Vận chuyển & nhận hàng
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 6 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(6)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        SEO
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 7 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(7)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Sản phẩm liên quan
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 8 ? "actived" : ""}`} onClick={()=>{
                                                    setTabLfContent(8)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Nút “Mua ngay”
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                </div>
                                <div className="productEdit_lf--content">
                                    <div className="productEdit_lf--content-list">
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 1 ? "showed" : ""}`}>
                                            <ProductTq data={data} />
                                        </div>
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 2 ? "showed" : ""}`}>
                                            Thuộc tính
                                        </div>
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 3 ? "showed" : ""}`}>
                                            Tùy chọn
                                        </div>
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 4 ? "showed" : ""}`}>
                                            Tập tin
                                        </div>
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 5 ? "showed" : ""}`}>
                                            Vận chuyển & nhận hàng
                                        </div>
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 6 ? "showed" : ""}`}>
                                            SEO
                                        </div>
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 7 ? "showed" : ""}`}>
                                            Sản phẩm liên quan
                                        </div>
                                        <div className={`productEdit_lf--content-item ${tabLfContent === 8 ? "showed" : ""}`}>
                                            Nút “ Mua ngay”
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="productEdit_rt d-item">
                            <div className="productEdit_rt--wrap">
                                <div className="productEdit_Kdung">
                                    {
                                        loading
                                            ?
                                            <div className="skeleton"></div>
                                            :
                                            <>
                                                <p className="note-sm cl-text fw-5">Khả dụng sản phẩm</p>
                                                <div className={`product_table--status ${loadingStatus[data?.product?.id] && "load"} `}>
                                                    {loadingStatus[data?.product?.id] && <ScaleLoader className='product_table--status-load' />}
                                                    <p className={`note-text ${data?.product?.status === "draft" ? "cl-text" : "cl-gray3"} `}>Tắt</p>
                                                    <label className="switch cl-gr">
                                                        <input
                                                            type="checkbox"
                                                            checked={data?.product?.status === "publish"}
                                                            onChange={(e) => handleStatusChange(data?.product?.id, data?.product?.status, e)}
                                                            disabled={loadingStatus[data?.product?.id]} // Vô hiệu hóa trong lúc loading
                                                        />
                                                        <span className="switch-wrap">
                                                            <span className="switch-wrap-around"></span>
                                                        </span>
                                                    </label>
                                                    <p className={`note-text ${data?.product?.status === "publish" ? "cl-text" : "cl-gray3"} `}>Bật</p>
                                                </div>
                                            </>
                                    }

                                </div>
                                <div className="productEdit_tags">

                                    <div className="productEdit_layout">

                                        <div className={`productEdit_layout--top ${actived1 ? "actived" : ""}`} onClick={() => {
                                            $(componentRef1.current).slideToggle(500);
                                            setActived1(!actived1)
                                        }}>
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>
                                                        <div className="productEdit_layout--top-wrap">
                                                            <p className="note-sm fw-5 cl-text">
                                                                Thẻ sản phẩm
                                                            </p>
                                                            <span className="ic">
                                                                <FontAwesomeIcon icon={faAngleDown} />
                                                            </span>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                        <div className="productEdit_layout--bottom " ref={componentRef1}>
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>

                                                        <div className="productEdit_layout--bottom-wrap">
                                                            <div className="productEdit_tags--form">
                                                                <div className="productEdit_tags--form-ip">
                                                                    <input type="text" placeholder='Nhập tên thẻ' className='form-item-ip' />
                                                                    <button className="btn">
                                                                        <span className="btn-text">
                                                                            Thêm
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                                <p className="note-mn fw-i cl-gray">Phân cách các thẻ bằng dấu phẩy</p>
                                                            </div>
                                                            <ul className="productEdit_tags--list">
                                                                {
                                                                    data?.product?.tagTerms.nodes.map((tag, index) => {
                                                                        return (
                                                                            <li key={index} className="productEdit_tags--item">
                                                                                <span className="ic">
                                                                                    <FontAwesomeIcon icon={faXmark} />
                                                                                </span>
                                                                                <p className="note-sm cl-gray">{tag.name}</p>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div className="productEdit_avatar">
                                    <div className="productEdit_layout">
                                        <div className={`productEdit_layout--top ${actived2 ? "actived" : ""}`} onClick={() => {
                                            $(componentRef2.current).slideToggle(500);
                                            setActived2(!actived2)
                                        }}>
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>
                                                        <div className="productEdit_layout--top-wrap">
                                                            <p className="note-sm fw-5 cl-text">
                                                                Ảnh đại diện sản phẩm
                                                            </p>
                                                            <span className="ic">
                                                                <FontAwesomeIcon icon={faAngleDown} />
                                                            </span>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                        <div className="productEdit_layout--bottom" ref={componentRef2}>
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>
                                                        <div className="productEdit_layout--bottom-wrap">
                                                            <div className="productEdit_avatar--img">
                                                                <img src={data?.product?.image?.sourceUrl} alt={data?.name} />
                                                            </div>
                                                            <div className="productEdit_avatar--control">
                                                                <p className="note-sm cl-gray deleteImg">
                                                                    Xóa
                                                                </p>
                                                                <div className="productEdit_avatar--change">
                                                                    <span className="ic">
                                                                        <img src={icChangeImg} alt="" />
                                                                    </span>
                                                                    <p className="note-sm cl-text">
                                                                        Thay đổi ảnh
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div className="productEdit_dm">
                                    <div className="productEdit_layout">
                                        <div className={`productEdit_layout--top ${actived3 ? "actived" : ""}`} onClick={() => {
                                            $(componentRef3.current).slideToggle(500);
                                            setActived3(!actived3)
                                        }}>
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>
                                                        <div className="productEdit_layout--top-wrap">
                                                            <p className="note-sm fw-5 cl-text">
                                                                Danh mục sản phẩm
                                                            </p>
                                                            <span className="ic">
                                                                <FontAwesomeIcon icon={faAngleDown} />
                                                            </span>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                        <div className="productEdit_layout--bottom" ref={componentRef3}>
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>
                                                        <div className="productEdit_layout--bottom-wrap">
                                                            <div className="productEdit_dm--tabs">
                                                                <div onClick={() => {
                                                                    setTab(1)
                                                                }} className={`productEdit_dm--tab ${tab === 1 ? "actived" : ""}`}>
                                                                    Tất cả danh mục
                                                                </div>
                                                                <div onClick={() => {
                                                                    setTab(2)
                                                                }} className={`productEdit_dm--tab ${tab === 2 ? "actived" : ""}`}>
                                                                    Dùng nhiều nhất
                                                                </div>
                                                            </div>
                                                            <div className="productEdit_dm--contents">
                                                                <div className={`productEdit_dm--content ${tab === 1 ? "showed" : ""}`}>
                                                                    <ul className="productEdit_dm--list">
                                                                        {
                                                                            dataProductCate?.productCategories?.edges.map((data, index) => {
                                                                                return (
                                                                                    <li key={index} className="productEdit_dm--item">
                                                                                        <label className='boxCk'>
                                                                                            <input checked={checkedDm.includes(data?.node?.id)} type="checkbox" onChange={(e) => {
                                                                                                handleCheckedDm(data?.node?.id)
                                                                                            }} />
                                                                                            <span className="box"></span>
                                                                                            <span className="note-sm cl-text">
                                                                                                {data?.node?.name}
                                                                                            </span>
                                                                                        </label>
                                                                                        {
                                                                                            data?.node?.children?.edges.length > 0
                                                                                                ?
                                                                                                <ul className="productEdit_dm--list">
                                                                                                    {
                                                                                                        data?.node?.children?.edges.map((dataChild, indexChild) => {
                                                                                                            return (
                                                                                                                <li key={indexChild} className="productEdit_dm--item">
                                                                                                                    <label className='boxCk'>
                                                                                                                        <input type="checkbox" onChange={(e) => {
                                                                                                                            handleCheckedDm(dataChild?.node?.id)
                                                                                                                        }} />
                                                                                                                        <span className="box"></span>
                                                                                                                        <span className="note-sm cl-text">
                                                                                                                            {dataChild?.node?.name}
                                                                                                                        </span>
                                                                                                                    </label>

                                                                                                                </li>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </ul>
                                                                                                :
                                                                                                ""
                                                                                        }
                                                                                    </li>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ul>
                                                                </div>
                                                                <div className={`productEdit_dm--content ${tab === 2 ? "showed" : ""}`}>
                                                                    <ul className="productEdit_dm--list">
                                                                        {
                                                                            dataProductCateMuch?.productCategories?.edges.map((data, index) => {
                                                                                return (
                                                                                    <li key={index} className="productEdit_dm--item">
                                                                                        <label className='boxCk'>
                                                                                            <input checked={checkedDm.includes(data?.node?.id)} type="checkbox" onChange={(e) => {
                                                                                                handleCheckedDm(data?.node?.id)
                                                                                            }} />
                                                                                            <span className="box"></span>
                                                                                            <span className="note-sm cl-text">
                                                                                                {data?.node?.name}
                                                                                            </span>
                                                                                        </label>
                                                                                        {
                                                                                            data?.node?.children?.edges.length > 0
                                                                                                ?
                                                                                                <ul className="productEdit_dm--list">
                                                                                                    {
                                                                                                        data?.node?.children?.edges.map((dataChild, indexChild) => {
                                                                                                            return (
                                                                                                                <li key={indexChild} className="productEdit_dm--item">
                                                                                                                    <label className='boxCk'>
                                                                                                                        <input type="checkbox" onChange={(e) => {
                                                                                                                            handleCheckedDm(dataChild?.node?.id)
                                                                                                                        }} />
                                                                                                                        <span className="box"></span>
                                                                                                                        <span className="note-sm cl-text">
                                                                                                                            {dataChild?.node?.name}
                                                                                                                        </span>
                                                                                                                    </label>

                                                                                                                </li>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </ul>
                                                                                                :
                                                                                                ""
                                                                                        }
                                                                                    </li>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                    </div>
                                    <div className="productEdit_dm--btn">
                                        {
                                            loading
                                                ?
                                                <div className="skeleton"></div>
                                                :
                                                <button className="btn">
                                                    <span className="btn-text">
                                                        Thêm danh mục mới
                                                    </span>
                                                </button>
                                        }

                                    </div>
                                </div>
                                <div className="productEdit_xb">
                                    <div className="productEdit_layout">
                                        <div className={`productEdit_layout--top ${actived4 ? "actived" : ""}`} onClick={() => {
                                            $(componentRef4.current).slideToggle(500);
                                            setActived4(!actived4)
                                        }}>
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <div className="productEdit_layout--top-wrap">
                                                        <p className="note-sm fw-5 cl-text">
                                                            Xuất bản
                                                        </p>
                                                        <span className="ic">
                                                            <FontAwesomeIcon icon={faAngleDown} />
                                                        </span>
                                                    </div>
                                            }
                                        </div>
                                        <div className="productEdit_layout--bottom" ref={componentRef4}>
                                            <div className="productEdit_layout--bottom-wrap">
                                                <ul className="productEdit_xb--list">
                                                    <li className="productEdit_xb--item">
                                                        {
                                                            loading
                                                                ?
                                                                <div className="skeleton"></div>
                                                                :
                                                                <div className="productEdit_xb--box">
                                                                    <div className="productEdit_xb--top">
                                                                        <div className="productEdit_xb--top-wrap">
                                                                            <div className="productEdit_xb--top-lf">
                                                                                <p className="note-sm title cl-pri fw-5">
                                                                                    <span className="ic">
                                                                                        <img src={icXb1} alt="icxb1" />
                                                                                    </span>
                                                                                    Trạng thái:
                                                                                </p>
                                                                                <p className="note-sm cl-gray fw-5">Đã xuất bản</p>
                                                                            </div>
                                                                            <div className="productEdit_xb--top-rt">
                                                                                <div className="productEdit_xb--ic" onClick={() => {
                                                                                    $(componentRef5.current).slideToggle(500);
                                                                                }}>
                                                                                    <img src={editProCt} alt="editProCt" />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="productEdit_xb--bottom" ref={componentRef5}>
                                                                        <div className="productEdit_xb--bottom-wrap">
                                                                            <Select2Component
                                                                                options={optionsStatus}
                                                                                value={selectedValueStatus}
                                                                                onChange={handleSelectStatus}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        }
                                                    </li>
                                                    <li className="productEdit_xb--item">
                                                        {
                                                            loading
                                                                ?
                                                                <div className="skeleton"></div>
                                                                :
                                                                <div className="productEdit_xb--box">
                                                                    <div className="productEdit_xb--top">
                                                                        <div className="productEdit_xb--top-wrap">
                                                                            <div className="productEdit_xb--top-lf">
                                                                                <p className="note-sm title cl-pri fw-5">
                                                                                    <span className="ic">
                                                                                        <img src={icXb2} alt="icxb1" />
                                                                                    </span>
                                                                                    Hiển thị:
                                                                                </p>
                                                                                <p className="note-sm cl-gray fw-5">Công khai</p>
                                                                            </div>
                                                                            <div className="productEdit_xb--top-rt">
                                                                                <div className="productEdit_xb--ic" onClick={() => {
                                                                                    $(componentRef6.current).slideToggle(500);
                                                                                }}>
                                                                                    <img src={editProCt} alt="editProCt" />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="productEdit_xb--bottom" ref={componentRef6}>
                                                                        <div className="productEdit_xb--bottom-wrap">
                                                                            <Select2Component
                                                                                options={optionsView}
                                                                                value={selectedValueView}
                                                                                onChange={handleSelectView}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        }
                                                    </li>
                                                    <li className="productEdit_xb--item">
                                                        {
                                                            loading
                                                                ?
                                                                <div className="skeleton"></div>
                                                                :
                                                                <div className="productEdit_xb--box">
                                                                    <div className="productEdit_xb--top">
                                                                        <div className="productEdit_xb--top-wrap">
                                                                            <div className="productEdit_xb--top-lf">
                                                                                <p className="note-sm title cl-pri fw-5">
                                                                                    <span className="ic">
                                                                                        <img src={icXb3} alt="icxb1" />
                                                                                    </span>
                                                                                    Đã xuất bản:
                                                                                </p>
                                                                                <p className="note-sm cl-gray fw-5">{dateView}</p>
                                                                            </div>
                                                                            <div className="productEdit_xb--top-rt">
                                                                                <div className="productEdit_xb--ic " onClick={() => {
                                                                                    $(componentRef7.current).slideToggle(500);
                                                                                }}>
                                                                                    <img src={editProCt} alt="editProCt" />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="productEdit_xb--bottom" ref={componentRef7}>
                                                                        <div className="productEdit_xb--bottom-wrap">
                                                                            <DatePicker
                                                                                selected={selectedDateTime}
                                                                                onChange={handleChange}
                                                                                showTimeSelect
                                                                                timeFormat="HH:mm"
                                                                                dateFormat="dd/MM/yyyy HH:mm"
                                                                                timeIntervals={1} // Điều chỉnh thời gian cách nhau
                                                                                inline
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        }

                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="productEdit_xb--control">
                                        <div className="productEdit_xb--control-btns">
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>
                                                        <button className="btn">
                                                            <span className="btn-text">
                                                                Cập nhật
                                                            </span>
                                                        </button>
                                                        <Link target='_blank' to={data?.product?.link} className="btn trans">
                                                            <span className="btn-text">
                                                                Xem trước
                                                            </span>
                                                        </Link>
                                                    </>
                                            }

                                        </div>
                                        <ul className="productEdit_xb--control-list d-wrap">
                                            {
                                                loading
                                                    ?
                                                    <div className="skeleton"></div>
                                                    :
                                                    <>
                                                        <li className="productEdit_xb--control-item d-item d-3">
                                                            <div className="productEdit_xb--control-link">
                                                                <span className="ic">
                                                                    <img src={control1} alt="Nhân bản" />
                                                                </span>
                                                                <p className="note-sm cl-text">
                                                                    Nhân bản
                                                                </p>
                                                            </div>
                                                        </li>
                                                        <li className="productEdit_xb--control-item d-item d-3">
                                                            <div className="productEdit_xb--control-link">
                                                                <span className="ic">
                                                                    <img src={control2} alt="Tạo bản nháp" />
                                                                </span>
                                                                <p className="note-sm cl-text">
                                                                    Tạo bản nháp
                                                                </p>
                                                            </div>
                                                        </li>
                                                        <li className="productEdit_xb--control-item d-item d-3">
                                                            <div className="productEdit_xb--control-link">
                                                                <span className="ic">
                                                                    <img src={control3} alt="Xóa" />
                                                                </span>
                                                                <p className="note-sm cl-text">
                                                                    Xóa
                                                                </p>
                                                            </div>
                                                        </li>
                                                    </>
                                            }

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCt;
