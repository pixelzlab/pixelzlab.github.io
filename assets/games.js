const gameCollection = {
    pixelArt: {
        name: "Pixel Art",
        init(canvas) {
            const game = {
                init() {
                    this.canvas = canvas;
                    if (!this.canvas) return;
                    
                    this.ctx = this.canvas.getContext('2d');
                    this.pixelSize = 15;
                    this.colors = ['#34d56c', '#1ec851', '#ffffff'];
                    this.isDrawing = false;
                    
                    this.canvas.width = 300;
                    this.canvas.height = 300;
                    
                    // Remove old event listeners if they exist
                    if (this.removeEvents) {
                        this.removeEvents();
                    }
                    
                    this.setupEvents();
                    this.clear();
                },

                setupEvents() {
                    // Store event handlers so we can remove them later
                    this.handleMouseDown = (e) => {
                        this.isDrawing = true;
                        this.draw(e);
                    };
                    
                    this.handleMouseMove = (e) => {
                        if (this.isDrawing) this.draw(e);
                    };
                    
                    this.handleMouseUp = () => {
                        this.isDrawing = false;
                    };
                    
                    this.handleTouchStart = (e) => {
                        e.preventDefault();
                        this.isDrawing = true;
                        this.drawTouch(e);
                    };
                    
                    this.handleTouchMove = (e) => {
                        e.preventDefault();
                        if (this.isDrawing) this.drawTouch(e);
                    };
                    
                    this.handleTouchEnd = () => {
                        this.isDrawing = false;
                    };

                    // Add event listeners
                    this.canvas.addEventListener('mousedown', this.handleMouseDown);
                    this.canvas.addEventListener('mousemove', this.handleMouseMove);
                    this.canvas.addEventListener('mouseup', this.handleMouseUp);
                    this.canvas.addEventListener('mouseleave', this.handleMouseUp);
                    this.canvas.addEventListener('touchstart', this.handleTouchStart);
                    this.canvas.addEventListener('touchmove', this.handleTouchMove);
                    this.canvas.addEventListener('touchend', this.handleTouchEnd);
                },

                removeEvents() {
                    // Remove all event listeners
                    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
                    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
                    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
                    this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
                    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
                    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
                    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
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
            game.init();
            return game;
        }
    },

    bubblePop: {
        name: "Bubble Pop",
        init(canvas) {
            const game = {
                init() {
                    this.canvas = canvas;
                    this.ctx = this.canvas.getContext('2d');
                    this.canvas.width = 300;
                    this.canvas.height = 300;
                    this.bubbles = [];
                    this.score = 0;
                    this.timeLeft = 30;
                    this.isGameActive = true;
                    
                    this.setupEvents();
                    this.spawnBubble();
                    this.gameLoop();
                },

                spawnBubble() {
                    if (this.bubbles.length < 8) {
                        this.bubbles.push({
                            x: Math.random() * (this.canvas.width - 40) + 20,
                            y: this.canvas.height + 20,
                            radius: Math.random() * 15 + 10,
                            speed: Math.random() * 2 + 1,
                            color: `hsl(${Math.random() * 60 + 120}, 70%, 50%)`
                        });
                    }
                },

                setupEvents() {
                    const handleClick = (x, y) => {
                        if (!this.isGameActive) return;
                        
                        this.bubbles.forEach((bubble, index) => {
                            const distance = Math.sqrt(
                                Math.pow(x - bubble.x, 2) + 
                                Math.pow(y - bubble.y, 2)
                            );
                            if (distance < bubble.radius) {
                                this.bubbles.splice(index, 1);
                                this.score += Math.floor(bubble.radius);
                                this.spawnBubble();
                            }
                        });
                    };

                    // Mouse events
                    this.canvas.addEventListener('click', (e) => {
                        const rect = this.canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        handleClick(x, y);
                    });

                    // Touch events
                    this.canvas.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        const rect = this.canvas.getBoundingClientRect();
                        const x = e.touches[0].clientX - rect.left;
                        const y = e.touches[0].pageY - rect.top;
                        handleClick(x, y);
                    });

                    // Timer
                    this.timer = setInterval(() => {
                        if (this.timeLeft > 0 && this.isGameActive) {
                            this.timeLeft--;
                            if (this.timeLeft === 0) {
                                this.isGameActive = false;
                            }
                        }
                    }, 1000);
                },

                gameLoop() {
                    if (!this.isGameActive) {
                        this.drawGameOver();
                        return;
                    }

                    this.ctx.fillStyle = '#f8fafc';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    
                    // Update and draw bubbles
                    this.bubbles = this.bubbles.filter(bubble => bubble.y > -bubble.radius);
                    this.bubbles.forEach(bubble => {
                        bubble.y -= bubble.speed;
                        
                        this.ctx.beginPath();
                        this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                        this.ctx.fillStyle = bubble.color;
                        this.ctx.fill();
                    });
                    
                    // Spawn new bubbles
                    if (Math.random() < 0.03) {
                        this.spawnBubble();
                    }
                    
                    // Draw score and time
                    this.ctx.fillStyle = '#000';
                    this.ctx.font = '16px Arial';
                    this.ctx.fillText(`Score: ${this.score} | Time: ${this.timeLeft}s`, 10, 30);
                    
                    requestAnimationFrame(() => this.gameLoop());
                },

                drawGameOver() {
                    this.ctx.fillStyle = '#f8fafc';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    
                    this.ctx.fillStyle = '#000';
                    this.ctx.font = '24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2 - 30);
                    this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 10);
                },

                clear() {
                    clearInterval(this.timer);
                    this.init();
                }
            };
            game.init();
            return game;
        }
    }
}; 