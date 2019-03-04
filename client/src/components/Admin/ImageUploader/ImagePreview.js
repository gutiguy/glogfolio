import withLoading from "../../../hoc/withLoading";
import styled from "styled-components";

const ImagePreview = styled.img`
  display: flex;
  max-height: 40vh;
  max-width: 100%;
  margin: 0 auto;
`;

export default withLoading(ImagePreview);
