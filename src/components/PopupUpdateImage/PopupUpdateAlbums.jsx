import React, { useEffect, useState } from 'react'
import "./PopupUpdateImage.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import Select2Component from '../Select2Component/Select2Component';
import imgDemo from "../../assets/images/proDemo.png"
import { Link, useParams } from 'react-router-dom';
import { GET_ALL_IMAGE_ATTRIBUTES } from '../../Query/getPosts';
import { useMutation, useQuery } from '@apollo/client';
import { BarLoader, ClipLoader, PacmanLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import axios from 'axios';

const PopupUpdateAlbums = ({ showedChangeAlbums, setShowedChangeAlbums, setTabActived, tabActived, listAlbumId, idProAlbum, setIdProAlbum, id, refetchProductCt, data }) => {

    const [selectedValueImage, setSelectedValueImage] = useState("image")
    const [selectedValueMonth, setSelectedValueMonth] = useState("")
    const [selectedValueYear, setSelectedValueYear] = useState("")

    const [idAlbsFormatted, setIdAlbsFormatted] = useState()
    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [capacity, setCapacity] = useState("")
    const [altAva, setAltAva] = useState("")
    const [caption, setCaption] = useState("")
    const [description, setDescription] = useState("")
    const [linkLk, setLinkLk] = useState("")
    const [avatar, setAvatar] = useState("")
    const [page2, setPage2] = useState(0)
    const [totalPages2, setTotalPages2] = useState(0)  // Tổng số trang (tính một lần)
    const [isRefetching, setIsRefetching] = useState(false)
    let size2 = 50
    const [dragging, setDragging] = useState(false)
    const [loadingUpLoadImg2, setLoadingUpLoadImg2] = useState(false)
    const [loadingUpLoadAlbs, setLoadingUpLoadAlbs] = useState(false)
    const [checkedAlbums, setCheckedAlbums] = useState([]);
    const [loadingSetUpImage, setLoadingSetUpImage] = useState(false)
    const [dataAvatar, setDataAvatar] = useState([])
    const currentYear = new Date().getFullYear()
    const [valueSearch, setValueSearch] = useState("")

    console.log(dataAvatar)


    useEffect(() => {
        if (!idProAlbum) {
            // Nếu không có idAva, không giải mã và không làm gì cả
            setIdAlbsFormatted('');
            return;
        }

        try {
            // Giải mã Base64 để lấy chuỗi ban đầu
            const decodedProductId = atob(idProAlbum); // atob() giải mã Base64

            const productNumber = Number(decodedProductId.match(/:(\d+)$/)?.[1]) || null;

            setIdAlbsFormatted(productNumber);

            console.log(productNumber)
        } catch (error) {
            // Nếu giải mã không thành công (do chuỗi Base64 không hợp lệ), xử lý lỗi
            console.error('Failed to decode Base64:', error);
            setIdAlbsFormatted(''); // Hoặc giá trị mặc định khác nếu cần
        }
    }, [idProAlbum]);

    console.log(idProAlbum)


    const { loading: loadingAllMedia, error: errorAllMedia, data: dataAllMedia, refetch: refetchAllMedia } = useQuery(GET_ALL_IMAGE_ATTRIBUTES, {
        variables: {
            size: size2,
            offset: 0,
            ...(selectedValueImage === "upload" ? { parent: id } : ""),
            ...(selectedValueImage === "noneImage" ? { parent: 0 } : ""),
            ...(selectedValueImage === "forYou" ? { authorIn: data.user_id } : ""),
            ...(selectedValueMonth !== "" ? { month: Number(selectedValueMonth) } : ""),
            ...(selectedValueYear !== "" ? { year: Number(selectedValueYear) } : ""),
            ...(valueSearch !== "" ? { search: valueSearch } : "")

        },
        fetchPolicy: 'cache-first', // Lấy dữ liệu từ cache trước
        notifyOnNetworkStatusChange: false,  // Đảm bảo cập nhật khi dữ liệu thay đổi
    });

    console.log(errorAllMedia)




    const optionsMonth = [
        { value: "", label: 'Tất cả các tháng' },
        { value: "1", label: 'Tháng 1' },
        { value: "2", label: 'Tháng 2' },
        { value: "3", label: 'Tháng 3' },
        { value: "4", label: 'Tháng 4' },
        { value: "5", label: 'Tháng 5' },
        { value: "6", label: 'Tháng 6' },
        { value: "7", label: 'Tháng 7' },
        { value: "8", label: 'Tháng 8' },
        { value: "9", label: 'Tháng 9' },
        { value: "10", label: 'Tháng 10' },
        { value: "11", label: 'Tháng 11' },
        { value: "12", label: 'Tháng 12' }
    ];

    // Tạo danh sách các năm từ năm hiện tại đến 10 năm trước
    const optionYears = [
        { value: "", label: "Tất cả các năm" }, // Thêm lựa chọn "Tất cả các năm" ở đầu
        ...Array.from({ length: 11 }, (_, i) => {
            return { value: currentYear - i, label: (currentYear - i).toString() };
        })
    ];


    const optionsImage = [
        { value: "image", label: 'Hình ảnh' },
        { value: "upload", label: 'Tải lên sản phẩm này' },
        { value: "noneImage", label: 'Chưa được đính kèm' },
        { value: "forYou", label: 'Của bạn' }
    ];

    const handleSelectChangeImage = (value) => {
        setSelectedValueImage(value);
    };

    const handleSelectChangeMonth = (value) => {
        setSelectedValueMonth(value);
    };

    const handleSelectChangeYear = (value) => {
        setSelectedValueYear(value);
    };

    useEffect(() => {
        console.log(idProAlbum)
        const infoAva = dataAllMedia?.mediaItems?.edges.filter((data) => {
            return data.node.id === idProAlbum;
        })

        setDataAvatar(infoAva)

    }, [idProAlbum])



    useEffect(() => {

        if (Array.isArray(dataAvatar) && dataAvatar.length > 0 && dataAvatar[0]?.node) {
            setTitle(dataAvatar[0]?.node.title || "");

            const formattedDate = dataAvatar[0]?.node.date ? new Date(dataAvatar[0]?.node.date).toLocaleDateString("en-GB", {
                day: "2-digit", month: "2-digit", year: "numeric",
            }) : null;
            setDate(formattedDate);

            console.log("dataAvatar", dataAvatar)

            const fileSizeInKB = dataAvatar[0]?.node.fileSize ? (dataAvatar[0]?.node.fileSize / 1024).toFixed(0) + " KB" : "NaN";
            setCapacity(fileSizeInKB);

            setAltAva(dataAvatar[0]?.node.altText);
            setCaption(dataAvatar[0]?.node.caption);
            setDescription(dataAvatar[0]?.node.description);
            setLinkLk(dataAvatar[0]?.node.sourceUrl);

            setAvatar(dataAvatar[0]?.node.sourceUrl)
        }



    }, [dataAvatar]);




    // Cập nhật totalPages khi dữ liệu được tải lần đầu
    useEffect(() => {
        if (dataAllMedia?.mediaItems?.pageInfo?.offsetPagination?.total) {
            setTotalPages2(Math.ceil((dataAllMedia?.mediaItems?.pageInfo?.offsetPagination?.total) / size2) || 0);
        }

    }, [dataAllMedia]);


    console.log(dataAllMedia)

    const handlePageChange2 = async (selected) => {
        setIsRefetching(true); // Kích hoạt loading thủ công
        await refetchAllMedia({ offset: selected * size2 });
        setPage2(selected); // Cập nhật page cho ReactPaginate
        setIsRefetching(false); // Tắt loading sau khi refetch xong
    };

    useEffect(() => {
        setCheckedAlbums(listAlbumId);
    }, [dataAllMedia]);



    const handleChangeImgAlbs = (e, idImage) => {
        if (e.ctrlKey || e.shiftKey) {
            // Khi nhấn Ctrl hoặc Shift, thêm hoặc bỏ chọn nhiều ảnh
            setCheckedAlbums((prev) => {
                return prev.includes(idImage)
                    ? prev.filter((id) => id !== idImage) // Bỏ checked nếu đã chọn
                    : [...prev, idImage]; // Thêm checked nếu chưa có
            });

            // Cập nhật localStorage với danh sách checkedAlbums mới
            localStorage.setItem("idProAlbums", JSON.stringify(checkedAlbums));
        } else {
            // Khi không giữ Ctrl hoặc Shift, chọn một ảnh duy nhất nhưng không làm mất ảnh cũ
            setCheckedAlbums((prev) => {
                // Nếu ảnh đã chọn chưa có trong checkedAlbums thì thêm vào, nếu có thì giữ nguyên
                const updatedCheckedAlbums = prev.includes(idImage)
                    ? prev
                    : [...prev, idImage];
                return updatedCheckedAlbums;
            });

            // Cập nhật ảnh duy nhất đang chọn
            setIdProAlbum(idImage);

            // Cập nhật localStorage với danh sách checkedAlbums mới
            localStorage.setItem("idProAlbums", JSON.stringify(checkedAlbums));
            localStorage.setItem("idProAlbum", idImage);
        }
    };



    useEffect(() => {
        window.addEventListener("resize", () => {
            totalHeight2()

        })

        function totalHeight2() {
            const popupUpdateImg2 = document.querySelector(".popupUpdateImg.albs")

            if (popupUpdateImg2) {
                const lf = popupUpdateImg2.querySelector(".popupUpdateImg_show--lf")
                const style3 = getComputedStyle(lf)
                const top2 = lf.querySelector(".popupUpdateImg_show--lf-top")
                const bottom2 = lf.querySelector(".popupUpdateImg_show--lf-bottom")
                const list2 = bottom2.querySelector(".popupUpdateImg_show--all-list")
                const all = bottom2.querySelector(".popupUpdateImg_show--all")
                const style4 = getComputedStyle(all)
                const totalAllMedia = bottom2.querySelector(".totalAllMedia")
                const noteBoChecked = lf.querySelector(".noteBoChecked")
                console.log(noteBoChecked)
                const total2 = lf.clientHeight - parseInt(style3.rowGap) - top2.clientHeight - parseInt(style4.rowGap) - totalAllMedia.clientHeight - noteBoChecked.clientHeight - 4;
                console.log(total2)
                list2.style.height = total2 + "px";

            }

        }

        totalHeight2()

    }, [tabActived])


    // Hàm sao chép liên kết
    const handleCopy = () => {
        navigator.clipboard.writeText(linkLk)
            .then(() => {
                toast.success("Đã sao chép liên kết", {
                    autoClose: 3000,
                })
            })
            .catch(error => {
                console.error('Failed to copy: ', error);
            });
    };


    const handleUpload = async (files) => {
        const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB

        setLoadingUpLoadImg2(true); // Bật trạng thái loading

        const uploadFile = async (file) => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`Tệp "${file.name}" vượt quá giới hạn dung lượng 5 GB.`, {
                    autoClose: 3000,
                });
                return null; // Bỏ qua tệp này nếu quá lớn
            }

            const formData = new FormData();
            formData.append("file", file);
            const token = localStorage.getItem('authToken');

            try {
                const response = await axios.post(
                    "https://managewoostore.monamedia.net/wp-json/wp/v2/media",
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.status === 201) {
                    return response.data; // Trả về dữ liệu file đã upload
                } else {
                    console.error("Upload failed for:", file.name, response.data);
                    return null;
                }
            } catch (error) {
                console.error("Error during upload for:", file.name, error.message);
                return null;
            }
        };

        const uploadedFiles = [];
        for (const file of files) {
            const uploadedFile = await uploadFile(file);
            if (uploadedFile) {
                uploadedFiles.push(uploadedFile);
            }
        }

        setLoadingUpLoadImg2(false); // Tắt trạng thái loading

        if (uploadedFiles.length > 0) {
            toast.success(`${uploadedFiles.length} tệp tin đã được tải lên thành công!`, {
                autoClose: 3000,
            });
            refetchAllMedia(); // Refresh danh sách media
            setTabActived(2);
        } else {
            toast.error("Không thể tải lên các tệp tin.", {
                autoClose: 3000,
            });
        }
    };


    const handleFileChange = (e) => {


        const files = Array.from(e.target.files);
        handleUpload(files);
    };

    const handleUpLoadImg = () => {
        document.getElementById("fileInput2").click();
    };


    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleUpload(files);
    };


    const handleSetUpAvatar = (idProduct) => {
        console.log("idProduct: " + idProduct);
        setLoadingSetUpImage(true)
        const mediaId = idProduct; // ID của ảnh trong Media Library
        const listInfoAvatarUpdate = {
            alt_text: altAva, // Văn bản thay thế (alt text)
            caption: caption, // Chú thích ảnh
            title: title,     // Tiêu đề ảnh
            description: description, // Mô tả ảnh
        };

        const token = localStorage.getItem('authToken');


        // Sử dụng then/catch
        axios
            .post(
                `https://managewoostore.monamedia.net/wp-json/wp/v2/media/${mediaId}`, // Endpoint REST API
                listInfoAvatarUpdate, // Payload dữ liệu
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Thay bằng token xác thực
                    },
                }
            )
            .then((response) => {
                console.log("Media updated successfully:", response.data);
                // Thực hiện hành động tiếp theo nếu cần
                setLoadingSetUpImage(false)
                toast.success("Thông tin ảnh cập nhật thành công!", {
                    autoClose: 3000,
                });
                refetchAllMedia({})


            })
            .catch((error) => {
                console.error("Error updating media:", error);
                setLoadingSetUpImage(false)
                toast.error("Thông tin ảnh cập nhật thất bại!", {
                    autoClose: 3000,
                });
                refetchAllMedia({})

            });
    };


    const handleAddUpAlbs = (idProductSp) => {
        console.log(idProductSp)
        setLoadingUpLoadAlbs(true);
        // Giải mã Base64
        const decodedProductId = atob(idProductSp); // atob() giải mã Base64

        // Lấy ID sản phẩm từ chuỗi
        const productNumberId = Number(decodedProductId.match(/:(\d+)$/)?.[1]) || null;

        console.log('ID sản phẩm sau khi giải mã:', productNumberId);

        // Token từ localStorage
        const token = localStorage.getItem('authToken');

        // Endpoint REST API của WordPress
        const endpoint = `https://managewoostore.monamedia.net/wp-json/wc/v3/products/${productNumberId}`;

        // Lấy dữ liệu hiện tại của sản phẩm
        axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Thay bằng token thực tế
            },
        })
            .then(response => {
                const currentImages = response.data.images || []; // Lấy danh sách ảnh hiện tại

                // Giữ lại ảnh đầu tiên và loại bỏ các ảnh còn lại
                const imagesWithoutFirst = currentImages.slice(1); // Loại bỏ ảnh đầu tiên

                // Cập nhật mảng checkedAlbums khi có sự thay đổi (bỏ chọn/ chọn ảnh)
                const updatedCheckedAlbums = checkedAlbums.filter(id => {
                    return id; // Logic để kiểm tra xem id có đang được chọn không
                });

                // Tạo mảng ảnh cập nhật
                const updatedImages = [
                    // Ảnh đầu tiên sẽ luôn được giữ lại
                    currentImages[0],
                    // Lọc ảnh không có trong checkedAlbums (tức là ảnh đã bị bỏ chọn)
                    ...imagesWithoutFirst.filter(image => {
                        return updatedCheckedAlbums.includes(btoa(`:${image.id}`));
                    })
                ].concat(updatedCheckedAlbums.map((id) => {
                    const decodedImgAlbsId = atob(id); // Giải mã Base64
                    const ImgNumberId = Number(decodedImgAlbsId.match(/:(\d+)$/)?.[1]) || null;
                    return { id: ImgNumberId };
                }));

                // Cập nhật sản phẩm với danh sách ảnh mới
                return axios.put(endpoint, { images: updatedImages }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
            })
            .then(updateResponse => {
                // Xử lý phản hồi thành công
                console.log('Album cập nhật thành công:', updateResponse.data);
                toast.success("Cập nhật Albums sản phẩm thành công", {
                    autoClose: 3000,
                });
                setShowedChangeAlbums(false);
                setLoadingUpLoadAlbs(false);
                setCheckedAlbums(checkedAlbums);
                refetchAllMedia({});
                refetchProductCt({});
                setValueSearch("")

            })
            .catch(error => {
                // Xử lý lỗi
                console.error('Lỗi khi cập nhật album:', error.response?.data || error.message);
                toast.error("Cập nhật Albums sản phẩm thất bại", {
                    autoClose: 3000,
                });
                setShowedChangeAlbums(false);
                setLoadingUpLoadAlbs(false);
                refetchAllMedia({});
                refetchProductCt({})
            });
    };



    const handleDeleteImgVV = (id) => {
        // Hiển thị thông báo xác nhận
        const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?");

        if (!userConfirmed) {
            console.log("Hủy hành động xóa");
            return; // Người dùng từ chối xóa, kết thúc hàm
        }

        // Endpoint API của WordPress
        const endpoint = `https://managewoostore.monamedia.net/wp-json/wp/v2/media/${id}`;

        // Token xác thực
        const token = localStorage.getItem("authToken"); // Lấy token từ localStorage (hoặc nguồn khác)

        // Gửi yêu cầu xóa
        axios
            .delete(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Thay YOUR_TOKEN bằng token JWT thực tế
                },
                data: {
                    force: true, // Tham số bắt buộc để xóa vĩnh viễn
                },
            })
            .then((response) => {
                console.log("Xóa thành công:", response.data);

                // Thực hiện các thao tác khác sau khi xóa, ví dụ: cập nhật danh sách
                toast.success("Ảnh xóa thành công!", {
                    autoClose: 3000,
                });

                localStorage.setItem("idAvatar", "");
                setIdAlbsFormatted("");
                refetchAllMedia({});
                setDate("")
                setTitle("");
                setCapacity("");
                setAltAva("");
                setCaption("");
                setDescription("");
                setLinkLk("");
                setAvatar("");
                refetchProductCt({})
                setIdProAlbum("");
                localStorage.setItem("idProAlbum", "")

            })
            .catch((error) => {
                console.error("Xóa thất bại:", error.response?.data || error.message);
                toast.success("Ảnh xóa thất bại!", {
                    autoClose: 3000,
                });
            });
    };

    console.log("idProAlbum", idProAlbum)


    console.log("dataAvatar", dataAvatar)

    return (
        <div className="popupUpdateImgBox">
            <div className={`popupUpdateImg albs ${showedChangeAlbums && "showed"} ${loadingAllMedia || loadingSetUpImage || loadingUpLoadAlbs || loadingSetUpImage ? "disabled" : ""}`}>
                <div className="popupUpdateImg_wrap">
                    <div className="popupUpdateImg_top">
                        <div className="popupUpdateImg_top--title">
                            <p className="note-lg cl-text fw-6">Thêm ảnh vào thư viện</p>
                            <button className="popupUpdateImg_ex" onClick={() => {
                                setShowedChangeAlbums(false)
                                document.body.style.overflow = "auto"
                                setIdProAlbum("");
                                localStorage.setItem("idProAlbum", "")
                                setValueSearch("")

                            }}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className="popupUpdateImg_tab">
                            <div className="popupUpdateImg_tab--lf">
                                <ul className="popupUpdateImg_tab--list d-wrap">
                                    <li className="popupUpdateImg_tab--item d-item">
                                        <div className={`popupUpdateImg_tab--item-wrap ${tabActived === 1 ? "actived" : ""}`} onClick={() => {
                                            setTabActived(1)
                                        }}>
                                            <p className="note-text cl-text fw-5">
                                                Tải lên tệp mới
                                            </p>
                                        </div>
                                    </li>
                                    <li className="popupUpdateImg_tab--item d-item">
                                        <div className={`popupUpdateImg_tab--item-wrap ${tabActived === 2 ? "actived" : ""}`} onClick={() => {
                                            setTabActived(2)
                                        }}>
                                            <p className="note-text cl-text fw-5">
                                                Chọn từ thư viện media
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="popupUpdateImg_tab--rt">
                                <div className="popupUpdateImg_tab--rt-btn">
                                    <button className={`btn trans ${loadingAllMedia || loadingUpLoadImg2 || loadingUpLoadAlbs ? "loadBtn" : ""} ${data?.product?.galleryImages?.nodes?.length !== checkedAlbums.length ? "" : "btnDis"} `} onClick={() => {
                                        handleAddUpAlbs(id)
                                    }}>
                                        <span className="btn-text">
                                            Thêm vào thư viện của sản phẩm
                                        </span>
                                    </button>
                                    {
                                        loadingUpLoadAlbs
                                            ?
                                            <div className="btn-loading">
                                                <ClipLoader color="#007AFF" />
                                            </div>
                                            :
                                            ""
                                    }
                                </div>
                                <div className="popupUpdateImg_tab--rt-btn">
                                    <button className={`btn ${loadingAllMedia || loadingUpLoadImg2 || loadingSetUpImage || loadingUpLoadAlbs ? "loadBtn" : ""}`} onClick={() => {
                                        handleSetUpAvatar(idAlbsFormatted)
                                    }}>
                                        <span className="btn-text">
                                            Thiết lập thông tin ảnh
                                        </span>
                                    </button>
                                    {
                                        loadingSetUpImage
                                            ?
                                            <div className="btn-loading">
                                                <ClipLoader color="#007AFF" />
                                            </div>
                                            :
                                            ""
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="popupUpdateImg_bottom">
                        <div className="popupUpdateImg_content">
                            <ul className="popupUpdateImg_content--list">
                                <li className={`popupUpdateImg_content--item ${tabActived === 1 ? "showed" : ""}`}>
                                    <div className={`popupUpdateImg_upload ${dragging ? 'dragging' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}>
                                        {
                                            loadingUpLoadImg2
                                                ?
                                                <div className="popupUpdateImg_upload--loading">
                                                    <p className="note-lg cl-text t-center fw-6">
                                                        Đang tải lên vui lòng chờ...
                                                    </p>
                                                    <div className="popupUpdateImg_upload--loading-ic">
                                                        <BarLoader className='loading' color="#007AFF" />
                                                    </div>
                                                    <p className="note-sm cl-text t-center fw-6">
                                                        Xin cảm ơn
                                                    </p>
                                                </div>
                                                :
                                                <div className="popupUpdateImg_upload--wrap">
                                                    <input type="file" name="" id="fileInput2" multiple onChange={handleFileChange} />
                                                    <p className="note-lg fw-5 cl-text t-center">
                                                        Thả các tệp tin để tải lên
                                                    </p>
                                                    <span className="note-text cl-text t-center">
                                                        hoặc
                                                    </span>
                                                    <button className="btn" onClick={handleUpLoadImg}>
                                                        <span className="btn-text">
                                                            Chọn tệp tin
                                                        </span>
                                                    </button>
                                                    <span className="note-md cl-text t-center">
                                                        Kích thước tệp tin tải lên tối đa: 5 GB
                                                    </span>
                                                </div>
                                        }


                                    </div>
                                </li>
                                <li className={`popupUpdateImg_content--item ${tabActived === 2 ? "showed" : ""}`}>
                                    <div className="popupUpdateImg_show">
                                        <div className="popupUpdateImg_show--wrap">
                                            <div className="popupUpdateImg_show--lf">
                                                <div className="popupUpdateImg_show--lf-top">
                                                    <div className="popupUpdateImg_show--lf-top-lf">
                                                        <p className="note-text fw-5 cl-text">
                                                            Lọc media
                                                        </p>
                                                        <div className="popupUpdateImg_show--lf-top-lf-sl">
                                                            <Select2Component
                                                                options={optionsImage}
                                                                value={selectedValueImage}
                                                                onChange={handleSelectChangeImage}
                                                            />
                                                            <Select2Component
                                                                options={optionsMonth}
                                                                value={selectedValueMonth}
                                                                onChange={handleSelectChangeMonth}
                                                            />
                                                            <Select2Component
                                                                options={optionYears}
                                                                value={selectedValueYear}
                                                                onChange={handleSelectChangeYear}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="popupUpdateImg_show--lf-top-rt">
                                                        <p className="note-text fw-5 cl-text">
                                                            Tìm tệp media
                                                        </p>
                                                        <input value={valueSearch} onChange={(e) => {
                                                            setValueSearch(e.target.value)
                                                        }} type="text" className='form-item-ip' placeholder='Nhập tên hình' />
                                                    </div>
                                                </div>
                                                <span className="note-mn cl-text noteBoChecked">(Giữ Ctrl + Click để bỏ chọn)</span>
                                                <div className="popupUpdateImg_show--lf-bottom">
                                                    <div className="popupUpdateImg_show--all">
                                                        <ul className="popupUpdateImg_show--all-list d-wrap">
                                                            {
                                                                loadingAllMedia || isRefetching
                                                                    ?
                                                                    <div className="popupUpdateImg_show--all-loading">
                                                                        <PacmanLoader className='loadingIcon' color="#007AFF" />
                                                                    </div>
                                                                    :
                                                                    dataAllMedia?.mediaItems?.edges.map((data, index) => {
                                                                        return (
                                                                            <li key={index} className="popupUpdateImg_show--all-item d-item">
                                                                                <label className='popupUpdateImg_show--all-item-img'>
                                                                                    <input checked={checkedAlbums.includes(data.node.id)} onChange={()=>{}} onClick={(e) => {
                                                                                        handleChangeImgAlbs(e, data.node.id)

                                                                                    }}
                                                                                        onDoubleClick={(e) => {
                                                                                            handleChangeImgAlbs(e, data.node.id)
                                                                                        }}
                                                                                        type="checkbox" name='imgAlbs' />
                                                                                    <span className="box">
                                                                                        <FontAwesomeIcon icon={faCheck} />
                                                                                    </span>

                                                                                    <span className="img">
                                                                                        {
                                                                                            data.node.mediaType === "image"
                                                                                                ?
                                                                                                <img loading='lazy' src={data.node.sourceUrl} alt={data.node.title} />
                                                                                                :
                                                                                                <video muted >
                                                                                                    <source src={data.node.mediaItemUrl} type="video/mp4" />
                                                                                                </video>
                                                                                        }
                                                                                    </span>
                                                                                </label>
                                                                            </li>
                                                                        )
                                                                    })

                                                            }
                                                        </ul>
                                                        <div className="totalAllMedia">
                                                            <p className="note-text cl-gray t-center fw-4">
                                                                Kết quả từ {page2 + 1} đến trang {totalPages2}
                                                            </p>
                                                            <div className="totalAllMedia_pagi">
                                                                <ReactPaginate
                                                                    pageCount={totalPages2}
                                                                    onPageChange={({ selected }) => handlePageChange2(selected)}  // Gọi hàm khi chuyển trang
                                                                    pageRangeDisplayed={2}
                                                                    marginPagesDisplayed={1}
                                                                    previousLabel="←"  // Mũi tên trái
                                                                    nextLabel="→"      // Mũi tên phải
                                                                    containerClassName="pagination"
                                                                    activeClassName="active"
                                                                    forcePage={page2}
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`popupUpdateImg_show--rt ${idProAlbum === "" ? "hiddened" : ""}`}>
                                                <div className="popupUpdateImg_show--ct">
                                                    <div className="popupUpdateImg_show--ct-top">
                                                        <p className="note-text cl-text t-up fw-5">
                                                            Chi tiết tệp đính kèm
                                                        </p>
                                                        <div className="popupUpdateImg_show--ct-info">
                                                            <div className="popupUpdateImg_show--ct-info-img">
                                                                <img src={avatar !== "" ? avatar : imgDemo} alt="imgDemo" />
                                                            </div>
                                                            <div className="popupUpdateImg_show--ct-info-des">
                                                                <p className="note-mn cl-text fw-5">
                                                                    <>Tên: {title}</>
                                                                </p>
                                                                <p className="note-mn cl-gray fw-4">
                                                                    <>Ngày: {date}</>
                                                                </p>
                                                                <p className="note-mn cl-gray fw-4">
                                                                    <>Dung lượng: {capacity}</>
                                                                </p>
                                                                <p className="note-mn cl-gray fw-4">
                                                                    <>
                                                                        {
                                                                            Array.isArray(dataAvatar) && dataAvatar.length > 0 && dataAvatar[0]?.node
                                                                                ?
                                                                                <>
                                                                                    {dataAvatar[0]?.node.mediaDetails.width} dài và rộng {dataAvatar[0]?.node.mediaDetails.height} pixel
                                                                                </>
                                                                                :
                                                                                ""
                                                                        }

                                                                    </>
                                                                </p>
                                                                {
                                                                    idProAlbum !== "" ?
                                                                        <p className="note-mn cl-second ">
                                                                            <span className='btnDeleteNever' onClick={() => {
                                                                                handleDeleteImgVV(idAlbsFormatted)
                                                                            }}>Xóa vĩnh viễn</span>
                                                                        </p>
                                                                        :
                                                                        ""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="popupUpdateImg_show--ct-bottom">
                                                        <div className="popupUpdateImg_show--ct-form">
                                                            <ul className="popupUpdateImg_show--ct-form-list">
                                                                <li className="popupUpdateImg_show--ct-form-item">
                                                                    <label className="form-item">
                                                                        <p className="note-text cl-text">Văn bản thay thế</p>
                                                                        <input value={altAva} onChange={(e) => { setAltAva(e.target.value) }} type="text" placeholder='Nhập văn bản thay thế' className="form-item-ip" />
                                                                    </label>
                                                                    <Link to="https://www.w3.org/WAI/tutorials/images/decision-tree/" target='_blank' className='link'>Xem cách mô tả nội dung ảnh</Link>
                                                                    <span className="note-sm cl-gray">
                                                                        Để trống nếu ảnh chỉ dùng làm hiệu ứng trang trí
                                                                    </span>
                                                                </li>
                                                                <li className="popupUpdateImg_show--ct-form-item">
                                                                    <label className="form-item">
                                                                        <p className="note-text cl-text">Tiêu đề</p>
                                                                        <input value={title} onChange={(e) => { setTitle(e.target.value) }} type="text" placeholder='Nhập tiêu đề' className="form-item-ip" />
                                                                    </label>
                                                                </li>
                                                                <li className="popupUpdateImg_show--ct-form-item">
                                                                    <label className="form-item">
                                                                        <p className="note-text cl-text">Chú thích</p>
                                                                        <input type="text" value={caption} onChange={(e) => { setCaption(e.target.value) }} placeholder='Nhập chú thích' className="form-item-ip" />
                                                                    </label>
                                                                </li>
                                                                <li className="popupUpdateImg_show--ct-form-item">
                                                                    <label className="form-item">
                                                                        <p className="note-text cl-text">Mô tả</p>
                                                                        <textarea type="text" value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder='Nhập mô tả' className="form-item-tx" />
                                                                    </label>
                                                                </li>
                                                                <li className="popupUpdateImg_show--ct-form-item">
                                                                    <label className="form-item">
                                                                        <p className="note-text cl-text">Liên kết của tệp tin</p>
                                                                        <input value={linkLk} onChange={(e) => { setLinkLk(e.target.value) }} type="text" placeholder='Nhập liên kết' className="form-item-ip" readonly disabled />
                                                                    </label>
                                                                    <button onClick={() => {
                                                                        handleCopy()
                                                                    }} className="btn trans">
                                                                        <span className="btn-text">
                                                                            Sao chép liên kết
                                                                        </span>
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="popupUpdateImg_modal"></div>
        </div>


    )
}

export default PopupUpdateAlbums
