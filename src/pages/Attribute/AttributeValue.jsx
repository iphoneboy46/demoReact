
import React, { useEffect, useRef, useState } from 'react'
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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AttributeTableValue from './AttributeTableValue'
import PagiWeb from '../../components/PagiWeb/PagiWeb'


const optionsCate = [
    { value: 'null', label: 'Hành động' },
    { value: 'deleteCate', label: 'Xóa' },
];

const AttributeValue = () => {
    const { id, name, slug } = useParams();
    const [editCate, setEditCate] = useState(false)
    const [idCate, setIdCate] = useState(0)
    const [valueSearchKeyWord, setValueSearchKeyWord] = useState("")
    const [nameCate, setNameCate] = useState("")
    const [descriptionCate, setDescriptionCate] = useState("")
    const [slugCate, setSlugCate] = useState("")

    const [idDm, setIdDm] = useState("")
    const childRef = useRef();

    const [page, setPage] = useState(() => {
        // Lấy giá trị page từ localStorage khi khởi tạo state
        return Number(localStorage.getItem("pagePagiAttributeValue")) || 1;
    });

    const location = useLocation();

    useEffect(() => {
        return () => {
            // Xóa localStorage khi rời khỏi trang
            localStorage.setItem("pagePagiAttributeValue", 1);
        };
    }, [location.pathname]);

    const [loadingCate, setLoadingCate] = useState(false)

    const [nameError, setNameError] = useState(false)

    const [listCheckBoxCate, setListCheckBoxCate] = useState([])
    const [selectedValueCate, setSelectedValueCate] = useState("null")
    const [loadingDelete, setLoadingDelete] = useState(false)
    const navigate = useNavigate(); // Hook nằm bên trong component

    const handleSelectChangeCate = (value) => {
        setSelectedValueCate(value);
    };


    console.log("idDm", idDm)

    const handleCancelEditCate = () => {
        setIdCate(0)
        setNameCate("")
        setDescriptionCate("")
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
            description: descriptionCate,
            ...(slugCate !== "" ? { slug: slugCate } : ""),
        }

        console.log(listSubmit)

        const token = localStorage.getItem('authToken');
        const baseUrl = process.env.REACT_APP_BASE_URL;

        setLoadingCate(true)


        axios
            .post(`${baseUrl}/wp-json/wc/v3/products/attributes/${id}/terms`, listSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                toast.success("Thêm thành công", {
                    autoClose: 3000,
                });

                childRef.current.refetchCategories(); // Gọi refetch từ component con
                setNameCate("")
                setDescriptionCate("")
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
                toast.error("Thêm thất bại", {
                    autoClose: 3000,
                });

                setLoadingCate(false)
                console.error('Lỗi khi thêm:', error.response.data);

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
            description: descriptionCate,
            ...(slugCate !== "" ? { slug: slugCate } : ""),


        }

        console.log(listSubmitUpdate)

        const token = localStorage.getItem('authToken');
        const baseUrl = process.env.REACT_APP_BASE_URL;


        axios
            .put(`${baseUrl}/wp-json/wc/v3/products/attributes/${id}/terms/${idDm}`, listSubmitUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                toast.success("Cập nhật thành công", {
                    autoClose: 3000,
                });

                childRef.current.refetchCategories(); // Gọi refetch từ component con
                setIdCate(0)
                setNameCate("")
                setDescriptionCate("")
                setSlugCate("")
                setEditCate(false)
                setPage(1)


                setLoadingCate(false)

                console.log(response.data)

                localStorage.setItem("pagePagiAttributeValue", 1)
                navigate(``);

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
                toast.error("Cập nhật thất bại", {
                    autoClose: 3000,
                });
                setLoadingCate(false)
                console.error('Lỗi khi thêm:', error.response.data);

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
                <title>Sản phẩm {name}</title>
            </Helmet>
            <div className='category tags attributes'>
                <div className="layout_top">
                    <div className="layout_top--title">
                        <span className="ic">
                            <img src={ictitle} alt="ictitle" />
                        </span>
                        <h1 className="title-mn fw-6 cl-text">
                            Sản phẩm {name}
                        </h1>
                    </div>
                    <PagiWeb />
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
                                                Cập nhật {name}
                                            </>
                                            :
                                            <>
                                                Thêm mới {name}
                                            </>
                                    }
                                </p>
                            </div>
                            <div className="category_lf--form">
                                <ul className="category_lf--form-list">
                                    <li className="category_lf--form-item">
                                        <label className="form-item">
                                            <p className="note-text fw-6">
                                                Tên
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

                                            }} type="text" className="form-item-ip" placeholder="Tên" />

                                            {
                                                nameError && <p className="form-item-error">
                                                    Tên không được để trống
                                                </p>
                                            }
                                        </label>
                                        <p className="note-mn cl-gray2">
                                            Tên là cách nó xuất hiện trên trang web của bạn.
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
                                            "slug” là đường dẫn thân thiện của tên. Nó thường chỉ bao gồm kí tự viết thường, số và dấu gạch ngang, không dùng tiếng Việt.
                                        </p>
                                    </li>
                                    <li className="category_lf--form-item">
                                        <label className="form-item">
                                            <p className="note-text fw-6">
                                                Mô tả
                                            </p>
                                            <textarea onChange={(e) => {
                                                setDescriptionCate(e.target.value)
                                            }} value={descriptionCate} type="text" className="form-item-tx" placeholder="Mô tả" />
                                        </label>
                                        <p className="note-mn cl-gray2">
                                            Thông thường mô tả này không được sử dụng trong các giao diện, tuy nhiên có vài giao diện có thể hiển thị mô tả này.
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
                                                    Cập nhật
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
                                                Thêm mới
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
                                        {name}
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

                                    <div className="box-search">
                                        <input type="text" onChange={(e) => {

                                            setValueSearchKeyWord(e.target.value)
                                        }} placeholder='Tên' className="form-item-ip" value={valueSearchKeyWord} />
                                        <button className="btn">
                                            <span className="btn-ic">
                                                <img src={icSearch} alt="" />
                                            </span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className="category_rt--table">
                                <AttributeTableValue slug={slug} idAttribute={id} name={name} ref={childRef} valueSearchKeyWord={valueSearchKeyWord} setEditCate={setEditCate} setNameCate={setNameCate} setDescriptionCate={setDescriptionCate} setSlugCate={setSlugCate} setIdCate={setIdCate} page={page} setPage={setPage} listCheckBoxCate={listCheckBoxCate} setListCheckBoxCate={setListCheckBoxCate} selectedValueCate={selectedValueCate} setSelectedValueCate={setSelectedValueCate} setLoadingDelete={setLoadingDelete} loadingDelete={loadingDelete} setIdDm={setIdDm} idDm={idDm} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default AttributeValue
