import { gql } from "@apollo/client";

export const UPDATE_PRODUCT_STATUS = gql`
    mutation UpdateProductStatus($id: ID!, $status: PostStatusEnum!) {
        updateProduct(input: { id: $id, status: $status }) {
            product {
                id
                status
            }
        }
    }
`;
