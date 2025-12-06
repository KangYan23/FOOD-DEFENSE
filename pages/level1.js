import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export default function Level1() {
  const router = useRouter();
  const audioRef = useRef(null);

  // Background Music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleClick = () => {
    router.push('/battlescene');
  };

  return (
    <>
      <Head>
        <title>Level 1 - Food Defense</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <div className="level1-container" onClick={handleClick}>
        {/* Background Music */}
        <audio
          ref={audioRef}
          src="/POL-pet-park-short.wav"
          loop
          preload="auto"
        />

        <Image
          src="/level1.png"
          alt="Level 1 Background"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          priority
        />
      </div>

      <style jsx>{`
        .level1-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .level1-container:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
