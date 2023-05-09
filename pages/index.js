import Head from "next/head";
import Subscribe from "../components/Subscribe";
import Footer from "../components/Footer";

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>ETF Obavijesti</title>
      </Head>
      <main className={styles.main}>
        <header>
          <h1 className={styles.title}>ETF Obavijesti</h1>
        </header>
        <p className={styles.description}>
          Pretplatite se da biste dobili najnovije obavijesti sa stranice
          Elektrotehničkog Fakulteta na vašu email adresu svakoga dana!
        </p>
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
