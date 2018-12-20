import gql from "graphql-tag";

/* QUERIES */
const FETCH_PAGES_SHALLOW = gql`
  query fetchPages {
    pages {
      id
      title
    }
  }
`;

const FETCH_PAGES_SHALLOW_WITH_PERMA = gql`
  query fetchPages {
    pages {
      id
      title
      perma
    }
  }
`;

const FETCH_PAGES = gql`
  query fetchPage($ids: [ID]!) {
    pages(ids: $ids) {
      id
      title
      perma
      content
      draft
      __typename
    }
  }
`;

/* MUATIONS */
const ADD_PAGE = gql`
  mutation addPage($addedPage: PageInput!) {
    addPage(addedPage: $addedPage) {
      id
    }
  }
`;

const DELETE_PAGES = gql`
  mutation deletePages($ids: [ID]!) {
    deletePages(ids: $ids)
  }
`;

const EDIT_PAGE = gql`
  mutation editPage($id: ID!, $editedPage: PageInput!) {
    editPage(id: $id, editedPage: $editedPage)
  }
`;

export {
  FETCH_PAGES_SHALLOW,
  FETCH_PAGES_SHALLOW_WITH_PERMA,
  FETCH_PAGES,
  DELETE_PAGES,
  EDIT_PAGE,
  ADD_PAGE
};
