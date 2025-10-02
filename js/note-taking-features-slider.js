/**
 * Note-Taking Features Slider - Unique implementation to avoid conflicts
 * Features: Manual navigation, auto-play, keyboard support, touch support
 */

class NoteTakingFeaturesSlider {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('Note-Taking Features Slider: Container not found');
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
    }

    createSlider() {
        this.container.innerHTML = `
            <div class="zhike-slider-container">
                <div class="zhike-slider-track" id="zhikeSliderTrack">
                    <div class="zhike-feature-slide active">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>Research-Backed Templates</h3>
                                <p>Replaced blank pages with proven methodologies like Cornell Notes, subject-specific structures, and guided frameworks that teach students how to process information effectively through embedded educational guidance.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <video class="zhike-feature-video" autoplay muted loop playsinline poster="assets/figma_assets/Notetaking App/Feature 1_fallback.svg">
                                <source src="assets/figma_assets/Notetaking App/Feature 1.mp4" type="video/mp4">
                                <img src="assets/figma_assets/Notetaking App/Feature 1_fallback.svg" alt="Video: Structured Note-Taking Templates Demo" class="zhike-feature-video">
                                <div class="zhike-feature-icon">📝</div>
                            </video>
                        </div>
                    </div>
                    <div class="zhike-feature-slide">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>Anywhere Access System</h3>
                                <p>Lightweight overlay system that allows note-taking while using other apps—reading textbooks, watching videos, or following presentations—without disrupting the primary learning context or requiring app switching.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <img class="zhike-feature-image" src="assets/figma_assets/Notetaking App/Feature 2.png" alt="Anywhere Access System Interface" loading="lazy">
                        </div>
                    </div>
                    <div class="zhike-feature-slide">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>Multiple Input Methods</h3>
                                <p>Integrated typing and pen input with rich text editing options, custom grids for spatial learning, and accessibility features that ensure all students can participate regardless of their device accessories or input preferences.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <img class="zhike-feature-image" src="assets/figma_assets/Notetaking App/Feature 3.png" alt="Multiple Input Methods Interface" loading="lazy">
                        </div>
                    </div>
                    <div class="zhike-feature-slide">
                        <div class="zhike-feature-content">
                            <div class="zhike-feature-text">
                                <h3>Learning Communities</h3>
                                <p>Discussion boards where students share effective note-taking strategies, save templates from high-performing peers, and build collaborative learning networks that spread good study habits naturally through peer influence.</p>
                            </div>
                        </div>
                        <div class="zhike-feature-visual">
                            <img class="zhike-feature-image" src="assets/figma_assets/Notetaking App/Feature 4.png" alt="Learning Communities Interface" loading="lazy">
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

        // Visibility change
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

    handleKeyboard(e) {
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
            case ' ':
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

    pauseAllVideos() {
        const videos = this.container.querySelectorAll('.zhike-feature-video');
        videos.forEach(video => {
            video.pause();
        });
    }

    restartCurrentVideo() {
        this.pauseAllVideos();
        
        const currentSlideElement = this.slides[this.currentSlide];
        if (currentSlideElement) {
            const video = currentSlideElement.querySelector('.zhike-feature-video');
            if (video) {
                video.currentTime = 0;
                video.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            }
        }
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    destroy() {
        this.pauseAutoPlay();
        this.pauseAllVideos();
        
        document.removeEventListener('keydown', this.handleKeyboard);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.zhike-features-slider');
    if (sliderContainer) {
        window.noteTakingFeaturesSlider = new NoteTakingFeaturesSlider('.zhike-features-slider', {
            autoPlay: true,
            autoPlayInterval: 5000,
            enableKeyboard: true,
            enableTouch: true,
            pauseOnHover: true
        });

        console.log('Note-Taking Features Slider initialized successfully');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NoteTakingFeaturesSlider;
}