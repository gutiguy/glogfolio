import React from "react";
import { RingLoader } from "react-spinners";

export default function withLoading(LoadingComponent) {
  return function WithLoading(props) {
    const { isLoading, ...rest } = props;
    return (
      <React.Fragment>
        {isLoading ? <StyledLoader /> : null}
        <LoadingComponent {...rest} />
      </React.Fragment>
    );
  };
}

export const StyledLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%"
    }}
  >
    <RingLoader />
  </div>
);

/* Use this when you want the component to mount only when loading is done (and unmount when it resumes) */
export function withLoadingAndMount(LoadingComponent) {
  return function WithLoadingAndMount(props) {
    const { isLoading, ...rest } = props;
    if (isLoading) {
      return <RingLoader />;
    } else return <LoadingComponent {...rest} />;
  };
}
