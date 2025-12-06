import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
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

  return (
    <>
      <Head>
        <title>Food Defense</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <div className="main-container">
        {/* Background Music */}
        <audio
          ref={audioRef}
          src="/POL-pet-park-short.wav"
          loop
          preload="auto"
        />

        <img className="title-image" src="/title2.png" alt="Title" />
        <button className="start-button" onClick={() => router.push('/scanfood')}>
          START
        </button>

        <style jsx>{`
          .main-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            background-image: url('/background1.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .title-image {
            position: absolute;
            top: 200px;
            right: 60px;
            max-width: 35%;
            height: auto;
            z-index: 2;
          }

          .start-button {
            position: absolute;
            background: linear-gradient(145deg, #d2a679, #b8935f);
            border: 3px solid #8b4513;
            border-radius: 15px;
            padding: 12px 32px;
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            box-shadow: 0 6px 0 #8b4513, 0 8px 15px rgba(0,0,0,0.4);
            cursor: pointer;
            font-family: Arial, sans-serif;
            letter-spacing: 2px;
            transition: all 0.1s ease;
            top: 50%;
            right: 300px;
            transform: translateY(-50%);
            z-index: 3;
          }

          .start-button:active {
            transform: translateY(-47px);
            box-shadow: 0 3px 0 #8b4513, 0 5px 10px rgba(0,0,0,0.4);
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .main-container {
              background-size: cover;
              background-position: center center;
            }

            .title-image {
              top: 20%;
              left: 50%;
              right: auto;
              transform: translateX(-50%);
              max-width: 80%;
            }

            .start-button {
              top: 70%;
              left: 50%;
              right: auto;
              transform: translate(-50%, -50%);
              font-size: 24px;
              padding: 10px 28px;
            }

            .start-button:active {
              transform: translate(-50%, -47px);
            }
          }

          @media (max-width: 480px) {
            .title-image {
              max-width: 90%;
              top: 15%;
            }

            .start-button {
              font-size: 20px;
              padding: 8px 24px;
              top: 75%;
            }
          }
        `}</style>
      </div>
    </>
  );
}
