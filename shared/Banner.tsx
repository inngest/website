import styled from "@emotion/styled"

type Props = { className?: string }

const Banner: React.FC<Props> = (props) => {
  return <Wrapper className={props.className}>{props.children}</Wrapper>
}

export const CheckBanner: React.FC<{ list: Array<String> } & Props> = (
  props
) => {
  return (
    <Banner className={props.className}>
      <CheckList>
        {props.list.map((elem, n) => (
          <ChecklistItem key={n}>{elem}</ChecklistItem>
        ))}
      </CheckList>
    </Banner>
  )
}

const Wrapper = styled.div`
  background: var(--black);
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  box-shadow: 0 5px 40px rgba(var(--black-rgb), 0.5);
  font-family: var(--font-mono);
`

const CheckList = styled.ul`
  padding: 0;
  list-style: none;
  display: flex;
`

const ChecklistItem = styled.li`
  background: url(/assets/check.svg) no-repeat left center;
  height: 2rem;
  line-height: 2rem;
  margin: 0;
  padding: 0 0 0 2rem;

  & + & {
    margin: 0 0 0 3rem;
  }
`

export default Banner
