import gql from "graphql-tag";

export const FETCH_POSTS_SHALLOW = gql`
    query FetchPostsShallow($tags: [ID], $publishStatus: PublishStatus) {
      posts(tags: $tags, publishStatus: $publishStatus) {
        id
        title
        summary
        posted_at
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
        posted_at
        tags {
          id
          name
        }
      }
    }
  `,
  ADD_POST = gql`
    mutation AddPost($addedPost: PostInput!, $publishStatus: PublishStatus) {
      addPost(addedPost: $addedPost, publishStatus: $publishStatus) {
        id
        title
        summary
        posted_at
        tags {
          id
          name
        }
      }
    }
  `,
  EDIT_POST = gql`
    mutation EditPost(
      $id: ID!
      $editedPost: PostInput!
      $publishStatus: PublishStatus
    ) {
      editPost(
        id: $id
        editedPost: $editedPost
        publishStatus: $publishStatus
      ) {
        id
        title
        summary
        content
        posted_at
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
  `,
  FETCH_POSTS_DATES = gql`
    query PostDates {
      postDates {
        month
        year
      }
    }
  `;
