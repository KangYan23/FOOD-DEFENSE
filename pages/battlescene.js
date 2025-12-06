import Head from "next/head";
import PlayingInterface from "../components/ui/PlayingInterface";

export default function BattleScene() {
    return (
        <>
            <Head>
                <title>Battle - Food Defense</title>
                <meta name="description" content="Battle Scene" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <PlayingInterface />
            </main>
        </>
    );
}
