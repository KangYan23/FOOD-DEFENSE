import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GameManager, ROWS, COLS } from '../../scripts/GameManager';

const gameManager = new GameManager();

export default function PlayingInterface() {
    // Initialize grid state
    const [grid, setGrid] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    const [selectedPet, setSelectedPet] = useState(null);
    const [resources, setResources] = useState(500); // "Sun" currency

    // Reset grid when dimensions change
    useEffect(() => {
        if (grid.length !== ROWS || (grid[0] && grid[0].length !== COLS)) {
            setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        }
    });

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
        if (selectedPet && !grid[rowIndex][colIndex] && resources >= 100) {
            placeUnit(rowIndex, colIndex, selectedPet, 100);
            setSelectedPet(null); // Deselect after placement
        }
    };

    const placeUnit = (rowIndex, colIndex, type, cost) => {
        setGrid(prevGrid => gameManager.placeDefender(prevGrid, rowIndex, colIndex, type));
        setResources(prev => prev - cost);
    };

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
            {/* 
                GAME CONTAINER: Locks the aspect ratio to match the background image.
                This ensures that the Grid (overlay) and the Background (image) 
                always scale together.
            */}
            <div
                className="relative w-full max-w-[1500px] aspect-video shadow-2xl bg-[#333] flex flex-col"
                style={{
                    backgroundImage: 'url(/game_background_dirt_v3.png)',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* --- TOP BAR REMOVED AS REQUESTED --- */}

                {/* --- GRID OVERLAY AREA --- */}
                <div
                    className="absolute z-10"
                    style={{
                        top: '25%',
                        bottom: '10%',
                        left: '28%',
                        right: '28%',
                        transform: 'perspective(600px) rotateX(30deg)',
                        transformOrigin: 'bottom center',
                        transformStyle: 'preserve-3d'
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
                                            relative w-full h-full border border-white/30
                                            ${cell ? '' : 'hover:bg-white/10 hover:border-white/60'} 
                                            transition-all duration-200 cursor-pointer
                                        `}
                                    >
                                        {/* Placed Unit */}
                                        {cell && (
                                            <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10" style={{ transform: 'rotateX(-20deg) translateY(-20%)' }}>
                                                <div className="absolute bottom-[0%] w-[60%] h-[15%] bg-black/40 rounded-[100%] blur-[4px]"></div>
                                                <div className="relative w-[100%] h-[120%] animate-bounce-short">
                                                    <Image
                                                        src={`/${cell.type}.png`}
                                                        alt="Defender"
                                                        fill
                                                        className="object-contain drop-shadow-2xl"
                                                        sizes="10vw"
                                                    />
                                                </div>
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
