import gql from "graphql-tag";

export const FETCH_NAVIGATIONS = gql`
    query {
      navigations {
        id
        name
        shown
        type
        ... on PageNavigation {
          page {
            id
            perma
          }
        }
        ... on ExternalNavigation {
          link
        }
      }
    }
  `,
  FETCH_NAVIGATIONS_FOR_INTERFACE = gql`
    query {
      navigations(shown: true) {
        name
        ... on PageNavigation {
          page {
            perma
          }
        }
        ... on ExternalNavigation {
          link
        }
      }
    }
  `,
  FETCH_PAGE_NAVIGATIONS = gql`
    query {
      navigations(shown: true, type: P) {
        ... on PageNavigation {
          page {
            id
            perma
          }
        }
      }
    }
  `,
  ADD_EXTERNAL_NAVIGATION = gql`
    mutation addExternalNavigation($addedNavigation: ExternalNavigationInput!) {
      addExternalNavigation(addedNavigation: $addedNavigation) {
        id
        type
        __typename
      }
    }
  `,
  ADD_PAGE_NAVIGATION = gql`
    mutation addPageNavigation($addedNavigation: PageNavigationInput!) {
      addPageNavigation(addedNavigation: $addedNavigation) {
        id
        type
        __typename
        page {
          perma
          __typename
        }
      }
    }
  `,
  DELETE_NAVIGATIONS = gql`
    mutation deleteNavigations($ids: [ID]!) {
      deleteNavigations(ids: $ids)
    }
  `,
  EDIT_PAGE_NAVIGATION = gql`
    mutation editPageNavigation(
      $id: ID!
      $editedNavigation: PageNavigationInput!
    ) {
      editPageNavigation(id: $id, editedNavigation: $editedNavigation)
    }
  `,
  EDIT_EXTERNAL_NAVIGATION = gql`
    mutation editExternalNavigation(
      $id: ID!
      $editedNavigation: ExternalNavigationInput!
    ) {
      editExternalNavigation(id: $id, editedNavigation: $editedNavigation)
    }
  `,
  REORDER_NAVIGATIONS = gql`
    mutation reorderNavigations($afterId: ID!, $currentId: ID!) {
      reorderNavigations(afterId: $afterId, currentId: $currentId)
    }
  `;
