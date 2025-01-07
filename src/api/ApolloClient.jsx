import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const token = localStorage.getItem('authToken');
// console.log(token)

const baseUrl = process.env.REACT_APP_BASE_URL;
const client = new ApolloClient({
    link: createHttpLink({
        uri: `${baseUrl}/graphql`, // Kiểm tra URI này
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    }),
    cache: new InMemoryCache(),
});

export default client;