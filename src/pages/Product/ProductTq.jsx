import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useQuery } from '@apollo/client';
import { GET_All_IMAGE_ALBUMS } from '../../Query/getPosts';

const ProductTq = ({ data, loading, setDescriptionPro, setNamePro, setKiloPro, setCodePro, setPriceProRegular, setPriceProSale, showedChangeAlbums, setShowedChangeAlbums, setTabActived, setIdProAlbum, setListAlbumId, refetchProductCt }) => {
    console.log(data)
    const [description, setDescription] = useState("Vui lòng nhập mô tả sản phẩm")
    const [name, setName] = useState("NaN")
    const [kilo, setKilo] = useState("NaN")
    const [sku, setSku] = useState("NaN")
    const [regularPrice, setRegularPrice] = useState("NaN")
    const [salePrice, setSalePrice] = useState("NaN")
    const listRef = useRef(null);


    // useEffect(()=>{

    // })







    useEffect(() => {
        if (data?.product) {
            setName(data?.product?.name)
            setDescription(data?.product?.description)
            setKilo(data?.product?.weight)
            setSku(data?.product?.sku)
            setRegularPrice(data?.product?.regularPrice || "NaN")
            setSalePrice(data?.product?.salePrice || "NaN")
        }
    }, [data])




    useEffect(() => {
        setDescriptionPro(description)
        setNamePro(name)
        setKiloPro(kilo)
        setCodePro(sku)
        setPriceProRegular(regularPrice)
        setPriceProSale(salePrice)
    }, [description, name, kilo, sku, regularPrice, salePrice])





    const handleEditorChange = (content) => {

        setDescription(content);
    };




    const handleOpenPopup = () => {
        setShowedChangeAlbums(true)
        setTabActived(2)
        // localStorage.setItem("idProAlbum", data?.product?.id)
        // setIdProAlbum(localStorage.getItem("idProAlbum"))

        const dataAlbsId = data?.product?.galleryImages?.nodes.map((data) => {
            return data.id
        })

        // Chuyển đổi danh sách thành chuỗi JSON và lưu vào localStorage
        localStorage.setItem("idProAlbums", JSON.stringify(dataAlbsId));
        setListAlbumId(JSON.parse(localStorage.getItem("idProAlbums")));

        console.log(dataAlbsId)
    }


    return (
        <div className="productTq">
            <div className="productTq_wrap">
                <div className="productTq_alb">
                    {
                        loading
                            ?
                            <div className="skeleton"></div>
                            :
                            <div className="productTq_alb--wrap">
                                <div className="productTq_alb--title">
                                    <p className="note-text fw-6 cl-text">
                                        Thư viện hình ảnh
                                    </p>
                                </div>
                                <ul className="productTq_alb--list d-wrap">
                                    <li className="productTq_alb--item d-item">
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
                                    </li>
                                    {
                                        data?.product?.galleryImages?.nodes.length > 0
                                            ?
                                            data?.product?.galleryImages?.nodes.map((data, index) => {
                                                return (
                                                    <li key={index} className="productTq_alb--item d-item">
                                                        <div className="productTq_alb--item-img">
                                                            {
                                                                data.mediaType === "image"
                                                                    ?
                                                                    <img loading='lazy' src={data.sourceUrl} alt={data.title} />
                                                                    :
                                                                    <video muted >
                                                                        <source src={data.mediaItemUrl} type="video/mp4" />
                                                                    </video>
                                                            }
                                                        </div>
                                                    </li>
                                                )

                                            })
                                            :
                                            ""
                                    }

                                </ul>
                            </div>
                    }

                </div>
                <div className="productTq_form">
                    {
                        loading
                            ?
                            <div className="skeleton"></div>
                            :
                            <div className="productTq_form--wrap">
                                <div className="productTq_form--list d-wrap" ref={listRef}>
                                    <div className="productTq_form--item d-item d-1">
                                        <label className="form-item">
                                            <p className="note-text fw-6 cl-text">
                                                Tên sản phẩm
                                            </p>
                                            <input value={name} type="text" className="form-item-ip" placeholder='Nhập tên sản phẩm' onChange={(e) => {
                                                setName(e.target.value)
                                            }} />
                                        </label>
                                    </div>
                                    <div className="productTq_form--item d-item d-2">
                                        <label className="form-item">
                                            <p className="note-text fw-6 cl-text">
                                                Trọng lượng sản phẩm
                                            </p>
                                            <input value={kilo} type="text" className="form-item-ip" placeholder='Nhập trọng lượng sản phẩm' onChange={(e) => {
                                                setKilo(e.target.value)
                                            }} />
                                        </label>
                                    </div>
                                    <div className="productTq_form--item d-item d-2">
                                        <label className="form-item">
                                            <p className="note-text fw-6 cl-text">
                                                Mã sản phẩm
                                            </p>
                                            <input value={sku} type="text" className="form-item-ip" placeholder='Nhập mã sản phẩm' onChange={(e) => {
                                                setSku(e.target.value)
                                            }} />
                                        </label>
                                    </div>
                                    {
                                        data?.product?.type === "SIMPLE" && <div className="productTq_form--item d-item d-2">
                                            <label className="form-item">
                                                <p className="note-text fw-6 cl-text">
                                                    Giá sản phẩm mặc định
                                                </p>
                                                <div className="form-item-unit">
                                                    <input value={regularPrice} type="text" className="form-item-ip" placeholder='Nhập giá sản phẩm' onChange={(e) => {
                                                        setRegularPrice(e.target.value)
                                                    }} />
                                                    <div className="form-item-unit-text">
                                                        Đ
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    }
                                    {
                                        data?.product?.type === "SIMPLE" && <div className="productTq_form--item d-item d-2">
                                            <label className="form-item">
                                                <p className="note-text fw-6 cl-text">
                                                    Giá sản phẩm giảm giá
                                                </p>
                                                <div className="form-item-unit">
                                                    <input value={salePrice} type="text" className="form-item-ip" placeholder='Nhập giá sản phẩm' onChange={(e) => {
                                                        setSalePrice(e.target.value)
                                                    }} />
                                                    <div className="form-item-unit-text">
                                                        Đ
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    }
                                    <div className="productTq_form--item d-item d-1">
                                        <div className="form-item">
                                            <p className="note-text fw-6 cl-text">
                                                Mô tả sản phẩm
                                            </p>

                                            <Editor
                                                apiKey='sihdullj6a7so9mj8oqv4fhgdhfkglgmeterpbtaym2d36e1'
                                                init={{
                                                    height: 800,
                                                    menubar: true,
                                                    plugins: [
                                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                                                        'fullscreen', 'insertdatetime', 'media', 'table', 'emoticons', 'help', 'wordcount'
                                                    ],
                                                    toolbar:
                                                        'undo redo | styleselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist | link image | code | preview | fontSize|fontFamily',
                                                    font_formats:
                                                        'Arial=arial,helvetica,sans-serif;' +
                                                        'Georgia=georgia,palatino,"times new roman",times,serif;' +
                                                        'Courier New=courier new,courier,monospace;' +
                                                        'Tahoma=tahoma,arial,helvetica,sans-serif;',
                                                    fontsize_formats: '8px 10px 12px 14px 18px 24px 36px',
                                                    toolbar_mode: 'floating', // Optional: makes the toolbar stick when scrolling
                                                    language: 'vi',
                                                    style_formats: [
                                                        {
                                                            title: 'Font family',
                                                            items: [
                                                                { title: 'Arial', format: 'font', value: 'Arial, Helvetica, sans-serif' },
                                                                { title: 'Georgia', format: 'font', value: 'Georgia, "Times New Roman", serif' },
                                                                { title: 'Courier New', format: 'font', value: '"Courier New", Courier, monospace' },
                                                            ]
                                                        },
                                                        {
                                                            title: 'Font size',
                                                            items: [
                                                                { title: '8px', format: 'fontSize', value: '8px' },
                                                                { title: '10px', format: 'fontSize', value: '10px' },
                                                                { title: '12px', format: 'fontSize', value: '12px' },
                                                                { title: '14px', format: 'fontSize', value: '14px' },
                                                                { title: '18px', format: 'fontSize', value: '18px' },
                                                                { title: '24px', format: 'fontSize', value: '24px' },
                                                                { title: '36px', format: 'fontSize', value: '36px' }
                                                            ]
                                                        }
                                                    ]
                                                }}
                                                value={description}
                                                onEditorChange={handleEditorChange}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default ProductTq
