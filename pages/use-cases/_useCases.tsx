import Button from "../../shared/Button";
import styled from "@emotion/styled";
import { LibraryData, LibraryItem } from "../../utils/library";
import { MDXRemote } from "next-mdx-remote";
import Tag from "../../shared/tag";

type Props = {
  category: string;
  items: LibraryData;
};

const Examples = ({ items }: Props) => {
  return (
    <Wrapper>
      <div>
        {(items || []).map((i) => (
          <Example key={i.dir} item={i} />
        ))}
      </div>

      <p>There’s plenty more you can do with inngest :)</p>
    </Wrapper>
  );
};

export default Examples;

const Example = ({ item }: { item: LibraryItem }) => {
  const { config } = item;

  return (
    <ItemWrapper className="col-3">
      <div>
        <h4>{config.name}</h4>
        <span>
          Uses{" "}
          {config.features.map((u) => (
            <Tag key={u}>{u}</Tag>
          ))}
        </span>

        <p>
          <b>When</b>
        </p>
        {config?.md?.when && <MDXRemote {...config.md.when} />}

        <p className="run">
          <b>Run</b>
        </p>
        {config?.md?.run && <MDXRemote {...config.md.run} />}
      </div>

      <Details>
        <p>
          <b>Why</b>
        </p>
        {config?.md?.why && <MDXRemote {...config.md.why} />}

        <Button kind="outline" href={`/sign-up?ref=${item.dir}-explore`}>
          Explore this use case
        </Button>
      </Details>
    </ItemWrapper>
  );
};

const Wrapper = styled.div`
  max-width: var(--max-page-width);
  margin: var(--header-trailing-padding) auto;

  > div {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-gap: var(--grid-gap);
    margin: 0 0 2rem;
  }

  > p {
    opacity: 0.2;
    text-align: center;
  }
`;

const ItemWrapper = styled.div`
  background: var(--color-black);

  box-shadow: 0px 20px 100px rgba(70, 54, 245, 0.15),
    0px 4px 4px rgba(0, 0, 0, 0.25);

  > div {
    padding: 2rem;
  }

  h4 {
    margin: 0 0 0.25rem;
  }
  h4 + span {
    display: block;
    text-transform: uppercase;
    font-size: 11px;
    margin: 1rem 0;
    span {
      margin-left: 5px;
    }
  }

  p + p,
  p + ol,
  p + ul {
    margin-top: 0.4rem;
  }

  p + p.run {
    margin-top: 1rem;
  }

  a {
    border-color: rgba(255, 255, 255, 0.2);
    font-size: 0.8rem;
    margin: 1.5rem 0 0;
  }
`;

const Details = styled.div`
  background: var(--primary-color);
  color: var(--color-white);
`;
