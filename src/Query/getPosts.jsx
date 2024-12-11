import { gql } from '@apollo/client';

//truy vấn truy cập danh mục
export const GET_PRODUCT_CATEGORIES = gql`
    query GetProductCategories2 {
      productCategories {
        edges {
          node {
            id
            name
            termTaxonomyId
            children {
              edges {
                node {
                  id
                  name
                  termTaxonomyId
                  children {
                    edges {
                      node {
                        id
                        name
                        termTaxonomyId
                      }
                    }
                  }
                  count
                }
              }
            }
            count
          }
        }
      }
    }
`;

// truy vấn lấy tất cả sản phẩm
export const GET_PRODUCT_ALL = gql`
  query GetProductAll($offset: Int, $size: Int! ,$categoryId:Int , $status: String , $type: ProductTypesEnum,$orderby: [ProductsOrderbyInput],$search: String) {
    products(
      where: { 
        offsetPagination: { offset: $offset, size: $size }, 
        categoryId: $categoryId,
        status: $status,
        type: $type,
        orderby: $orderby,
        search: $search,
        }) 
      {
      edges {
        node {
          id
          name
          description
          image { 
            sourceUrl
          }
          ... on ProductWithPricing {
            regularPrice
            salePrice
          }
          ... on VariableProduct {
            status
            stockQuantity
            stockStatus
            variations {
              nodes {
                id
                name
                regularPrice
                salePrice
                stockStatus
                sku
              }
              pageInfo {
                offsetPagination {
                  hasMore
                  hasPrevious
                  total
                }
              }
            }
            terms(where: { taxonomies: [PRODUCTCATEGORY] }) {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
            tagTerms: terms(where: { taxonomies: [PRODUCTTAG] }) {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
            salePrice
            price
            sku
          }
          ... on SimpleProduct {
            regularPrice
            salePrice
            status
            stockQuantity
            stockStatus
          }
          type
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      found
    }
  }
    
`;



// truy vấn lấy tất cả sản phẩm đã publish
export const GET_PUBLISHER_PRODUCT_TOTAL = gql`
  query GetPublishedProducts {
    products(where: {status: "publish"}) {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;


// truy vấn lấy tất cả sản phẩm đã publish
export const GET_DRAFT_PRODUCT_TOTAL = gql`
  query GetDraftedProducts {
    products(where: {status: "draft"}) {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;


// truy vấn lấy tất cả sản phẩm đã xóa
export const GET_TRASH_PRODUCT_TOTAL = gql`
  query GetTrashedProducts {
    products(where: {status: "trash"}) {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;


// truy vấn lấy tất cả sản phẩm 
export const GET_ALL_PRODUCT_TOTAL = gql`
  query GetAllProducts {
    products {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;

