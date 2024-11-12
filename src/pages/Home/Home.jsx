import React from "react";
import "../../sass/pages/home.scss";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS để hiển thị toast
import { Link } from "react-router-dom";
const Home = () => {
	const handleShowAlert = () => {
		toast.success("Thông báo")
	};

	return (
		<>
			<div className="home">
				<div className="container">
					<div className="home_wrap">
						<h1 className="title-lg t-center fw-7 fwi">Home</h1>
						<div>
							<Link to="/posts" className="cl-second note-text">List Post</Link>
						</div>
						<button
							onClick={() => {
								handleShowAlert();
							}}
						>
							Show Alert
						</button>
					</div>
				</div>
			</div>
			<ToastContainer />
		</>
	);
};

export default Home;
