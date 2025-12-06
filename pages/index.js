import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const handleStart = () => {
    router.push('/scanfood');
  };

  return (
    <>
      <Head>
        <title>Food Defense</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <div className="main-container">

        <div className="menu-container">
          <img className="title-image" src="/title2.png" alt="Title" />
          <button className="menu-button" onClick={handleStart}>
            START
          </button>
          <button className="menu-button">
            SETTINGS
          </button>
        </div>

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

          .menu-container {
            position: absolute;
            right: 5%;
            top: 20%;
            width: 40%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            z-index: 10;
          }

          .title-image {
            width: 100%;
            height: auto;
            object-fit: contain;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
          }

          /* For loading screen title */
          .title-image-loading { 
            position: absolute;
            top: 50px;
            right: 50px;
            width: 300px;
            height: auto;
            z-index: 2;
          }

          .menu-button {
            /* Relative to flex container */
            background: linear-gradient(145deg, #d2a679, #b8935f);
            border: 3px solid #8b4513;
            border-radius: 15px;
            padding: 12px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            box-shadow: 0 6px 0 #8b4513, 0 8px 15px rgba(0,0,0,0.4);
            cursor: pointer;
            font-family: Arial, sans-serif;
            letter-spacing: 2px;
            transition: all 0.1s ease;
            width: 50%; /* Reduced width */
            max-width: 220px;
          }

          .menu-button:active {
            transform: translateY(3px);
            box-shadow: 0 3px 0 #8b4513, 0 5px 10px rgba(0,0,0,0.4);
          }

          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85); /* Dark overlay */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
            backdrop-filter: blur(5px);
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

            .menu-button {
              /* Remove absolute positioning logic if any remained, handled by flex & margins now */
              font-size: 24px;
              padding: 10px 28px;
            }

            .menu-button:active {
               /* Handled by main class */
            }
          }

          @media (max-width: 480px) {
            .title-image {
              max-width: 90%;
              top: 15%;
            }

            .menu-button {
              font-size: 20px;
              padding: 8px 24px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
