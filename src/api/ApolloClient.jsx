import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: '', // Đổi URL này thành URL trang WordPress của bạn
    cache: new InMemoryCache(),
});

export default client;