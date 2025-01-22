
import React, { useEffect, useRef, useState } from 'react'
import ictitle from "../../assets/images/ictitle.svg"
import "../../sass/pages/category.scss"
import { GET_ALL_CATEGORIES, GET_PRODUCT_CATEGORIES } from '../../Query/getPosts'
import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import PopupUpdateImage from '../../components/PopupUpdateImage/PopupUpdateImage'
import icEditImg from "../../assets/images/icEditImg.png"
import icDeleteImg from "../../assets/images/icDeleteImg.png"
import icSearch from "../../assets/images/mnic6.png"
import CategoryTable from './CategoryTable'
import axios from 'axios'
import { toast } from 'react-toastify'
import client from '../../api/ApolloClient'
import { ClipLoader } from 'react-spinners'
import Select2Component from '../../components/Select2Component/Select2Component'
import { Helmet } from 'react-helmet'
import { useLocation, useNavigate } from 'react-router-dom'


const optionsCate = [
    { value: 'null', label: 'Hành động' },
    { value: 'deleteCate', label: 'Xóa' },
];

const Category = () => {

    const { data: dataProductCate } = useQuery(GET_PRODUCT_CATEGORIES)
    const [titleSlDm, setTitleSlDm] = useState("Chọn danh mục")

    const [activeDm, setActiveDm] = useState(-1)


    const [activeDmChild, setActiveDmChild] = useState(-1)


    const [idAva, setIdAva] = useState("")
    const [showedChangeAva, setShowedChangeAva] = useState(false)
    const [tabActived, setTabActived] = useState(1)


    const [editCate, setEditCate] = useState(false)
    const [idCate, setIdCate] = useState(0)
    const [valueSearchKeyWord, setValueSearchKeyWord] = useState("")
    const [nameCate, setNameCate] = useState("")
    const [descriptionCate, setDescriptionCate] = useState("")
    const [slugCate, setSlugCate] = useState("")
    const [avatarProduct, setAvatarProduct] = useState({
        image: "",
        id: "",
    })
    const [idDm, setIdDm] = useState("")
    const childRef = useRef();

    const [page, setPage] = useState(() => {
        // Lấy giá trị page từ localStorage khi khởi tạo state
        return Number(localStorage.getItem("pagePagiCate")) || 1;
    });

    const location = useLocation();

    useEffect(() => {
        return () => {
            // Xóa localStorage khi rời khỏi trang
            localStorage.setItem("pagePagiCate",1);
        };
    }, [location.pathname]);

    console.log("location",location)

    const [loadingCate, setLoadingCate] = useState(false)

    const [nameError, setNameError] = useState(false)

    const [listCheckBoxCate, setListCheckBoxCate] = useState([])


    console.log(avatarProduct)

    const [selectedValueCate, setSelectedValueCate] = useState("null")
    const [loadingDelete, setLoadingDelete] = useState(false)
    const navigate = useNavigate(); // Hook nằm bên trong component


    const handleSelectChangeCate = (value) => {
        setSelectedValueCate(value);
    };






    const handleOpenPopup = () => {
        setTabActived(2)
        setShowedChangeAva(true)
        setIdAva("")

    }

    const handleCancelEditCate = () => {
        setIdCate(0)
        setNameCate("")
        setActiveDm(-1)
        setActiveDmChild(-1)
        setDescriptionCate("")
        setSlugCate("")
        setTitleSlDm("")
        setEditCate(false)
        setAvatarProduct({
            id: "",
            image: ""
        })
        localStorage.setItem("idAvatar", "")

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
            parent: idCate !== null && idCate !== -1 ? idCate : 0,
            ...(avatarProduct.image !== "" && avatarProduct.id !== ""
                ?
                {
                    image: {
                        id: Number(atob(avatarProduct.id).match(/:(\d+)$/)?.[1]) || 0,
                        src: avatarProduct.image,
                    }
                }
                :
                ""
            )

        }

        console.log(listSubmit)

        const token = localStorage.getItem('authToken');
        const baseUrl = process.env.REACT_APP_BASE_URL;

        setLoadingCate(true)


        axios
            .post(`${baseUrl}/wp-json/wc/v3/products/categories`, listSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                toast.success("Thêm danh mục thành công", {
                    autoClose: 3000,
                });

                childRef.current.refetchCategories(); // Gọi refetch từ component con
                setNameCate("")
                setActiveDm(-1)
                setActiveDmChild(-1)
                setDescriptionCate("")
                setSlugCate("")
                setTitleSlDm("")
                setEditCate(false)
                setAvatarProduct({
                    id: "",
                    image: ""
                })
                setPage(1)
                setIdCate(0)
                setLoadingCate(false)

                localStorage.setItem("pagePagiCate", 1)
                navigate(``);


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
                toast.error("Thêm danh mục thất bại", {
                    autoClose: 3000,
                });

                setLoadingCate(false)
                console.error('Lỗi khi thêm danh mục:', error.response.data);

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
            parent: idCate !== null && idCate !== -1 ? idCate : 0,
            ...(avatarProduct.image !== "" && avatarProduct.id !== ""
                ?
                {
                    image: {
                        id: Number(atob(avatarProduct.id).match(/:(\d+)$/)?.[1]) || 0,
                        src: avatarProduct.image,
                    }
                }
                :
                ""
            )

        }

        console.log(listSubmitUpdate)

        const token = localStorage.getItem('authToken');
        const baseUrl = process.env.REACT_APP_BASE_URL;


        axios
            .put(`${baseUrl}/wp-json/wc/v3/products/categories/${idDm}`, listSubmitUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                toast.success("Cập nhật danh mục thành công", {
                    autoClose: 3000,
                });

                childRef.current.refetchCategories(); // Gọi refetch từ component con
                setIdCate(0)
                setNameCate("")
                setActiveDm(-1)
                setActiveDmChild(-1)
                setDescriptionCate("")
                setSlugCate("")
                setTitleSlDm("")
                setEditCate(false)
                setAvatarProduct({
                    id: "",
                    image: ""
                })
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
                toast.error("Cập nhật danh mục thất bại", {
                    autoClose: 3000,
                });
                setLoadingCate(false)
                console.error('Lỗi khi thêm danh mục:', error.response.data);

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




    const renderChildren = (children, activeDmChild, setActiveDmChild, setTitleSlDm, setIdCate) => {
        return (
            <ul className="box-select-list">
                {children.map((child, childIndex) => {
                    return (
                        <li key={childIndex} className="box-select-item">
                            <div
                                className={`box-select-cs ${activeDmChild === child.node.termTaxonomyId ? "actived" : ""}`}
                                id={child.node.id}
                                onClick={() => {
                                    setTitleSlDm(child.node.name);
                                    setActiveDmChild(child.node.termTaxonomyId);
                                    setIdCate(child.node.termTaxonomyId);

                                }}
                            >
                                <p className="note-sm cl-text fw-5">
                                    {child.node?.name}
                                </p>
                            </div>
                            {/* Kiểm tra nếu có cấp con, tiếp tục gọi hàm đệ quy */}
                            {child.node?.children?.edges?.length > 0 && renderChildren(child.node.children.edges, activeDmChild, setActiveDmChild, setTitleSlDm, setIdCate)}
                        </li>
                    );
                })}
            </ul>
        );
    };


    console.log(activeDm)
    console.log(activeDmChild)
    return (
        <>
            <Helmet>
                <title>Danh mục</title>
            </Helmet>
            <div className='category'>
                <div className="layout_top">
                    <div className="layout_top--title">
                        <span className="ic">
                            <img src={ictitle} alt="ictitle" />
                        </span>
                        <h1 className="title-mn fw-6 cl-text">
                            Danh mục sản phẩm
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
                                                Cập nhật danh mục
                                            </>
                                            :
                                            <>
                                                Thêm danh mục mới
                                            </>
                                    }
                                </p>
                            </div>
                            <div className="category_lf--form">
                                <ul className="category_lf--form-list">
                                    <li className="category_lf--form-item">
                                        <label className="form-item">
                                            <p className="note-text fw-6">
                                                Tên danh mục
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

                                            }} type="text" className="form-item-ip" placeholder="Tên danh mục" />

                                            {
                                                nameError && <p className="form-item-error">
                                                    Tên danh mục không được để trống
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
                                                Danh mục cha
                                            </p>
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
                                                                setIdCate(0)
                                                                setActiveDm(-1)
                                                                localStorage.setItem("activeDm", -1)
                                                                localStorage.setItem("titleSlDm", "Chọn danh mục")

                                                            }}>
                                                                <p className="note-sm cl-text fw-5">
                                                                    Chọn danh mục
                                                                </p>
                                                            </div>
                                                        </li>
                                                        {dataProductCate?.productCategories?.edges.map((data, index) => {
                                                            if (!data.node) return null;
                                                            return (
                                                                <li key={index} className="box-select-item">
                                                                    <div
                                                                        className={`box-select-cs ${activeDm === data.node.termTaxonomyId ? "actived" : ""}`}
                                                                        id={data.node.id}
                                                                        onClick={() => {
                                                                            setTitleSlDm(data.node.name);
                                                                            setActiveDm(data.node.termTaxonomyId);
                                                                            setIdCate(data.node.termTaxonomyId);
                                                                            setActiveDmChild();
                                                                        }}
                                                                    >
                                                                        <p className="note-sm cl-text fw-5">
                                                                            {data.node?.name}

                                                                        </p>
                                                                    </div>
                                                                    {/* Kiểm tra nếu có cấp con, tiếp tục gọi hàm đệ quy */}
                                                                    {data.node?.children?.edges?.length > 0 && renderChildren(data.node.children.edges, activeDmChild, setActiveDmChild, setTitleSlDm, setIdCate)}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>

                                            </label>
                                        </label>
                                        <p className="note-mn cl-gray2">
                                            Chỉ định một danh mục cha để tạo đa cấp. Chẳng hạn, chuyên mục nhạc sẽ là danh mục cha của Hiphop và Jazz.
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
                                    <li className="category_lf--form-item">
                                        <label className="form-item">
                                            <p className="note-text fw-6">
                                                Hình ảnh đại diện
                                            </p>
                                        </label>
                                        <div className="category_lf--form-item-imgs">
                                            {
                                                avatarProduct.image !== ""
                                                    ?
                                                    <div className="category_lf--form-item-img">
                                                        <img src={avatarProduct.image} alt={avatarProduct.id} />
                                                        <div className="category_lf--form-item-img-ics">
                                                            <span className="ic" onClick={() => {
                                                                setTabActived(2)
                                                                setShowedChangeAva(true)
                                                                setIdAva(avatarProduct.id)
                                                            }}>
                                                                <img src={icEditImg} alt="" />
                                                            </span>
                                                            <span className="ic" onClick={() => {
                                                                setAvatarProduct({
                                                                    image: "",
                                                                    id: ""
                                                                })
                                                            }}>
                                                                <img src={icDeleteImg} alt="" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div onClick={() => {
                                                        handleOpenPopup()

                                                    }} className="productTq_alb--item-up">
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
                                            }
                                        </div>
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
                                                    Cập nhật danh mục
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
                                                Thêm danh mục mới
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
                                        Danh mục sản phẩm
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
                                        }} placeholder='Tên danh mục' className="form-item-ip" value={valueSearchKeyWord} />
                                        <button className="btn">
                                            <span className="btn-ic">
                                                <img src={icSearch} alt="" />
                                            </span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className="category_rt--table">
                                <CategoryTable ref={childRef} valueSearchKeyWord={valueSearchKeyWord} setActiveDm={setActiveDm} setActiveDmChild={setActiveDmChild} setTitleSlDm={setTitleSlDm} setEditCate={setEditCate} setNameCate={setNameCate} setDescriptionCate={setDescriptionCate} setSlugCate={setSlugCate} setIdCate={setIdCate} setAvatarProduct={setAvatarProduct} page={page} setPage={setPage} setIdAva={setIdAva} setIdDm={setIdDm} listCheckBoxCate={listCheckBoxCate} setListCheckBoxCate={setListCheckBoxCate} selectedValueCate={selectedValueCate} setSelectedValueCate={setSelectedValueCate} setLoadingDelete={setLoadingDelete} loadingDelete={loadingDelete} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PopupUpdateImage showedChangeAva={showedChangeAva} setShowedChangeAva={setShowedChangeAva} idAva={idAva} setIdAva={setIdAva} tabActived={tabActived} setTabActived={setTabActived} setAvatarProduct={setAvatarProduct} id={""} />

        </>

    )
}

export default Category
