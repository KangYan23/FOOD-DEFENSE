import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Level1() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress >= 100) {
        clearInterval(interval);
        router.push('/battlescene');
      }
      setProgress(currentProgress);
    }, 100);
  };

  return (
    <>
      <Head>
        <title>Level 1 - Food Defense</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <div className="level1-container" onClick={handleClick}>
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

        {loading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <video
                src="/corn_gunner_animation.mp4"
                autoPlay
                loop
                playsInline
                className="loading-anim"
              />
              <div className="loading-bar-container">
                <div className="loading-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="loading-text">Loading...</p>
            </div>
          </div>
        )}
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

          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
            overflow: hidden;
          }

          .loading-overlay::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('/background-forest.png') no-repeat center center;
            background-size: cover;
            filter: blur(8px);
            z-index: -1;
            transform: scale(1.1);
          }

          .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .loading-anim {
            width: 200px;
            height: 200px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px rgba(255, 255, 0, 0.5));
          }

          .loading-bar-container {
            width: 300px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid #8b4513;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
          }

          .loading-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #ffcc00, #ff9900);
            transition: width 0.1s linear;
          }

          .loading-text {
            color: white;
            font-family: monospace;
            font-size: 1.2rem;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
      `}</style>
    </>
  );
}
