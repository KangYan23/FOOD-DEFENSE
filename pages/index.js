import Head from "next/head";
import PlayingInterface from "../components/ui/PlayingInterface";

export default function Home() {
  return (
    <>
      <Head>
        <title>Food Defense</title>
        <meta name="description" content="A tower defense game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PlayingInterface />
      </main>
    </>
  );
}
