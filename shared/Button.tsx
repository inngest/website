import React from "react";
import styled from "@emotion/styled";
import { css, SerializedStyles } from "@emotion/react";

// Button props
type Props = React.HTMLAttributes<any> & {
  kind?: Kinds;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: (() => void) | ((e: React.SyntheticEvent) => any);
  disabled?: boolean;
  link?: string;
  target?: string;
  style?: object;
  className?: string;
  children: React.ReactNode;
};

export default React.forwardRef<HTMLButtonElement, Props>(
  (props: Props, ref) => {
    const { kind, link, children, ...rest } = props;
    let { onClick } = props;

    let C: any = Button;
    // lets us smartly apply "href" to link components
    let cProps = {};

    if (link) {
      C = Link;
      cProps = { href: link };
      onClick = (e: React.SyntheticEvent) => {
        if (props.target !== undefined) {
          // use a normal handler to open a tab if there's target="_blank" etc.
          return;
        }
        if (link.indexOf("://") !== -1) {
          window.location.href = link;
          return;
        }
        e.preventDefault();
      };
    }

    return (
      <C
        {...cProps}
        ref={ref}
        css={[kind && kindCSS[kind], props.disabled && disabledCSS]}
        {...rest}
        onClick={onClick}
        className={`button ${props.className || ""}`}
      >
        {children}
      </C>
    );
  }
);

export const buttonCSS = css`
  border: 1px transparent;
  border-radius: var(--border-radius);
  padding: var(--button-padding);
  background: transparent;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;

  & + .button {
    margin-left: 1rem;
  }
`;

const Link = styled.a`
  ${buttonCSS};
`;

const Button = styled.button`
  ${buttonCSS}
`;

const primaryCSS = css`
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
  box-shadow: 0 5px 25px rgba(var(--primary-color-rgb), 0.6);
`;

const outlineCSS = css`
  border: 1px solid var(--stroke-color);
  color: #fff;
`;

const disabledCSS = `
`;

const Kinds = {
  PRIMARY: "primary",
  OUTLINE: "outline",
};
export type Kinds = typeof Kinds[keyof typeof Kinds];

const kindCSS: { [item in Kinds]: SerializedStyles } = {
  primary: primaryCSS,
  outline: outlineCSS,
};
