import Button from "../../shared/Button";
import styled from "@emotion/styled";
import { LibraryData, LibraryItem } from "../../utils/library";

type Props = {
  category: string;
  items: LibraryData;
};

const Examples = ({ items, category }: Props) => {
  return (
    <Wrapper className="grid">
      {items.map(i => <Example key={i.dir} item={i} />)}
    </Wrapper>
  );
};

export default Examples;

const Example = ({ item }: { item: LibraryItem }) => {
  const { config } = item;
  return (
    <ItemWrapper className="col-2">
      <div>
      <h4>{config.name}</h4>
      <span>Uses {config.features.map(u => <span key={u}>{u}</span>)}</span>

      <p><b>When</b></p>
      <p><b>Run</b></p>

      <p>{config.description}</p>
      </div>

      <Details>
        <p><b>Why</b></p>
        <p>{config.why}</p>
      </Details>
    </ItemWrapper>
  );
}

const Wrapper = styled.div`
`;

const ItemWrapper = styled.div`
  > div {
    padding: 2rem;
  }

  font-size: .8rem;

  box-shadow: 0px 20px 100px rgba(70, 54, 245, 0.15),
    0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const Details = styled.div`
  background: var(--primary-color);
  color: var(--color-white);
`;
