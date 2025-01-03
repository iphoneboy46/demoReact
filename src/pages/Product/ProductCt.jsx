import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCircleQuestion, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_ID, GET_PRODUCT_CATEGORIES, GET_PRODUCT_CATEGORIES_MUCH } from '../../Query/getPosts';
import ictitle from '../../assets/images/ictitle.svg';
import PagiWeb from '../../components/PagiWeb/PagiWeb';
import { CREATE_TAG_MUTATION, GET_TAG_TERMS, REMOVE_TAGS_FROM_PRODUCT,UPDATE_PRODUCT_STATUS, UPDATE_PRODUCT_TAG } from '../../Query/update';
import { toast } from 'react-toastify';
import { BarLoader, ClipLoader, ScaleLoader } from 'react-spinners';
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
import axios from 'axios';
import PopupUpdateImage from '../../components/PopupUpdateImage/PopupUpdateImage';
import PopupUpdateAlbums from '../../components/PopupUpdateImage/PopupUpdateAlbums';
import { Tooltip, TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const optionsStatus = [
    { value: 'publish', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
];

const optionsView = [
    { value: 'publish', label: "Công khai" },
    { value: 'password', label: 'Bảo vệ bằng mật khẩu' },
    { value: 'private', label: 'Riêng tư' }
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

    const [actived1, setActived1] = useState(true)
    const [actived2, setActived2] = useState(true)
    const [actived3, setActived3] = useState(true)
    const [actived4, setActived4] = useState(true)
    const [nameTags, setNameTags] = useState("")
    const [loadingHandleTags, setLoadingHandleTags] = useState(false)
    const [loadingHandleTags2, setLoadingHandleTags2] = useState(false)
    const [errorMessTag, setErrorMessTag] = useState("")
    const [listUpdate, setListUpdate] = useState()
    const [passPro, setPassPro] = useState("")
    const [dateView, setDateView] = useState("");
    const [selectedDateTime, setSelectedDateTime] = useState(new Date())
    const [descriptionPro, setDescriptionPro] = useState("")
    const [namePro, setNamePro] = useState("")
    const [kiloPro, setKiloPro] = useState("")
    const [codePro, setCodePro] = useState("")
    const [priceProRegular, setPriceProRegular] = useState("")
    const [priceProSale, setPriceProSale] = useState("")
    const [showedChangeAva, setShowedChangeAva] = useState(false)
    const [showedChangeAlbums, setShowedChangeAlbums] = useState(false)

    const [idAva, setIdAva] = useState(() => {
        return localStorage.getItem("idAvatar") || ""
    })
    const [tabActived, setTabActived] = useState(1)
    const [avatarProduct, setAvatarProduct] = useState({})

    const [selectedValueStatus, setSelectedValueStatus] = useState(null);
    const [selectedValueView, setSelectedValueView] = useState(null);
    const [listAlbumId, setListAlbumId] = useState(() => {
        return JSON.parse(localStorage.getItem("idProAlbums")) || []
    })
    // const [listAlbumId, setListAlbumId] = useState([])
    const [idProAlbum, setIdProAlbum] = useState(() => {
        return localStorage.getItem("idProAlbum") || ""

    })

    const [loadingUpdate, setLoadingUpdate] = useState(false)







    const { data, loading, error, refetch: refetchProductCt } = useQuery(GET_PRODUCT_BY_ID, {
        variables: {
            id: id,
            first: 9999
        },
        fetchPolicy: 'network-only',
        // notifyOnNetworkStatusChange: true,  // Đảm bảo cập nhật khi dữ liệu thay đổi

    });


    const { data: dataProductCate } = useQuery(GET_PRODUCT_CATEGORIES)
    const { data: dataProductCateMuch } = useQuery(GET_PRODUCT_CATEGORIES_MUCH)



    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (data?.product?.status) {
                setSelectedValueStatus(data.product.status);
                setSelectedValueView(() => {
                    return data?.product?.password !== null ? "password" : data.product.status
                });
            }

        }, 1000); // Đợi 1000ms để đảm bảo dữ liệu được tải xong

        return () => clearTimeout(timeoutId); // Cleanup
    }, [data]); // Chạy khi data thay đổi


    //password
    useEffect(() => {
        setPassPro(data?.product?.password)
        setAvatarProduct(
            {
                id: data?.product?.image?.id,
                image: data?.product?.image?.sourceUrl
            }
        )
    }, [data])


    useEffect(() => {
        // Thời gian UTC ban đầu
        const utcTime = new Date(data?.product?.dateGmt);
        console.log(utcTime)

        // Tính giờ với múi giờ +7
        const timezoneOffset = 7; // +7 hours
        const localTime = new Date(utcTime.getTime() + timezoneOffset * 60 * 60 * 1000);

        // Cấu hình tùy chọn để định dạng ngày tháng năm
        const dateOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };

        // Cấu hình tùy chọn để định dạng giờ phút
        const timeOptions = {
            hour12: false,  // Dùng 24 giờ
            hour: '2-digit',
            minute: '2-digit',
        };

        // Định dạng lại ngày và giờ
        const formattedDate = localTime.toLocaleDateString('en-GB', dateOptions);
        const formattedTime = localTime.toLocaleTimeString('en-GB', timeOptions);

        // Kết hợp ngày và giờ
        setDateView(`${formattedDate}, ${formattedTime}`);
    }, [data]);



    console.log(data)
    console.log(dataProductCateMuch)

    useEffect(() => {
        // Kiểm tra nếu có danh mục trong data?.product?.terms
        if (data) {
            // Lấy danh sách ID từ danh mục đã có trong sản phẩm
            const initialCheckedIds = data?.product?.terms?.nodes?.map(term => term.termTaxonomyId);
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
            refetchProductCt({
                fetchPolicy: 'network-only', // Sử dụng 'network-only' để lấy lại dữ liệu từ server
                variables: { id: productId }, // Thực hiện lại query với biến id
            });

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

    const { data: dataTagsAll, refetch: refetchTagsAll } = useQuery(GET_TAG_TERMS); // Lấy danh sách thẻ hiện có
    const [createTag] = useMutation(CREATE_TAG_MUTATION); // Thêm thẻ mới
    const [addTagsToProduct] = useMutation(UPDATE_PRODUCT_TAG);  // Mutation cập nhật thẻ vào sản phẩm


    useEffect(() => {
        if (nameTags.trim().length > 0) {
            setErrorMessTag("");

        }
    }, [nameTags])

    const handleAddNameTags = (productId) => {
        console.log(nameTags)




        if (nameTags.trim().length === 0) {
            setErrorMessTag("Vui lòng nhập tên thẻ");
            return;
        }

        setLoadingHandleTags(true)
        // Giải mã Base64 để lấy chuỗi ban đầu
        const decodedProductId = atob(productId); // atob() giải mã Base64


        // Lấy 4 số cuối nếu chuỗi bắt đầu bằng "product:"
        const productNumber = decodedProductId.startsWith('product:')
            ? decodedProductId.split(':')[1].slice(-4) // Tách chuỗi và lấy 4 số cuối
            : decodedProductId;


        // Chuyển đổi và làm sạch các thẻ nhập vào
        const nameTagsFormat = nameTags
            .split(',')
            .map((tag) => tag.trim()) // Loại bỏ khoảng trắng thừa
            .filter((tag) => tag !== ''); // Loại bỏ chuỗi rỗng

        const newTags = [];
        const existingTags = [];

        // Kiểm tra thẻ đã tồn tại trong dữ liệu hiện tại
        nameTagsFormat.forEach((tagName) => {
            const existingTag = dataTagsAll.terms.nodes.find((tag) => tag.name.toLowerCase() === tagName.toLowerCase());
            if (existingTag) {
                existingTags.push(tagName); // Nếu thẻ đã tồn tại, chỉ thêm vào danh sách thẻ hiện tại
            } else {
                newTags.push(tagName); // Nếu thẻ mới, cần tạo
            }
        });

        // Nếu có thẻ mới, tạo chúng và thêm vào sản phẩm
        const addNewTagsPromises = newTags.map((tagName) =>
            createTag({
                variables: { name: tagName },
            }).then((response) => {
                const createdTag = response.data.createProductTag.productTag;
                if (!createdTag || !createdTag.name) {
                    throw new Error('Invalid response from createTag');
                }
                console.log('Tag created:', createdTag.name);
                return createdTag;
            })
        );

        Promise.all(addNewTagsPromises)
            .then((createdTags) => {
                console.log('All new tags added successfully:', createdTags);

                // Thêm cả thẻ đã tồn tại và thẻ mới vào sản phẩm
                const allTags = [...existingTags, ...createdTags.map((tag) => tag.name)];

                // Gửi yêu cầu thêm thẻ vào sản phẩm
                return addTagsToProduct({
                    variables: {
                        id: productNumber,
                        tagNames: allTags,
                    },
                });
            })
            .then(() => {
                toast.success('Thêm thẻ và cập nhật sản phẩm thành công', {
                    autoClose: 3000
                });
                // lm mới tagAll
                refetchTagsAll({});
                // Nếu chỉ muốn làm mới`tagTerms`, có thể thay đổi `fetchPolicy` như sau:
                refetchProductCt({
                    fetchPolicy: 'network-only', // Sử dụng 'network-only' để lấy lại dữ liệu từ server
                    variables: { id: productId }, // Thực hiện lại query với biến id
                });
                setNameTags(''); // Xóa các thẻ đã nhập sau khi xử lý
                setLoadingHandleTags(false)


            })
            .catch((err) => {
                console.error('Error adding new tags or updating product:', err);
                toast.error('Thêm thẻ hoặc cập nhật sản phẩm thất bại: ' + err.message, { autoClose: 3000 });
                setNameTags(''); // Xóa các thẻ đã nhập sau khi xử lý
                setLoadingHandleTags(false)
                setErrorMessTag(err.message)

            });

    };

    const [removeTagsFromProduct] = useMutation(REMOVE_TAGS_FROM_PRODUCT);


    const handleRemoveTag = (tagId, productId) => {
        setLoadingHandleTags2((prevState) => ({ ...prevState, [tagId]: true }));
        const decodedProductId = atob(productId);
        const productNumber = decodedProductId.startsWith('product:')
            ? decodedProductId.split(':')[1].slice(-4)
            : decodedProductId;

        const decodedTagId = atob(tagId);
        const tagNumber = decodedTagId.startsWith('term:')
            ? decodedTagId.split(':')[1].slice(-3)
            : decodedTagId;


        removeTagsFromProduct({
            variables: {
                id: productNumber.toString(), // Chuyển ID thành chuỗi
                tagIds: [tagNumber.toString()], // Đảm bảo là mảng chứa chuỗi
            },
        })
            .then((response) => {
                console.log('Response:', response);
                toast.success('Xóa thẻ thành công!', {
                    autoClose: 3000,

                });
                refetchProductCt({
                    fetchPolicy: 'network-only',
                    variables: { id: productId },
                });
                setLoadingHandleTags2(false);

            })
            .catch((error) => {
                console.error('Error in Mutation:', error);
                toast.error('Xóa thẻ thất bại: ' + error.message, {
                    autoClose: 3000,

                });
                setLoadingHandleTags2(false);
            })
            .finally(() => {
                setLoadingHandleTags2(false);
            });
    };



    useEffect(() => {
        console.log(listUpdate)
    }, [listUpdate])

    console.log(checkedDm)

    console.log("avatarProduct", avatarProduct)


    const handleUpdateProduct = (productId) => {
        setLoadingUpdate(true)
        console.log(avatarProduct)
        const decodedProductId = atob(productId);
        const productNumber = decodedProductId.match(/:(\d+)$/)?.[1] || null;

        // const productNumber = decodedProductId.startsWith('product:')
        //     ? decodedProductId.split(':')[1].slice(-4)
        //     : decodedProductId;

        // Kiểm tra nếu dateView không hợp lệ
        if (!dateView) {
            console.error("Invalid date view provided.");
            return;
        }

        // Tách chuỗi ngày giờ
        const dateParts = dateView.split(", ");
        if (dateParts.length !== 2) {
            console.error("Invalid date format:", dateView);
            return;
        }

        const date = dateParts[0].split("/");  // Tách thành ["24", "12", "2024"]
        const time = dateParts[1];             // Giờ: "16:27"

        // Kiểm tra định dạng ngày tháng
        if (date.length !== 3) {
            console.error("Invalid date format:", dateParts[0]);
            return;
        }

        // Tạo chuỗi ISO từ ngày và giờ
        const isoDateString = `${date[2]}-${date[1]}-${date[0]}T${time}:00`;  // Tạo ISO string

        // Tạo đối tượng Date từ chuỗi ISO
        const localDate = new Date(isoDateString);

        if (isNaN(localDate)) {
            console.error("Invalid date:", isoDateString);
            return;
        }

        // Trừ đi 7 giờ (7 * 60 * 60 * 1000 ms)
        const adjustedDate = new Date(localDate.getTime() - 7 * 60 * 60 * 1000);

        // Đưa về định dạng ISO chuẩn
        const isoDate = adjustedDate.toISOString();

        // Giả sử bạn đã có danh sách các ảnh hiện tại của sản phẩm (dưới đây là ví dụ)
        const currentImages = data?.product?.galleryImages?.nodes;
        console.log(currentImages)



        // Giải mã Base64 để lấy chuỗi ban đầu
        const decodedProductIdAva = atob(avatarProduct.id); // atob() giải mã Base64

        // Sử dụng regex để chỉ lấy số sau dấu 2 chấm
        const productNumberAva = decodedProductIdAva.match(/:(\d+)$/)?.[1] || 0;

        console.log(productNumberAva)

        // Tạo đối tượng input để truyền vào mutation
        const listSubmit = {
            id: productNumber,
            name: namePro || "",   // Kiểm tra và tránh "NaN"
            description: descriptionPro,
            date_created_gmt: isoDate,   // Đảm bảo định dạng ISO đúng
            post_password: selectedValueView === "password" ? passPro : "",
            categories: checkedDm.map(id => ({ id })),
            weight: kiloPro || "",
            status: selectedValueView === "private" ? selectedValueView : selectedValueStatus,
            regular_price: priceProRegular,  // Kiểm tra xem API có yêu cầu là regular_price thay vì regularPrice
            sale_price: priceProSale,  // Kiểm tra xem API có yêu cầu là regular_price thay vì regularPrice
            sku: codePro,
            images: [
                {
                    id: productNumberAva, // ID của ảnh chính
                    position: 0           // Ảnh chính luôn ở vị trí 0
                },
                // Giải mã ID và chỉ lấy số từ các ảnh còn lại trong currentImages
                ...currentImages.map(image => {
                    const decodedId = atob(image.id); // Giải mã Base64
                    const extractedNumber = decodedId.match(/:(\d+)$/)?.[1] || null; // Lấy số sau dấu ":"
                    return { id: extractedNumber };
                })
            ]

        };

        const listSubmitJson = JSON.stringify(listSubmit)

        console.log(listSubmitJson)



        const token = localStorage.getItem('authToken');


        // Gọi API để cập nhật sản phẩm bằng axios
        axios.put(`https://managewoostore.monamedia.net/wp-json/wc/v3/products/${productNumber}`, listSubmitJson, {
            headers: {
                'Authorization': `Bearer ${token}`, // Nếu cần token
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                console.log("Product updated:", response.data);
                refetchProductCt({
                });
                toast.success('Cập nhật thành công!', {
                    autoClose: 3000,
                })
                setLoadingUpdate(false);
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

                toast.error('Cập nhật thất bại', {
                    autoClose: 3000,
                })
                setLoadingUpdate(false);

                const container = document.querySelector(".layoutMain_rt--wrap");
                if (container) {
                    container.scrollTo({
                        top: 0, // Cuộn lên đầu trang
                        left: 0,
                        behavior: 'smooth', // Cuộn mượt mà
                    }); // Cu
                }

                if (error.response) {
                    // Lỗi từ server, có thể kiểm tra error.response.data hoặc error.response.status
                    console.error("Error updating product:", error.response.data);

                } else if (error.request) {
                    // Lỗi không nhận được phản hồi
                    console.error("Error request:", error.request);
                } else {
                    // Lỗi khác
                    console.error("Error:", error.message);
                }
            });
    };



    const handleDeleteAvatarProduct = (idPro) => {
        setAvatarProduct({
            id:"",
            image:undefined
        })
    };

    console.log(avatarProduct)


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
                                    {
                                        data?.product?.name !== null ? data.product.name : "NaN"
                                    }
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
                            <>

                                <div className="breadcrumbs">
                                    <ul className="breadcrumbs-list">
                                        <li className="breadcrumbs-item">
                                            <Link className="breadcrumbs-link" to="/product">Danh sách sản phẩm</Link>
                                        </li>
                                        <li className="breadcrumbs-item last">
                                            <p className="breadcrumbs-link" >
                                                {
                                                    data?.product?.name !== null ? data.product.name : "NaN"
                                                }
                                            </p>
                                        </li>
                                    </ul>
                                </div>

                                <div className="layout_top--type">
                                    {
                                        data?.product?.type === "SIMPLE" && <p className="note-text cl-text fw-6">Sản phẩm đơn giản</p>
                                    }
                                    {
                                        data?.product?.type === "VARIABLE" && <p className="note-text cl-text fw-6">Sản phẩm biến thể</p>
                                    }
                                </div>
                            </>
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
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 1 ? "actived" : ""}`} onClick={() => {
                                                    setTabLfContent(1)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Tổng quan
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 2 ? "actived" : ""}`} onClick={() => {
                                                    setTabLfContent(2)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Thuộc tính
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 3 ? "actived" : ""}`} onClick={() => {
                                                    setTabLfContent(3)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Tùy chọn
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 4 ? "actived" : ""}`} onClick={() => {
                                                    setTabLfContent(4)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Tập tin
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 5 ? "actived" : ""}`} onClick={() => {
                                                    setTabLfContent(5)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Vận chuyển & nhận hàng
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 6 ? "actived" : ""}`} onClick={() => {
                                                    setTabLfContent(6)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        SEO
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 7 ? "actived" : ""}`} onClick={() => {
                                                    setTabLfContent(7)
                                                }}>
                                                    <p className="note-sm cl-text fw-5">
                                                        Sản phẩm liên quan
                                                    </p>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={`productEdit_lf--tab-item ${tabLfContent === 8 ? "actived" : ""}`} onClick={() => {
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
                                            <ProductTq data={data} loading={loading} setDescriptionPro={setDescriptionPro} setNamePro={setNamePro} setKiloPro={setKiloPro} setCodePro={setCodePro} setPriceProRegular={setPriceProRegular} setPriceProSale={setPriceProSale} showedChangeAlbums={showedChangeAlbums} setShowedChangeAlbums={setShowedChangeAlbums} setTabActived={setTabActived} setListAlbumId={setListAlbumId} setIdProAlbum={setIdProAlbum} refetchProductCt={refetchProductCt} />
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
                                {
                                    data?.product?.status === "private"
                                        ?
                                        ""
                                        :
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
                                }
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
                                                                    <input value={nameTags} onChange={(e) => {
                                                                        setNameTags(e.target.value)
                                                                    }} type="text" placeholder='Thêm thẻ sản phẩm' className="form-item-ip" />
                                                                    <button onClick={() => {
                                                                        handleAddNameTags(id)
                                                                    }} className={`btn ${loadingHandleTags ? "btnDis" : ""}`}>
                                                                        <span className="btn-text">
                                                                            Thêm
                                                                        </span>
                                                                        {
                                                                            loadingHandleTags && <ClipLoader className='btn-loading2' color="#007AFF" />
                                                                        }

                                                                    </button>
                                                                </div>
                                                                {
                                                                    errorMessTag !== ""
                                                                        ?
                                                                        <span className="note-mn cl-red">
                                                                            {errorMessTag}
                                                                        </span>
                                                                        :
                                                                        ""
                                                                }
                                                                <span className="note-mn cl-gray fw-i">
                                                                    Phân cách các thẻ bằng dấu phẩy
                                                                </span>
                                                            </div>
                                                            <ul className="productEdit_tags--list">
                                                                {
                                                                    data?.product?.tagTerms?.nodes?.map((tag, index) => {
                                                                        return (
                                                                            <li key={index} className={`productEdit_tags--item ${loadingHandleTags2[tag.id] ? "loading" : ""}`}>
                                                                                <div className="productEdit_tags--item-wrap">
                                                                                    <span onClick={() => {
                                                                                        handleRemoveTag(tag.id, id)
                                                                                    }} className="ic">
                                                                                        <FontAwesomeIcon icon={faXmark} />
                                                                                    </span>
                                                                                    <p className="note-sm cl-gray">
                                                                                        {tag.name}
                                                                                    </p>
                                                                                </div>
                                                                                {
                                                                                    loadingHandleTags2[tag.id]
                                                                                        ?
                                                                                        <ScaleLoader className='tagsLoading'
                                                                                            color="#007AFF"
                                                                                            height={25}
                                                                                            width={3}
                                                                                            margin={1}
                                                                                        />
                                                                                        :
                                                                                        ""
                                                                                }
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
                                                            {
                                                                data?.product?.image !== null || avatarProduct.image !== undefined
                                                                    ?
                                                                    <>
                                                                        <div className="productEdit_avatar--img" onClick={() => {
                                                                            setShowedChangeAva(true)
                                                                            document.body.style.overflow = "hidden"
                                                                            localStorage.setItem("idAvatar", data?.product?.image?.id)
                                                                            setIdAva(localStorage.getItem("idAvatar"))
                                                                            setTabActived(2)
                                                                        }}>
                                                                            <img src={avatarProduct.image} alt={data?.name} />
                                                                        </div>
                                                                        <div className="productEdit_avatar--control">
                                                                            <p onClick={() => {
                                                                                handleDeleteAvatarProduct(data?.product?.id, data?.product?.image?.id)
                                                                            }} className="note-sm cl-gray deleteImg">
                                                                                Xóa
                                                                            </p>
                                                                            <button className="productEdit_avatar--change" onClick={() => {
                                                                                setShowedChangeAva(true)
                                                                                document.body.style.overflow = "hidden"
                                                                                localStorage.setItem("idAvatar", data?.product?.image?.id)
                                                                                setIdAva(localStorage.getItem("idAvatar"))
                                                                                setTabActived(2)
                                                                            }}>
                                                                                <span className="ic">
                                                                                    <img src={icChangeImg} alt="" />
                                                                                </span>
                                                                                <p className="note-sm cl-text">
                                                                                    Thay đổi ảnh
                                                                                </p>
                                                                                <span data-tooltip-id="my-tooltipUpLoad" className="ic" data-tooltip-content="Để có kết quả tốt nhất, hãy tải lên tệp JPEG hoặc PNG có kích thước 1000 x 1000 pixel trở lên. Dung lượng tối đa 5GB">
                                                                                    <FontAwesomeIcon icon={faCircleQuestion} />
                                                                                </span>
                                                                                <Tooltip id="my-tooltipUpLoad" place="bottom" />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <div className="productEdit_avatar--none-img">
                                                                        <button className="productEdit_avatar--change" onClick={() => {
                                                                            setShowedChangeAva(true)
                                                                            document.body.style.overflow = "hidden"
                                                                            localStorage.setItem("idAvatar", data?.product?.image?.id)
                                                                            setIdAva(localStorage.getItem("idAvatar"))
                                                                            setTabActived(2)
                                                                        }} >
                                                                            <span className="ic">
                                                                                <img src={icChangeImg} alt="" />
                                                                            </span>
                                                                            <p className="note-sm cl-text">
                                                                                Thiết lập ảnh cho sản phẩm
                                                                            </p>
                                                                            <span data-tooltip-id="my-tooltipUpLoad" className="ic" data-tooltip-content="Để có kết quả tốt nhất, hãy tải lên tệp JPEG hoặc PNG có kích thước 1000 x 1000 pixel trở lên. Dung lượng tối đa 5GB">
                                                                                <FontAwesomeIcon icon={faCircleQuestion} />
                                                                            </span>
                                                                            <Tooltip id="my-tooltipUpLoad" place="bottom" />
                                                                        </button>
                                                                    </div>

                                                            }


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
                                                                                            <input checked={Array.isArray(checkedDm) && checkedDm.includes(data?.node?.termTaxonomyId)} type="checkbox" onChange={(e) => {
                                                                                                handleCheckedDm(data?.node?.termTaxonomyId)
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
                                                                                                                        <input checked={Array.isArray(checkedDm) && checkedDm.includes(dataChild?.node?.termTaxonomyId)} type="checkbox" onChange={(e) => {
                                                                                                                            handleCheckedDm(dataChild?.node?.termTaxonomyId)
                                                                                                                        }} />
                                                                                                                        <span className="box"></span>
                                                                                                                        <span className="note-sm cl-text">
                                                                                                                            {dataChild?.node?.name}
                                                                                                                        </span>
                                                                                                                    </label>
                                                                                                                    {
                                                                                                                        dataChild?.node?.children?.edges.length > 0
                                                                                                                            ?
                                                                                                                            <ul className="productEdit_dm--list">
                                                                                                                                {
                                                                                                                                    dataChild?.node?.children?.edges.map((dataChild2, indexChild2) => {
                                                                                                                                        return (
                                                                                                                                            <li key={indexChild2} className="productEdit_dm--item">
                                                                                                                                                <label className='boxCk'>
                                                                                                                                                    <input checked={Array.isArray(checkedDm) && checkedDm.includes(dataChild2?.node?.termTaxonomyId)} type="checkbox" onChange={(e) => {
                                                                                                                                                        handleCheckedDm(dataChild2?.node?.termTaxonomyId)
                                                                                                                                                    }} />
                                                                                                                                                    <span className="box"></span>
                                                                                                                                                    <span className="note-sm cl-text">
                                                                                                                                                        {dataChild2?.node?.name}
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
                                                                                            <input checked={Array.isArray(checkedDm) && checkedDm.includes(data?.node?.termTaxonomyId)} type="checkbox" onChange={(e) => {
                                                                                                handleCheckedDm(data?.node?.termTaxonomyId)
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
                                                                                                                        <input checked={Array.isArray(checkedDm) && checkedDm.includes(dataChild?.node?.termTaxonomyId)} type="checkbox" onChange={(e) => {
                                                                                                                            handleCheckedDm(dataChild?.node?.termTaxonomyId)
                                                                                                                        }} />
                                                                                                                        <span className="box"></span>
                                                                                                                        <span className="note-sm cl-text">
                                                                                                                            {dataChild?.node?.name}
                                                                                                                        </span>
                                                                                                                    </label>
                                                                                                                    {
                                                                                                                        dataChild?.node?.children?.edges.length > 0
                                                                                                                            ?
                                                                                                                            <ul className="productEdit_dm--list">
                                                                                                                                {
                                                                                                                                    dataChild?.node?.children?.edges.map((dataChild2, indexChild2) => {
                                                                                                                                        return (
                                                                                                                                            <li key={indexChild2} className="productEdit_dm--item">
                                                                                                                                                <label className='boxCk'>
                                                                                                                                                    <input checked={Array.isArray(checkedDm) && checkedDm.includes(dataChild2?.node?.termTaxonomyId)} type="checkbox" onChange={(e) => {
                                                                                                                                                        handleCheckedDm(dataChild2?.node?.termTaxonomyId)
                                                                                                                                                    }} />
                                                                                                                                                    <span className="box"></span>
                                                                                                                                                    <span className="note-sm cl-text">
                                                                                                                                                        {dataChild2?.node?.name}
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
                                                                                <p className="note-sm cl-gray fw-5">
                                                                                    {
                                                                                        selectedValueStatus === "publish" && "Đã xuất bản"
                                                                                    }
                                                                                    {
                                                                                        selectedValueStatus === "draft" && "Bản nháp"
                                                                                    }
                                                                                    {
                                                                                        selectedValueStatus === "trash" && "Thùng rác"
                                                                                    }
                                                                                    {
                                                                                        data?.product?.status === "private" && "Được xuất bản ở chế độ riêng tư"
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            {
                                                                                data?.product?.status === "private"
                                                                                    ?
                                                                                    ""
                                                                                    :
                                                                                    <div className="productEdit_xb--top-rt">
                                                                                        <div className="productEdit_xb--ic" onClick={() => {
                                                                                            $(componentRef5.current).slideToggle(500);
                                                                                        }}>
                                                                                            <img src={editProCt} alt="editProCt" />
                                                                                        </div>
                                                                                    </div>
                                                                            }

                                                                        </div>

                                                                    </div>
                                                                    {
                                                                        data?.product?.status === "private"
                                                                            ?
                                                                            ""
                                                                            :
                                                                            <div className="productEdit_xb--bottom" ref={componentRef5}>
                                                                                <div className="productEdit_xb--bottom-wrap">
                                                                                    <Select2Component
                                                                                        options={optionsStatus}
                                                                                        value={selectedValueStatus}
                                                                                        onChange={handleSelectStatus}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                    }

                                                                </div>
                                                        }
                                                    </li>
                                                    {
                                                        data?.product?.status === "draft" || data?.product?.status === "trash"
                                                            ?
                                                            ""
                                                            :
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
                                                                                        <p className="note-sm cl-gray fw-5">
                                                                                            {
                                                                                                selectedValueView === "publish" && "Công khai"

                                                                                            }
                                                                                            {
                                                                                                selectedValueView === "password" && "Bảo vệ bằng mật khấu"

                                                                                            }
                                                                                            {
                                                                                                selectedValueView === "private" && "Riêng tư"
                                                                                            }

                                                                                        </p>
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
                                                                                    {
                                                                                        data?.product?.password !== null && selectedValueView === "password"
                                                                                            ?
                                                                                            <input type="text" onChange={(e) => {
                                                                                                setPassPro(e.target.value)
                                                                                            }} value={passPro} className="form-item-ip" placeholder='Nhập mật khẩu' />
                                                                                            :
                                                                                            ""
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                }
                                                            </li>
                                                    }
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
                                                        <div className="productEdit_xb--control-btn">
                                                            <button className={`btn ${loadingUpdate && "loadBtn"}`} onClick={() => {
                                                                handleUpdateProduct(id)
                                                            }}>
                                                                <span className="btn-text">
                                                                    Cập nhật
                                                                </span>
                                                            </button>
                                                            {
                                                                loadingUpdate
                                                                    ?
                                                                    <div className="btn-loading">
                                                                        <ClipLoader color="#007AFF" />
                                                                    </div>

                                                                    :
                                                                    ""
                                                            }
                                                        </div>
                                                        <div className="productEdit_xb--control-btn">
                                                            <Link target='_blank' to={data?.product?.link} className="btn trans">
                                                                <span className="btn-text">
                                                                    Xem trước
                                                                </span>
                                                            </Link>
                                                        </div>

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
                                                        <li className="productEdit_xb--control-item d-item">
                                                            <div className="productEdit_xb--control-link">
                                                                <span className="ic">
                                                                    <img src={control1} alt="Nhân bản" />
                                                                </span>
                                                                <p className="note-sm cl-text">
                                                                    Nhân bản
                                                                </p>
                                                            </div>
                                                        </li>
                                                        <li className="productEdit_xb--control-item d-item">
                                                            <div className="productEdit_xb--control-link">
                                                                <span className="ic">
                                                                    <img src={control2} alt="Tạo bản nháp" />
                                                                </span>
                                                                <p className="note-sm cl-text">
                                                                    Tạo bản nháp
                                                                </p>
                                                            </div>
                                                        </li>
                                                        <li className="productEdit_xb--control-item d-item">
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
            <PopupUpdateImage showedChangeAva={showedChangeAva} setShowedChangeAva={setShowedChangeAva} idAva={idAva} setIdAva={setIdAva} tabActived={tabActived} setTabActived={setTabActived} setAvatarProduct={setAvatarProduct} refetchProductCt={refetchProductCt} id={id} />
            <PopupUpdateAlbums showedChangeAlbums={showedChangeAlbums} setShowedChangeAlbums={setShowedChangeAlbums} tabActived={tabActived} setTabActived={setTabActived} listAlbumId={listAlbumId} idProAlbum={idProAlbum} setIdProAlbum={setIdProAlbum} id={id} refetchProductCt={refetchProductCt} data={data} />
        </div>
    );
};

export default ProductCt;
