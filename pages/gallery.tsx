import { airtableList } from "airtableApi";
import Image from "next/image";
import Link from "next/link";
import styles from "./gallery.module.scss";

type ImageResponse = { file: string; name: string };
const Gallery = ({ imageResponses }: { imageResponses: ImageResponse[] }) => {
  const images = imageResponses.map(({ file, name }) => (
    <div className={styles.galleryItem} key={file}>
      <Image
        src={"https://snowflakes-disambiguous.s3.amazonaws.com/" + file}
        alt={file}
        width={244}
        height={244}
      />
      <div className={styles.author}>{name}</div>
    </div>
  ));

  return (
    <div>
      <Link href={`/`} style={{ float: "right" }}>
        back to snowflake generator ➡️
      </Link>
      <div className={styles.gallery}>{images}</div>
    </div>
  );
};

export const getServerSideProps = async () => ({
  props: { imageResponses: (await airtableList()).map((r) => r.fields) },
});

export default Gallery;
