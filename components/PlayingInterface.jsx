import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GameManager, ROWS, COLS } from '../scripts/GameManager';

const gameManager = new GameManager();

const SELECTION_ITEMS = [
    { type: 'sun_flower_animation.mp4', cost: 50, label: 'Sunflower' },
    { type: 'pea_shooter.png', cost: 100, label: 'Pea Shooter' },
    { type: 'carrot_guardian.png', cost: 100, label: 'Carrot Guardian' },
];

const Unit = ({ type, onResourceGen }) => {
    const isVideo = type.endsWith('.mp4');

    useEffect(() => {
        let interval;
        // Only use interval for non-video sunflowers (static images)
        if (type.includes('sun_flower') && !isVideo) {
            interval = setInterval(() => {
                onResourceGen(50);
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [type, onResourceGen, isVideo]);

    return (
        <div className="relative w-full h-full animate-bounce-short">
            {isVideo ? (
                <video
                    src={`/${type}`}
                    autoPlay
                    loop={!type.includes('sun_flower')} // Manual loop for sunflower to track cycles
                    playsInline
                    className="w-full h-full object-contain drop-shadow-2xl scale-[2.5]"
                    onEnded={(e) => {
                        if (type.includes('sun_flower')) {
                            onResourceGen(50);
                            e.target.currentTime = 0;
                            e.target.play();
                        }
                    }}
                />
            ) : (
                <Image
                    src={`/${type}`}
                    alt="Defender"
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="10vw"
                />
            )}
        </div>
    );
};

export default function PlayingInterface() {
    // Initialize grid state
    const [grid, setGrid] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    const [selectedPet, setSelectedPet] = useState(null);
    const [resources, setResources] = useState(300); // "Sun" currency
    const [isShovelActive, setIsShovelActive] = useState(false);

    // Reset grid when dimensions change
    useEffect(() => {
        if (grid.length !== ROWS || (grid[0] && grid[0].length !== COLS)) {
            setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        }
    }, [grid]);

    // Drag and Drop Logic
    const handleDragStart = (e, petType, cost) => {
        if (resources >= cost) {
            e.dataTransfer.setData("petType", petType);
            e.dataTransfer.setData("cost", cost);
            e.dataTransfer.effectAllowed = "copy";
            setSelectedPet(petType); // Also select for click-to-place
        } else {
            e.preventDefault(); // Prevent drag if can't afford
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e, rowIndex, colIndex) => {
        e.preventDefault();
        const petType = e.dataTransfer.getData("petType");
        const cost = parseInt(e.dataTransfer.getData("cost"));

        if (petType && !grid[rowIndex][colIndex] && resources >= cost) {
            placeUnit(rowIndex, colIndex, petType, cost);
        }
    };

    const handleCellClick = (rowIndex, colIndex) => {
        if (isShovelActive) {
            if (grid[rowIndex][colIndex]) {
                setGrid(prevGrid => gameManager.removeDefender(prevGrid, rowIndex, colIndex));
                setIsShovelActive(false); // Deactivate shovel after use
            }
        } else if (selectedPet) {
            // Find cost of selected pet
            const item = SELECTION_ITEMS.find(i => i.type === selectedPet);
            if (item && !grid[rowIndex][colIndex] && resources >= item.cost) {
                placeUnit(rowIndex, colIndex, selectedPet, item.cost);
                setSelectedPet(null); // Deselect after placement
            }
        }
    };

    const toggleShovel = () => {
        setIsShovelActive(!isShovelActive);
        setSelectedPet(null); // Clear any selected pet
    };

    const placeUnit = (rowIndex, colIndex, type, cost) => {
        setGrid(prevGrid => gameManager.placeDefender(prevGrid, rowIndex, colIndex, type));
        setResources(prev => prev - cost);
    };

    const handleResourceGen = (amount) => {
        setResources(prev => prev + amount);
    };

    return (
        <div className="w-screen h-screen bg-black overflow-hidden">
            {/* 
                GAME CONTAINER: Full screen background
            */}
            <div
                className="relative w-full h-full flex flex-col"
                style={{
                    backgroundImage: 'url(/game_background_dirt_v3.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* --- TOP BAR --- */}
                <div className="absolute top-0 left-0 w-full h-[15%] z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl px-6 py-2 flex gap-4 pointer-events-auto">

                        {SELECTION_ITEMS.map((item) => (
                            <div
                                key={item.type}
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, item.type, item.cost)}
                                onClick={() => {
                                    if (resources >= item.cost) setSelectedPet(item.type);
                                }}
                                className={`w-16 h-16 relative bg-white/10 rounded-lg border 
                                    ${selectedPet === item.type ? 'border-yellow-400 bg-white/30' : 'border-white/30'} 
                                    cursor-grab active:cursor-grabbing hover:bg-white/20 transition-all hover:scale-105 group overflow-hidden`}
                                title={`${item.label} (${item.cost})`}
                            >
                                <div className="relative w-full h-full">
                                    {item.type.endsWith('.mp4') ? (
                                        <video
                                            src={`/${item.type}`}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover group-hover:brightness-110"
                                        />
                                    ) : (
                                        <Image
                                            src={`/${item.type}`}
                                            alt={item.label}
                                            fill
                                            className="object-cover group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                            sizes="64px"
                                        />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white z-10">
                                    {item.cost}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* --- COIN DISPLAY --- */}
                <div className="absolute bottom-4 left-4 z-50 flex items-center gap-4 pointer-events-auto">
                    {/* Coin Display */}
                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-yellow-500/30 shadow-lg pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white/80 flex items-center justify-center text-black font-extrabold text-lg shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-pulse-slow">
                            $
                        </div>
                        <span className="text-yellow-300 font-mono font-bold text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
                            {resources}
                        </span>
                    </div>

                    {/* Shovel Button */}
                    <button
                        onClick={toggleShovel}
                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-lg ${isShovelActive
                            ? 'bg-red-500/80 border-white scale-110 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                            : 'bg-black/60 border-white/30 hover:bg-white/10 hover:border-white/60'
                            }`}
                        title="Shovel - Remove Plant"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`w-8 h-8 transition-colors ${isShovelActive ? 'text-white' : 'text-gray-300'}`}
                        >
                            <path d="M13.73 3.51a.75.75 0 00-1.06 0L5.47 10.71a.75.75 0 000 1.06l1.27 1.27c.3.3.78.3 1.06 0l2.42-2.42 2.65 2.65-2.42 2.42c-.3.3-.3.78 0 1.06l1.27 1.27c.3.3.78.3 1.06 0l7.2-7.2a.75.75 0 000-1.06l-1.27-1.27a.75.75 0 00-1.06 0l-1.27 1.27-2.65-2.65 1.27-1.27a.75.75 0 000-1.06L13.73 3.51z" />
                            <path d="M7.78 18.22a.75.75 0 00-1.06 0L2.22 22.72a.75.75 0 101.06 1.06l4.5-4.5a.75.75 0 000-1.06z" />
                        </svg>
                    </button>
                </div>

                {/* --- GRID OVERLAY AREA --- */}
                <div
                    className="absolute z-10"
                    style={{
                        top: '20%',    // Push down more to avoid overlap
                        bottom: '10%',
                        left: '22%',   // Increase side margins to avoid house/cave
                        right: '22%',
                        // Removed 3D transforms to make it flat "in front of us"
                    }}
                >
                    <div
                        className="w-full h-full grid"
                        style={{
                            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                        }}
                    >
                        {grid.map((row, rowIndex) => (
                            row.map((cell, colIndex) => {
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                                        className={`
                                            relative w-full h-full border border-white/5
                                            ${cell ? '' : 'hover:bg-white/10 hover:border-white/40'} 
                                            transition-all duration-200 cursor-pointer
                                        `}
                                    >
                                        {/* Placed Unit */}
                                        {cell && (
                                            <div
                                                className="relative w-full h-full flex items-center justify-center pointer-events-none z-10"
                                            >
                                                <Unit type={cell.type} onResourceGen={handleResourceGen} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}