import {
  FETCH_NAVIGATIONS,
  FETCH_NAVIGATIONS_FOR_INTERFACE
} from "../../../graphql/navigation";
import { swapArrayElements } from "../../../utils/reorder";

function updateInterfaceQuery(proxy, mutatedNavigations) {
  proxy.writeQuery({
    query: FETCH_NAVIGATIONS,
    data: { navigations: mutatedNavigations }
  });
}

export const syncDelete = ({ ids }) => proxy => {
  const { navigations } = proxy.readQuery({
    query: FETCH_NAVIGATIONS
  });
  const mutatedNavigations = navigations.filter(
    navigation => !ids.includes(navigation.id)
  );
  proxy.writeQuery({
    query: FETCH_NAVIGATIONS,
    data: { navigations: mutatedNavigations }
  });
};

export const syncAdd = ({ addedNavigation }, page) => (proxy, { data }) => {
  const { id, type, __typename } =
    data.addExternalNavigation || data.addPageNavigation;
  if (addedNavigation.pageId) {
    addedNavigation.page = { ...page, __typename: "Page" };
  }
  const { navigations } = proxy.readQuery({
    query: FETCH_NAVIGATIONS
  });
  let mutatedNavigations = [...navigations];
  mutatedNavigations.push({ ...addedNavigation, id, type, __typename });
  updateInterfaceQuery(proxy, mutatedNavigations);
};

export const syncEdit = (userInput, page) => proxy => {
  const { id, editedNavigation } = userInput;
  const { navigations } = proxy.readQuery({ query: FETCH_NAVIGATIONS });
  let mutatedNavigations = [...navigations];
  let mutatedIndex = navigations.map(ele => ele.id).indexOf(id);
  if (editedNavigation.pageId) {
    editedNavigation.page = { ...page, __typename: "Page" };
  }
  mutatedNavigations[mutatedIndex] = {
    ...mutatedNavigations[mutatedIndex],
    ...editedNavigation
  };
  proxy.writeQuery({
    query: FETCH_NAVIGATIONS,
    data: { navigations: mutatedNavigations }
  });
  // We also want to sync the UI interface
  proxy.writeQuery({
    query: FETCH_NAVIGATIONS_FOR_INTERFACE,
    data: {
      navigations: mutatedNavigations.filter(
        navigation => navigation.shown === true
      )
    }
  });
};

export const syncReorder = ({ oldIndex, newIndex }) => proxy => {
  const { navigations } = proxy.readQuery({ query: FETCH_NAVIGATIONS });
  let mutatedNavigations = swapArrayElements(navigations, oldIndex, newIndex);
  proxy.writeQuery({
    query: FETCH_NAVIGATIONS,
    data: { navigations: mutatedNavigations }
  });
  proxy.writeQuery({
    query: FETCH_NAVIGATIONS_FOR_INTERFACE,
    data: { navigations: mutatedNavigations }
  });
};
