import React, { useRef, useEffect } from "react";

import "./StatCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";


const StatCard = ({ title, value, percentage, isPositive, data }) => {
    const trendColor = isPositive ? "positive" : "negative";


    return (
        <div className="stat_card">
            <h3 className="stat_card--title note-sm cl-gray fw-5">{title}</h3>
            <div className="stat_card--wrap">
                <div className="stat_card--lf">
                    <div className="stat_card--info">
                        <span className="stat_card--value note-lg fw-6 cl-text">{value}</span>
                        <div className={`stat_card--trend ${trendColor}`}>
                            <div className="stat_card--ic">
                                {isPositive ? (
                                    <FontAwesomeIcon icon={faArrowTrendUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faArrowTrendDown} />
                                )}
                            </div>
                            <span className="stat_card--percentage">{percentage}%</span>
                        </div>
                    </div>
                </div>
                <div className="stat_card--rt">
                    <div className="stat_card--chart">
                        <ResponsiveContainer width="100%" height={60}>
                            <AreaChart data={data}>
                                <defs>
                                    {
                                        isPositive
                                            ?
                                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#079455" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#079455" stopOpacity={0} />
                                            </linearGradient>
                                            :
                                            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D92D20" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#D92D20" stopOpacity={0} />
                                            </linearGradient>
                                    }

                                </defs>
                                <Tooltip
                                    cursor={false}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="uv"
                                    stroke={isPositive ? "#079455" : "#D92D20"}
                                    fillOpacity={1}
                                    fill={isPositive ? "url(#colorGreen)" : "url(#colorRed)"}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
