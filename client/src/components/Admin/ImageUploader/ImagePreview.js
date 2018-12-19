import withLoading from "../../../hoc/withLoading";
import styled from "styled-components";

const ImagePreview = styled.img`
  width: 80%;
  max-height: 40vh;
  display: flex;
  margin: 0 auto;
`;

export default withLoading(ImagePreview);
