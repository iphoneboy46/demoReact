import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import "../../sass/pages/category.scss"
import imgNone from "../../assets/images/proDemo.png"
import { useQuery } from '@apollo/client';
import { GET_ALL_ATTRIBUTES_VALUE} from '../../Query/getPosts';
import edit from "../../assets/images/edit.png"
import { Tooltip } from 'react-tooltip';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { ClipLoader, ScaleLoader } from 'react-spinners'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';




const AttributeTableValue = forwardRef(
    ({ valueSearchKeyWord, setSlugCate, setDescriptionCate, setNameCate, setEditCate, setIdCate, page, setPage, listCheckBoxCate, setListCheckBoxCate, selectedValueCate, setSelectedValueCate, loadingDelete, setLoadingDelete, setIdDm , slug , name , idDm , idAttribute }, ref) => {
        const navigate = useNavigate(); // Hook nằm bên trong component
        

        const [totalPages, setTotalPages] = useState(0);  // Tổng số trang (tính một lần)
        const [checkedAllLength, setCheckedAllLength] = useState(false)
        const perPage = 8;  // Số lượng sản phẩm mỗi trang

        // Gọi GraphQL với Apollo Client, truyền offset, size,  vào
        const { loading: loadingCategoryAll, error, data: categoryAlls, refetch: refetchCategoryAll } = useQuery(GET_ALL_ATTRIBUTES_VALUE, {
            variables: {
                taxonomy:slug,
                page: page,
                perPage,
                ...(valueSearchKeyWord !== "" ? { search: valueSearchKeyWord } : "")
            },
            notifyOnNetworkStatusChange: true,  // Đảm bảo cập nhật khi dữ liệu thay đổi
            fetchPolicy: 'network-only',  // Đảm bảo luôn lấy dữ liệu mới mỗi lần thay đổi page
        });


        useImperativeHandle(ref, () => ({
            refetchCategories: () => refetchCategoryAll(),
        }));

        useEffect(() => {
            if (categoryAlls?.customTaxonomy?.total) {
                setTotalPages(Math.ceil(categoryAlls?.customTaxonomy?.total / perPage))
            }

            setIdDm()

            
        }, [categoryAlls])

        useEffect(() => {
            if (valueSearchKeyWord !== "") {
                setPage(1)
                localStorage.setItem("pagePagiAttributeValue", 1); // Lưu vào localStorage
                navigate(``)

            }
            refetchCategoryAll({
                page: page,
                perPage
            }); // Gọi lại API với offset mới
        }, [valueSearchKeyWord])

        // Khi trang thay đổi
        const handlePageChange = (selected) => {
            console.log(selected)
            const pageCong = selected + 1

            localStorage.setItem("pagePagiAttributeValue", (pageCong)); // Lưu vào localStorage
            setPage(Number(localStorage.getItem("pagePagiAttributeValue"))); // Cập nhật state
            refetchCategoryAll({
                page: page,
                perPage
            }); // Gọi lại API với offset mới


            navigate(`?${localStorage.getItem('pagePagiAttributeValue') !== "" ? "&page=" + (Number(localStorage.getItem('pagePagiAttributeValue'))) : ""} `);
        };

        console.log(categoryAlls)

        const handleEditCate = (data) => {
            console.log("dataEdit", data)
            setIdCate(data.id)
            setNameCate(data.name)
            setDescriptionCate(data.description)
            setSlugCate(data.slug)
            setEditCate(true)
            setIdDm(data.id)

            const container = document.querySelector(".layoutMain_rt--wrap");
            if (container) {
                container.scrollTo({
                    top: 0, // Cuộn lên đầu trang
                    left: 0,
                    behavior: 'smooth', // Cuộn mượt mà
                }); // Cuộn container về đầu
            }

        }


        // hàm xét đki nếu checked đc thêm vào list ko thì xóa
        function handleChangeCheckBox(e, id) {
            if (e.target.checked) {
                setListCheckBoxCate((prevList) => {
                    return [id, ...prevList];
                });

            } else {
                setListCheckBoxCate((prevList) => {
                    const newArray = prevList.filter((item) => item !== id);
                    return newArray;
                });
            }
        }

        function handleChangeCheckBoxAll(e) {

            if (e.target.checked) {
                const table = document.querySelector(".category_table")
                const items = table.querySelectorAll(".category_table--item")
                items.forEach((item) => {
                    item.querySelector(".boxCk input").checked = true;
                });
                const allIds = categoryAlls?.getProductCategories?.categories.map((data) => data.id);
                setListCheckBoxCate(allIds);


            } else {
                const table = document.querySelector(".category_table")
                const items = table.querySelectorAll(".category_table--item")
                items.forEach((item) => {
                    item.querySelector(".boxCk input").checked = false;

                });
                setListCheckBoxCate([]);
            }
        }

        console.log(listCheckBoxCate)

        console.log(categoryAlls?.getProductCategories?.categories?.length)

        useEffect(() => {
            if (listCheckBoxCate.length !== categoryAlls?.getProductCategories?.categories?.length) {
                setCheckedAllLength(false)
            } else {
                setCheckedAllLength(true)
            }
        }, [listCheckBoxCate])

        useEffect(() => {
            if (selectedValueCate === "deleteCate") {
                handleDeleteCategories();
            }
        }, [selectedValueCate]);

        const handleDeleteCategories = () => {
            setLoadingDelete((prevState) => {
                const updatedStatus = { ...prevState };
                listCheckBoxCate.forEach((id) => {
                    updatedStatus[id] = true;
                });
                return updatedStatus;
            });
            if (listCheckBoxCate.length === 0) {
                console.log("No categories selected for deletion.");
                return;
            }

            const token = localStorage.getItem('authToken');
            const baseUrl = process.env.REACT_APP_BASE_URL;

            // Xóa từng danh mục dựa trên ID
            const deleteRequests = listCheckBoxCate.map((id) =>
                axios
                    .delete(`${baseUrl}/wp-json/wc/v3/products/attributes/${idAttribute}/terms/${id}?force=true`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Thêm token vào header
                        },
                    })
                    .then((response) => {
                        // console.log(`Deleted category ID ${id}:`, response.data);
                        toast.success(`Xoá ID ${id} thành công`, {
                            autoClose: 3000,
                        });
                    })
                    .catch((error) => {
                        console.error(`Error deleting category ID ${id}:`, error.response?.data || error.message);
                        toast.error("Xoá thất bại", {
                            autoClose: 3000,
                        });
                    })
            );

            // Chờ tất cả yêu cầu hoàn tất
            Promise.all(deleteRequests).then(() => {
                console.log("All categories processed.");
                setListCheckBoxCate([]); // Xóa danh sách sau khi hoàn tất
                setSelectedValueCate('null'); // Reset giá trị select
                refetchCategoryAll({});
                setLoadingDelete(false);
            });
        };


        return (
            <div className="category_table tags">
                <div className="category_table--wrap">
                    <div className="category_table--table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <label className='boxCk' onChange={(e) => {
                                            handleChangeCheckBoxAll(e)
                                        }}>
                                            <input type="checkbox" checked={checkedAllLength} />
                                            <span className="box"></span>
                                        </label>
                                    </th>
                                    <th>
                                        <p className="note-text fw-5 cl-text">
                                            Tên 
                                        </p>
                                    </th>
                                    <th>
                                        <p className="note-text fw-5 cl-text">
                                            Mô tả
                                        </p>
                                    </th>
                                    <th>
                                        <p className="note-text fw-5 cl-text">
                                            Đường dẫn
                                        </p>
                                    </th>
                                    <th>
                                        <p className="note-text fw-5 cl-text t-center">
                                            Lượt
                                        </p>
                                    </th>
                                    <th>
                                        <p className="note-text fw-5 cl-text t-center">
                                            Hành động
                                        </p>
                                    </th>
                                </tr>
                            </thead>

                            {
                                error
                                    ? (
                                        <tbody>
                                            <tr >
                                                <td className='product_table--null' >
                                                    <p className="note-sm fw-5 cl-text mt-2">Không tìm thấy {name} nào</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                    :
                                    loadingCategoryAll
                                        ?
                                        <>
                                            <tbody className='loading'>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                    <td>
                                                        <div className="skeleton"></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </>
                                        :
                                        <tbody>
                                            {
                                                categoryAlls?.customTaxonomy
                                                    ?.query
                                                    .length <= 0
                                                    ?
                                                    <tr>
                                                        <td className='product_table--null'>
                                                            <p className="note-sm fw-5 cl-text mt-2">Không tìm thấy {name} nào</p>
                                                        </td>
                                                    </tr>
                                                    :
                                                    categoryAlls?.customTaxonomy
                                                        ?.query
                                                        .map((data, index) => {
                                                            return (
                                                                <tr key={index} className={`category_table--item ${loadingDelete[data.id] && "dis"} `}>

                                                                    <td data-label="Chọn">
                                                                        <label className='boxCk'>
                                                                            <input type="checkbox" onChange={(e) => {
                                                                                handleChangeCheckBox(e, data.id)
                                                                            }} />
                                                                            <span className="box"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td data-label="Tên thẻ">
                                                                        <p className="note-text fw-6">
                                                                            {data.name}
                                                                        </p>

                                                                    </td>
                                                                    <td data-label="Mô tả">
                                                                        <p className="note-text">
                                                                            {
                                                                                data.description !== "" ? data.description : "_______"
                                                                            }
                                                                        </p>
                                                                    </td>
                                                                    <td data-label="Đường dẫn">
                                                                        <p className="note-text">
                                                                            {
                                                                                data.slug
                                                                            }
                                                                        </p>
                                                                    </td>
                                                                    <td data-label="Lượt">
                                                                        <p className="note-text">
                                                                            {
                                                                                data.count
                                                                            }
                                                                        </p>
                                                                    </td>
                                                                    <td data-label="Hành động">
                                                                        <div className="product_table--actions">
                                                                            <button data-tooltip-id="tooltipEditDm" className="product_table--actions-ic" onClick={() => {
                                                                                handleEditCate(data)
                                                                            }}>
                                                                                <img src={edit} alt="edit" />
                                                                            </button>
                                                                            <Tooltip id="tooltipEditDm" place="top" content="Chỉnh sửa" />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                            }
                                        </tbody>


                            }
                        </table>
                    </div>
                    {
                        // Kiểm tra nếu dữ liệu sản phẩm hợp lệ, nếu không thì ẩn đi phân trang
                        categoryAlls?.customTaxonomy?.total <= 0
                            ?
                            null
                            :
                            <div className="product_table--pagi">
                                <div className="product_table--pagi-lf">
                                    <p className="note-sm cl-text fw-5">
                                        Kết quả từ {page} đến trang {totalPages}
                                    </p>
                                </div>
                                <div className="product_table--pagi-rt">
                                    <ReactPaginate
                                        pageCount={totalPages}
                                        onPageChange={({ selected }) => handlePageChange(selected)}  // Gọi hàm khi chuyển trang
                                        pageRangeDisplayed={2}
                                        marginPagesDisplayed={1}
                                        previousLabel="←"  // Mũi tên trái
                                        nextLabel="→"      // Mũi tên phải
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        forcePage={page - 1}
                                    />
                                </div>
                            </div>

                    }
                </div>
            </div>
        )
    }

)

export default AttributeTableValue
