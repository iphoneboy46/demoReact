import React, { useContext, useEffect, useRef, useState } from 'react'
import "../../sass/pages/product.scss"
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PRODUCT_TOTAL, GET_DRAFT_PRODUCT_TOTAL, GET_PRODUCT_ALL, GET_PUBLISHER_PRODUCT_TOTAL, GET_TRASH_PRODUCT_TOTAL } from '../../Query/getPosts';
import ReactPaginate from 'react-paginate';
import { UPDATE_PRODUCT_STATUS } from '../../Query/update';
import { toast } from 'react-toastify';
import { ScaleLoader } from 'react-spinners';
import { ThemeContext } from '../../App';
import { Link } from 'react-router-dom';
import edit from "../../assets/images/edit.png"
import { Tooltip } from 'react-tooltip';

const ProductTable = ({ list, changeBl, selectedValueSl, valueSearch, setListCheckBoxPro, listCheckBoxPro, setSelectedValueHd, setSelectedValueHd2 }) => {
    const [page, setPage] = useState(() => {
        // Lấy giá trị page từ localStorage khi khởi tạo state
        return Number(localStorage.getItem("pagePagi")) || 0;
    });
    const [totalPages, setTotalPages] = useState(0);  // Tổng số trang (tính một lần)
    const [loadingStatus, setLoadingStatus] = useState(false);
    const { setTotalProduct, setTotalProductAo, setTotalProductDraft, setTotalProductTrash } = useContext(ThemeContext)
    const size = 5;  // Số lượng sản phẩm mỗi trang
    // Tính toán offset từ page và size
    const offset = page * size;

    const [idCategories, setIdCategories] = useState(0);
    const [quantityCategories, setQuantityCategories] = useState(0);
    const [statusPro, setStatusPro] = useState("null");
    const [typePro, setTypePro] = useState("");


    // Gọi GraphQL với Apollo Client, truyền offset, size, và categoryId vào
    const { loading, error, data: productAlls, refetch } = useQuery(GET_PRODUCT_ALL, {
        variables: {
            offset,  // offset và size để phân trang
            size,    // size để phân trang
            categoryId: idCategories === "null" ? "" : idCategories,  // truyền categoryId vào query
            ...(statusPro !== "null" ? { status: statusPro } : ""),
            type: typePro !== "null" ? typePro : undefined, // truyền type
            ...(selectedValueSl === "az" ? { orderby: [{ field: "NAME", order: "ASC" }] } : ""), // Sắp xếp theo tên tăng dần
            ...(selectedValueSl === "za" ? { orderby: [{ field: "NAME", order: "DESC" }] } : ""), // Sắp xếp theo tên giảm dần
            ...(selectedValueSl === "tc" ? { orderby: [{ field: "PRICE", order: "ASC" }] } : ""), // Sắp xếp theo giá tăng dần
            ...(selectedValueSl === "ct" ? { orderby: [{ field: "PRICE", order: "DESC" }] } : ""),  // Sắp xếp theo giá giảm dần
            ...(valueSearch !== ""
                ? (/^[a-zA-Z0-9]+$/.test(valueSearch) // Kiểm tra nếu chỉ chứa chữ và số (không có khoảng trắng)
                    ? { sku: valueSearch }  // Nếu đúng thì tìm theo SKU
                    : { search: valueSearch })  // Nếu không thì tìm theo từ khóa
                : ""),

        },
        notifyOnNetworkStatusChange: true,  // Đảm bảo cập nhật khi dữ liệu thay đổi
        fetchPolicy: 'network-only',  // Đảm bảo luôn lấy dữ liệu mới mỗi lần thay đổi page
    });

    console.log(productAlls)


    useEffect(() => {
        setIdCategories(Number(localStorage.getItem("idCategories")) || 0)
        setQuantityCategories(Number(localStorage.getItem('quantityCategories') || 0))
        setStatusPro(localStorage.getItem('statusPro') || "null")
        setTypePro(localStorage.getItem('typePro') || "null")


    }, [list.cateId, list.cateQuantity, list.statusPro, list.typePro, changeBl])

    // khi status thay đổi
    useEffect(() => {
        refetch({
            ...(statusPro !== "null" ? { status: statusPro } : ""),
        });
    }, [statusPro, refetch, size])





    //lấy sản phẩm đã xuất bản
    const { data: dataPublisherPro, refetch: refetchPublisherPro } = useQuery(GET_PUBLISHER_PRODUCT_TOTAL);
    useEffect(() => {
        setTotalProductAo(dataPublisherPro?.products?.pageInfo?.offsetPagination?.total)
    }, [dataPublisherPro, refetchPublisherPro]);




    //lấy sản phẩm chưa xuất bản
    const { data: dataDraftPro, refetch: refetchDraftPro } = useQuery(GET_DRAFT_PRODUCT_TOTAL);
    useEffect(() => {
        setTotalProductDraft(dataDraftPro?.products?.pageInfo?.offsetPagination?.total)
    }, [dataDraftPro, refetchDraftPro]);

    console.log(dataDraftPro?.products?.pageInfo?.offsetPagination?.total)


    //lấy sản phẩm XÓA
    const { data: dataTrashPro, refetch: refetchTrashPro } = useQuery(GET_TRASH_PRODUCT_TOTAL);
    useEffect(() => {
        setTotalProductTrash(dataTrashPro?.products?.pageInfo?.offsetPagination?.total)
    }, [dataTrashPro]);



    //lấy tất cả sản phẩm 
    const { data: dataProAll, refetch: refetchProAll } = useQuery(GET_ALL_PRODUCT_TOTAL);
    useEffect(() => {

        setTotalProduct(dataProAll?.products?.pageInfo?.offsetPagination?.total)

    }, [dataProAll])



    // Cập nhật totalPages khi dữ liệu được tải lần đầu
    useEffect(() => {
        if (productAlls?.products?.found) {
            setTotalPages(Math.ceil((productAlls?.products?.found) / size) || 0);
        }

    }, [productAlls]);

    console.log(toast)



    //khi danh muc thay doi
    useEffect(() => {
        setPage(0);
        refetch({ offset: 0, size });

    }, [quantityCategories, statusPro, idCategories, selectedValueSl, valueSearch, refetch, size])






    // Khi trang thay đổi
    const handlePageChange = (selected) => {
        localStorage.setItem("pagePagi", selected); // Lưu vào localStorage
        setPage(Number(localStorage.getItem("pagePagi"))); // Cập nhật state
        refetch({ offset: selected * size, size }); // Gọi lại API với offset mới
    };




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
            refetchPublisherPro({})
            refetchDraftPro({})
            refetchTrashPro({})
            refetchProAll({})
        }).catch(error => {
            setLoadingStatus(false)
            console.error('Error updating product status:', error);
            toast.error("Thao tác thất bại", {
                autoClose: 3000,
            })

        });
    };

    // hàm xử lý bỏ tất cả nhưng thuộc tính checkbox đc chọn vào thùng rác
    useEffect(() => {
        if (list.selectedValueHd === "trashPro") {
            // Set trạng thái loading cho tất cả ID
            setLoadingStatus((prevState) => {
                const updatedStatus = { ...prevState };
                listCheckBoxPro.forEach((id) => {
                    updatedStatus[id] = true;
                });
                return updatedStatus;
            });

            // Thực hiện mutation cho tất cả ID
            const mutationPromises = listCheckBoxPro.map((id) =>
                updateProductStatus({
                    variables: {
                        id: id,
                        status: "TRASH",
                    },
                })
                    .then(() => {
                        // Hiển thị thông báo thành công
                        toast.success(`Đã chuyển sản phẩm vào thùng rác thành công`, {
                            autoClose: 3000,
                        });
                    })
                    .catch((error) => {
                        // Hiển thị thông báo lỗi
                        console.error(`Error updating product `, error);
                        toast.error(`Đã chuyển sản phẩm vào thùng rác thất bại`, {
                            autoClose: 3000,
                        });
                    })
                    .finally(() => {
                        // Tắt trạng thái loading cho từng sản phẩm
                        setLoadingStatus((prevState) => ({
                            ...prevState,
                            [id]: false,
                        }));
                    })
            );

            // Chờ tất cả mutation hoàn thành
            Promise.all(mutationPromises)
                .then(() => {
                    // Làm mới dữ liệu
                    refetchPublisherPro();
                    refetchDraftPro();
                    refetch({});
                    refetchTrashPro({});
                    refetchProAll({});
                })
                .finally(() => {
                    // Reset trạng thái và danh sách checkbox
                    setSelectedValueHd("null"); // Reset giá trị cho phép thao tác tiếp
                    list.selectedValueHd = "null";
                    setListCheckBoxPro([]); // Xóa danh sách checkbox
                });
        }
    }, [list.selectedValueHd === "trashPro"]);

    // hàm xử lý bỏ tất cả nhưng thuộc tính checkbox đc chọn khôi phục lại
    useEffect(() => {
        if (list.selectedValueHd2 === "restorePro") {
            // Set trạng thái loading cho tất cả ID
            setLoadingStatus((prevState) => {
                const updatedStatus = { ...prevState };
                listCheckBoxPro.forEach((id) => {
                    updatedStatus[id] = true;
                });
                return updatedStatus;
            });

            // Thực hiện mutation cho tất cả ID
            const mutationPromises = listCheckBoxPro.map((id) =>
                updateProductStatus({
                    variables: {
                        id: id,
                        status: "PUBLISH",
                    },
                })
                    .then(() => {
                        // Hiển thị thông báo thành công
                        toast.success(`Đã khôi phục sản phẩm thành công`, {
                            autoClose: 3000,
                        });
                    })
                    .catch((error) => {
                        // Hiển thị thông báo lỗi
                        console.error(`Error updating product `, error);
                        toast.error(`Đã khôi phục sản phẩm thất bại`, {
                            autoClose: 3000,
                        });
                    })
                    .finally(() => {
                        // Tắt trạng thái loading cho từng sản phẩm
                        setLoadingStatus((prevState) => ({
                            ...prevState,
                            [id]: false,
                        }));
                    })
            );

            // Chờ tất cả mutation hoàn thành
            Promise.all(mutationPromises)
                .then(() => {
                    // Làm mới dữ liệu
                    refetchPublisherPro();
                    refetchDraftPro();
                    refetch({});
                    refetchTrashPro({});
                    refetchProAll({});
                })
                .finally(() => {
                    // Reset trạng thái và danh sách checkbox
                    setSelectedValueHd2("null"); // Reset giá trị cho phép thao tác tiếp
                    list.selectedValueHd2 = "null";
                    setListCheckBoxPro([]); // Xóa danh sách checkbox
                });
        }
    }, [list.selectedValueHd2 === "restorePro"]);


    // hàm xét đki nếu checked đc thêm vào list ko thì xóa
    function handleChangeCheckBox(e, id) {
        if (e.target.checked) {
            setListCheckBoxPro((prevList) => {
                return [id, ...prevList];
            });

        } else {
            setListCheckBoxPro((prevList) => {
                const newArray = prevList.filter((item) => item !== id);
                return newArray;
            });
        }
    }

    function handleChangeCheckBoxAll(e) {

        if (e.target.checked) {
            const table = document.querySelector(".product_table")
            const items = table.querySelectorAll(".product_table--item")
            items.forEach((item) => {
                item.querySelector(".boxCk input").checked = true;
            });
            const allIds = productAlls?.products?.edges.map((data) => data.node.id);
            setListCheckBoxPro(allIds);


        } else {
            const table = document.querySelector(".product_table")
            const items = table.querySelectorAll(".product_table--item")
            items.forEach((item) => {
                item.querySelector(".boxCk input").checked = false;

            });
            setListCheckBoxPro([]);
        }
    }



    return (
        <div className="product_table">
            <div className="product_table--wrap">
                <div className="product_table--table">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <label className='boxCk'>
                                        <input type="checkbox" checked={listCheckBoxPro.length === 5 ? true : false} onChange={(e) => {
                                            handleChangeCheckBoxAll(e)
                                        }} name="" id="" />
                                        <span className="box"></span>
                                    </label>
                                </th>
                                <th>
                                    <p className="note-text fw-5 cl-text">
                                        Tiêu đề sản phẩm/ Biến thể
                                    </p>
                                </th>
                                <th>
                                    <p className="note-text fw-5 cl-text">
                                        Trạng thái
                                    </p>
                                </th>
                                <th>
                                    <p className="note-text fw-5 cl-text">
                                        Danh mục
                                    </p>
                                </th>
                                <th>
                                    <p className="note-text fw-5 cl-text">
                                        Giá sản phẩm
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

                            error ? (
                                <tbody>
                                    <tr >
                                        <td className='product_table--null' >
                                            <p className="note-sm fw-5 cl-text mt-2">Không có sản phẩm nào phù hợp</p>
                                        </td>
                                    </tr>
                                </tbody>
                            )
                                :
                                loading
                                    ?
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
                                    </tbody>
                                    :

                                    <tbody>
                                        {
                                            !productAlls || !productAlls.products || productAlls.products.edges.length === 0
                                                ?
                                                <tr>
                                                    <td className='product_table--null'>
                                                        <p className="note-sm fw-5 cl-text mt-2">Không có sản phẩm nào phù hợp</p>
                                                    </td>
                                                </tr>
                                                :
                                                productAlls?.products?.edges.map((data, index) => {
                                                    // Kiểm tra nếu không có sản phẩm

                                                    return (
                                                        <tr className='product_table--item' key={index} id={data.node.id}>
                                                            <td data-label="Chọn">
                                                                <label className='boxCk'>
                                                                    <input type="checkbox" onChange={(e) => {
                                                                        handleChangeCheckBox(e, data.node.id)
                                                                    }} />
                                                                    <span className="box"></span>
                                                                </label>
                                                            </td>
                                                            <td data-label="Tiêu đề sản phẩm/ Biến thể">
                                                                <div className="product_table--info">
                                                                    <div className="product_table--info-img">
                                                                        <img src={data?.node?.image?.sourceUrl} alt={data?.node?.name} />
                                                                    </div>
                                                                    <div className="product_table--info-des">
                                                                        <p className="note-sm title cl-text fw-6">
                                                                            {data?.node?.name}
                                                                        </p>
                                                                        <p className="note-mn cl-text fw-5 quantity">
                                                                            Số lượng:
                                                                            <span className="fw-4">
                                                                                {
                                                                                    data?.node?.stockQuantity === null
                                                                                        ? "N/A"
                                                                                        : data?.node?.stockQuantity
                                                                                }
                                                                            </span>
                                                                        </p>
                                                                        <p className="note-mn cl-text fw-5 code">
                                                                            Mã:
                                                                            <span className="fw-4">
                                                                                {
                                                                                    data?.node?.sku === null
                                                                                        ? "N/A"
                                                                                        : data?.node?.sku
                                                                                }</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td data-label="Trạng thái">
                                                                <div className={`product_table--status ${loadingStatus[data?.node?.id] && "load"} `}>
                                                                    {loadingStatus[data?.node?.id] && <ScaleLoader className='product_table--status-load' />}
                                                                    <p className={`note-text ${data?.node?.status === "draft" ? "cl-text" : "cl-gray3"} `}>Tắt</p>
                                                                    <label className="switch cl-gr">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={data?.node?.status === "publish"}
                                                                            onChange={(e) => handleStatusChange(data?.node?.id, data?.node?.status, e)}
                                                                            disabled={loadingStatus[data?.node?.id]} // Vô hiệu hóa trong lúc loading
                                                                        />
                                                                        <span className="switch-wrap">
                                                                            <span className="switch-wrap-around"></span>
                                                                        </span>
                                                                    </label>
                                                                    <p className={`note-text ${data?.node?.status === "publish" ? "cl-text" : "cl-gray3"} `}>Bật</p>
                                                                </div>
                                                            </td>
                                                            <td data-label="Danh mục">
                                                                <ul className="product_table--dms">
                                                                    {
                                                                        data?.node?.terms?.nodes.map((dataChild1, childIndex1) => {
                                                                            return (
                                                                                <li key={childIndex1} id={dataChild1.id} className="product_table--dm">
                                                                                    <p className="note-sm cl-text fw-5">{dataChild1.name}</p>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </td>
                                                            <td data-label="Giá sản phẩm">
                                                                <div className="product_table--prices">
                                                                    <p className="note-sm cl-text fw-5">{data?.node?.regularPrice !== null ? data?.node?.regularPrice?.replace(/&nbsp;/g, ' ') : "NaN"}</p>
                                                                    <p className='note-sm cl-red fw-5'>{data?.node?.salePrice !== null ? data?.node?.salePrice?.replace(/&nbsp;/g, ' ') : "NaN"}</p>
                                                                </div>

                                                            </td>
                                                            <td data-label="Hành động">
                                                                <div className="product_table--actions">
                                                                    <Link data-tooltip-id="tooltipEdit" to={`/product/${data.node.id}`} className="product_table--actions-ic">
                                                                        <img src={edit} alt="edit" />
                                                                    </Link>
                                                                    <Tooltip id="tooltipEdit" place="top" content="Chỉnh sửa" />
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
                    productAlls?.products?.pageInfo?.endCursor === null || error
                        ?
                        null
                        :
                        <div className="product_table--pagi">
                            <div className="product_table--pagi-lf">
                                <p className="note-sm cl-text fw-5">
                                    Kết quả từ {page + 1} đến trang {totalPages}
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
                                    forcePage={page}
                                />
                            </div>
                        </div>

                }

            </div>
        </div>
    )
}

export default ProductTable;
