import Button from "../../shared/Button";
import styled from "@emotion/styled";

type Props = {
  header: string;
  subheader: string;
  // category lets us properly track attribution when clicking on CTAs.
  category: string;
};

const Header = ({ header, subheader, category }: Props) => {
  return (
    <Wrapper className="grid">
      <Hero className="grid-center-6">
        <div className="content">
          <h1>{header}</h1>
          <p>{subheader}</p>
        </div>

        <div className="cta">
          <Button kind="primary" href={`/sign-up?ref=${category}-hero`}>
            <span className="button-text-light">{">"}_</span>
            &nbsp;
            <span className="button-text-med">Start building</span>
          </Button>
          <Button kind="outline" href={`/docs?ref=${category}-hero`}>
            Explore docs →
          </Button>
        </div>
      </Hero>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.div`
  background: url(/assets/hero-grid.svg) no-repeat right 10%;
  border-bottom: 1px dashed var(--grid-line-color);
  margin: 0 0 var(--section-padding);
`;

const Hero = styled.div`
  text-align: center;
  padding: calc(var(--section-padding) + 2vh) 0 var(--section-padding);
  display: flex;
  flex-direction: column;

  p {
    margin-bottom: var(--section-padding);
    font-size: 1.1rem;
  }

  > div {
    flex: 1;
  }

  > .cta {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button {
    font-family: var(--font-mono);
    display: inline-block;
    letter-spacing: -0.5px;
  }
`;
