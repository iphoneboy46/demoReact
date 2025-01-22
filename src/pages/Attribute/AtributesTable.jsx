import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import "../../sass/pages/category.scss"
import { useQuery } from '@apollo/client';
import { GET_ALL_ATTRIBUTE } from '../../Query/getPosts';
import edit from "../../assets/images/edit.png"
import { Tooltip } from 'react-tooltip';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';




const AttributesTable = forwardRef(
    ({ setSlugCate, setNameCate, setEditCate, setIdCate, listCheckBoxCate, setListCheckBoxCate, selectedValueCate, setSelectedValueCate, loadingDelete, setLoadingDelete, setIdDm }, ref) => {


        const [checkedAllLength, setCheckedAllLength] = useState(false)


        // Gọi GraphQL với Apollo Client, truyền offset, size,  vào
        const { loading: loadingCategoryAll, error, data: categoryAlls, refetch: refetchCategoryAll } = useQuery(GET_ALL_ATTRIBUTE, {
            notifyOnNetworkStatusChange: true,  // Đảm bảo cập nhật khi dữ liệu thay đổi
            fetchPolicy: 'network-only',  // Đảm bảo luôn lấy dữ liệu mới mỗi lần thay đổi page
        });


        console.log(categoryAlls)

        useImperativeHandle(ref, () => ({
            refetchCategories: () => refetchCategoryAll(),
        }));


        console.log(categoryAlls)

        const handleEditCate = (data) => {
            console.log("dataEdit", data)
            setIdCate(data.id)
            setNameCate(data.label)
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
                const allIds = categoryAlls?.productAttributes?.map((data) => data.id);
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


        useEffect(() => {
            if (listCheckBoxCate.length !== categoryAlls?.productAttributes
                .length) {
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
                    .delete(`${baseUrl}/wp-json/wc/v3/products/attributes/${id}?force=true`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Thêm token vào header
                        },
                    })
                    .then((response) => {
                        // console.log(`Deleted category ID ${id}:`, response.data);
                        toast.success(`Xoá thẻ ID ${id} thành công`, {
                            autoClose: 3000,
                        });
                    })
                    .catch((error) => {
                        console.error(`Error deleting category ID ${id}:`, error.response?.data || error.message);
                        toast.error("Xoá thẻ thất bại", {
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
            <div className="category_table attribute">
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
                                            Tên thuộc tính
                                        </p>
                                    </th>
                                    <th>
                                        <p className="note-text fw-5 cl-text">
                                            Đường dẫn
                                        </p>
                                    </th>
                                    <th>
                                        <p className="note-text fw-5 cl-text t-center">
                                            Tên chủng loại
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
                                                    <p className="note-sm fw-5 cl-text mt-2">Không có thuộc tính nào phù hợp</p>
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
                                                </tr>
                                            </tbody>
                                        </>
                                        :
                                        <tbody>
                                            {
                                                categoryAlls?.productAttributes?.length <= 0
                                                    ?
                                                    <tr>
                                                        <td className='product_table--null'>
                                                            <p className="note-sm fw-5 cl-text mt-2">Không có thuộc tính nào phù hợp</p>
                                                        </td>
                                                    </tr>
                                                    :
                                                    categoryAlls?.productAttributes?.map((data, index) => {
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
                                                                <td data-label="Tên thuộc tính">
                                                                    <p className="note-text fw-6">
                                                                        {data.label}
                                                                    </p>
                                                                </td>
                                                                <td data-label="Đường dẫn">
                                                                    <p className="note-text">
                                                                        {
                                                                            data.slug
                                                                        }
                                                                    </p>
                                                                </td>
                                                                <td data-label="Tên chủng loại">
                                                                    {
                                                                        data.terms.length > 0
                                                                            ?
                                                                            <ul>
                                                                                {
                                                                                    data.terms.map((data, indexChild) => {
                                                                                        return (
                                                                                            <li key={indexChild}>
                                                                                                <p className="note-sm cl-text">
                                                                                                    {data}
                                                                                                </p>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }

                                                                            </ul>
                                                                            :
                                                                            <p className="note-text">
                                                                                _______
                                                                            </p>
                                                                    }

                                                                    <Link className='note-sm cl-gray2 fw-5' to={`/product/attributes/${data.id}/${data.name}/${data.slug}`}>Cấu hình chủng loại sản phẩm</Link>
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
                </div>
            </div>
        )
    }

)

export default AttributesTable
