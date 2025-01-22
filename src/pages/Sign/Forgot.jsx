import React, { useState } from 'react'
import "../../sass/pages/sign.scss"
import lgbn from "../../assets/images/lgbn.png"
import logoMona from "../../assets/images/logoMona.png"
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from "yup"; // Import Yup
import { Link, useNavigate } from 'react-router-dom'
import logotg from "../../assets/images/logotg.png"
import { toast } from 'react-toastify'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { Helmet } from 'react-helmet'

const Forgot = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmitForgot = (values, { setSubmitting }) => {
        axios.post("https://managewoostore.monamedia.net/wp-json/mona_react/v1/user-forgot/", {
            email: values.email, // Gửi email đến API
        })
            .then((response) => {
                // Kiểm tra mã trạng thái trả về từ API
                if (response.status === 200) {
                    setSubmitting(false)
                    const message = response.data.message || "Gửi email thành công. Vui lòng kiểm tra hộp thư.";
                    toast.success(message, {
                        position: "top-left",  // Hoặc "bottom-left" để đặt thông báo ở dưới cùng
                        autoClose: 500,       // Thời gian thông báo sẽ tự động biến mất (ms)
                    });
                    setTimeout(() => {
                        navigate("/signin");

                    }, [1000])
                } else {
                    setSubmitting(false)
                    const errorMessage = response.data.message || "Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.";
                    toast.error(errorMessage); // Hiển thị thông báo lỗi từ API
                }
            })
            .catch((error) => {
                // Nếu có lỗi trong quá trình gửi yêu cầu
                const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.";
                setErrorMessage(errorMessage);
            });
    };




    const initialValues = {
        email: "",

    }

    const validationSchema = Yup.object({
        email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    });

    return (
        <>
            <Helmet>
                <title>Quên mật khẩu</title>
            </Helmet>
            <div className="sign">
                <div className="sign_wrap">
                    <div className="sign_lf">
                        <div className="sign_lf--wrap">
                            <div className="sign_lf--img">
                                <img src={lgbn} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="sign_rt">
                        <div className="sign_rt--wrap">
                            <div className="sign_rt--top">
                                <div className="sign_rt--title">
                                    <span className="ic">
                                        <img src={logoMona} alt="" />
                                    </span>
                                    <p className="title-sm fw-6 cl-text">Mona Media</p>
                                </div>
                            </div>
                            <div className="sign_rt--center">
                                <p className="note-lg fw-6 cl-text"> Nhập email để lấy lại mật khẩu
                                </p>
                                <div className="sign_form">
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={(values, { setSubmitting }) => {
                                            handleSubmitForgot(values, { setSubmitting })
                                        }}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <div className="sign_form--wrap">
                                                    <div className="sign_form--list">
                                                        <div className="sign_form--item">
                                                            <label className="form-item">
                                                                <p className="form-item-lb">Email</p>
                                                                <span className="form-item-wrap">
                                                                    <Field className="form-item-ip" type="email" name="email" placeholder="Nhập email" value={undefined} />
                                                                </span>
                                                                <ErrorMessage name="email" component="div" className="form-item-error" />
                                                            </label>
                                                        </div>
                                                        <div className="sign_form--item">
                                                            <div className="sign_form--control">
                                                                <div className="sign_form--control-rt">
                                                                    <Link to="/signin" className='cl-pri note-sm'>Quay lại</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="sign_form--btns">
                                                        <div className="sign_form--btn">
                                                            <button className={`btn ${isSubmitting ? "loadBtn" : ""}`} type="submit" >
                                                                <span className="btn-text">
                                                                    Gữi
                                                                </span>
                                                                {
                                                                    isSubmitting
                                                                        ?
                                                                        <span className="btn-loading">
                                                                            <ClipLoader color="#7405ca" size={50} />
                                                                        </span>
                                                                        :
                                                                        ""
                                                                }
                                                            </button>
                                                            {
                                                                errorMessage.length > 0 &&
                                                                <div className="sign_form--error">
                                                                    <p className="note-sm fw-6 cl-red">{errorMessage}</p>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}

                                    </Formik>

                                </div>
                            </div>
                            <div className="sign_rt--bottom">
                                <div className="sign_rt--bottom-lf">
                                    <Link to="https://mona.media/" target='_blank' className='sign_rt--bottom-link'>
                                        <img src={logotg} alt="" />
                                    </Link>
                                </div>
                                <div className="sign_rt--bottom-rt">
                                    <p className="note-mn">@MonaMedia 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Forgot
