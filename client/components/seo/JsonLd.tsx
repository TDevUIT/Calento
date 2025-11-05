import Script from 'next/script';

type SchemaValue = string | number | boolean | null | SchemaObject | SchemaValue[];

interface SchemaObject {
  [key: string]: SchemaValue;
}

interface JsonLdProps {
  data: SchemaObject | SchemaObject[];
}

/**
 * JSON-LD Component for Schema.org structured data
 * Injects structured data into page for better SEO
 */
export const JsonLd = ({ data }: JsonLdProps) => {
  const jsonLdData = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLdData.map((schema, index) => (
        <Script
          key={index}
          id={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default JsonLd;
