const game = {
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.clearButton = document.getElementById('clearGame');
        
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        if (!this.clearButton) {
            console.error('Clear button not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.pixelSize = 15;
        this.colors = ['#34d56c', '#1ec851', '#ffffff'];
        this.isDrawing = false;
        
        this.canvas.width = 300;
        this.canvas.height = 300;
        
        this.setupEvents();
        this.clear();
    },

    setupEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.draw(e);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) this.draw(e);
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isDrawing = false;
        });
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDrawing = true;
            this.drawTouch(e);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDrawing) this.drawTouch(e);
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.isDrawing = false;
        });
        
        // Clear button event
        this.clearButton.addEventListener('click', () => {
            console.log('Clear button clicked');
            this.clear();
        });
    },

    draw(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = Math.floor(((e.clientX - rect.left) * scaleX) / this.pixelSize) * this.pixelSize;
        const y = Math.floor(((e.clientY - rect.top) * scaleY) / this.pixelSize) * this.pixelSize;
        
        this.drawPixel(x, y);
    },

    drawTouch(e) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = Math.floor(((touch.clientX - rect.left) * scaleX) / this.pixelSize) * this.pixelSize;
        const y = Math.floor(((touch.clientY - rect.top) * scaleY) / this.pixelSize) * this.pixelSize;
        
        this.drawPixel(x, y);
    },

    drawPixel(x, y) {
        if (x >= 0 && x < this.canvas.width && y >= 0 && y < this.canvas.height) {
            this.ctx.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
        }
    },

    clear() {
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = '#edf2f7';
        this.ctx.lineWidth = 1;
        
        for(let x = 0; x <= this.canvas.width; x += this.pixelSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for(let y = 0; y <= this.canvas.height; y += this.pixelSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    game.init();
}); 