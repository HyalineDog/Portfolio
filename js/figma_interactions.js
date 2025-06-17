// Enhanced full-screen scroll-based presentation with snap scrolling
class PresentationController {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupProgressBar();
        this.setupKeyboardNavigation();
        this.setupSnapScrolling();
        this.setupImageInteractions();
        this.resetAllSlides();
    }

    setupIntersectionObserver() {
        // Enhanced observer options for better control
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px', // Trigger when slide is more centered
            threshold: [0.3, 0.7] // Multiple thresholds for different effects
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                const slide = entry.target;
                const slideIndex = Array.from(this.slides).indexOf(slide);
                
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    // Add slide-specific animation classes
                    slide.classList.add('is-visible');
                    
                    // Staggered animations for elements within the slide
                    setTimeout(() => {
                        this.animateSlideElements(slide, slideIndex);
                    }, 200);
                    
                    // Add interactive features
                    this.addSlideInteractions(slide, slideIndex);
                } else if (!entry.isIntersecting) {
                    // Reset animations when slide goes out of view
                    slide.classList.remove('is-visible');
                    this.resetSlideElements(slide);
                }
            });
        };

        // Initialize observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        this.slides.forEach(slide => {
            observer.observe(slide);
        });
    }

    setupProgressBar() {
        // Add scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    setupKeyboardNavigation() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const currentSlideIndex = this.getCurrentSlideIndex();
            
            if (e.key === 'ArrowDown' && currentSlideIndex < this.slides.length - 1) {
                e.preventDefault();
                this.smoothScrollToSlide(currentSlideIndex + 1);
            } else if (e.key === 'ArrowUp' && currentSlideIndex > 0) {
                e.preventDefault();
                this.smoothScrollToSlide(currentSlideIndex - 1);
            }
        });
    }

    setupSnapScrolling() {
        // Add CSS scroll-snap for full-screen snapping
        const container = document.querySelector('.presentation-container');
        if (container) {
            container.style.scrollSnapType = 'y mandatory';
            container.style.overflowY = 'scroll';
            container.style.height = '100vh';
        }
        
        // Add scroll-snap-align to each slide
        this.slides.forEach((slide) => {
            slide.style.scrollSnapAlign = 'start';
        });
        
        // Handle wheel events for smoother snapping
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (this.isScrolling) return;
            
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                this.snapToNearestSlide();
            }, 150);
        }, { passive: true });
    }

    setupImageInteractions() {
        // Setup image interaction handlers
        this.slides.forEach((slide, slideIndex) => {
            const images = slide.querySelectorAll('.figma-image');
            
            images.forEach(img => {
                // Add hover effects
                img.addEventListener('mouseenter', () => {
                    img.classList.add('hover-effect');
                });
                
                img.addEventListener('mouseleave', () => {
                    img.classList.remove('hover-effect');
                });
                
                // Add click interactions for specific slides
                if (slideIndex === 1) {
                    img.addEventListener('click', () => {
                        img.classList.toggle('clicked');
                    });
                }
            });
        });
    }

    resetAllSlides() {
        this.slides.forEach(slide => {
            this.resetSlideElements(slide);
        });
    }

    snapToNearestSlide() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const slideIndex = Math.round(scrollTop / windowHeight);
        
        if (slideIndex !== this.currentSlide && slideIndex >= 0 && slideIndex < this.slides.length) {
            this.currentSlide = slideIndex;
            this.scrollToSlide(slideIndex);
        }
    }

    scrollToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.isScrolling = true;
            window.scrollTo({
                top: index * window.innerHeight,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 800);
            
            this.currentSlide = index;
        }
    }

    // Function to animate elements within a slide
    animateSlideElements(slide, slideIndex) {
        const texts = slide.querySelectorAll('.figma-text');
        const images = slide.querySelectorAll('.figma-image');
        
        // Animate text elements with staggered timing
        texts.forEach((text, index) => {
            setTimeout(() => {
                text.classList.add('animate-in');
            }, index * 150);
        });
        
        // Animate images with different effects based on slide
        images.forEach((img, index) => {
            setTimeout(() => {
                if (slideIndex === 0) {
                    img.classList.add('zoom-in');
                } else {
                    img.classList.add('slide-in-right');
                }
            }, (texts.length * 150) + (index * 200));
        });
    }

    // Function to reset slide elements
    resetSlideElements(slide) {
        const elements = slide.querySelectorAll('.figma-text, .figma-image');
        elements.forEach(element => {
            element.classList.remove('animate-in', 'zoom-in', 'slide-in-right');
        });
    }

    // Function to add interactive features to slides
    addSlideInteractions(slide, slideIndex) {
        const images = slide.querySelectorAll('.figma-image');
        
        images.forEach(img => {
            // Add hover effects
            img.addEventListener('mouseenter', () => {
                img.classList.add('hover-effect');
            });
            
            img.addEventListener('mouseleave', () => {
                img.classList.remove('hover-effect');
            });
            
            // Add click interactions for specific slides
            if (slideIndex === 1) {
                img.addEventListener('click', () => {
                    img.classList.toggle('clicked');
                });
            }
        });
    }

    // Smooth scroll behavior for better UX
    smoothScrollToSlide(slideIndex) {
        const targetSlide = this.slides[slideIndex];
        if (targetSlide) {
            targetSlide.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Function to get current slide index based on viewport
    getCurrentSlideIndex() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let currentIndex = 0;
        
        this.slides.forEach((slide, index) => {
            const slideTop = slide.offsetTop;
            const slideBottom = slideTop + slide.offsetHeight;
            
            if (scrollPosition >= slideTop && scrollPosition <= slideBottom) {
                currentIndex = index;
            }
        });
        
        return currentIndex;
    }
}

// Initialize the presentation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PresentationController();
});