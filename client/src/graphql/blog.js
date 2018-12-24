import gql from "graphql-tag";

export const FETCH_POSTS_SHALLOW = gql`
    query FetchPostsShallow {
      posts {
        id
        title
        summary
        draft
        tags {
          id
          name
        }
      }
    }
  `,
  FETCH_POST_DEEP = gql`
    query FetchPostsDeep($ids: [ID]) {
      posts(ids: $ids) {
        id
        title
        content
        draft
        tags {
          id
          name
        }
      }
    }
  `,
  ADD_POST = gql`
    mutation AddPost($addedPost: PostInput!) {
      addPost(addedPost: $addedPost) {
        id
        title
        summary
        tags {
          id
          name
        }
      }
    }
  `,
  EDIT_POST = gql`
    mutation EditPost($id: ID!, $editedPost: PostInput!) {
      editPost(id: $id, editedPost: $editedPost) {
        id
        title
        summary
        content
        draft
        tags {
          id
          name
        }
      }
    }
  `,
  DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
      deletePost(id: $id)
    }
  `,
  FETCH_TAGS = gql`
    query FetchTags {
      tags {
        id
        name
      }
    }
  `,
  ADD_EDIT_AND_DELETE_TAGS = gql`
    mutation AddEditAndDeleteTags(
      $addedTags: [TagInput]
      $editedTags: [TagEditInput!]
      $deletedTags: [ID]
    ) {
      addEditAndDeleteTags(
        addedTags: $addedTags
        editedTags: $editedTags
        deletedTags: $deletedTags
      )
    }
  `;
