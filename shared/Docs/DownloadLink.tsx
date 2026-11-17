import { refLinkProps } from "@/utils/v1/ref";
type Props = {
  url: string;
  filename: string;
  children: React.ReactNode;
};

export const DownloadLink = ({ url, filename, children }: Props) => {
  return (
    <a {...refLinkProps(url)} download={filename}>
      {children}
    </a>
  );
};
