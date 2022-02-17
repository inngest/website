import styled from "@emotion/styled";
import Button from "./Button";

type Props = {
  small?: string;
  heading?: string;
}

const Callout: React.FC<Props> = ({ small, heading }) => {
  return (
    <div className="grid">
      <Content className="bg-primary">
        <div>
          <span>{small || "Now with zero yaml ;-)"}</span>
          <h3>{heading || "Deploy a serverless function in minutes."}</h3>
        </div>
        <Button kind="black" href="/sign-up">{'>'}_ Start building</Button>
      </Content>
    </div>
  );
}

export default Callout;

const Content = styled.div`
  position: relative;
  grid-column: 3 / -3;

  display: grid;
  grid-template-columns: 4fr 2fr;
  align-items: center;

  padding: var(--header-trailing-padding) 0;
  padding-right: var(--header-trailing-padding);

  box-shadow: 0 0 4rem rgba(var(--black-rgb), 0.5);

  span, button, a {
    font-family: var(--font-mono);
  }

  button, a {
    font-size: 1.3rem;
  }

  &:before {
    display: block;
    content: "";
    background: var(--primary-color);
    left: -100%;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
  }

`;
