type Props = {
  url: string;
  filename: string;
  children: React.ReactNode;
};

export const DownloadLink = ({ url, filename, children }: Props) => {
  return (
    <a href={url} download={filename}>
      {children}
    </a>
  );
};
