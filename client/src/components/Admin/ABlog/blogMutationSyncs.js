import { FETCH_POST_DEEP, FETCH_POSTS_SHALLOW } from "../../../graphql/blog";
import { swapArrayElements } from "../../../utils/reorder";

function updateShallowQuery(proxy, mutatedPosts) {
  proxy.writeQuery({
    query: FETCH_POSTS_SHALLOW,
    data: {
      posts: mutatedPosts
    }
  });
}

function updateDeepQuery(proxy, mutatedPosts) {
  proxy.writeQuery({
    query: FETCH_POST_DEEP,
    data: { posts: mutatedPosts }
  });
}

function updateRelevantQueries(proxy, mutatedPosts) {
  updateShallowQuery(proxy, mutatedPosts);
}

export const syncDelete = ({ id }) => proxy => {
  const { posts } = proxy.readQuery({
    query: FETCH_POSTS_SHALLOW
  });
  const mutatedPosts = posts.filter(post => id !== post.id);
  updateRelevantQueries(proxy, mutatedPosts);
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
    query: FETCH_POSTS_SHALLOW
  });
  const { tags, ...restOfPost } = addedPost;
  let parsedTags = tags.map(id => ({ id, __typename: "Tag" }));
  let mutatedPosts = [...posts];
  mutatedPosts.push({
    ...restOfPost,
    id,
    tags: parsedTags,
    __typename: "Post"
  });
  updateRelevantQueries(proxy, mutatedPosts);
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
  updateRelevantQueries(proxy, mutatedPosts);
};
