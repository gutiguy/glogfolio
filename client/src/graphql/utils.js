export function makeUpdateMap({ name, cb }) {
  return ({ mutate, ...props }) => ({
    [name]: (clientInput, meta) => {
      return mutate({
        variables: clientInput,
        update: cb(clientInput, meta)
      });
    },
    ...props
  });
}
