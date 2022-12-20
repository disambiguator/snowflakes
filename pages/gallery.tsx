import { airtableList, Model } from "airtableApi";
import Image from "next/image";
import Link from "next/link";
import styles from "./gallery.module.scss";

const Gallery = ({ imageResponses }: { imageResponses: Model[] }) => {
  const images = imageResponses.map(({ file, name }) => (
    <div className={styles.galleryItem} key={file}>
      <Image
        src={"https://snowflakes-disambiguous.s3.amazonaws.com/" + file}
        alt={file}
        width={264}
        height={264}
        className={styles.image}
      />
      <div className={styles.author}>{name}</div>
    </div>
  ));

  return (
    <div className={styles.frame}>
      <Link href="/" style={{ marginLeft: "auto" }}>
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
