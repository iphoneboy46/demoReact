import { gql } from '@apollo/client';

// Truy vấn để lấy danh sách bài viết
export const GET_POSTS = gql`
    query GetPosts {
        posts {
            nodes {
                id
                title
                content
                date
                uri
            }
        }
    }
`;