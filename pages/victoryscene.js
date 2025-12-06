import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function VictoryScene() {
  const router = useRouter();
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // Start victory animation on component mount
  useEffect(() => {
    // Show envelope after a short delay
    const timer = setTimeout(() => {
      setShowEnvelope(true);
      
      // Trigger envelope opening animation after a short delay
      setTimeout(() => {
        setEnvelopeOpen(true);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNextClick = () => {
    // Navigate back to scanfood.js
    router.push('/scanfood');
  };

  const handlePlayAgain = () => {
    // Go back to scan food
    router.push('/scanfood');
  };

  return (
    <>
      <Head>
        <title>Victory! - Food Defense</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="victory-container">
        {/* Victory Message */}
        <div className="victory-header">
          <h1 className="victory-title">VICTORY!</h1>
          <p className="victory-subtitle">You defended your kitchen successfully!</p>
        </div>

        {/* Envelope Animation - Same as scanfood.js */}
        {showEnvelope && (
          <div className="envelope-container" onClick={handleNextClick}>
            {envelopeOpen && (
              <div className="congratulations-message">
                <h2>Congratulations!</h2>
                <p>You unlocked new legendary warriors!</p>
              </div>
            )}
            {envelopeOpen && (
              <div className="golden-flash-container">
                <div className="golden-flash"></div>
                <div className="radiant-glow"></div>
              </div>
            )}
            <div className={`envelope ${envelopeOpen ? 'open' : ''}`}>
              <div className="envelope-back"></div>
              <div className="envelope-flap"></div>
              <div className="photos-container">
                <div className="photo photo-1">
                  <img src="/strawberry_bomb.png" alt="Strawberry Bomb" />
                </div>
                <div className="photo photo-2">
                  <img src="/chicken_breast_warrior.png" alt="Chicken Breast Warrior" />
                </div>
                <div className="photo photo-3">
                  <img src="/corn_gunner.png" alt="Corn Gunner" />
                </div>
              </div>
            </div>
            {envelopeOpen && (
              <div className="press-to-continue">
                Press To Continue
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .victory-container {
          width: 100vw;
          height: 100vh;
          background-image: url('/game_background_dirt_v3.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
        }



        .victory-header {
          text-align: center;
          margin-bottom: 40px;
          z-index: 5;
        }

        .victory-title {
          font-family: 'Titan One', cursive;
          font-size: 64px;
          color: #ff9800;
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9);
          margin: 0 0 15px 0;
          animation: victoryPulse 2s ease-in-out infinite;
        }

        @keyframes victoryPulse {
          0%, 100% {
            transform: scale(1);
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9),
                         0 0 20px rgba(255, 152, 0, 0.6);
          }
          50% {
            transform: scale(1.05);
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9),
                         0 0 40px rgba(255, 152, 0, 0.8),
                         0 0 60px rgba(255, 152, 0, 0.4);
          }
        }

        .victory-subtitle {
          font-size: 24px;
          font-weight: 700;
          color: #2e7d32;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
          margin: 0;
        }

        /* Congratulations Message */
        .congratulations-message {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 15;
          animation: fadeInUp 0.8s ease-out;
        }

        .congratulations-message h2 {
          font-family: 'Titan One', cursive;
          font-size: 36px;
          color: #ff9800;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
          margin: 0 0 8px 0;
          animation: bounce 2s infinite;
        }

        .congratulations-message p {
          font-family: 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #4caf50;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
          margin: 0;
          animation: pulse 2s infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Golden Flash Effect - Same as scanfood.js */
        .golden-flash-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          z-index: 0;
          pointer-events: none;
        }

        .golden-flash {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, 
            rgba(255, 215, 0, 0.9) 0%,
            rgba(255, 193, 7, 0.7) 20%,
            rgba(255, 235, 59, 0.5) 40%,
            rgba(255, 223, 0, 0.3) 60%,
            transparent 80%);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.5);
          animation: goldenBurst 2s ease-out 1.3s forwards;
        }

        .radiant-glow {
          position: absolute;
          top: -50px;
          left: -50px;
          width: calc(100% + 100px);
          height: calc(100% + 100px);
          background: radial-gradient(circle,
            rgba(255, 215, 0, 0.4) 0%,
            rgba(255, 223, 0, 0.2) 30%,
            transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: radiantPulse 3s ease-in-out 1.5s forwards;
        }

        @keyframes goldenBurst {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: scale(1.2) rotate(45deg);
          }
          60% {
            opacity: 0.8;
            transform: scale(1.5) rotate(90deg);
          }
          100% {
            opacity: 0;
            transform: scale(2) rotate(180deg);
          }
        }

        @keyframes radiantPulse {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          30% {
            opacity: 0.6;
            transform: scale(1.1);
          }
          70% {
            opacity: 0.4;
            transform: scale(1.3);
          }
          100% {
            opacity: 0;
            transform: scale(1.8);
          }
        }

        /* Envelope Animation - Same as scanfood.js */
        .envelope-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .envelope {
          position: relative;
          width: 250px;
          height: 160px;
          perspective: 1000px;
          transform-style: preserve-3d;
          animation: envelopeFloat 3s ease-in-out infinite;
        }

        @keyframes envelopeFloat {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-10px) rotateX(5deg); }
        }

        .envelope-back {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f1eb, #e8ddd4);
          border: 2px solid #d4c4b0;
          border-radius: 8px;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateZ(0);
          z-index: 1;
        }

        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(135deg, #f8f4ee, #ebe0d7);
          border: 2px solid #d4c4b0;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          transform-origin: bottom;
          transform: rotateX(0deg) translateZ(1px);
          transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 
            0 5px 15px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          z-index: 3;
        }

        .envelope.open .envelope-flap {
          transform: rotateX(-120deg) translateZ(1px);
        }

        .photos-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 70%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .photo {
          position: absolute;
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 
            0 12px 35px rgba(0, 0, 0, 0.3),
            0 0 0 4px rgba(255, 255, 255, 0.9);
          transform: scale(0) rotateY(0deg) translateX(0) translateY(0);
          transition: all 2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .envelope.open .photo {
          transform: scale(1);
        }

        .envelope.open .photo-1 {
          transform: scale(1) rotateY(-15deg) translateX(-140px) translateY(-30px);
          transition-delay: 0.5s;
          animation: heroicGlow 2s ease-out 1.3s forwards;
        }

        .envelope.open .photo-2 {
          transform: scale(1) rotateY(0deg) translateX(0) translateY(-50px);
          transition-delay: 0.8s;
          animation: heroicGlow 2s ease-out 1.6s forwards;
        }

        .envelope.open .photo-3 {
          transform: scale(1) rotateY(15deg) translateX(140px) translateY(-30px);
          transition-delay: 1.1s;
          animation: heroicGlow 2s ease-out 1.9s forwards;
        }

        @keyframes heroicGlow {
          0% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 215, 0, 0));
          }
          25% {
            filter: brightness(1.4) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          }
          50% {
            filter: brightness(1.6) drop-shadow(0 0 30px rgba(255, 215, 0, 1)) drop-shadow(0 0 60px rgba(255, 223, 0, 0.6));
          }
          75% {
            filter: brightness(1.3) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
          }
          100% {
            filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
          }
        }

        .photo-1 {
          z-index: 7;
        }

        .photo-2 {
          z-index: 8;
        }

        .photo-3 {
          z-index: 7;
        }

        /* Press To Continue */
        .press-to-continue {
          position: absolute;
          bottom: 200px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #ffffff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          text-align: center;
          z-index: 15;
          animation: pressFlash 2s ease-in-out infinite;
        }

        @keyframes pressFlash {
          0%, 100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translateX(-50%) scale(1.02);
          }
        }

        .envelope-container {
          cursor: pointer;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .victory-title {
            font-size: 48px;
          }

          .victory-subtitle {
            font-size: 18px;
          }

          .congratulations-message h2 {
            font-size: 28px;
          }

          .congratulations-message p {
            font-size: 16px;
          }

          .envelope {
            width: 200px;
            height: 130px;
          }

          .envelope.open .photo-1 {
            transform: scale(1) rotateY(-15deg) translateX(-130px) translateY(-25px);
          }

          .envelope.open .photo-2 {
            transform: scale(1) rotateY(0deg) translateX(0) translateY(-50px);
          }

          .envelope.open .photo-3 {
            transform: scale(1) rotateY(15deg) translateX(130px) translateY(-25px);
          }

          .press-to-continue {
            bottom: 40px;
            font-size: 16px;
          }

          .golden-flash-container {
            width: 400px;
            height: 400px;
          }
        }

        /* Landscape orientation */
        @media (orientation: landscape) and (max-height: 430px) {
          .victory-title {
            font-size: 32px;
          }

          .victory-subtitle {
            font-size: 16px;
          }

          .congratulations-message {
            top: 20px;
          }

          .congratulations-message h2 {
            font-size: 22px;
          }

          .congratulations-message p {
            font-size: 14px;
          }

          .envelope {
            width: 150px;
            height: 100px;
          }

          .envelope.open .photo-1,
          .envelope.open .photo-2,
          .envelope.open .photo-3 {
            width: 60px;
            height: 60px;
          }

          .press-to-continue {
            bottom: 20px;
            font-size: 14px;
          }

          .golden-flash-container {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>
    </>
  );
}
