import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GameManager, ROWS, COLS } from '../scripts/GameManager';

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
                        {/* Draggable Carrot Unit */}
                        <div
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, 'carrot.jpg', 100)}
                            className="w-16 h-16 relative bg-white/10 rounded-lg border border-white/30 cursor-grab active:cursor-grabbing hover:bg-white/20 transition-all hover:scale-105 group"
                        >
                            <Image
                                src="/carrot.jpg"
                                alt="Carrot Defender"
                                fill
                                className="object-contain p-1 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                sizes="64px"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-white">
                                50
                            </div>
                        </div>
                    </div>
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
                                            relative w-full h-full border border-white/30
                                            ${cell ? '' : 'hover:bg-white/10 hover:border-white/60'} 
                                            transition-all duration-200 cursor-pointer
                                        `}
                                    >
                                        {/* Placed Unit */}
                                        {cell && (
                                            <div
                                                className="relative w-full h-full flex items-center justify-center pointer-events-none z-10"
                                            >
                                                {/* Simple scaling/positioning for 2D view */}
                                                <div className="relative w-[90%] h-[90%] animate-bounce-short">
                                                    <Image
                                                        src={cell.type.includes('.') ? `/${cell.type}` : `/${cell.type}.png`}
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