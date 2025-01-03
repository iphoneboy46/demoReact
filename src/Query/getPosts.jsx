import { gql } from '@apollo/client';

//truy vấn truy cập danh mục
export const GET_PRODUCT_CATEGORIES = gql`
    query GetProductCategories {
      productCategories(first: 1000) {
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

//truy vấn truy cập danh mục sử dụng nhiều
export const GET_PRODUCT_CATEGORIES_MUCH = gql`
    query GetProductCategories {
      productCategories(where: {orderby: COUNT},first: 1000) {
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
  query GetProductAll($offset: Int, $size: Int! ,$categoryId:Int , $status: String , $type:ProductTypesEnum,$orderby: [ProductsOrderbyInput],$search: String, $sku: String) {
    products(
      where: { 
        offsetPagination: { offset: $offset, size: $size }, 
        categoryId: $categoryId,
        status: $status,
        type: $type,
        orderby: $orderby,
        search: $search,
        sku: $sku,
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
          ... on VariableProduct {
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
            regularPrice
            price
            sku
            dateGmt
            link
            weight
            shippingRequired
            password
            status
            stockQuantity
            stockStatus
          }
          ... on SimpleProduct {
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
            regularPrice
            price
            sku
            dateGmt
            link
            weight
            shippingRequired
            password
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


export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!,$first: Int!) {
    product(id: $id) {
      id
      name
      description
      dateGmt
      link
      sku
      password
      image {
        sourceUrl
        id
      }
        galleryImages(first: $first) {
          nodes {
            id
            sourceUrl
            altText
            mediaItemUrl
            mediaType
          }
      }

      ... on VariableProduct {
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
            salePrice(format: RAW)
            regularPrice(format: RAW)
            sku
            dateGmt
            link
            weight
            shippingRequired
            password
            status
            stockQuantity
            stockStatus
          }
          ... on SimpleProduct {
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
            salePrice(format: RAW)
            regularPrice(format: RAW)
            sku
            dateGmt
            link
            weight
            shippingRequired
            password
            status
            stockQuantity
            stockStatus
          }
      type
      
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



// truy vấn lấy tất cả ảnh media

export const GET_ALL_IMAGE_ATTRIBUTES = gql`
  query GetAllImageAttributes($size: Int!, $offset: Int,$parent:ID, $authorIn: [ID] , $month: Int, $year: Int, $search: String) {
  mediaItems( where: {
    offsetPagination: {offset: $offset, size:$size },
    parent: $parent,
    authorIn: $authorIn,
    dateQuery: {month: $month, year: $year},
    search: $search
  }) {
    edges {
      node {
        id
        title
        altText
        caption(format: RAW)
        description(format: RAW)
        date
        sourceUrl
        mediaItemUrl
        mediaType
        mediaDetails {
          width
          height
          file
        }
        author {
          node {
            name
          }
        }
        fileSize
      }
    }
    pageInfo {
      offsetPagination {
        total
        
      }
    }
  }
}
`;


// export const GET_IMAGE_AVA_ID = gql`
//   query GetImageAvaId($id: Int!) {
//   mediaItems(where: {id: $id}) {
//     edges {
//       node {
//         id
//         title
//         altText
//         caption(format: RAW)
//         description(format: RAW)
//         date
//         sourceUrl
//         mediaDetails {
//           width
//           height
//           file
//         }
//         author {
//           node {
//             name
//           }
//         }
//         fileSize
//       }
//     }
//   }
// }
// `;



