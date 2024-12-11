import React, {  useState } from 'react';
import "../../sass/pages/sign.scss";
import vdbn from "../../assets/images/vdbn.mp4";
import logoMona from "../../assets/images/logoMona.png";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import { Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logotg from "../../assets/images/logotg.png";
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { ClipLoader } from "react-spinners";
import axios from 'axios';

const SignIn = () => {
    const [showPass, setShowPass] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleShowPass = () => {
        setShowPass(!showPass);
    };




    const initialValues = {
        email: "",
        pass: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
        pass: Yup.string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .required("Cần phải có mật khẩu"),
    });


    if (localStorage.getItem('authToken')) {
        window.location.href = '/';
    }

    // Mutation với React Query
    const loginMutation = useMutation({
        mutationFn: (values) => {
            return axios.post("https://managewoostore.monamedia.net/wp-json/mona_react/v1/user-login", {
                username: values.email,
                password: values.pass,
            })
            .then(response => {
                if (!response.data.success) {
                    throw new Error(response.data.message || "Failed to login");
                }
                return response.data;
            });
        }
    });


    const handleSignIn = (values, { setSubmitting }) => {
        if (loginMutation.isLoading) return; // Tránh gọi nhiều lần nếu đang xử lý
        loginMutation.mutate(values, {

            onSuccess: (data) => {
                if (data.success) {
                    if (rememberMe) {
                        localStorage.setItem('authToken', data.data.token);
                        localStorage.setItem('dataUser', JSON.stringify(data.data));
                    } else {
                        sessionStorage.setItem('authToken', data.data.token);
                        sessionStorage.setItem('dataUser', JSON.stringify(data.data));
                    }
                    localStorage.setItem('authToken', data.data.token);
                    localStorage.setItem('dataUser', JSON.stringify(data.data))
                    setSubmitting(false)

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 300)

                } else {
                    // In ra thông báo lỗi
                    setSubmitting(false)
                    console.error("Error:", data.message);
                    setErrorMessage(data.message || "Đăng nhập thất bại");
                }
            },
            onError: (error) => {
                console.error("Error during login:", error);
                setErrorMessage("Có lỗi xảy ra, vui lòng thử lại sau.");
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
                setSubmitting(false);
            },
        });
    };


    return (
        <div className="sign">
            <div className="sign_wrap">
                <div className="sign_lf">
                    <div className="sign_lf--wrap">
                        <div className="sign_lf--img">
                            <video muted loop playsInline autoPlay>
                                <source src={vdbn} type="video/mp4" />
                            </video>
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
                            <p className="note-lg fw-6 cl-text">Rất vui được gặp lại bạn</p>
                            <div className="sign_form">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, { setSubmitting }) => {
                                        handleSignIn(values, { setSubmitting });

                                    }}
                                >
                                    {({ isSubmitting, resetForm }) => (
                                        <Form>
                                            <div className="sign_form--wrap">
                                                <div className="sign_form--list">
                                                    <div className="sign_form--item">
                                                        <label className="form-item">
                                                            <p className="form-item-lb">Email</p>
                                                            <span className="form-item-wrap">
                                                                <Field className="form-item-ip" type="email" name="email" placeholder="Nhập email" />
                                                            </span>
                                                            <ErrorMessage name="email" component="div" className="form-item-error" />
                                                        </label>
                                                    </div>
                                                    <div className="sign_form--item">
                                                        <label className="form-item pass">
                                                            <p className="form-item-lb">Mật khẩu</p>
                                                            <div className="form-item-wrap">
                                                                <Field
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
                                                        <div className="sign_form--control">
                                                            <div className="sign_form--control-lf">
                                                                <div className="sign_form--switch">
                                                                    <label className="switch">
                                                                        <input type="checkbox" onChange={()=>{
                                                                            setRememberMe(!rememberMe);
                                                                        }} />
                                                                        <span className="switch-wrap">
                                                                            <span className="switch-wrap-around"></span>
                                                                        </span>
                                                                    </label>
                                                                    <p className="note-sm lc-text">Ghi nhớ</p>
                                                                </div>
                                                            </div>
                                                            <div className="sign_form--control-rt">
                                                                <Link to="/forgot" className="cl-pri note-sm">Quên mật khẩu</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sign_form--btns">
                                                    <div className="sign_form--btn">
                                                        <button className={`btn ${isSubmitting ? "loadBtn" : ""}`} type="submit" disabled={loginMutation.isLoading}>
                                                            <span className="btn-text">
                                                                {loginMutation.isLoading ? "Đang xử lý..." : "Đăng nhập"}
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
                                <Link to="https://mona.media/" target="_blank" className="sign_rt--bottom-link">
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
    );
};

export default SignIn;
