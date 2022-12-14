import { airtableList } from "airtableApi";
import Image from "next/image";
import Link from "next/link";
import styles from "./gallery.module.scss";

type ImageResponse = { file: string };
const Gallery = ({ imageResponses }: { imageResponses: ImageResponse[] }) => {
  const images = imageResponses.map(({ file }) => (
    <div className={styles.galleryItem} key={file}>
      <Image
        src={"https://snowflakes-disambiguous.s3.amazonaws.com/" + file}
        alt={file}
        width={244}
        height={244}
      />
      <div className={styles.author}>{file}</div>
    </div>
  ));

  return (
    <div>
      <Link href={`/`}>
        <a style={{ float: "right" }}>back to snowflake generator ➡️</a>
      </Link>
      <div className={styles.gallery}>{images}</div>
    </div>
  );
};

export const getServerSideProps = async () => ({
  props: { imageResponses: (await airtableList()).map((r) => r.fields) },
});

export default Gallery;
