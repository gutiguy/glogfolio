import React from "react";
import { RingLoader } from "react-spinners";

export default function withLoading(LoadingComponent) {
  return function WithLoading(props) {
    const { isLoading, ...rest } = props;
    return (
      <React.Fragment>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <RingLoader />
          </div>
        ) : null}
        <LoadingComponent {...rest} />
      </React.Fragment>
    );
  };
}

/* Use this when you want the component to mount only when loading is done (and unmount when it resumes) */
export function withLoadingAndMount(LoadingComponent) {
  return function WithLoadingAndMount(props) {
    const { isLoading, ...rest } = props;
    if (isLoading) {
      return <RingLoader />;
    } else return <LoadingComponent {...rest} />;
  };
}
