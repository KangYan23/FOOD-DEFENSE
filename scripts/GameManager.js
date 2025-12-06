export const ROWS = 5;
export const COLS = 9;

const UNIT_STATS = {
    'sun_flower_animation.mp4': { hp: 100 },
    'pea_shooter_animation.mp4': { hp: 150 },
    'carrot_guardian_animation.mp4': { hp: 250 }, // Tanker
};

export class GameManager {
    constructor() {
        this.grid = this.initializeGrid();
        this.enemies = [];
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
            const stats = UNIT_STATS[type] || { hp: 100 };
            newGrid[rowIndex][colIndex] = {
                type: type,
                id: Date.now(),
                hp: stats.hp,
                maxHp: stats.hp,
                lastAttackTime: 0
            };
        }
        return newGrid;
    }

    removeDefender(grid, rowIndex, colIndex) {
        const newGrid = grid.map(row => [...row]);
        newGrid[rowIndex][colIndex] = null;
        return newGrid;
    }

    startWave(waveNumber) {
        // Wave 1 -> 1 enemy, Wave 2 -> 2 enemies, etc. limit to 5 waves based on prompt context, or just generic count
        const count = waveNumber;
        for (let i = 0; i < count; i++) {
            this.spawnEnemy(i * 1000); // Stagger start times slightly if needed, but here we just spawn
        }
    }

    spawnEnemy(delayOffset = 0) {
        // Random row
        const row = Math.floor(Math.random() * ROWS);
        // Start at Right edge (COLS)
        // Add some randomness to col to separate them if multiple spawn in same wave
        const startCol = COLS + (Math.random() * 2);

        this.enemies.push({
            id: Date.now() + Math.random(),
            row: row,
            col: startCol,
            type: 'chubby_animation.mp4',
            speed: 0.03, // Speed of movement
            hp: 100,
            maxHp: 100,
            lastAttackTime: 0,
            damage: 25 // Damage per hit
        });
    }

    update(grid) {
        let gridModified = false;
        const now = Date.now();

        // Move enemies
        this.enemies.forEach(enemy => {
            let shouldMove = true;

            // Check collision with defenders if grid is provided
            if (grid) {
                const colIndex = Math.floor(enemy.col);
                // Check if enemy is inside a grid cell (0 to COLS-1)
                // And if that cell has a defender
                if (colIndex >= 0 && colIndex < COLS && grid[enemy.row][colIndex]) {
                    shouldMove = false;

                    // Attack Logic
                    if (now - enemy.lastAttackTime > 2000) { // Attack every 2 seconds
                        const defender = grid[enemy.row][colIndex];
                        defender.hp -= enemy.damage;
                        enemy.lastAttackTime = now;
                        gridModified = true;

                        // Check if defender dead
                        if (defender.hp <= 0) {
                            grid[enemy.row][colIndex] = null;
                            shouldMove = true; // Resume movement
                        }
                    }
                }
            }

            if (shouldMove) {
                enemy.col -= enemy.speed;
            }
        });

        // Defender Projectile Logic (Pea Shooter)
        if (grid) {
            grid.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell && cell.type.includes('pea_shooter')) {
                        // Check if time to fire
                        if (now - cell.lastAttackTime > 1500) { // Fire every 1.5s
                            // Find target in this row
                            // Enemies in this row, to the right of the shooter
                            const targets = this.enemies.filter(e => e.row === rowIndex && e.col > colIndex);
                            if (targets.length > 0) {
                                // Target the closest one (smallest col)
                                targets.sort((a, b) => a.col - b.col);
                                const target = targets[0];

                                // Deal damage
                                target.hp -= 25; // Pea damage
                                cell.lastAttackTime = now;
                                gridModified = true;
                            }
                        }
                    }
                });
            });
        }

        // Remove dead enemies
        this.enemies = this.enemies.filter(e => {
            if (e.hp <= 0) return false;
            // Remove passed left edge
            return e.col > -2;
        });

        return { enemies: [...this.enemies], gridModified };
    }
}