import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ScanFood() {
  const router = useRouter();
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Calculate nutritional percentages for display bars
  const calculateNutritionPercentages = (nutrition) => {
    if (!nutrition) return { carbs: 0, protein: 0, fiber: 0, fat: 0 };
    
    const total = nutrition.carbohydrates + nutrition.protein + nutrition.fiber + nutrition.fat;
    if (total === 0) return { carbs: 0, protein: 0, fiber: 0, fat: 0 };
    
    return {
      carbs: Math.round((nutrition.carbohydrates / total) * 100),
      protein: Math.round((nutrition.protein / total) * 100),
      fiber: Math.round((nutrition.fiber / total) * 100),
      fat: Math.round((nutrition.fat / total) * 100),
    };
  };

  const startCamera = () => {
    console.log('🎥 startCamera function called!');
    setError(null);
    console.log(' Setting cameraActive to true FIRST');
    setCameraActive(true);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setAnalyzing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        
        if (response.status === 401) {
          throw new Error('API authentication failed. Please check your API key.');
        } else if (response.status === 404) {
          throw new Error('No suitable AI models available in your region.');
        } else if (response.status === 429) {
          throw new Error('API quota exceeded. Please try again later.');
        } else {
          throw new Error(errorData.details || 'Failed to analyze food');
        }
      }

      const data = await response.json();
      console.log('Analysis result:', data);
      setResult(data);
    } catch (err) {
      console.error('Error analyzing food:', err);
      setError(err.message || 'Failed to analyze food. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const scanAgain = () => {
    setShowEnvelope(true);
    setEnvelopeOpen(false);
    
    // Trigger envelope opening animation after a short delay
    setTimeout(() => {
      setEnvelopeOpen(true);
    }, 500);
  };

  const handleNextClick = () => {
    // Navigate to battle scene
    router.push('/battlescene');
  };

  useEffect(() => {
    const initCamera = async () => {
      if (cameraActive && !streamRef.current) {
        console.log('📸 useEffect: Requesting camera access...');

        // Small delay to ensure React has rendered the video element
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
          });

          console.log('✅ Camera stream obtained:', stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            console.log('✨ Video element updated with stream!');
          } else {
            console.log('❌ videoRef.current is STILL null!');
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          setError('Unable to access camera. Please grant camera permissions.');
          setCameraActive(false);
        }
      }
    };

    initCamera();
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Food Defense Scanner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, orientation=landscape" />
        <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="game-container">
        {/* Main Game Frame */}
        <div className="game-frame">

          {/* Logo / Title Area */}
          <div className="game-header">
            <h1 className="game-title">FOOD DEFENSE!</h1>
          </div>

          {/* Main Content Area */}
          <div className="game-stage">

            {!cameraActive && !result && (
              <div className="menu-screen">
                <div className="wooden-panel">
                  <h2>Ready to Scan?</h2>
                  <p>Defend your health! Identify the enemy foods.</p>
                  <button className="wood-button start-btn" onClick={startCamera}>
                    OPEN CAMERA
                  </button>
                </div>
                <div className="character-decoration">🥦</div>
              </div>
            )}

            {cameraActive && !analyzing && !result && (
              <div className="menu-screen">
                <div className="wooden-panel camera-panel">
                  <div className="camera-preview">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="video-feed-preview"
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </div>
                  <div className="camera-controls">
                    <button className="wood-button start-btn" onClick={captureAndAnalyze}>
                      SCAN
                    </button>
                    <button className="wood-button back-btn" onClick={stopCamera}>
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="loading-screen">
                <div className="wooden-panel mini">
                  <div className="spinner">⚔️</div>
                  <p>Analyzing Tactics...</p>
                </div>
              </div>
            )}

            {result && (() => {
              const percentages = calculateNutritionPercentages(result.nutrition);
              return (
                <div className="results-board">
                  <div className="parchment-bg">
                    <div className="result-header">
                      <h2 className="food-name">{result.foodName}</h2>
                      <span className={`status-seal ${result.isHealthy ? 'healthy' : 'unhealthy'}`}>
                        {result.isHealthy ? 'ALLY' : 'ENEMY'}
                      </span>
                    </div>

                    <p className="intel-report">{result.healthReason}</p>

                    <div className="stats-container">
                      <div className="stat-row">
                        <span className="stat-label">Carbs</span>
                        <div className="stat-bar">
                          <div className="fill" style={{ 
                            width: `${percentages.carbs}%`, 
                            background: '#ffd93d' 
                          }}></div>
                        </div>
                        <span className="stat-value">{result.nutrition.carbohydrates}g ({percentages.carbs}%)</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Protein</span>
                        <div className="stat-bar">
                          <div className="fill" style={{ 
                            width: `${percentages.protein}%`, 
                            background: '#ff6b9d' 
                          }}></div>
                        </div>
                        <span className="stat-value">{result.nutrition.protein}g ({percentages.protein}%)</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Fiber</span>
                        <div className="stat-bar">
                          <div className="fill" style={{ 
                            width: `${percentages.fiber}%`, 
                            background: '#6bcf7f' 
                          }}></div>
                        </div>
                        <span className="stat-value">{result.nutrition.fiber}g ({percentages.fiber}%)</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Fat</span>
                        <div className="stat-bar">
                          <div className="fill" style={{ 
                            width: `${percentages.fat}%`, 
                            background: '#ff9a76' 
                          }}></div>
                        </div>
                        <span className="stat-value">{result.nutrition.fat}g ({percentages.fat}%)</span>
                      </div>
                    </div>

                    <div className="action-row">
                      <button className="wood-button small-btn" onClick={scanAgain}>
                        GET YOUR PLANTS
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {showEnvelope && (
              <div className="envelope-container">
                <div className={`envelope ${envelopeOpen ? 'open' : ''}`}>
                  <div className="envelope-back"></div>
                  <div className="envelope-flap"></div>
                  <div className="photos-container">
                    <div className="photo photo-1">
                      <img src="/chris.jpg" alt="Chris" />
                    </div>
                    <div className="photo photo-2">
                      <img src="/carrot.jpg" alt="Carrot" />
                    </div>
                    <div className="photo photo-3">
                      <img src="/dou.jpg" alt="Dou" />
                    </div>
                  </div>
                </div>
                {envelopeOpen && (
                  <div className="envelope-next-button">
                    <button className="wood-button next-btn" onClick={handleNextClick}>
                      NEXT
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="error-popup">
                <div className="wooden-panel alert">
                  <p>⚠️ {error}</p>
                  <button className="wood-button" onClick={() => setError(null)}>
                    RETRY
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        <style jsx>{`
          /* Global & Container */
          .game-container {
            width: 100vw;
            height: 100vh;
            background-color: #8bc34a;
            background-image: url('/background-forest.png');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: 'Nunito', sans-serif;
          }

          .game-frame {
            width: 100%;
            height: 100%;
            max-width: 100vw;
            max-height: 100vh;
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
          }

          /* Header with Banner */
          .game-header {
            text-align: center;
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            width: 100%;
            display: flex;
            justify-content: center;
            pointer-events: none;
          }

          .game-title {
            font-family: 'Titan One', cursive;
            font-size: 42px;
            color: #ff9800;
            text-shadow: 
              2px 2px 0px #fff,
              4px 4px 0px #795548;
            background: #fff8e1;
            padding: 10px 40px;
            border-radius: 10px;
            border: 3px solid #795548;
            box-shadow: 0 5px 0 #5d4037;
            transform: rotate(-2deg);
            display: inline-block;
          }

          /* Main Stage */
          .game-stage {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
          }

          @media (orientation: landscape) {
            .game-stage {
              flex-direction: row;
              justify-content: space-around;
              padding: 10px;
            }
          }

          .menu-screen {
            position: relative;
          }

          /* Wooden Panel Component */
          .wooden-panel {
            background: #d7ccc8;
            background-image: linear-gradient(0deg, rgba(0,0,0,0.1) 50%, transparent 50%);
            background-size: 100% 40px;
            border: 4px solid #795548;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            box-shadow: 
              inset 0 0 20px rgba(0,0,0,0.2),
              0 10px 20px rgba(0,0,0,0.3);
            position: relative;
            min-width: 300px;
            max-width: 500px;
          }
          
          .wooden-panel:before {
            content: '';
            position: absolute;
            top: 5px; left: 5px; right: 5px; bottom: 5px;
            border: 2px dashed #a1887f;
            border-radius: 10px;
            pointer-events: none;
          }

          .wooden-panel.camera-panel {
            max-width: 600px;
            padding: 20px;
          }

          .wooden-panel h2 {
            font-family: 'Titan One', cursive;
            color: #5d4037;
            font-size: 28px;
            margin: 0 0 10px;
          }

          .wooden-panel p {
            color: #4e342e;
            font-weight: 700;
            margin-bottom: 20px;
            font-size: 18px;
          }

          /* Camera Preview */
          .camera-preview {
            width: 100%;
            height: 300px;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 20px;
            border: 3px solid #5d4037;
          }

          .video-feed-preview {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .camera-controls {
            display: flex;
            gap: 15px;
            justify-content: center;
          }

          /* Buttons (Wood Style) */
          .wood-button {
            background: #8d6e63;
            color: #fff;
            font-family: 'Titan One', cursive;
            font-size: 20px;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            border-bottom: 6px solid #5d4037;
            cursor: pointer;
            text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
            transition: transform 0.1s;
            position: relative;
            overflow: hidden;
            display: inline-block;
          }

          .wood-button:after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 50%;
            background: rgba(255,255,255,0.1);
            pointer-events: none;
          }

          .wood-button:active {
            transform: translateY(4px);
            border-bottom-width: 2px;
          }
          
          .start-btn {
            font-size: 24px;
            background: #8bc34a;
            border-color: #558b2f;
            color: #f1f8e9;
            text-shadow: 1px 1px 0 #33691e;
          }
          
          .back-btn {
            background: #ffb74d;
            border-color: #f57c00;
            color: #5d4037;
            text-shadow: none;
            font-size: 18px;
          }

          .next-btn {
            background: #8d6e63;
            border-color: #5d4037;
            color: #fff;
            text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
            font-size: 20px;
          }

          /* Envelope Next Button */
          .envelope-next-button {
            position: absolute;
            bottom: 372px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            animation: slideUpFade 0.8s ease-out 1.8s forwards;
            z-index: 1001;
          }

          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          /* Results Parchment */
          .results-board {
            display: flex;
            justify-content: center;
            align-items: center;
            animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .parchment-bg {
            background: #fff3e0;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 600px;
            position: relative;
            border: 1px solid #e0e0e0;
            transform: rotate(-1deg);
          }
          
          .parchment-bg:before {
            content: '';
            position: absolute;
            top: -10px; left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 20px;
            background: rgba(0,0,0,0.1);
            border-radius: 50%;
            z-index: -1;
          }

          .result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed #d7ccc8;
            padding-bottom: 15px;
            margin-bottom: 15px;
            min-height: 40px;
            background: rgba(255,255,255,0.3);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }

          .food-name {
            font-family: 'Titan One', cursive;
            font-size: 26px;
            color: #2d1b14;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
            font-weight: bold;
            z-index: 10;
            position: relative;
          }

          .status-seal {
            font-weight: 800;
            padding: 5px 15px;
            border-radius: 20px;
            border: 2px solid;
            text-transform: uppercase;
            letter-spacing: 1px;
            transform: rotate(5deg);
          }

          .status-seal.healthy {
            color: #2e7d32;
            border-color: #2e7d32;
            background: #e8f5e9;
          }

          .status-seal.unhealthy {
            color: #c62828;
            border-color: #c62828;
            background: #ffebee;
          }

          .intel-report {
            font-style: italic;
            color: #5d4037;
            margin-bottom: 20px;
            line-height: 1.4;
          }

          .stats-container {
            background: rgba(255,255,255,0.5);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #d7ccc8;
          }

          .stat-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }

          .stat-label {
            width: 70px;
            font-weight: 700;
            color: #5d4037;
            font-size: 14px;
          }

          .stat-bar {
            flex: 1;
            height: 12px;
            background: #efebe9;
            border-radius: 6px;
            margin: 0 10px;
            overflow: hidden;
            border: 1px solid #d7ccc8;
          }

          .fill {
            height: 100%;
            border-radius: 6px;
          }

          .stat-value {
            width: 90px;
            text-align: right;
            font-weight: 800;
            color: #4e342e;
            font-size: 12px;
          }
          
          .action-row {
            margin-top: 20px;
            text-align: center;
          }

          /* Loading */
          .spinner {
            font-size: 40px;
            animation: spin 1s infinite linear;
            margin-bottom: 15px;
          }

          @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
          @keyframes popIn { from {transform: scale(0.8); opacity: 0;} to {transform: scale(1); opacity: 1;} }

          /* Character Decoration */
          .character-decoration {
            position: absolute;
            bottom: -20px;
            right: -30px;
            font-size: 80px;
            transform: rotate(15deg);
            z-index: 5;
            text-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }

          /* Envelope Animation */
          .envelope-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(2px);
            z-index: 1000;
            animation: fadeIn 0.5s ease-in-out;
          }

          .envelope {
            position: relative;
            width: 300px;
            height: 200px;
            perspective: 1000px;
            transform-style: preserve-3d;
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
          }

          .photo {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 
              0 12px 35px rgba(0, 0, 0, 0.3),
              0 0 0 4px rgba(255, 255, 255, 0.9);
            transform: scale(0) rotateY(0deg) translateX(0) translateY(0);
            transition: all 2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background: white;
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
          }

          .envelope.open .photo-2 {
            transform: scale(1) rotateY(0deg) translateX(0) translateY(-50px);
            transition-delay: 0.8s;
          }

          .envelope.open .photo-3 {
            transform: scale(1) rotateY(15deg) translateX(140px) translateY(-30px);
            transition-delay: 1.1s;
          }

          .photo-1 {
            z-index: 3;
          }

          .photo-2 {
            z-index: 4;
          }

          .photo-3 {
            z-index: 3;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Mobile Responsive Design */
          @media (max-width: 844px) {
            .game-container {
              padding: 10px;
            }

            .game-frame {
              max-width: 100%;
              max-height: 100%;
              padding: 10px;
            }

            .game-title {
              font-size: 28px;
              padding: 8px 20px;
            }

            .wooden-panel {
              min-width: 280px;
              max-width: 90vw;
              padding: 20px;
              margin: 10px;
            }

            .wooden-panel.camera-panel {
              max-width: 95vw;
              padding: 15px;
            }

            .camera-preview {
              height: 250px;
              margin-bottom: 15px;
            }

            .camera-controls {
              flex-direction: row;
              gap: 10px;
              justify-content: center;
              flex-wrap: wrap;
            }

            .wood-button {
              font-size: 16px;
              padding: 10px 20px;
              margin: 5px;
            }

            .start-btn {
              font-size: 18px;
            }

            .parchment-bg {
              max-width: 95vw;
              padding: 20px;
              margin: 10px;
            }

            .result-header {
              flex-direction: column;
              gap: 10px;
              text-align: center;
            }

            .food-name {
              font-size: 22px;
            }

            .stat-label {
              width: 60px;
              font-size: 12px;
            }

            .stat-value {
              width: 80px;
              font-size: 11px;
            }
          }

          /* iPhone 13 and similar devices */
          @media (max-width: 390px) and (max-height: 844px) {
            .game-frame {
              padding: 5px;
            }

            .game-title {
              font-size: 24px;
              padding: 6px 16px;
            }

            .wooden-panel {
              min-width: 260px;
              padding: 15px;
            }

            .wooden-panel.camera-panel {
              padding: 10px;
            }

            .camera-preview {
              height: 200px;
            }

            .wood-button {
              font-size: 14px;
              padding: 8px 16px;
            }

            .start-btn {
              font-size: 16px;
            }

            .camera-controls {
              gap: 8px;
            }

            .envelope {
              width: 200px;
              height: 130px;
            }

            .envelope.open .photo-1 {
              transform: scale(0.8) rotateY(-15deg) translateX(-90px) translateY(-15px);
            }

            .envelope.open .photo-2 {
              transform: scale(0.8) rotateY(0deg) translateX(0) translateY(-30px);
            }

            .envelope.open .photo-3 {
              transform: scale(0.8) rotateY(15deg) translateX(90px) translateY(-15px);
            }

            .envelope-next-button {
              bottom: 300px;
            }
          }

          /* iPhone 13 Landscape Mode (844px x 390px) */
          @media (orientation: landscape) and (max-height: 430px) {
            .game-container {
              flex-direction: row;
            }

            .game-frame {
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              padding: 5px;
            }

            .game-header {
              position: fixed;
              top: 5px;
              left: 10px;
              width: auto;
              transform: none;
            }

            .game-title {
              font-size: 18px;
              padding: 3px 8px;
              margin: 0;
            }

            .game-stage {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              width: 100%;
              height: 100%;
              gap: 10px;
            }

            .wooden-panel {
              min-width: 200px;
              max-width: 300px;
              padding: 8px;
              margin: 0;
            }

            .wooden-panel.camera-panel {
              padding: 5px;
            }

            .camera-preview {
              height: 200px;
              width: 300px;
            }

            .wood-button {
              font-size: 11px;
              padding: 4px 8px;
            }

            .start-btn {
              font-size: 14px;
            }

            .camera-controls {
              gap: 5px;
              flex-direction: row;
            }

            .envelope {
              width: 150px;
              height: 100px;
            }

            .envelope.open .photo-1,
            .envelope.open .photo-2,
            .envelope.open .photo-3 {
              width: 40px;
              height: 40px;
            }

            .envelope-next-button {
              bottom: 10px;
              right: 10px;
            }

            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 5px;
            }

            .stat-item {
              padding: 5px;
            }

            .stat-label {
              font-size: 10px;
            }

            .stat-value {
              font-size: 12px;
              width: 60px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
