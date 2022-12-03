import Image from "next/image";

type ImageResponse = { filename: string; src: string };

const Gallery = () => {
  const apiResponse: ImageResponse[] = [];

  const images = apiResponse.map(({ filename, src }) => {
    return (
      <div key={filename}>
        <Image src={src} alt={filename} />
        {filename}
      </div>
    );
  });

  return <div>Gallery{images}</div>;
};

export default Gallery;
