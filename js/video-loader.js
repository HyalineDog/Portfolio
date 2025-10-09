/**
 * Video Loader Utility
 * Handles video loading with fallbacks, error handling, and performance optimization
 */

class VideoLoader {
    constructor() {
        this.loadedVideos = new Set();
        this.failedVideos = new Set();
        this.observers = new Map();
        this.init();
    }

    init() {
        // Initialize intersection observer for lazy loading
        this.setupIntersectionObserver();
        
        // Process existing videos on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.processAllVideos();
        });

        // Handle dynamic content
        this.setupMutationObserver();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadVideo(entry.target);
                        this.intersectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
        }
    }

    setupMutationObserver() {
        if ('MutationObserver' in window) {
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
                            videos.forEach(video => this.processVideo(video));
                            
                            if (node.tagName === 'VIDEO') {
                                this.processVideo(node);
                            }
                        }
                    });
                });
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    processAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => this.processVideo(video));
    }

    processVideo(video) {
        if (video.dataset.videoProcessed) return;
        
        video.dataset.videoProcessed = 'true';
        
        // Add loading state
        this.addLoadingState(video);
        
        // Setup error handling
        this.setupErrorHandling(video);
        
        // Setup lazy loading if intersection observer is available
        if (this.intersectionObserver && !video.autoplay) {
            this.intersectionObserver.observe(video);
        } else {
            // Load immediately for autoplay videos or if no intersection observer
            this.loadVideo(video);
        }
    }

    addLoadingState(video) {
        const container = video.parentElement;
        
        // Create loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'video-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading video...</p>
        `;
        
        // Add loading styles if not already present
        if (!document.querySelector('#video-loader-styles')) {
            const styles = document.createElement('style');
            styles.id = 'video-loader-styles';
            styles.textContent = `
                .video-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    color: #666;
                    z-index: 10;
                }
                
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .video-error {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    color: #dc3545;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 20px;
                    border-radius: 8px;
                    z-index: 10;
                }
                
                .video-container {
                    position: relative;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Ensure container has relative positioning
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
        container.classList.add('video-container');
        
        video.loadingIndicator = loadingDiv;
        container.appendChild(loadingDiv);
    }

    setupErrorHandling(video) {
        const handleError = () => {
            this.handleVideoError(video);
        };

        const handleLoad = () => {
            this.handleVideoLoad(video);
        };

        video.addEventListener('error', handleError);
        video.addEventListener('loadeddata', handleLoad);
        video.addEventListener('canplay', handleLoad);
        
        // Timeout fallback
        setTimeout(() => {
            if (!this.loadedVideos.has(video) && !this.failedVideos.has(video)) {
                console.warn('Video loading timeout:', video.src);
                this.handleVideoError(video);
            }
        }, 10000); // 10 second timeout
    }

    loadVideo(video) {
        if (this.loadedVideos.has(video) || this.failedVideos.has(video)) {
            return;
        }

        // If video has a source, try to load it
        if (video.src || video.querySelector('source')) {
            video.load();
        }
    }

    handleVideoLoad(video) {
        this.loadedVideos.add(video);
        
        // Remove loading indicator
        if (video.loadingIndicator) {
            video.loadingIndicator.remove();
        }
        
        // Show video
        video.style.opacity = '1';
        
        console.log('Video loaded successfully:', video.src);
    }

    handleVideoError(video) {
        this.failedVideos.add(video);
        
        // Remove loading indicator
        if (video.loadingIndicator) {
            video.loadingIndicator.remove();
        }
        
        console.warn('Video failed to load:', video.src);
    }



    // Public method to retry failed videos
    retryFailedVideos() {
        this.failedVideos.forEach(video => {
            this.failedVideos.delete(video);
            this.processVideo(video);
        });
    }

    // Public method to get loading statistics
    getStats() {
        return {
            loaded: this.loadedVideos.size,
            failed: this.failedVideos.size,
            total: this.loadedVideos.size + this.failedVideos.size
        };
    }
}

// Initialize video loader
const videoLoader = new VideoLoader();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoLoader;
}

// Make available globally
window.VideoLoader = VideoLoader;window.videoLoader = videoLoader;
