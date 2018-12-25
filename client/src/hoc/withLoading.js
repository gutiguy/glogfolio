import React from "react";
import { RingLoader } from "react-spinners";

export default function withLoading(LoadingComponent) {
  return function WithLoading(props) {
    const { isLoading, ...rest } = props;
    return (
      <React.Fragment>
        {isLoading ? <RingLoader /> : null}
        <LoadingComponent {...rest} />
      </React.Fragment>
    );
  };
}
