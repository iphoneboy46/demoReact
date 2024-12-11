import React, { useState } from 'react'
import "../../sass/pages/sign.scss"
import lgbn from "../../assets/images/lgbn.png"
import logoMona from "../../assets/images/logoMona.png"
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from "yup"; // Import Yup
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import logotg from "../../assets/images/logotg.png"

const SignUp = () => {


    const [showPass, setShowPass] = useState(true);
    const [showRePass, setShowRePass] = useState(true);


    const handleShowPass = () => {
        setShowPass(!showPass)

    }

    const handleShowRePass = () => {
        setShowRePass(!showRePass)

    }

    const handleSubmitSignUp = (values) => {
        console.log("Form values:", values);
    }



    const initialValues = {
        email: "",
        pass: "",
        repass: "",

    }

    const validationSchema = Yup.object({
        email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
        pass: Yup.string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .required("Cần có mật khẩu"),
        repass: Yup.string()
            .oneOf([Yup.ref("pass"), null], "Mật khẩu không khớp") // Kiểm tra trùng khớp với "pass"
            .required("Cần xác nhận mật khẩu"),
    });

    return (
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
                            <p className="note-lg fw-6 cl-text"> Đăng kí tài khoản
                            </p>
                            <div className="sign_form">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        handleSubmitSignUp(values)
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
                                                        <label className="form-item pass">
                                                            <p className="form-item-lb">Mật khẩu</p>
                                                            <div className="form-item-wrap">
                                                                <Field
                                                                    value={undefined}
                                                                    className="form-item-ip"
                                                                    type={showPass ? "password" : "text"}
                                                                    name="pass"
                                                                    placeholder="Nhập mật khẩu"
                                                                />
                                                                <span onClick={handleShowPass} className="ic-eyes">
                                                                    {
                                                                        showPass ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />
                                                                    }
                                                                </span>
                                                            </div>
                                                            <ErrorMessage name="pass" component="div" className="form-item-error" />
                                                        </label>
                                                    </div>
                                                    <div className="sign_form--item">
                                                        <label className="form-item pass">
                                                            <p className="form-item-lb">Nhập lại mật khẩu</p>
                                                            <div className="form-item-wrap">
                                                                <Field
                                                                    value={undefined}
                                                                    className="form-item-ip"
                                                                    type={showRePass ? "password" : "text"}
                                                                    name="repass"
                                                                    placeholder="Nhập mật khẩu"
                                                                />
                                                                <span onClick={handleShowRePass} className="ic-eyes">
                                                                    {
                                                                        showRePass ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />
                                                                    }
                                                                </span>
                                                            </div>
                                                            <ErrorMessage name="repass" component="div" className="form-item-error" />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="sign_form--btns">
                                                    <div className="sign_form--btn">
                                                        <button className="btn">
                                                            <span className="btn-text">
                                                                Đăng ký
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="sign_form--do">
                                                    <p className="note-sm cl-text t-center">
                                                        Bạn đã có tài khoản ?
                                                        <Link className="cl-pri" to="/signin"> Đăng nhập ngay</Link>
                                                    </p>
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
    )
}

export default SignUp
