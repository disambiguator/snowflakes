import { airtableList } from "airtableApi";
import Image from "next/image";

type ImageResponse = { file: string };

const Gallery = ({ imageResponses }: { imageResponses: ImageResponse[] }) => {
  const images = imageResponses.map(({ file }) => (
    <div key={file}>
      <Image
        src={"https://snowflakes-disambiguous.s3.amazonaws.com/" + file}
        alt={file}
        width={500}
        height={500}
      />
      {file}
    </div>
  ));

  return <div>Gallery{images}</div>;
};

export const getServerSideProps = async () => ({
  props: { imageResponses: (await airtableList()).map((r) => r.fields) },
});

export default Gallery;
