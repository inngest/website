import styled from "@emotion/styled";
import { css } from "@emotion/react";

const Tag = styled.span`
  display: inline-block;
  border-radius: 4px;
  padding: 5px 0.75rem 4px;

  font-size: 11px !important;
  font-weight: 400 !important;
  text-transform: uppercase;
  line-height: 1;

  & + & {
    margin-left: 0.3em;
  }

  background: var(--color-iris-60);
  color: var(--black);
`;

export default function (props) {
  return <Tag className="tag" {...props} />;
}

export const greyCSS = css`
  background: #d7dfd5;
  color: #626e61;
`;

export const greenCSS = css`
  background: #ceecce;
  color: #4e754d;
`;
