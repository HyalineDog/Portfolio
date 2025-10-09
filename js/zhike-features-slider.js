/**
 * ZhiKe Features Slider - Unique implementation to avoid conflicts
 * Features: Manual navigation, auto-play, keyboard support, touch support
 */

class ZhiKeFeaturesSlider {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('ZhiKe Features Slider: Container not found');
            return;
        }

        // Configuration
        this.options = {
            autoPlay: true,
            autoPlayInterval: 5000,
            enableKeyboard: true,
            enableTouch: true,
            pauseOnHover: true,
            ...options
        };

        // State
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.isAutoPlaying = this.options.autoPlay;
        this.autoPlayTimer = null;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Elements
        this.track = null;
        this.slides = [];
        this.prevBtn = null;
        this.nextBtn = null;
        this.indicators = [];

        this.init();
    }

    init() {
        this.createSlider();
        this.bindEvents();
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
        this.updateSlider();
        this.initializeVideos();
    }

    createSlider() {
        this.container.innerHTML = `
            <div class="zhike-slider-container">
                <div class="zhike-slider-track" id="zhikeSliderTrack">
                    <div class="zhike-feature-slide active">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>Simplified Interface Design</h3>
                                <p>Stripped away PowerPoint's complexity to essential teaching tools only. Clean toolbar and right-side controls let teachers focus on students, not software navigation.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <video class="zhike-feature-video" autoplay muted poster="assets/figma_assets/Zhike Classroom Platform/Simplified Interface_fallback.svg">
                                <source src="assets/figma_assets/Zhike Classroom Platform/Simplified Interface.mp4" type="video/mp4">
                                <img src="assets/figma_assets/Zhike Classroom Platform/Simplified Interface_fallback.svg" alt="Video: Simplified Interface Demo" class="zhike-feature-video">
                                <div class="zhike-feature-icon">🎯</div>
                            </video>
                        </div>
                    </div>
                    <div class="zhike-feature-slide">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>AI-Powered Content Creation</h3>
                                <p>One-click access to iFlytek's resource bank with AI assistance. Teachers can generate, edit, and customize lesson materials instantly without leaving the platform.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <video class="zhike-feature-video" autoplay muted poster="assets/figma_assets/Zhike Classroom Platform/AI Generated Content_fallback.svg">
                                <source src="assets/figma_assets/Zhike Classroom Platform/AI Generated Content.mp4" type="video/mp4">
                                <img src="assets/figma_assets/Zhike Classroom Platform/AI Generated Content_fallback.svg" alt="Video: AI-Powered Content Creation Demo" class="zhike-feature-video">
                                <div class="zhike-feature-icon">🤖</div>
                            </video>
                        </div>
                    </div>
                    <div class="zhike-feature-slide">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>Cross-Platform Optimization</h3>
                                <p>Purpose-built experiences: PC for content creation, tablets for lesson control, smartboards for student-facing presentation—each optimized for its specific teaching context.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <video class="zhike-feature-video" autoplay muted poster="assets/figma_assets/Zhike Classroom Platform/Cross Platform_fallback.svg">
                                <source src="assets/figma_assets/Zhike Classroom Platform/Cross Platform.mp4" type="video/mp4">
                                <img src="assets/figma_assets/Zhike Classroom Platform/Cross Platform_fallback.svg" alt="Video: Cross-Platform Optimization Demo" class="zhike-feature-video">
                                <div class="zhike-feature-icon">📱</div>
                            </video>
                        </div>
                    </div>
                    <div class="zhike-feature-slide">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>Seamless Student Interaction</h3>
                                <p>Embedded classroom activities within slides. Send problems to student devices, collect real-time feedback, and project student work—all without switching apps.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <img class="zhike-feature-image" src="assets/figma_assets/Zhike Classroom Platform/PowerPoint Student Interactions Feature.png" alt="Student Interaction Features">
                        </div>
                    </div>
                </div>
            </div>
            <div class="zhike-slider-controls">
                <button class="zhike-slider-btn" id="zhikePrevBtn" aria-label="Previous slide">
                    <span>‹</span>
                </button>
                <div class="zhike-slider-indicators">
                    <div class="zhike-indicator active" data-slide="0"></div>
                    <div class="zhike-indicator" data-slide="1"></div>
                    <div class="zhike-indicator" data-slide="2"></div>
                    <div class="zhike-indicator" data-slide="3"></div>
                </div>
                <button class="zhike-slider-btn" id="zhikeNextBtn" aria-label="Next slide">
                    <span>›</span>
                </button>
            </div>
        `;

        // Get references to elements
        this.track = this.container.querySelector('#zhikeSliderTrack');
        this.slides = this.container.querySelectorAll('.zhike-feature-slide');
        this.prevBtn = this.container.querySelector('#zhikePrevBtn');
        this.nextBtn = this.container.querySelector('#zhikeNextBtn');
        this.indicators = this.container.querySelectorAll('.zhike-indicator');
    }

    bindEvents() {
        // Button events
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Indicator events
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard events
        if (this.options.enableKeyboard) {
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }

        // Touch events
        if (this.options.enableTouch) {
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        }

        // Pause on hover
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Visibility change (pause when tab is not active and manage video playback)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
                this.pauseAllVideos();
            } else if (this.isAutoPlaying) {
                this.resumeAutoPlay();
                this.restartCurrentVideo();
            }
        });
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider('next');
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider('prev');
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        const direction = index > this.currentSlide ? 'next' : 'prev';
        this.currentSlide = index;
        this.updateSlider(direction);
    }

    updateSlider(direction = null) {
        this.isTransitioning = true;

        // Add direction class for enhanced animations
        if (direction) {
            this.track.classList.remove('slide-next', 'slide-prev');
            this.track.classList.add(`slide-${direction}`);
        }

        // Update track position
        const translateX = -this.currentSlide * 25; // 25% per slide
        this.track.style.transform = `translateX(${translateX}%)`;

        // Update active slide
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
            if (direction) {
                this.track.classList.remove(`slide-${direction}`);
            }
        }, 600);

        // Restart auto-play timer
        if (this.isAutoPlaying) {
            this.restartAutoPlay();
        }

        // Restart current video when slide changes
        this.restartCurrentVideo();

        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('zhike-slider-change', {
            detail: {
                currentSlide: this.currentSlide,
                totalSlides: this.totalSlides,
                direction: direction
            }
        }));
    }

    startAutoPlay() {
        if (!this.isAutoPlaying) return;
        
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.options.autoPlayInterval);

        // Add progress animation to current indicator
        this.updateAutoPlayIndicator();
    }

    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        this.removeAutoPlayIndicator();
    }

    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayTimer) {
            this.startAutoPlay();
        }
    }

    restartAutoPlay() {
        this.pauseAutoPlay();
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }

    updateAutoPlayIndicator() {
        this.removeAutoPlayIndicator();
        if (this.isAutoPlaying && this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.add('auto-progress');
        }
    }

    removeAutoPlayIndicator() {
        this.indicators.forEach(indicator => {
            indicator.classList.remove('auto-progress');
        });
    }

    setAutoPlay(enabled, interval = null) {
        this.isAutoPlaying = enabled;
        if (interval) {
            this.options.autoPlayInterval = interval;
        }

        if (enabled) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }

    handleKeyboard(e) {
        // Only handle keyboard events when slider is visible
        const rect = this.container.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ': // Spacebar
                e.preventDefault();
                this.setAutoPlay(!this.isAutoPlaying);
                break;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    // Public API methods
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    // Video management methods
    pauseAllVideos() {
        const videos = this.container.querySelectorAll('.zhike-feature-video');
        videos.forEach(video => {
            video.pause();
        });
    }

    restartCurrentVideo() {
        // Pause all videos first
        this.pauseAllVideos();
        
        // Find and restart the video in the current slide
        const currentSlideElement = this.slides[this.currentSlide];
        if (currentSlideElement) {
            const video = currentSlideElement.querySelector('.zhike-feature-video');
            if (video) {
                video.currentTime = 0;
                
                // Check if video is ready to play
                if (video.readyState >= 2) {
                    video.play().catch(e => {
                        console.log('Video autoplay prevented:', e);
                    });
                } else {
                    // Wait for video to be ready
                    video.addEventListener('canplay', () => {
                        video.play().catch(e => {
                            console.log('Video autoplay prevented:', e);
                        });
                    }, { once: true });
                }
            }
        }
    }

    initializeVideos() {
        const videos = this.container.querySelectorAll('.zhike-feature-video');
        videos.forEach((video, index) => {
            // Set video attributes for better loading
            video.preload = 'metadata';
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            
            // Force load the video
            video.load();
            
            // If this is the active slide video, try to play it once ready
            if (index === this.currentSlide) {
                if (video.readyState >= 2) {
                    video.play().catch(e => {
                        console.log('Video autoplay prevented:', e);
                    });
                } else {
                    video.addEventListener('canplay', () => {
                        video.play().catch(e => {
                            console.log('Video autoplay prevented:', e);
                        });
                    }, { once: true });
                }
            }
        });
    }

    destroy() {
        this.pauseAutoPlay();
        this.pauseAllVideos();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.zhike-features-slider');
    if (sliderContainer) {
        // Create global instance for external access
        window.zhikeFeaturesSlider = new ZhiKeFeaturesSlider('.zhike-features-slider', {
            autoPlay: true,
            autoPlayInterval: 5000,
            enableKeyboard: true,
            enableTouch: true,
            pauseOnHover: true
        });

        console.log('ZhiKe Features Slider initialized successfully');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZhiKeFeaturesSlider;
}