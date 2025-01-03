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




// Query để lấy danh sách thẻ
export const GET_TAG_TERMS = gql`
  query GetTagTerms {
    terms(where: { taxonomies: [PRODUCTTAG] }) {
      nodes {
        id
        name
      }
    }
  }
`;

// Mutation để thêm thẻ vào danh mục
export const ADD_TAG = gql`
  mutation AddTag($name: String!, $taxonomy: String!) {
    createTag(input: { name: $name, taxonomy: $taxonomy }) {
      term {
        id
        name
      }
    }
  }
`;

// Define custom mutation to update product tags
export const UPDATE_PRODUCT_TAG = gql`
  mutation AddTagsToProduct($id: String!, $tagNames: [String]!) {
    addTagsToProduct(input: {id: $id, tagNames: $tagNames}) {
      product {
        id
        title
        terms(where: {taxonomies: "product_tag"}) {
          id
          name
        }
      }
    }
  }
`



export const CREATE_TAG_MUTATION = gql`
  mutation CreateProductTag($name: String!) {
    createProductTag(input: { name: $name }) {
      productTag {
        id
        name
      }
    }
  }
`;


// Mutation để xóa thẻ khỏi sản phẩm
export const REMOVE_TAGS_FROM_PRODUCT = gql`
  mutation RemoveTagsFromProduct($id: String!, $tagIds: [String!]!) {
    removeTagsFromProduct(input: { id: $id, tagIds: $tagIds }) {
      product {
        id
        title
        terms(where: { taxonomies: "product_tag" }) {
          id
          name
        }
      }
    }
  }
`;








