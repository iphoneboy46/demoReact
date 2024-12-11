import { Route, Routes, Navigate } from "react-router-dom";
import "./sass/style.scss";
import publicRoutes from "./routes/publicRoutes";
import React, { createContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ApolloProvider } from "@apollo/client";
import client from "./api/ApolloClient";

const queryClient = new QueryClient();
export const ThemeContext = createContext();

function App() {
    const dataUser = localStorage.getItem("dataUser")
    const [user, setUser] = useState(dataUser);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalProductAo, setTotalProductAo] = useState(0);
    const [totalProductDraft, setTotalProductDraft] = useState(0);
    const [totalProductTrash, setTotalProductTrash] = useState(0);
    const signSuccess = localStorage.getItem("authToken");


    document.addEventListener("click", (e) => {
        const boxSelects = document.querySelectorAll(".box-select");

        boxSelects.forEach((boxSelect) => {
            const input = boxSelect.querySelector(".ipDropDown");

            // Nếu click bên trong box-select, giữ trạng thái
            if (boxSelect.contains(e.target)) return;

            // Nếu không, đóng dropdown
            if (input) {
                input.checked = false;
            }
        });
    });





    window.addEventListener("click", (e) => {
        if (!e.target.closest(".box-select")) {
            const boxSelects = document.querySelectorAll(".box-select")
            if (boxSelects) {
                boxSelects.forEach(boxSelect => {
                    const ip = boxSelect.querySelector(".ipDropDown");
                    ip.checked = false;
                })
            }
        }
    })




    return (
        <ApolloProvider client={client}>
            <ThemeContext.Provider value={{ user, setUser, totalProduct, setTotalProduct ,totalProductAo, setTotalProductAo, totalProductDraft, setTotalProductDraft , totalProductTrash, setTotalProductTrash }} >
                <QueryClientProvider client={queryClient}>
                    <div className="App">
                        <Routes>
                            {publicRoutes.map((publicRoute, index) => {
                                const Page = publicRoute.components;
                                const Layout = publicRoute.layout || React.Fragment;

                                // Kiểm tra route có cần đăng nhập hay không
                                if (publicRoute.protected && !signSuccess) {
                                    return (
                                        <Route
                                            key={index}
                                            path={publicRoute.path}
                                            element={<Navigate to="/signin" />} // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
                                        />
                                    );
                                }

                                return (
                                    <Route
                                        exact={publicRoute.exact}
                                        key={index}
                                        path={publicRoute.path}
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                        <ToastContainer />
                    </div>
                </QueryClientProvider>
            </ThemeContext.Provider>
        </ApolloProvider>

    );
}

export default App;
