import React, { useEffect, useMemo, useRef, useState } from 'react'
import "../../sass/pages/product.scss"
import $ from 'jquery'; // Import jQuery
import Select2Component from '../../components/Select2Component/Select2Component'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'; // Import react-select





const ProductAttribute = ({ data }) => {
    const [selectedOptionAtr, setSelectedOptionAtr] = useState("");
    const [listAttribute, setListAttribute] = useState([]);
    const [listValue, setListValue] = useState([]);

    const [activedItems, setActivedItems] = useState([]);
    const [checkedHienThi, setCheckedHienThi] = useState([]);
    const [checkedBienThe, setCheckedBienThe] = useState([]);

    const [selectedValueAtr, setSelectedValueAtr] = useState([]);
    const [listCheckSlug, setListCheckSlug] = useState([]);
    const [position, setPosition] = useState([]);

    // const optionValueAtr = useMemo(() => {
    //     return listValue.map((attribute) => {
    //         return attribute.terms.map((term) => ({
    //             value: term.id,
    //             label: term.name,
    //         }));
    //     });
    // }, [listValue]);

    // console.log(listValue)

    const optionValueAtr = useMemo(() => {
        // Sắp xếp lại listValue theo thứ tự position
        const sortedListValue = listValue.sort((a, b) => {
            const positionA = position.indexOf(a.slug); // Lấy vị trí của slug trong mảng position
            const positionB = position.indexOf(b.slug);

            return positionA - positionB; // So sánh thứ tự giữa hai phần tử
        });

        console.log(sortedListValue)

        // Sau khi đã sắp xếp, map lại listValue và tạo option
        return sortedListValue.map((attribute) => {
            return attribute.terms.map((term) => ({
                value: term.slug,
                label: term.name,
            }));
        });
    }, [listValue, position]);



    useEffect(() => {
        if (data?.product?.attributes?.nodes) {
            setCheckedHienThi(data.product.attributes.nodes.map((item) => item.visible || false));
            setCheckedBienThe(data.product.attributes.nodes.map((item) => item.visible || false));
            setPosition(data.product.attributes.nodes.map((item) => item.name || ""));
        }
    }, [data]);

    console.log(position)


    useEffect(() => {
        let listCheckSlugNew = []

        if (data?.product?.attributes?.nodes && Array.isArray(data.product.attributes.nodes)) {
            console.log(listCheckSlug)

            console.log("listCheckSlug", listCheckSlug)


            listCheckSlug.map((item) => {
                console.log(item.terms)
                listCheckSlugNew.push(...item.terms)
            })

            console.log(listCheckSlugNew)

            const initialSelectedValues = data.product.attributes.nodes.map((item) => {
                const listOptions = [item.options]
                console.log("listOptions", listOptions)

                // Lấy các giá trị của item.options và chuyển thành đối tượng phù hợp với react-select
                return Array.isArray(item.options)
                    ? item.options.map((option) => {
                        const matchedTerm = listCheckSlugNew.find((list) => {
                            return list.slug === option
                        });
                        return matchedTerm
                            ? { value: matchedTerm.slug, label: matchedTerm.name, id: matchedTerm.id }
                            : { value: option, label: option, id: option }; // Giá trị mặc định nếu không tìm thấy
                    })
                    : [];
            });
            console.log("initialSelectedValues:", initialSelectedValues);
            setSelectedValueAtr(initialSelectedValues);
        }
    }, [data, listCheckSlug]);

    console.log("selectedValueAtr", selectedValueAtr,)

    const handleMultiSelectValueAtr = (selected, index) => {
        console.log(index);
        console.log("Selected values:", selected);
        setSelectedValueAtr((prev) => {
            const newSelectedValues = [...prev];
            console.log(newSelectedValues)
            newSelectedValues[index] = selected; // Cập nhật giá trị tại index cụ thể
            return newSelectedValues;
        });
    };


    // Hàm xử lý thay đổi trạng thái checked
    const handleCheckboxChangeHienThi = (index) => {
        setCheckedHienThi((prev) => {
            const updated = [...prev];
            console.log(updated)
            updated[index] = !updated[index]; // Đảo ngược trạng thái
            return updated;
        });
    };



    // Hàm xử lý thay đổi trạng thái checked
    const handleCheckboxChangeBienThe = (index) => {
        setCheckedBienThe((prev) => {
            const updated = [...prev];
            console.log(updated)
            updated[index] = !updated[index]; // Đảo ngược trạng thái
            return updated;
        });

        console.log(checkedBienThe)
    };


    useEffect(() => {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.error('Token không tồn tại. Vui lòng đăng nhập lại.');
            return;
        }

        // Gọi API để lấy danh sách thuộc tính
        axios({
            method: 'get',
            url: `${baseUrl}/wp-json/wc/v3/products/attributes`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((attributesResponse) => {
                const attributes = attributesResponse.data;

                // Tạo danh sách các promises để lấy terms cho từng thuộc tính
                const termsPromises = attributes.map((attr) => {
                    let page = 1;
                    let allTerms = [];
                    let hasMore = true;

                    const getTermsForAttribute = () => {
                        return axios({
                            method: 'get',
                            url: `${baseUrl}/wp-json/wc/v3/products/attributes/${attr.id}/terms?per_page=100&page=${page}`,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            allTerms = [...allTerms, ...response.data];

                            // Kiểm tra phân trang và tiếp tục gọi API nếu còn dữ liệu
                            if (response.data.length < 100) {
                                hasMore = false; // Nếu trả về ít hơn 100, không còn dữ liệu
                            } else {
                                page++;
                            }

                            return hasMore ? getTermsForAttribute() : Promise.resolve(allTerms);
                        });
                    };

                    // Gọi hàm lấy terms
                    return getTermsForAttribute().then((terms) => ({
                        ...attr,
                        terms,
                    }));
                });

                // Chờ tất cả các promises hoàn thành
                Promise.all(termsPromises)
                    .then((attributesWithTerms) => {
                        console.log('Thuộc tính và giá trị:', attributesWithTerms);
                        setListAttribute(attributesWithTerms); // Lưu vào state
                        setListValue(attributesWithTerms); // Lưu vào state
                        setListCheckSlug(attributesWithTerms); // Lưu vào state
                    })
                    .catch((error) => {
                        console.error('Lỗi khi lấy terms của thuộc tính:', error);
                    });
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách thuộc tính:', error);
            });
    }, []); // Chỉ chạy 1 lần khi component mount



    console.log(listAttribute)

    // Tạo mảng ref để quản lý từng item
    const componentRefs = useRef([]);

    // Đảm bảo số lượng refs luôn khớp với số lượng items
    if (data?.product?.attributes?.nodes.length !== componentRefs.current.length) {
        componentRefs.current = Array(data?.product?.attributes?.nodes.length)
            .fill(null)
            .map((_, i) => componentRefs.current[i] || React.createRef());
    }


    const toggleActived = (index) => {
        setActivedItems((prev) => {
            // Kiểm tra nếu index đã có trong danh sách actived
            if (prev.includes(index)) {
                // Nếu có, xóa index ra khỏi danh sách
                return prev.filter((i) => i !== index);
            } else {
                // Nếu không có, thêm index vào danh sách
                return [...prev, index];
            }
        });
    };


    const optionAtr = useMemo(() => [
        { value: "", label: "Thêm hiện có" },
        ...listAttribute.map(list => ({
            value: list.id,
            label: list.name,
        })),
    ], [listAttribute]);

    const handleChangeAtr = (option) => {
        setSelectedOptionAtr(option);
        console.log("Selected:", option);
    };








    return (
        <div className="productAttribute">
            <div className="productAttribute_wrap">
                <div className="productAttribute_top">
                    <div className="productAttribute_top--lf">
                        <button className="btn trans">
                            <span className="btn-text">
                                Thêm mới
                            </span>
                        </button>
                        <Select2Component
                            options={optionAtr}
                            value={selectedOptionAtr}
                            onChange={handleChangeAtr}
                            placeholder="Choose an option"
                            isSearchable={true}
                        />
                    </div>
                    <div className="productAttribute_top--rt">
                        <div className="productAttribute_controls">
                            <div className="productAttribute_control">
                                <span className="note-sm cl-text">
                                    Mở
                                </span>
                            </div>
                            <div className="productAttribute_control">

                                <span className="note-sm cl-text">
                                    Đóng
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="productAttribute_bottom" >
                    <ul className="productAttribute_list">
                        {
                            data?.product?.attributes?.nodes.map((data, index) => {
                                return (
                                    <li key={index} className={`productAttribute_item ${activedItems.includes(index) ? 'actived' : ''}`} >
                                        <div className="productAttribute_item--top" onClick={() => {
                                            $(componentRefs.current[index].current).slideToggle(500);
                                            toggleActived(index); // Toggle trạng thái actived
                                        }}>
                                            <div className="productAttribute_item--top-wrap">
                                                <div className="productAttribute_item--top-lf">
                                                    <p className="note-text cl-text fw-7">
                                                        {data.label}
                                                    </p>
                                                </div>
                                                <div className="productAttribute_item--top-rt">
                                                    <span className="note-sm cl-red">
                                                        Xóa
                                                    </span>
                                                    <span className="ic">
                                                        <FontAwesomeIcon icon={faChevronUp} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="productAttribute_item--bottom" ref={componentRefs.current[index]}>
                                            <div className="productAttribute_item--bottom-wrap">
                                                <div className="productAttribute_item--bottom-lf">
                                                    <div className="productAttribute_item--bottom-lf-top">
                                                        <p className="note-sm cl-text">
                                                            Tên: <span className='fw-6'>{data.label}</span>
                                                        </p>
                                                    </div>
                                                    <div className="productAttribute_item--bottom-lf-bottom">
                                                        <label className='boxCk'>
                                                            <input type="checkbox" checked={checkedHienThi[index]} name="visible" id="" onChange={() => {
                                                                handleCheckboxChangeHienThi(index)
                                                            }} />
                                                            <span className="box"></span>
                                                            <p className="note-sm cl-text">Có thể nhìn thấy trên trang sản phẩm</p>
                                                        </label>
                                                        <label className='boxCk'>
                                                            <input type="checkbox" checked={checkedBienThe[index]} name="variable" id="" onChange={() => {
                                                                handleCheckboxChangeBienThe(index)
                                                            }} />
                                                            <span className="box"></span>
                                                            <p className="note-sm cl-text">Dùng cho nhiều biến thể</p>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="productAttribute_item--bottom-rt">
                                                    <div className="productAttribute_item--select">
                                                        <label className="form-item">
                                                            <p className="note-text">Giá trị(s):</p>
                                                            {
                                                                data.position
                                                            }
                                                            <Select
                                                                isMulti
                                                                options={optionValueAtr[index] || []}
                                                                value={selectedValueAtr[index] || []}
                                                                onChange={(selected) => {
                                                                    handleMultiSelectValueAtr(selected, index)
                                                                }}
                                                                getOptionLabel={(e) => e.label}
                                                                getOptionValue={(e) => e.value}
                                                                placeholder={`Chọn giá trị ${data.label}`}
                                                                key={index}
                                                            />
                                                        </label>
                                                        <div className="productAttribute_item--btns">
                                                            <div className="productAttribute_item--btns-lf">
                                                                <button className="btn trans">
                                                                    <span className="btn-text">
                                                                        Chọn tất cả
                                                                    </span>
                                                                </button>
                                                                <button className="btn trans">
                                                                    <span className="btn-text">
                                                                        Không chọn
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            <div className="productAttribute_item--btns-rt">
                                                                <button className="btn trans">
                                                                    <span className="btn-text">
                                                                        Tạo giá trị
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }

                    </ul>
                </div>
                <div className="productAttribute_btn">
                    <button className="btn">
                        <span className="btn-text">
                            Lưu thuộc tính
                        </span>
                    </button>
                    <div className="productAttribute_controls">
                        <div className="productAttribute_control">
                            <span className="note-sm cl-text">
                                Mở
                            </span>
                        </div>
                        <div className="productAttribute_control">

                            <span className="note-sm cl-text">
                                Đóng
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductAttribute;
