import styled from "@emotion/styled";

type Props = { className?: string }

const Banner: React.FC<Props> = (props) => {
  return (
    <Wrapper className={props.className}>
      {props.children}
    </Wrapper>
  );
}

export const CheckBanner: React.FC<{ list: Array<String> } & Props> = (props) => {
  return (
    <Banner className={props.className}>
      <CheckList>
        {props.list.map((elem, n) => <li key={n}>{elem}</li>)}
      </CheckList>
    </Banner>
  );
}

const Wrapper = styled.div`
  background: var(--black);
  padding: 2rem 0;
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  box-shadow: 0 5px 40px rgba(var(--black-rgb), 0.5);
`;

const CheckList = styled.ul`  
  list-style: none;
  display: flex;

  li {
    background: url(/assets/check.svg) no-repeat;
    height: 2rem;
    line-height: 2rem;
    padding: 0 0 0 2.5rem;
  }
  li + li {
    margin-left: 3rem;
  }
`

export default Banner;
