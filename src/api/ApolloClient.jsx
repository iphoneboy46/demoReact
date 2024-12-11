import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const token = localStorage.getItem('authToken');
// console.log(token)

const client = new ApolloClient({
    link: createHttpLink({
        uri: 'https://managewoostore.monamedia.net/graphql', // Kiểm tra URI này
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    }),
    cache: new InMemoryCache(),
});

export default client;