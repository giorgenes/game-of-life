class GameOfLife {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Get maximum available space while maintaining responsive design
        this.updateGridSize();
        
        // Initialize game state
        this.grid = [];
        this.nextGrid = [];
        this.generation = 0;
        this.isRunning = false;
        this.speed = 200; // milliseconds between generations
        this.animationId = null;
        
        // Cell rendering properties
        this.cellSize = 10;
        this.deadColor = '#ffffff';
        this.aliveColor = '#000000';
        
        this.initGrids();
        // Event listeners removed - no user interaction needed
        this.draw();
        this.updateStats();
        
        // Reset to random initial pattern
        this.reset();
        
        // Start the game automatically
        this.play();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateGridSize();
            this.initGrids();
            this.reset();
            this.play();
        });
    }
    
    updateGridSize() {
        // Use full screen dimensions
        const fullWidth = window.innerWidth;
        const fullHeight = window.innerHeight;
        
        // Calculate optimal cell size based on available space
        if (fullWidth <= 600) {
            this.cellSize = 4;
        } else if (fullWidth <= 800) {
            this.cellSize = 6;
        } else if (fullWidth <= 1200) {
            this.cellSize = 8;
        } else {
            this.cellSize = 10;
        }
        
        // Calculate grid dimensions based on cell size
        this.cols = Math.floor(fullWidth / this.cellSize);
        this.rows = Math.floor(fullHeight / this.cellSize);
        
        // Set canvas to full screen
        this.canvas.width = fullWidth;
        this.canvas.height = fullHeight;
    }
    
    initGrids() {
        this.grid = [];
        this.nextGrid = [];
        
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            this.nextGrid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = false;
                this.nextGrid[i][j] = false;
            }
        }
    }
    
    // setupEventListeners() removed - no user interaction
    
    // Interactive cell editing removed - game runs automatically only
    
    // Conway's Game of Life rules
    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Skip the cell itself
                
                const neighborRow = row + i;
                const neighborCol = col + j;
                
                // Check boundaries
                if (neighborRow >= 0 && neighborRow < this.rows &&
                    neighborCol >= 0 && neighborCol < this.cols &&
                    this.grid[neighborRow][neighborCol]) {
                    count++;
                }
            }
        }
        return count;
    }
    
    nextGeneration() {
        // Calculate next generation based on Conway's rules
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbors = this.countNeighbors(row, col);
                const isAlive = this.grid[row][col];
                
                if (isAlive) {
                    // Any live cell with 2 or 3 live neighbors survives
                    this.nextGrid[row][col] = (neighbors === 2 || neighbors === 3);
                } else {
                    // Any dead cell with exactly 3 live neighbors becomes alive
                    this.nextGrid[row][col] = (neighbors === 3);
                }
            }
        }
        
        // Swap grids
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
        this.generation++;
        this.updateStats();
        this.draw();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.deadColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Grid lines removed for cleaner fullscreen look
        
        // Draw alive cells
        this.ctx.fillStyle = this.aliveColor;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            }
        }
    }
    
    updateStats() {
        // Stats removed - no UI elements to update
    }
    
    play() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }
    
    animate() {
        if (this.isRunning) {
            this.nextGeneration();
            setTimeout(() => {
                if (this.isRunning) {
                    this.animate();
                }
            }, this.speed);
        }
    }
    
    
    reset() {
        this.generation = 0;
        
        // Generate random pattern
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = Math.random() < 0.3; // 30% chance of being alive
            }
        }
        
        this.draw();
        this.updateStats();
    }
    
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameOfLife = new GameOfLife();
});
