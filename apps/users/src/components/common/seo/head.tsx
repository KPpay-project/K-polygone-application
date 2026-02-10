import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export const Head = ({ title, description, canonical }: HeadProps) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};
