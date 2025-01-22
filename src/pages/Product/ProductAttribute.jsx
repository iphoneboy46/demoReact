import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import "../../sass/pages/product.scss"
import $ from 'jquery'; // Import jQuery
import Select2Component from '../../components/Select2Component/Select2Component'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'; // Import react-select
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader, MoonLoader, ScaleLoader } from 'react-spinners';





const ProductAttribute = ({ data, refetchProductCt }) => {
    const [selectedOptionAtr, setSelectedOptionAtr] = useState("");
    const [listAttribute, setListAttribute] = useState([]);
    const [listValue, setListValue] = useState([]);

    const [activedItems, setActivedItems] = useState([]);
    const [checkedHienThi, setCheckedHienThi] = useState([]);
    const [checkedBienThe, setCheckedBienThe] = useState([]);

    const [selectedValueAtr, setSelectedValueAtr] = useState([]);
    const [listCheckSlug, setListCheckSlug] = useState([]);
    const { id } = useParams();
    const [loadingAddAttribute, setLoadingAddAttribute] = useState(false)
    const [loadingSaveAttribute, setLoadingSaveAttribute] = useState(false)
    const [loadingDataAttribute, setLoadingDataAttribute] = useState(false)


    const [dataCustom, setDataCustom] = useState([]);
    const [dataAo, setDataAo] = useState([]);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [dataCustomCheck, setDataCustomCheck] = useState(false);
    const [idAo, setIdAo] = useState([])
    const [typePro, setTypePro] = useState("")

    // Tạo mảng ref để quản lý từng item
    const componentRefs = useRef([]);

    useEffect(() => {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token không tồn tại. Vui lòng đăng nhập lại.');
            return;
        }

        setLoadingDataAttribute(true)


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
                        setLoadingDataAttribute(false)
                        console.log('Thuộc tính và giá trị:', attributesWithTerms);
                        setListAttribute(attributesWithTerms); // Lưu vào state
                        setListValue(attributesWithTerms); // Lưu vào state
                        setListCheckSlug(attributesWithTerms); // Lưu vào state

                    })
                    .catch((error) => {
                        console.error('Lỗi khi lấy terms của thuộc tính:', error);
                        setLoadingDataAttribute(false)

                    });
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách thuộc tính:', error);
                setLoadingDataAttribute(false)

            });
    }, []); // Chỉ chạy 1 lần khi component mount



    useEffect(() => {
        setDataCustom(data?.product?.attributes?.nodes || [])
        setTypePro(data?.product?.type || "")
    }, [data])

    useEffect(() => {
        // Đảm bảo `componentRefs` chứa đúng số lượng refs
        componentRefs.current = dataCustom.map((_, i) => componentRefs.current[i] || React.createRef());
    }, [dataCustom]);


    console.log(listValue)


    const optionValueAtr = useMemo(() => {
        if (!listValue) return {};

        const optionsByName = listValue.reduce((acc, attribute) => {
            console.log(attribute)
            // Lấy các giá trị đã chọn từ selectedValueAtr
            const selectedOptions = selectedValueAtr.flatMap((selected) =>
                selected?.map((opt) => opt.value) || []
            );

            console.log(selectedOptions)

            // Lọc bỏ các giá trị đã được chọn
            const filteredTerms = attribute.terms.filter(
                (term) => {
                    console.log(term)
                    return !selectedOptions.includes(term.slug)
                }
            );

            // Map danh sách filteredTerms thành định dạng cần thiết
            acc[attribute.slug] = filteredTerms.map((term) => ({
                value: term.name,
                label: term.name,
                name: attribute.slug,
            }));

            return acc;
        }, {});

        console.log(optionsByName)

        return optionsByName;
    }, [listValue, selectedValueAtr, data]);




    console.log(optionValueAtr)

    console.log(dataCustom)




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

    const optionAtrFormatted = useMemo(() => {
        console.log("optionAtr", optionAtr)
        return optionAtr.map((optionAtrValue) => {
            const listDis = dataCustom.map((list) => {
                console.log(list)
                return list.attributeId || list.id
            })
            return {
                ...optionAtrValue,
                isDisabled: listDis?.includes(optionAtrValue.value),
            }
        })
    }, [optionAtr, data, selectedOptionAtr])



    const handleChangeAtr = (option) => {
        setSelectedOptionAtr(option);

        setIsBtnDisabled(false);
        setDataCustomCheck(false);

        
        

    };


    useEffect(() => {
        if (data?.product?.attributes?.nodes) {
            setCheckedHienThi(dataCustom.map((item) => item.visible || false));
            setCheckedBienThe(dataCustom.map((item) => item.variation || false));
        }
    }, [dataCustom]);



    useEffect(() => {
        let listCheckSlugNew = []

        if (data?.product?.attributes?.nodes && Array.isArray(data?.product?.attributes?.nodes)) {
            console.log(listCheckSlug)

            console.log("listCheckSlug", listCheckSlug)


            listCheckSlug.map((item) => {
                console.log(item.terms)
                listCheckSlugNew.push(...item.terms)
            })

            console.log("listCheckSlugNew", listCheckSlugNew)

            const initialSelectedValues = data?.product?.attributes?.nodes.map((item) => {
                const listOptions = [item.options]
                console.log("listOptions", listOptions)

                console.log(item)

                // Lấy các giá trị của item.options và chuyển thành đối tượng phù hợp với react-select
                return Array.isArray(item.options)
                    ? item.options.map((option) => {
                        const matchedTerm = listCheckSlugNew.find((list) => {
                            return list.slug === option
                        });

                        console.log("matchedTerm", matchedTerm)
                        console.log(item.name)
                        return matchedTerm
                            ? { value: matchedTerm.slug, label: matchedTerm.name, name: item.name }
                            : { value: option, label: option, name: item.name }; // Giá trị mặc định nếu không tìm thấy
                    })
                    : [];
            });
            console.log("initialSelectedValues:", initialSelectedValues);
            setSelectedValueAtr(initialSelectedValues);
        }
    }, [data, listCheckSlug]);

    console.log("selectedValueAtr", selectedValueAtr)

    const handleMultiSelectValueAtr = (selected, index) => {
        setSelectedValueAtr((prev) => {
            const newSelectedValues = [...prev];
            newSelectedValues[index] = selected; // Cập nhật giá trị tại index cụ thể
            return newSelectedValues;
        });
    };

    console.log(selectedValueAtr)


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






    console.log("selectedOptionAtr", selectedOptionAtr)





    // xử lý chọn option thêm thuộc tính
    useEffect(() => {
        setLoadingAddAttribute(true)
        const timer = setTimeout(() => {
            setSelectedOptionAtr("");
            setLoadingAddAttribute(false)
        }, 500);

        return () => clearTimeout(timer); // Cleanup để tránh rò rỉ bộ nhớ

    }, [selectedValueAtr,dataCustom])

    console.log(data)


    useEffect(() => {
        if (selectedOptionAtr !== "") {
            const listNewOption = listValue.filter((item) => item.id === Number(selectedOptionAtr))

            console.log(listNewOption.map((option) => option))
            const listOptionNew = {
                id: Number(selectedOptionAtr),
                attributeId: Number(selectedOptionAtr),
                // id: Number(selectedOptionAtr),
                name: listNewOption[0]?.slug || "",
                label: listNewOption[0]?.name || "",
                options: [],
                variation: true,
                visible: true
            }

            idAo.push(Number(selectedOptionAtr))


            setDataAo(listOptionNew)

            setDataCustom((prev) => {
                return [
                    ...prev,
                    listOptionNew
                ]
            })


        }
    }, [selectedOptionAtr !== ""]);


    // const handleSelectAll = (name,index) => {
    //     console.log(index);
    //     console.log(name);

    //     console.log(listValue)

    //     const allOptions = optionValueAtr[name] || [];
    //     console.log(allOptions);

    //     setSelectedValueAtr((prevSelected) => {
    //         const newSelected = [...prevSelected];

    //         console.log("newSelected", newSelected.flat())


    //         console.log(name)

    //         const listCheck = listValue.filter((item) => item.slug === name) || [];
    //         console.log("listCheck", listCheck);
    //         console.log(newSelected[index]);

    //         let listCheckFormat = listCheck.map((list)=>{
    //             // console.log(list)
    //             return list.terms
    //         })

    //         console.log(listCheckFormat)

    //         // console.log(allOptions)
    //         // Lọc ra các phần tử không có trong newSelected[index]
    //         const listFilter = listCheckFormat[0]?.filter(
    //             (item) => !newSelected[index].some((selected) => selected.value === item.slug)
    //         );

    //         const listFilterResult = listFilter.map((item) => {
    //             console.log(item);
    //             console.log(item.name)
    //             console.log(item.slug)
    //             return {
    //                 value: item.slug,
    //                 label: item.name,
    //                 // name: `pa_${name.toLowerCase()}`,
    //                 name: name,

    //             };
    //         });

    //         console.log("listFilter", listFilterResult);

    //         // Kết hợp giá trị mới vào newSelected[index]
    //         newSelected[index] = [...newSelected[index], ...listFilterResult];
    //         console.log(newSelected[index]);

    //         return newSelected;
    //     });
    // };
    

    const handleSelectAll = (name, index) => {
        console.log(index);
        console.log(name);
        console.log(listValue);
    
        // Lấy tất cả các tùy chọn cho `name`
        const allOptions = optionValueAtr[name] || [];
        console.log(allOptions);
    
        setSelectedValueAtr((prevSelected) => {
            // Tạo một bản sao của `prevSelected`
            const newSelected = [...prevSelected];
            console.log("newSelected", newSelected.flat());
    
            // Lọc các phần tử trong `listValue` có `slug` trùng với `name`
            const listCheck = listValue.filter((item) => item.slug === name) || [];
            console.log("listCheck", listCheck);
            console.log(newSelected[index]);
    
            // Lấy `terms` của các phần tử trong `listCheck` (nếu có)
            let listCheckFormat = listCheck.map((list) => list.terms).flat(); // Dùng .flat() để làm phẳng mảng nếu cần
            console.log("listCheckFormat", listCheckFormat);
    
            // Lọc ra các phần tử chưa được chọn trong `newSelected[index]`
            const listFilter = listCheckFormat.filter(
                (item) => {
                    // Kiểm tra xem newSelected[index] có phải là mảng không, nếu không thì khởi tạo nó là mảng rỗng
                    return !((newSelected[index] || []).some((selected) => selected.value === item.slug));
                }
            );
    
            // Chuyển các phần tử lọc được thành định dạng phù hợp
            const listFilterResult = listFilter.map((item) => {
                console.log(item);
                console.log(item.name);
                console.log(item.slug);
                return {
                    value: item.slug,
                    label: item.name,
                    name: name, // Thêm name để theo dõi
                };
            });
    
            console.log("listFilter", listFilterResult);
    
            // Kết hợp các giá trị mới vào `newSelected[index]`
            newSelected[index] = [...(newSelected[index] || []), ...listFilterResult];
            console.log(newSelected[index]);
    
            return newSelected;
        });
    };
    
   
    
    
    
    
    
    
    

    const handleDeselectAll = (index) => {
        // Xóa tất cả các giá trị đã chọn cho Select ở index này
        setSelectedValueAtr((prevSelected) => {
            const newSelected = [...prevSelected];
            newSelected[index] = [];
            return newSelected;
        });

        setDataCustomCheck(false)
        setIsBtnDisabled(false)
    };

    const handleSaveAttribute = () => {
        const token = localStorage.getItem("authToken");
        const decodedProductId = atob(id); // Giải mã Base64
        const productNumber = decodedProductId.match(/:(\d+)$/)?.[1] || 0;
        const prevAttributes = dataCustom || [];
        setLoadingSaveAttribute(true);

        const mergedArray = selectedValueAtr.flat();  // Dữ liệu chọn mới
        console.log("mergedArray", mergedArray)

        // Cập nhật các thuộc tính có sự thay đổi
        const updatedAttributesValue = prevAttributes.map((prev, index) => {
            console.log(prev)
            // Tìm các mục trong mergedArray có tên thuộc tính giống prev.name
            let listOp = mergedArray.filter((item) => item.name === prev.name);
            console.log(listOp)
            let listOpValue = listOp.map((item) => item.label);


            console.log("New options to merge:", listOpValue);
            console.log("prev options:", prev.options);



            return {
                ...prev,
                id: prev.attributeId || idAo[index] || dataAo.id,
                attributeId: prev.attributeId || idAo[index] || dataAo.id,
                variation: checkedBienThe[index] || false,
                visible: checkedHienThi[index] || false,
                options: [...listOpValue]  // Thêm các options mới vào thuộc tính đó
            };

        });

        // Lọc ra các thuộc tính có sự thay đổi (có options)
        const filteredUpdatedAttributes = updatedAttributesValue.filter(attr => attr !== null);

        console.log(filteredUpdatedAttributes)



        const listSubmit = {
            id: productNumber,
            attributes: filteredUpdatedAttributes,
        };

        console.log("listSubmit", listSubmit)
        const baseUrl = process.env.REACT_APP_BASE_URL;

        axios
            .put(
                `${baseUrl}/wp-json/wc/v3/products/${productNumber}`,
                listSubmit,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                console.log("Product updated:", response.data);
                setSelectedOptionAtr("");
                setLoadingSaveAttribute(false);
                setDataCustomCheck(false)
                // setIdAo([])
                refetchProductCt({})
                toast.success("Cập nhật thuộc tính thành công!", {
                    autoClose: 3000,
                });



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
                setSelectedOptionAtr("");
                setLoadingSaveAttribute(false);
                setDataCustomCheck(false)
                toast.error("Cập nhật thuộc tính thất bại", {
                    autoClose: 3000,
                });

                const container = document.querySelector(".layoutMain_rt--wrap");
                if (container) {
                    container.scrollTo({
                        top: 0, // Cuộn lên đầu trang
                        left: 0,
                        behavior: 'smooth', // Cuộn mượt mà
                    }); // Cuộn container về đầu
                }

                if (error.response) {
                    console.error("Error updating product:", error.response.data);
                } else if (error.request) {
                    console.error("Error request:", error.request);
                } else {
                    console.error("Error:", error.message);
                }
            });

    };



    useEffect(() => {
        const isValid = dataCustom.some((data, index) => {
            const selectedValues = selectedValueAtr[index] || [];
            const options = data.options || [];

            const isCheckboxChanged =
                checkedHienThi[index] !== data.visible ||
                checkedBienThe[index] !== data.variation;

            const isNotMatching =
                selectedValues.length !== options.length ||
                !selectedValues.every(value =>
                    options.some(option => option === value.value)
                );

            return isNotMatching || isCheckboxChanged;
        });

        setIsBtnDisabled(isValid);
    }, [selectedValueAtr, dataCustom, checkedBienThe, checkedHienThi]);



    const handleDeleteAttribute = useCallback((attributeId, index, label) => {
        console.log(attributeId)
        refetchProductCt({})
        setDataCustomCheck(true)
        setSelectedOptionAtr("");
        setDataCustom((prev) => {
            return prev.filter((item) => {
                return item.attributeId !== attributeId
            })
        })

        // Cập nhật setSelectedValueAtr
        setSelectedValueAtr((prevSelected) => {
            return prevSelected.filter((item, idx) => {

                return idx !== index; // Giữ nguyên giá trị cho các index khác
            });
        });

        console.log("selectedValueAtr", selectedValueAtr)

        console.log(dataCustom)
    }, [dataCustom, selectedValueAtr])


    console.log("selectedValueAtr", selectedValueAtr)


    const openAll = () => {
        componentRefs.current.forEach((ref) => {
            if (ref?.current.style.display == "none") {
                $(ref.current).slideDown(500); // Mở
                setActivedItems(dataCustom.map((_, index) => index)); // Đánh dấu tất cả là actived
            }


        });
    };

    const closeAll = () => {
        componentRefs.current.forEach((ref) => {
            console.log(ref?.current)
            if (ref?.current) {
                $(ref.current).slideUp(500); // Đóng
                setActivedItems([]); // Xóa trạng thái actived
            }
        });
    }


    console.log(optionValueAtr)

    console.log(listValue)

    console.log(listCheckSlug)


    console.log(selectedValueAtr[2])



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
                        <div className={`productAttribute_top--lf-sl ${loadingAddAttribute || loadingDataAttribute ? "dis" : ""}`}>
                            <Select2Component
                                options={optionAtrFormatted}
                                value={selectedOptionAtr}
                                onChange={handleChangeAtr}
                                placeholder="Choose an option"
                                isSearchable={true}
                            />
                            {
                                loadingAddAttribute || loadingDataAttribute ? (
                                    <div className="btn-loading">
                                        <ClipLoader color="#007AFF" />
                                    </div>
                                ) : ""
                            }
                        </div>

                    </div>
                    {
                        dataCustom.length > 0
                        &&
                        <>
                            <div className="productAttribute_top--rt">
                                <div className="productAttribute_controls">
                                    <div className="productAttribute_control">
                                        <span className="note-sm cl-text" onClick={() => {
                                            openAll()
                                        }}>
                                            Mở
                                        </span>
                                    </div>
                                    <div className="productAttribute_control">

                                        <span className="note-sm cl-text" onClick={() => {
                                            closeAll()
                                        }}>
                                            Đóng
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className="productAttribute_bottom" >
                    <ul className="productAttribute_list">

                        {

                            dataCustom?.map((data, index) => {
                                console.log(data)
                                return (
                                    <>
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
                                                        <span className="note-sm cl-red" onClick={(e) => {
                                                            // e.preventDefault();
                                                            e.stopPropagation(); // Ngăn sự kiện lan truyền
                                                            handleDeleteAttribute(data.attributeId, index, data.label)
                                                        }}>
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

                                                            {
                                                                typePro !== "SIMPLE"
                                                                &&
                                                                <label className='boxCk'>
                                                                    <input type="checkbox" checked={checkedBienThe[index]} name="variable" id="" onChange={() => {
                                                                        handleCheckboxChangeBienThe(index)
                                                                    }} />
                                                                    <span className="box"></span>
                                                                    <p className="note-sm cl-text">Dùng cho nhiều biến thể</p>
                                                                </label>
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="productAttribute_item--bottom-rt">
                                                        <div className="productAttribute_item--select">
                                                            <label className="form-item">
                                                                <p className="note-text">Giá trị(s):</p>
                                                                {
                                                                    loadingDataAttribute
                                                                        ?
                                                                        <div className="skeleton"></div>
                                                                        :
                                                                        <Select
                                                                            isMulti
                                                                            options={optionValueAtr[data.name] || []}
                                                                            value={selectedValueAtr[index] || []}
                                                                            onChange={(selected) => {
                                                                                handleMultiSelectValueAtr(selected, index)
                                                                            }}
                                                                            getOptionLabel={(e) => e.label}
                                                                            getOptionValue={(e) => e.value}
                                                                            placeholder={`Chọn giá trị ${data.label}`}
                                                                            key={index}
                                                                        />
                                                                }

                                                            </label>
                                                            <div className="productAttribute_item--btns">
                                                                <div className="productAttribute_item--btns-lf">
                                                                    <button className={`btn trans ${optionValueAtr[data.name]?.length === 0 ? "btnDis" : ""}`} onClick={() => {
                                                                        handleSelectAll(data.name,index)
                                                                    }}>
                                                                        <span className="btn-text" >
                                                                            Chọn tất cả
                                                                        </span>
                                                                    </button>
                                                                    <button className={`btn trans ${selectedValueAtr[index]?.length <= 0 || selectedValueAtr[index] === undefined ? "btnDis" : ""}`} onClick={() => {
                                                                        handleDeselectAll(index)
                                                                    }}>
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
                                    </>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="productAttribute_btn">
                    <button
                        className={`btn ${loadingSaveAttribute && "loadBtn"} ${isBtnDisabled || dataCustomCheck ? "" : "btnDis"}`}
                        onClick={() => {
                            handleSaveAttribute();
                        }}
                    >
                        <span className="btn-text">
                            Lưu thuộc tính
                        </span>
                        {loadingSaveAttribute && (
                            <div className="btn-loading">
                                <ClipLoader color="#007AFF" />
                            </div>
                        )}
                    </button>
                    {
                        dataCustom.length > 0
                        &&
                        <>
                            <div className="productAttribute_controls">
                                <div className="productAttribute_control">
                                    <span className="note-sm cl-text" onClick={() => {
                                        openAll()
                                    }}>
                                        Mở
                                    </span>
                                </div>
                                <div className="productAttribute_control" onClick={() => {
                                    closeAll()
                                }}>

                                    <span className="note-sm cl-text">
                                        Đóng
                                    </span>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductAttribute;
