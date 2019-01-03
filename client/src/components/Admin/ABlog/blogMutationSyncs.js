import { FETCH_POSTS_SHALLOW } from "../../../graphql/blog";

function updateShallowQuery(proxy, mutatedPosts) {
  proxy.writeQuery({
    query: FETCH_POSTS_SHALLOW,
    data: {
      posts: mutatedPosts
    },
    variables: { tags: null }
  });
}

export const syncDelete = ({ id }) => proxy => {
  const { posts } = proxy.readQuery({
    query: FETCH_POSTS_SHALLOW,
    variables: { tags: null }
  });
  const mutatedPosts = posts.filter(post => id !== post.id);
  console.log(mutatedPosts);
  updateShallowQuery(proxy, mutatedPosts);
};

export const syncAdd = ({ addedPost }) => (
  proxy,
  {
    data: {
      addPost: { id }
    }
  }
) => {
  const { posts } = proxy.readQuery({
    query: FETCH_POSTS_SHALLOW,
    variables: { tags: null }
  });
  console.log(posts);
  const { tags, ...restOfPost } = addedPost;
  let parsedTags = tags.map(id => ({ id, __typename: "Tag" }));
  let mutatedPosts = [...posts];
  mutatedPosts.push({
    ...restOfPost,
    id,
    tags: parsedTags,
    __typename: "Post"
  });
  updateShallowQuery(proxy, mutatedPosts);
};

export const syncEdit = userInput => proxy => {
  const { id, editedPost } = userInput;
  const { posts } = proxy.readQuery({ query: FETCH_POSTS_SHALLOW });
  let mutatedPosts = [...posts];
  let mutatedIndex = posts.map(ele => ele.id).indexOf(id);
  mutatedPosts[mutatedIndex] = {
    ...mutatedPosts[mutatedIndex],
    ...editedPost
  };
  updateShallowQuery(proxy, mutatedPosts);
};
