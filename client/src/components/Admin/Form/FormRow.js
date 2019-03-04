import styled from "styled-components";

const FormRow = styled.div`
  width: ${props => props.width || 80}%;
  text-align: ${props => (props.centerContent ? "center" : "left")};
  margin: 1rem auto;
  min-height: ;4rem;
`;

export default FormRow;
