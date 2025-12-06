export const ROWS = 5;
export const COLS = 8;

export class GameManager {
    constructor() {
        this.grid = this.initializeGrid();
        this.selectedPet = 'pet_defender';
    }

    initializeGrid() {
        return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    }

    placeDefender(grid, rowIndex, colIndex, type) {
        const newGrid = grid.map(row => [...row]);
        if (newGrid[rowIndex][colIndex]) {
            // Remove if existing
            newGrid[rowIndex][colIndex] = null;
        } else {
            // Place new
            newGrid[rowIndex][colIndex] = {
                type: type,
                id: Date.now(),
                lastAttackTime: 0
            };
        }
        return newGrid;
    }

    // Placeholder for future enemy logic
    spawnEnemy() {
        // Logic to spawn enemy
    }
}
