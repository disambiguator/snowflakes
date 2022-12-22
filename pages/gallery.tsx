import { airtableList, Model } from "airtableApi";
import useIsMobile from "isMobile";
import Image from "next/image";
import Link from "next/link";
import styles from "./gallery.module.scss";

const Gallery = ({ imageResponses }: { imageResponses: Model[] }) => {
  const isMobile = useIsMobile();

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
      <div className={styles.links}>
        <Link href="/">back{isMobile ? "" : " to snowflake generator"} ⬅️</Link>
        <Link href="/walk">take a walk 🚶‍♀️</Link>
      </div>
      <div className={styles.gallery}>{images}</div>
    </div>
  );
};

export const getServerSideProps = async () => ({
  props: { imageResponses: (await airtableList()).map((r) => r.fields) },
});

export default Gallery;
