
import React, { useRef, useState } from 'react'
import ictitle from "../../assets/images/ictitle.svg"
import "../../sass/pages/category.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import icSearch from "../../assets/images/mnic6.png"
import axios from 'axios'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import Select2Component from '../../components/Select2Component/Select2Component'
import { Helmet } from 'react-helmet'
import AttributesTable from './AtributesTable'


const optionsCate = [
    { value: 'null', label: 'Hành động' },
    { value: 'deleteCate', label: 'Xóa' },
];

const Attributes = () => {


    const [editCate, setEditCate] = useState(false)
    const [idCate, setIdCate] = useState(0)
    const [nameCate, setNameCate] = useState("")
    const [slugCate, setSlugCate] = useState("")

    const [idDm, setIdDm] = useState("")
    const childRef = useRef();

    const [page, setPage] = useState(() => {
        // Lấy giá trị page từ localStorage khi khởi tạo state
        return Number(localStorage.getItem("pagePagiTags")) || 1;
    });

    const [loadingCate, setLoadingCate] = useState(false)

    const [nameError, setNameError] = useState(false)

    const [listCheckBoxCate, setListCheckBoxCate] = useState([])
    const [selectedValueCate, setSelectedValueCate] = useState("null")
    const [loadingDelete, setLoadingDelete] = useState(false)


    const handleSelectChangeCate = (value) => {
        setSelectedValueCate(value);
    };



    const handleCancelEditCate = () => {
        setIdCate(0)
        setNameCate("")
        setSlugCate("")
        setEditCate(false)

        const container = document.querySelector(".layoutMain_rt--wrap");
        if (container) {
            container.scrollTo({
                top: 0, // Cuộn lên đầu trang
                left: 0,
                behavior: 'smooth', // Cuộn mượt mà
            }); // Cuộn container về đầu
        }

    }

    const handleAddCate = () => {
        const listSubmit = {
            // id: idCate,
            name: nameCate,
            ...(slugCate !== "" ? { slug: slugCate } : ""),
        }

        console.log(listSubmit)

        const token = localStorage.getItem('authToken');
        const baseUrl = process.env.REACT_APP_BASE_URL;

        setLoadingCate(true)


        axios
            .post(`${baseUrl}/wp-json/wc/v3/products/attributes`, listSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                toast.success("Thêm thẻ thành công", {
                    autoClose: 3000,
                });

                childRef.current.refetchCategories(); // Gọi refetch từ component con
                setNameCate("")
                setSlugCate("")
                setEditCate(false)
                setPage(1)
                setIdCate(0)
                setLoadingCate(false)


                const container = document.querySelector(".layoutMain_rt--wrap");
                if (container) {
                    container.scrollTo({
                        top: 0, // Cuộn lên đầu trang
                        left: 0,
                        behavior: 'smooth', // Cuộn mượt mà
                    }); // Cuộn container về đầu
                }



                console.log(response.data)
            })
            .catch((error) => {
                toast.error("Thêm thẻ thất bại", {
                    autoClose: 3000,
                });

                setLoadingCate(false)
                console.error('Lỗi khi thêm thẻ:', error.response.data);

                const container = document.querySelector(".layoutMain_rt--wrap");
                if (container) {
                    container.scrollTo({
                        top: 0, // Cuộn lên đầu trang
                        left: 0,
                        behavior: 'smooth', // Cuộn mượt mà
                    }); // Cuộn container về đầu
                }
            });
    }

    const handleUpdateCate = () => {
        setLoadingCate(true)

        const listSubmitUpdate = {
            // id: idCate,

            name: nameCate,
            ...(slugCate !== "" ? { slug: slugCate } : ""),


        }

        console.log(listSubmitUpdate)

        const token = localStorage.getItem('authToken');
        const baseUrl = process.env.REACT_APP_BASE_URL;


        axios
            .put(`${baseUrl}/wp-json/wc/v3/products/attributes/${idDm}`, listSubmitUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                toast.success("Cập nhật thẻ thành công", {
                    autoClose: 3000,
                });

                childRef.current.refetchCategories(); // Gọi refetch từ component con
                setIdCate(0)
                setNameCate("")
                setSlugCate("")
                setEditCate(false)
                setPage(1)


                setLoadingCate(false)

                console.log(response.data)

                const container = document.querySelector(".layoutMain_rt--wrap");
                if (container) {
                    container.scrollTo({
                        top: 0, // Cuộn lên đầu trang
                        left: 0,
                        behavior: 'smooth', // Cuộn mượt mà
                    }); // Cuộn container về đầu
                }
            })
            .catch((error) => {
                toast.error("Cập nhật thẻ thất bại", {
                    autoClose: 3000,
                });
                setLoadingCate(false)
                console.error('Lỗi khi thêm thẻ:', error.response.data);

                const container = document.querySelector(".layoutMain_rt--wrap");
                if (container) {
                    container.scrollTo({
                        top: 0, // Cuộn lên đầu trang
                        left: 0,
                        behavior: 'smooth', // Cuộn mượt mà
                    }); // Cuộn container về đầu
                }
            });
    }

    console.log("idCate", idCate)



    return (
        <>
            <Helmet>
                <title>Thuộc tính</title>
            </Helmet>
            <div className='category tags'>
                <div className="layout_top">
                    <div className="layout_top--title">
                        <span className="ic">
                            <img src={ictitle} alt="ictitle" />
                        </span>
                        <h1 className="title-mn fw-6 cl-text">
                            Các thuộc tính
                        </h1>
                    </div>

                </div>
                <div className="category_wrap d-wrap">
                    <div className="category_lf d-item">
                        <div className="category_lf--wrap">
                            <div className="category_lf--title">
                                <p className="title-mn cl-text fw-6">
                                    {
                                        editCate
                                            ?
                                            <>
                                                Cập nhật thuộc tính
                                            </>
                                            :
                                            <>
                                                Thêm thuộc tính
                                            </>
                                    }
                                </p>
                                <p className="note-sm cl-text">
                                    Thuộc tính giúp bạn xác định các thông tin sản phẩm bổ sung, như kích thước hay màu sắc. Bạn có thể sử dụng các thuộc tính này trong cột phụ cửa hàng sử dụng widget.
                                </p>
                            </div>
                            <div className="category_lf--form">
                                <ul className="category_lf--form-list">
                                    <li className="category_lf--form-item">
                                        <label className="form-item">
                                            <p className="note-text fw-6">
                                                Tên thuộc tính
                                            </p>
                                            <input value={nameCate} onBlur={() => {
                                                setNameError(false)
                                            }} onKeyUp={() => {
                                                if (nameCate.length <= 0) {
                                                    setNameError(true);
                                                } else {
                                                    setNameError(false);

                                                }
                                            }} onChange={(e) => {
                                                setNameCate(e.target.value);

                                            }} type="text" className="form-item-ip" placeholder="Tên thuộc tính" />

                                            {
                                                nameError && <p className="form-item-error">
                                                    Tên thuộc tính   không được để trống
                                                </p>
                                            }
                                        </label>
                                        <p className="note-mn cl-gray2">
                                            Tên của thuộc tính (được hiển thị ngoài front-end)

                                        </p>
                                    </li>
                                    <li className="category_lf--form-item">
                                        <label className="form-item">
                                            <p className="note-text fw-6">
                                                Đường dẫn
                                            </p>
                                            <input onChange={(e) => {
                                                setSlugCate(e.target.value)
                                            }} value={slugCate} type="text" className="form-item-ip" placeholder="Tên đường dẫn" />
                                        </label>
                                        <p className="note-mn cl-gray2">
                                            Chuỗi đường dẫn tĩnh tham chiếu đến thuộc tính phải ngắn hơn 28 ký tự.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="category_lf--btn">
                                {
                                    editCate
                                        ?
                                        <>
                                            <button className={`btn ${loadingCate && "loadBtn"} ${nameCate.length <= 0 && "btnDis"}`} onClick={() => {
                                                handleUpdateCate()
                                            }}>
                                                <span className="btn-text">
                                                    Cập nhật thuộc tính
                                                </span>
                                                {
                                                    loadingCate && <span className="btn-loading">
                                                        <ClipLoader color="#007AFF" />
                                                    </span>
                                                }
                                            </button>
                                            <button className="btn red" onClick={() => {
                                                handleCancelEditCate()
                                            }}>
                                                <span className="btn-text">
                                                    Hủy
                                                </span>
                                            </button>
                                        </>
                                        :
                                        <button className={`btn ${loadingCate && "loadBtn"} ${nameCate.length <= 0 && "btnDis"}`} onClick={() => {
                                            handleAddCate()
                                        }}>
                                            <span className="btn-ic">
                                                <FontAwesomeIcon icon={faPlus} />
                                            </span>
                                            <span className="btn-text">
                                                Thêm thuộc tính mới
                                            </span>
                                            {
                                                loadingCate && <span className="btn-loading">
                                                    <ClipLoader color="#007AFF" />
                                                </span>
                                            }
                                        </button>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="category_rt d-item">
                        <div className="category_rt--wrap">
                            <div className="category_rt--title">
                                <div className="category_rt--title-top">
                                    <p className="title-mn fw-6 cl-text">
                                        Thuộc tính
                                    </p>
                                </div>
                                <div className="category_rt--title-bottom">
                                    <div className={`category_rt--title-sl ${listCheckBoxCate.length <= 0 || loadingDelete ? "dis" : ""}`}>
                                        <Select2Component
                                            options={optionsCate}
                                            value={selectedValueCate}
                                            onChange={handleSelectChangeCate}
                                            isSearchable={false}
                                        />
                                        {
                                            loadingDelete
                                            &&
                                            <div className="btn-loading-delete">
                                                <ClipLoader color="#007AFF" />
                                            </div>
                                        }

                                    </div>

                                </div>

                            </div>
                            <div className="category_rt--table">
                                <AttributesTable ref={childRef} setEditCate={setEditCate} setNameCate={setNameCate} setSlugCate={setSlugCate} setIdCate={setIdCate} page={page} setPage={setPage} listCheckBoxCate={listCheckBoxCate} setListCheckBoxCate={setListCheckBoxCate} selectedValueCate={selectedValueCate} setSelectedValueCate={setSelectedValueCate} setLoadingDelete={setLoadingDelete} loadingDelete={loadingDelete} setIdDm={setIdDm} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Attributes
