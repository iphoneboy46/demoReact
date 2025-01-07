import React, { useContext, useEffect, useRef, useState } from 'react'
import ictitle from "../../assets/images/ictitle.svg"
import btnIcPro0 from "../../assets/images/btnicpr0.png"
import btnIcPro1 from "../../assets/images/btnicpr1.png"
import btnIcPro2 from "../../assets/images/btnicpr2.png"
import btnIcPro3 from "../../assets/images/btnicpr3.png"
import btnIcPro4 from "../../assets/images/btnicpr4.png"
import scs1 from "../../assets/images/scs1.png"
import scs2 from "../../assets/images/scs2.png"
import scs3 from "../../assets/images/scs3.png"
import scs4 from "../../assets/images/scs4.png"
import icSearch from "../../assets/images/mnic6.png"
import icFilter from "../../assets/images/icFilter.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import "../../sass/pages/product.scss"
import { useQuery } from '@apollo/client'
import { GET_PRODUCT_CATEGORIES } from '../../Query/getPosts'
import ProductTable from './ProductTable'
import $ from 'jquery'; // Import jQuery
import { ThemeContext } from '../../App'
import Select2Component from '../../components/Select2Component/Select2Component'
import { useNavigate } from 'react-router-dom'
import PopupPrice1 from '../../components/PopupPrice/PopupPrice1'
import { Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import 'swiper/css/scrollbar';
import TotalPro from './TotalPro'

const optionsKho = [
    { value: 'null', label: 'Trạng thái kho' },
    { value: 'publish', label: 'Còn hàng' },
    { value: 'draft', label: 'Hết hàng' },
];

const optionsHd1 = [
    { value: 'null', label: 'Hành động' },
    { value: 'editPro', label: 'Chỉnh sửa' },
    { value: 'trashPro', label: 'Bỏ vào thùng rác' },
];

const optionsHd2 = [
    { value: 'null', label: 'Hành động' },
    { value: 'restorePro', label: 'Khôi phục lại' },
    { value: 'deletePro', label: 'Xóa vĩnh viễn' },
];

const optionsSp = [
    { value: 'null', label: 'Lọc theo sản phẩm' },
    { value: 'SIMPLE', label: 'Sản phẩm đơn giản' },
    { value: 'DOWNLOADABLE', label: 'Có thể tải xuống' },
    { value: 'VIRTUAL', label: 'Sản phẩm ảo' },
    { value: 'GROUPED', label: 'Sản phẩm nhóm' },
    { value: 'EXTERNAL', label: 'Sản phẩm bên ngoài /  liên kết' },
    { value: 'VARIABLE', label: 'Sản phẩm có biến thể' },
];

const optionsSl = [
    { value: "az", label: 'Name A-Z' },
    { value: "za", label: 'Name Z-A' },
    { value: "tc", label: 'Giá thấp đến cao' },
    { value: "ct", label: 'Giá cao đến thấp' }
];



const Product = () => {
    const navigate = useNavigate(); // Hook nằm bên trong component
    const [quantityChoose, setQuantityChoose] = useState(0)
    const [idCate, setIdCate] = useState()
    const [titleSl1, setTitleSl1] = useState()
    const [titleSlDm, setTitleSlDm] = useState(() => {
        return localStorage.getItem("titleSlDm", "Chọn danh mục")
    })
    const boxRef = useRef(null);
    const { totalProduct, totalProductAo, totalProductDraft, totalProductTrash } = useContext(ThemeContext)
    const { data: dataProductCate } = useQuery(GET_PRODUCT_CATEGORIES)
    const [listSubmit, setListSubmit] = useState({})


    const [cateQuantity, setCateQuantity] = useState(() => {
        return Number(localStorage.getItem("quantityCategories")) || 0
    })


    const [activeDm, setActiveDm] = useState(() => {
        return Number(localStorage.getItem("activeDm")) || -1;
    })


    const [activeDmChild, setActiveDmChild] = useState(() => {
        return Number(localStorage.getItem("activeDmChild")) || -1;
    })

    const [activeCn, setActiveCn] = useState(0);

    const [selectedValueKho, setSelectedValueKho] = useState(() => {
        return localStorage.getItem("statusPro") || "null"; // Nếu không có trong localStorage, mặc định là ""
    })
    const [selectedValueSp, setSelectedValueSp] = useState(() => {
        return localStorage.getItem("typePro") || "null"; // Nếu không có trong localStorage, mặc định là ""
    })

    const [selectedValueHd, setSelectedValueHd] = useState(() => {
        return localStorage.getItem("actionPro") || "null"; // Nếu không có trong localStorage, mặc định là ""
    })


    const [selectedValueHd2, setSelectedValueHd2] = useState(() => {
        return localStorage.getItem("actionPro2") || "null"; // Nếu không có trong localStorage, mặc định là ""
    })

    const [selectedValueSl, setSelectedValueSl] = useState(() => {
        return localStorage.getItem("selectedValueSl") || "az";
    })



    const [activeBl, setActiveBl] = useState(() => {
        return localStorage.getItem("activeBl") || "all";
    })

    const [changeBl, setChangeBl] = useState(() => {
        return localStorage.getItem("statusPro") || "null";

    })

    const [valueSearchKeyWord, setValueSearchKeyWord] = useState(() => {
        return localStorage.getItem("valueSearch") || "";
    })


    const [valueSearch, setValueSearch] = useState(() => {
        return localStorage.getItem("valueSearch") || "";
    })



    const [listCheckBoxPro, setListCheckBoxPro] = useState([])
    const [showPopup, setShowPopup] = useState(false)

    const handleApDung = () => {
        localStorage.setItem("idCategories", idCate)
        localStorage.setItem("quantityCategories", cateQuantity)
        localStorage.setItem("pagePagi", 0)
        localStorage.setItem("statusPro", selectedValueKho)
        localStorage.setItem("typePro", selectedValueSp)
        setListSubmit({
            cateId: idCate,
            cateQuantity: cateQuantity,
            statusPro: selectedValueKho,
            typePro: selectedValueSp,
            selectedValueHd: selectedValueHd,
            selectedValueHd2: selectedValueHd2,
        })
        navigate(`?${localStorage.getItem('idCategories') !== "null" ? "idCategories=" + localStorage.getItem('idCategories') : ""}${localStorage.getItem('quantityCategories') !== -1 ? "&quantityCategories=" + localStorage.getItem('quantityCategories') : ""}${localStorage.getItem('statusPro') !== "null" ? "&status=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('typePro') !== "null" ? "&type=" + localStorage.getItem('typePro') : ""}${localStorage.getItem('statusPro') !== "null" ? "&post_type=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('valueSearch') !== "" ? "&paramSearch=" + localStorage.getItem('valueSearch') : ""}`);
    }


    const handleSelectChangeKho = (value) => {
        setSelectedValueKho(value);
    };

    const handleSelectChangeSp = (value) => {
        setSelectedValueSp(value);
    };

    const handleSelectChangeHd = (value) => {
        setSelectedValueHd(value);
    }
    const handleSelectChangeHd2 = (value) => {
        setSelectedValueHd2(value);
    }



    const handleSelectChangeSl = (value) => {
        localStorage.setItem("selectedValueSl", value);
        setSelectedValueSl(value);
    }


    const handleBtnSearch = () => {
        localStorage.setItem("valueSearch", valueSearchKeyWord);
        setValueSearch(valueSearchKeyWord)
        navigate(`?${localStorage.getItem('idCategories') !== "null" ? "idCategories=" + localStorage.getItem('idCategories') : ""}${localStorage.getItem('quantityCategories') !== "-1" ? "&quantityCategories=" + localStorage.getItem('quantityCategories') : ""}${localStorage.getItem('statusPro') !== "null" ? "&status=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('typePro') !== "null" ? "&type=" + localStorage.getItem('typePro') : ""}${localStorage.getItem('statusPro') !== "null" ? "&post_type=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('valueSearch') !== "" ? "&paramSearch=" + localStorage.getItem('valueSearch') : ""}`);
    }


    const handleKeyEnter = (e) => {
        if (e.key === 'Enter') {
            handleBtnSearch();  // Gọi hàm tìm kiếm khi nhấn Enter
            navigate(`?${localStorage.getItem('idCategories') !== "null" ? "idCategories=" + localStorage.getItem('idCategories') : ""}${localStorage.getItem('quantityCategories') !== "-1" ? "&quantityCategories=" + localStorage.getItem('quantityCategories') : ""}${localStorage.getItem('statusPro') !== "null" ? "&status=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('typePro') !== "null" ? "&type=" + localStorage.getItem('typePro') : ""}${localStorage.getItem('statusPro') !== "null" ? "&post_type=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('valueSearch') !== "" ? "&paramSearch=" + localStorage.getItem('valueSearch') : ""}`);
        }
    }

    console.log(selectedValueHd)
    console.log(listCheckBoxPro)





    return (
        <div className="product">
            <div className="product_wrap">
                <div className="layout_top">
                    <div className="layout_top--title">
                        <span className="ic">
                            <img src={ictitle} alt="ictitle" />
                        </span>
                        <h1 className="title-mn fw-6 cl-text">
                            Danh sách sản phẩm
                        </h1>
                    </div>
                    <div className="layout_top--pro">
                        <div className="layout_top--pro-lf">
                            <div className="layout_top--pro-btns d-wrap">
                                <Swiper
                                    slidesPerView="auto"
                                    spaceBetween={0} // Đây phải là một giá trị số
                                    className="custom-class"
                                    scrollbar={{ draggable: true }}  // Kích hoạt thanh cuộn
                                    modules={[Scrollbar]}  // Cần khai báo module Scrollbar
                                >
                                    <SwiperSlide className='d-item'>
                                        <button className="btn btnPro">
                                            <span className="btn-ic">
                                                <img src={btnIcPro1} alt="btnIc" />
                                            </span>
                                            <span className="btn-text">Nhập sản phẩm</span>
                                        </button>
                                    </SwiperSlide>
                                    <SwiperSlide className='d-item'>
                                        <button className="btn btnPro">
                                            <span className="btn-ic">
                                                <img src={btnIcPro2} alt="btnIc" />
                                            </span>
                                            <span className="btn-text">Xuất sản phẩm</span>
                                        </button>
                                    </SwiperSlide>
                                    <SwiperSlide className='d-item'>
                                        <button className="btn btnPro">
                                            <span className="btn-ic">
                                                <img src={btnIcPro3} alt="btnIc" />
                                            </span>
                                            <span className="btn-text">Chỉnh sửa tất cả</span>
                                        </button>
                                    </SwiperSlide>
                                    <SwiperSlide className='d-item'>
                                        <button className="btn btnDis">
                                            <span className="btn-ic">
                                                <img src={btnIcPro4} alt="btnIc" />
                                            </span>
                                            <span className="btn-text">Xóa tất cả sản phẩm</span>
                                        </button>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                        <div className="layout_top--pro-rt">
                            <button className="btn">
                                <span className="btn-ic">
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                                <span className="btn-text">
                                    Thêm sản phẩm mới
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="product_content">
                    <div className="product_filter">
                        <div className="product_filter--top">
                            <div className="product_filter--top-list d-wrap">
                                <div className="product_filter--top-item d-item">
                                    <div className="product_filter--choose">
                                        <label className="product_filter--choose-ck" >
                                            <input type="checkbox" name="checkChoosePro" checked={listCheckBoxPro.length > 0} />
                                            <span className="box"></span>
                                        </label>
                                        <p className="note-sm cl-gray">Đã chọn</p>
                                        <p className="note-sm cl-pri fw-6">
                                            {
                                                listCheckBoxPro.length > 0 ? listCheckBoxPro.length : 0
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className={`product_filter--top-item d-item ${listCheckBoxPro.length > 0 ? "" : "notAction"}`}>
                                    <label className="box-select">
                                        <span className="box-select-title">
                                            <p className="note-sm cl-text fw-5">
                                                {
                                                    titleSl1 ? titleSl1 : "Cập nhật hàng loạt"
                                                }
                                            </p>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </span>
                                        <input className='ipDropDown' type="checkbox" />
                                        <div className="box-select-op">
                                            <ul className="box-select-list">
                                                <li className="box-select-item">
                                                    <div className={`box-select-cs ${activeCn === 0 ? "actived" : ""}`} onClick={() => {
                                                        setTitleSl1("Cập nhật hàng loạt")
                                                        setActiveCn(0)
                                                    }}>
                                                        <span className="ic">
                                                            <img src={btnIcPro0} alt="" />
                                                        </span>
                                                        <p className="note-sm cl-text fw-5">
                                                            Cập nhật hàng loạt
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className="box-select-item">
                                                    <div className={`box-select-cs ${activeCn === 1 ? "actived" : ""}`} onClick={() => {
                                                        setTitleSl1("Thiết lập giá")
                                                        setActiveCn(1)
                                                        setShowPopup(true)
                                                    }}>
                                                        <span className="ic">
                                                            <img src={scs1} alt="" />
                                                        </span>
                                                        <p className="note-sm cl-text fw-5">
                                                            Thiết lập giá
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className="box-select-item">
                                                    <div className={`box-select-cs ${activeCn === 2 ? "actived" : ""}`} onClick={() => {
                                                        setTitleSl1("Quảng bán trên Storefont")
                                                        setActiveCn(2)
                                                        document.body.style.overflow = "hidden"
                                                    }}>
                                                        <span className="ic">
                                                            <img src={scs2} alt="" />
                                                        </span>
                                                        <p className="note-sm cl-text fw-5">
                                                            Quảng bán trên Storefont
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className="box-select-item">
                                                    <div className={`box-select-cs ${activeCn === 3 ? "actived" : ""}`} onClick={() => {
                                                        setTitleSl1("Vận chuyển & Nhận hàng")
                                                        setActiveCn(3)
                                                    }}>
                                                        <span className="ic">
                                                            <img src={scs3} alt="" />
                                                        </span>
                                                        <p className="note-sm cl-text fw-5">
                                                            Vận chuyển & Nhận hàng
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className="box-select-item">
                                                    <div className={`box-select-cs ${activeCn === 4 ? "actived" : ""}`} onClick={() => {
                                                        setTitleSl1("Xóa các mục đã chọn")
                                                        setActiveCn(4)
                                                    }}>
                                                        <span className="ic">
                                                            <img src={scs4} alt="" />
                                                        </span>
                                                        <p className="note-sm cl-text fw-5">
                                                            Xóa các mục đã chọn
                                                        </p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                    </label>
                                </div>
                                <div className="product_filter--top-item d-item">
                                    <Select2Component
                                        options={optionsSl}
                                        value={selectedValueSl}
                                        onChange={handleSelectChangeSl}
                                        isSearchable={false}
                                    />
                                </div>
                                <div className="product_filter--top-item d-item">
                                    <div className="box-search">
                                        <input type="text" onKeyDown={handleKeyEnter} onChange={(e) => {

                                            setValueSearchKeyWord(e.target.value)
                                        }} placeholder='Tên , Mã sản phẩm' className="form-item-ip" value={valueSearchKeyWord} />
                                        <button onClick={handleBtnSearch} className="btn">
                                            <span className="btn-ic">
                                                <img src={icSearch} alt="" />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="product_filter--top-item d-item">
                                    <button className='btn btnFil' onClick={() => {
                                        $(boxRef.current).slideToggle(500);
                                    }}>
                                        <span className="btn-ic">
                                            <img src={icFilter} alt="" />
                                        </span>
                                        <span className="btn-text">
                                            Bộ lọc
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="product_filter--bottom" ref={boxRef}>
                            <div className="product_filter--bottom-box">
                                <div className="product_filter--bottom-top">
                                    <div className="product_filter--bottom-top-lf">
                                        <p className="note-lg fw-6 cl-pri">
                                            Bộ lọc sản phẩm
                                        </p>
                                    </div>
                                    <div className="product_filter--bottom-top-rt">
                                        <div className={`product_filter--bottom-top-rt-item ${activeBl === "all" ? "actived" : ""}`} onClick={() => {
                                            localStorage.setItem("activeBl", "all")
                                            localStorage.setItem("statusPro", "null")
                                            localStorage.setItem("idCategories", "null")
                                            localStorage.setItem("quantityCategories", 0)
                                            localStorage.setItem("pagePagi", 0)
                                            localStorage.setItem("typePro", "null")

                                            setActiveBl("all");
                                            setSelectedValueKho("null");
                                            setChangeBl("null");
                                            setIdCate();
                                            setCateQuantity(0)
                                            setSelectedValueSp("null")

                                            setListCheckBoxPro([]);


                                            navigate(`?${localStorage.getItem('idCategories') !== "null" ? "idCategories=" + localStorage.getItem('idCategories') : ""}${localStorage.getItem('quantityCategories') !== "-1" ? "&quantityCategories=" + localStorage.getItem('quantityCategories') : ""}${localStorage.getItem('statusPro') !== "null" ? "&status=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('typePro') !== "null" ? "&type=" + localStorage.getItem('typePro') : ""}${localStorage.getItem('statusPro') !== "null" ? "&post_type=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('valueSearch') !== "" ? "&paramSearch=" + localStorage.getItem('valueSearch') : ""}`);


                                        }}>
                                            <p className="note-sm cl-text fw-4">
                                                Tất cả
                                                <strong className='fw-6'> ({totalProduct === "Null" ? 0 : totalProduct})</strong>
                                            </p>
                                        </div>
                                        <div className={`product_filter--bottom-top-rt-item ${activeBl === "dxb" ? "actived" : ""}`} onClick={() => {
                                            localStorage.setItem("activeBl", "dxb")
                                            localStorage.setItem("statusPro", "publish")
                                            localStorage.setItem("idCategories", "null")
                                            localStorage.setItem("quantityCategories", 0)
                                            localStorage.setItem("pagePagi", 0)
                                            localStorage.setItem("typePro", "null")
                                            localStorage.setItem("activeDm", -1)
                                            localStorage.setItem("titleSlDm", "Chọn danh mục")

                                            setActiveBl("dxb")
                                            setSelectedValueKho("publish");
                                            setChangeBl("publish")
                                            setIdCate();
                                            setCateQuantity(0)
                                            setSelectedValueSp("null")
                                            setTitleSlDm("Chọn danh mục")
                                            setActiveDm(-1)

                                            setListCheckBoxPro([]);

                                            navigate(`?${localStorage.getItem('idCategories') !== "null" ? "idCategories=" + localStorage.getItem('idCategories') : ""}${localStorage.getItem('quantityCategories') !== "-1" ? "&quantityCategories=" + localStorage.getItem('quantityCategories') : ""}${localStorage.getItem('statusPro') !== "null" ? "&status=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('typePro') !== "null" ? "&type=" + localStorage.getItem('typePro') : ""}${localStorage.getItem('statusPro') !== "null" ? "&post_type=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('valueSearch') !== "" ? "&paramSearch=" + localStorage.getItem('valueSearch') : ""}`);
                                        }}>
                                            <p className="note-sm cl-text fw-4">
                                                Đã xuất bản
                                                <strong className='fw-6'> ({totalProductAo === "Null" ? 0 : totalProductAo})</strong>
                                            </p>
                                        </div>
                                        <div className={`product_filter--bottom-top-rt-item ${activeBl === "bn" ? "actived" : ""}`} onClick={() => {
                                            localStorage.setItem("activeBl", "bn")
                                            localStorage.setItem("statusPro", "draft")
                                            localStorage.setItem("idCategories", "null")
                                            localStorage.setItem("quantityCategories", 0)
                                            localStorage.setItem("pagePagi", 0)
                                            localStorage.setItem("typePro", "null")
                                            localStorage.setItem("activeDm", -1)
                                            localStorage.setItem("titleSlDm", "Chọn danh mục")

                                            setActiveBl("bn")
                                            setSelectedValueKho("draft");
                                            setChangeBl("draft")
                                            setIdCate();
                                            setCateQuantity(0)
                                            setSelectedValueSp("null")
                                            setTitleSlDm("Chọn danh mục")
                                            setActiveDm(-1)

                                            setListCheckBoxPro([]);


                                            navigate(`?${localStorage.getItem('idCategories') !== "null" ? "idCategories=" + localStorage.getItem('idCategories') : ""}${localStorage.getItem('quantityCategories') !== "-1" ? "&quantityCategories=" + localStorage.getItem('quantityCategories') : ""}${localStorage.getItem('statusPro') !== "null" ? "&status=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('typePro') !== "null" ? "&type=" + localStorage.getItem('typePro') : ""}${localStorage.getItem('statusPro') !== "null" ? "&post_type=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('valueSearch') !== "" ? "&paramSearch=" + localStorage.getItem('valueSearch') : ""}`);

                                        }}>
                                            <p className="note-sm cl-text fw-4">
                                                Bản nháp
                                                <strong className='fw-6'> ({totalProductDraft === "Null" ? 0 : totalProductDraft})</strong>
                                            </p>
                                        </div>
                                        <div className={`product_filter--bottom-top-rt-item ${activeBl === "tr" ? "actived" : ""}`} onClick={() => {
                                            localStorage.setItem("activeBl", "tr")
                                            localStorage.setItem("statusPro", "trash")
                                            localStorage.setItem("idCategories", "null")
                                            localStorage.setItem("quantityCategories", 0)
                                            localStorage.setItem("pagePagi", 0)
                                            localStorage.setItem("typePro", "null")
                                            localStorage.setItem("activeDm", -1)
                                            localStorage.setItem("titleSlDm", "Chọn danh mục")

                                            setActiveBl("tr")
                                            setChangeBl("trash")
                                            setSelectedValueKho("trash");
                                            setIdCate();
                                            setCateQuantity(0)
                                            setSelectedValueSp("null")
                                            setTitleSlDm("Chọn danh mục")
                                            setActiveDm(-1)

                                            setListCheckBoxPro([]);

                                            navigate(`?${localStorage.getItem('idCategories') !== "null" ? "idCategories=" + localStorage.getItem('idCategories') : ""}${localStorage.getItem('quantityCategories') !== "-1" ? "&quantityCategories=" + localStorage.getItem('quantityCategories') : ""}${localStorage.getItem('statusPro') !== "null" ? "&status=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('typePro') !== "null" ? "&type=" + localStorage.getItem('typePro') : ""}${localStorage.getItem('statusPro') !== "null" ? "&post_type=" + localStorage.getItem('statusPro') : ""}${localStorage.getItem('valueSearch') !== "" ? "&paramSearch=" + localStorage.getItem('valueSearch') : ""}`);

                                        }}>
                                            <p className="note-sm cl-text fw-4">
                                                Thùng rác
                                                <strong className='fw-6'> ({totalProductTrash === "Null" ? 0 : totalProductTrash})</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="product_filter--bottom-bottom">
                                    <div className="product_filter--bottom-bottom-list d-wrap">
                                        {
                                            activeBl === "tr" && <div className={`product_filter--bottom-bottom-item d-item ${listCheckBoxPro.length > 0 ? "" : "notAction"}`}>

                                                <Select2Component
                                                    options={optionsHd2}
                                                    value={selectedValueHd2}
                                                    onChange={handleSelectChangeHd2}
                                                    isSearchable={false}
                                                />
                                            </div>
                                        }
                                        {
                                            activeBl !== "tr" && <div className={`product_filter--bottom-bottom-item d-item ${listCheckBoxPro.length > 0 ? "" : "notAction"}`}>

                                                <Select2Component
                                                    options={optionsHd1}
                                                    value={selectedValueHd}
                                                    onChange={handleSelectChangeHd}
                                                    isSearchable={false}
                                                />
                                            </div>
                                        }
                                        <div className="product_filter--bottom-bottom-item d-item">
                                            <label className="box-select">
                                                <span className="box-select-title">
                                                    <p className="note-sm cl-text fw-5">
                                                        {
                                                            titleSlDm ? titleSlDm : "Chọn danh mục"
                                                        }
                                                    </p>
                                                    <FontAwesomeIcon icon={faAngleDown} />
                                                </span>
                                                <input className='ipDropDown' type="checkbox" />
                                                <div className="box-select-op">
                                                    <ul className="box-select-list">
                                                        <li className="box-select-item">
                                                            <div className={`box-select-cs ${activeDm === -1 ? "actived" : ""}`} onClick={() => {
                                                                setTitleSlDm("Chọn danh mục")
                                                                setIdCate(null)
                                                                setActiveDm(-1)
                                                                setCateQuantity(-1)
                                                                localStorage.setItem("activeDm", -1)
                                                                localStorage.setItem("titleSlDm", "Chọn danh mục")

                                                            }}>
                                                                <p className="note-sm cl-text fw-5">
                                                                    Chọn danh mục
                                                                </p>
                                                            </div>
                                                        </li>
                                                        {
                                                            dataProductCate?.productCategories?.edges.map((data, index) => {
                                                                if (!data.node) return null;
                                                                return (
                                                                    <li key={index} className="box-select-item">
                                                                        <div className={`box-select-cs ${activeDm === index ? "actived" : ""}`} id={data.node.id} onClick={() => {
                                                                            setTitleSlDm(data.node.name);
                                                                            setActiveDm(index);
                                                                            setIdCate(data.node.termTaxonomyId)
                                                                            setActiveDmChild();
                                                                            setCateQuantity(data.node?.count)
                                                                            localStorage.setItem("activeDm", index)
                                                                            localStorage.setItem("activeDmChild", "")
                                                                            localStorage.setItem("titleSlDm", data.node.name)
                                                                        }}>
                                                                            <p className="note-sm cl-text fw-5">
                                                                                {data.node?.name}
                                                                                <span className="note-sm fw-4">({data.node?.count === null ? "0" : data.node?.count})</span>
                                                                            </p>
                                                                        </div>
                                                                        {
                                                                            data.node?.children?.edges.length > 0 ? (
                                                                                <ul className="box-select-list">
                                                                                    {data.node.children.edges.map((child, childIndex) => {
                                                                                        return (
                                                                                            <li key={childIndex} className="box-select-item">
                                                                                                <div className={`box-select-cs ${activeDmChild === childIndex ? "actived" : ""}`} id={child.node.id} onClick={() => {
                                                                                                    setTitleSlDm(child.node.name);
                                                                                                    setActiveDmChild(childIndex);
                                                                                                    setIdCate(child.node.termTaxonomyId);
                                                                                                    setActiveDm();
                                                                                                    setCateQuantity(data.node?.count)
                                                                                                    localStorage.setItem("titleSlDm", child.node.name)
                                                                                                    localStorage.setItem("activeDm", "")
                                                                                                    localStorage.setItem("activeDmChild", childIndex)
                                                                                                }}>
                                                                                                    <p className="note-sm cl-text fw-5">
                                                                                                        {child.node?.name}
                                                                                                        <span className="note-sm fw-4">({child.node?.count === null ? 0 : child.node?.count})</span>
                                                                                                    </p>
                                                                                                </div>
                                                                                                {
                                                                                                    child.node?.children?.edges.length > 0 ? (
                                                                                                        <ul className="box-select-list">
                                                                                                            {child.node.children.edges.map((child2, childIndex2) => {
                                                                                                                return (
                                                                                                                    <li key={childIndex2} className="box-select-item">
                                                                                                                        <div className={`box-select-cs ${activeDmChild === childIndex2 ? "actived" : ""}`} id={child2.node.id} onClick={() => {
                                                                                                                            setTitleSlDm(child2.node.name);
                                                                                                                            setActiveDmChild(childIndex2);
                                                                                                                            setIdCate(child2.node.termTaxonomyId);
                                                                                                                            setActiveDm();
                                                                                                                            setCateQuantity(data.node?.count)
                                                                                                                            localStorage.setItem("titleSlDm", child2.node.name)
                                                                                                                            localStorage.setItem("activeDm", "")
                                                                                                                            localStorage.setItem("activeDmChild", childIndex2)
                                                                                                                        }}>
                                                                                                                            <p className="note-sm cl-text fw-5">
                                                                                                                                {child2.node?.name}
                                                                                                                                <span className="note-sm fw-4">({child2.node?.count === null ? 0 : child2.node?.count})</span>
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                    </li>
                                                                                                                )
                                                                                                            })}
                                                                                                        </ul>
                                                                                                    ) : ""
                                                                                                }
                                                                                            </li>
                                                                                        )
                                                                                    })}
                                                                                </ul>
                                                                            ) : ""
                                                                        }
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>

                                            </label>
                                        </div>
                                        <div className="product_filter--bottom-bottom-item d-item">
                                            <Select2Component
                                                options={optionsSp}
                                                value={selectedValueSp}
                                                onChange={handleSelectChangeSp}
                                                isSearchable={false}
                                            />
                                        </div>
                                        {
                                            activeBl === "dxb" || activeBl === "bn" || activeBl === "tr"
                                                ?
                                                ""
                                                :
                                                <div className="product_filter--bottom-bottom-item d-item">
                                                    <Select2Component
                                                        options={optionsKho}
                                                        value={selectedValueKho}
                                                        onChange={handleSelectChangeKho}
                                                        isSearchable={false}
                                                    />
                                                </div>
                                        }
                                        <div className="product_filter--bottom-bottom-item d-item">
                                            <button onClick={handleApDung} className="btn">
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
                    <ProductTable list={listSubmit} changeBl={changeBl} selectedValueSl={selectedValueSl} valueSearch={valueSearch} setListCheckBoxPro={setListCheckBoxPro} listCheckBoxPro={listCheckBoxPro} setSelectedValueHd={setSelectedValueHd} setSelectedValueHd2={setSelectedValueHd2} />
                </div>
                <TotalPro totalProduct={totalProduct} />
            </div>
            <PopupPrice1 showPopup={showPopup} setShowPopup={setShowPopup} />
        </div >
    )
}

export default Product
