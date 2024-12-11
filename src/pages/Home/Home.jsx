import React from "react";
import "../../sass/pages/home.scss";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS để hiển thị toast
import { Link } from "react-router-dom";
import ictitle from "../../assets/images/ictitle.svg";
import DateSelectOne from "../../components/DateSelectOne/DateSelectOne";
import StatCard from "../../components/StatCard/StatCard";
import ChartDS from "../../components/ChartDS/ChartDS";
import ChartAround from "../../components/ChartAround/ChartAround";


const stats = [
	{
		title: "Tổng doanh số",
		value: "$18,880",
		percentage: 7.4,
		isPositive: true,
		data: [{ name: 'Jan', uv: 0 }, { name: 'Feb', uv: 53 }, { name: 'Mar', uv: 10 }],
	},
	{
		title: "Doanh số bán hàng",
		value: "$920",
		percentage: -22,
		isPositive: false,
		data: [{ name: 'Jan', uv: 0 }, { name: 'Feb', uv: 20 }, { name: 'Mar', uv: 5 }]
	},
	{
		title: "Đơn hàng",
		value: "15.5K",
		percentage: 49,
		isPositive: true,
		data: [{ name: 'Jan', uv: 0 }, { name: 'Feb', uv: 20 }, { name: 'Mar', uv: 60 }]
	},
	{
		title: "Sản phẩm đã bán",
		value: "12.5K",
		percentage: 10,
		isPositive: false,
		data: [{ name: 'Jan', uv: 0 }, { name: 'Feb', uv: 60 }, { name: 'Mar', uv: 20 }]
	},
];

const Home = () => {

	return (
		<div className="home">
			<div className="home_wrap">
				<div className="layout_top">
					<div className="layout_top--title">
						<span className="ic">
							<img src={ictitle} alt="ictitle" />
						</span>
						<h1 className="title-mn fw-6 cl-text">
							Tổng quan
						</h1>
					</div>
					<div className="layout_top--list d-wrap">
						<div className="layout_top--top--item d-item">
							<DateSelectOne />
						</div>
					</div>
				</div>
				<div className="layoutStat">
					<ul className="layoutStat_list d-wrap">
						{
							stats.map((stat, index) => {
								return (
									<li key={index} className="layoutStat_item d-item d-4">
										<StatCard {...stat} />
									</li>
								)

							})
						}

					</ul>
				</div>
				<div className="home_ds">
					<ChartDS />
				</div>
				<div className="home_dt">
					<div className="home_dt--wrap.d-wrap">
						<div className="home_dt--lf d-item d-2">
							<ChartAround />
						</div>
						<div className="home_dt--rt d-item d-2">

						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
