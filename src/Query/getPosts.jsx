import { gql } from '@apollo/client';

const CATEGORY_FIELDS = gql`
  fragment CategoryFields on ProductCategory {
  id
  name
  termTaxonomyId
  count
  parentId
  description
  slug
  image {
    id
    sourceUrl
  }
  children {
    edges {
      node {
        id
        name
        termTaxonomyId
        count
        parentId
        children {
          edges {
            node {
              id
              name
              termTaxonomyId
              count
              parentId
              description
              slug
              image {
                id
                sourceUrl
              }
              children {
                edges {
                  node {
                    id
                    name
                    termTaxonomyId
                    count
                    parentId
                    description
                    slug
                    image {
                      id
                      sourceUrl
                    }
                    children {
                      edges {
                        node {
                          id
                          name
                          termTaxonomyId
                          count
                          parentId
                          description
                          slug
                          image {
                            id
                            sourceUrl
                          }
                          children {
                            edges {
                              node {
                                id
                                name
                                termTaxonomyId
                                count
                                parentId
                                description
                                slug
                                image {
                                  id
                                  sourceUrl
                                }
                                children {
                                  edges {
                                    node {
                                      id
                                      name
                                      termTaxonomyId
                                      count
                                      parentId
                                      description
                                      slug
                                      image {
                                        id
                                        sourceUrl
                                      }
                                      children {
                                        edges {
                                          node {
                                            id
                                            name
                                            termTaxonomyId
                                            count
                                            parentId
                                            description
                                            slug
                                            image {
                                              id
                                              sourceUrl
                                            }
                                            children {
                                              edges {
                                                node {
                                                  id
                                                  name
                                                  termTaxonomyId
                                                  count
                                                  parentId
                                                  description
                                                  slug
                                                  image {
                                                    id
                                                    sourceUrl
                                                  }
                                                  children {
                                                    edges {
                                                      node {
                                                        id
                                                        name
                                                        termTaxonomyId
                                                        count
                                                        parentId
                                                        description
                                                        slug
                                                        image {
                                                          id
                                                          sourceUrl
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;



export const GET_ALL_CATEGORIES = gql`
query GetProductCategories($search: String, $page: Int, $perPage: Int!) {
    customTaxonomyz(page: $page, perPage: $perPage, search: $search , taxonomy: "product_cat") {
      currentPage
      hasNextPage
      hasPreviousPage
      total
      totalPages
      query {
        name
        id
        parent
        level
        isInserted
        count
        description
        slug
        imageId
        imageUrl
        displayName
        parentName
      }
    }
  }
`;

export const GET_ALL_TAGS = gql`
  query GetProductTags($search: String, $page: Int, $perPage: Int!) {
    customTaxonomy(perPage: $perPage, page: $page, taxonomy: "product_tag" , search: $search) {
      currentPage
      hasNextPage
      hasPreviousPage
      total
      totalPages
      query {
        id
        name
        description
        count
        slug
      }
    }
  }
`

export const GET_ALL_ATTRIBUTE = gql`
  query NewQueryAllAttribute {
    productAttributes {
      id
      has_archives
      label
      name
      order_by
      slug
      type
      terms
    }
  }
`


export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    productCategories(first: 10000, where: { parent: null }) {
      edges {
        node {
          ...CategoryFields
        }
      }
    }
  }
  ${CATEGORY_FIELDS}
`;


//truy vấn truy cập danh mục sử dụng nhiều
export const GET_PRODUCT_CATEGORIES_MUCH = gql`
  query GetProductCategories {
      productCategories(first: 10000, where: { parent: null , orderby: COUNT }) {
        edges {
          node {
            ...CategoryFields
          }
        }
      }
    }
  ${CATEGORY_FIELDS}
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
            terms(where: { taxonomies: [PRODUCTCATEGORY] }, first: 10000) {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
            tagTerms: terms(where: { taxonomies: [PRODUCTTAG] } , first: 10000) {
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
            terms(where: { taxonomies: [PRODUCTCATEGORY] },first: 10000) {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
            tagTerms: terms(where: { taxonomies: [PRODUCTTAG] } , first: 10000) {
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
      attributes(first: $first) {
        nodes {
          name
          options
          id
          label
          variation
          visible
          attributeId
          position
          }
        }
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
            terms(where: { taxonomies: [PRODUCTCATEGORY] },first: 10000) {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
            tagTerms: terms(where: { taxonomies: [PRODUCTTAG] } , first: 10000) {
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
            terms(where: { taxonomies: [PRODUCTCATEGORY] },first: 10000) {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
            tagTerms: terms(where: { taxonomies: [PRODUCTTAG] } , first: 10000) {
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


export const GET_ALL_ATTRIBUTES_VALUE = gql`
  query GetAttributeValue(
    $page: Int, 
    $perPage: Int!, 
    $search: String, 
    $taxonomy: String
  ) {
    customTaxonomy(
      perPage: $perPage,
      page: $page,
      taxonomy: $taxonomy,
      search: $search
    ) {
      currentPage
      hasNextPage
      hasPreviousPage
      total
      totalPages
      query {
        id
        name
        description
        count
        slug
      }
    }
  }
`;






