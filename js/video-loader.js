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
                
                .video-error.enhanced {
                    max-width: 300px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .video-error .error-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                
                .video-error .error-icon {
                    font-size: 24px;
                    margin: 0;
                }
                
                .video-error .error-title {
                    font-weight: bold;
                    margin: 0;
                    color: #dc3545;
                }
                
                .video-error .error-message {
                    font-size: 14px;
                    margin: 0;
                    color: #666;
                    line-height: 1.4;
                }
                
                .video-retry-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 15;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .video-retry-overlay:hover {
                    opacity: 1;
                }
                
                .video-retry-overlay .retry-content {
                    text-align: center;
                    color: white;
                    background: rgba(0, 0, 0, 0.8);
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 250px;
                }
                
                .video-retry-overlay .retry-icon {
                    font-size: 32px;
                    margin-bottom: 10px;
                    animation: rotate 2s linear infinite;
                }
                
                .video-retry-overlay .retry-message {
                    font-size: 14px;
                    margin: 10px 0;
                    line-height: 1.4;
                }
                
                .retry-button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s ease;
                }
                
                .retry-button:hover {
                    background: #0056b3;
                }
                
                .retry-button:active {
                    transform: translateY(1px);
                }
                
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
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
        
        // Determine error type for better user feedback
        const errorType = this.determineErrorType(video);
        
        // Show fallback image with enhanced error info
        this.showFallbackImage(video, errorType);
        
        console.warn('Video failed to load, showing fallback:', video.src, 'Error type:', errorType);
    }

    determineErrorType(video) {
        // Check network connectivity
        if (!navigator.onLine) {
            return 'network';
        }
        
        // Check if it's a CORS issue
        if (video.error && video.error.code === video.error.MEDIA_ERR_NETWORK) {
            return 'network';
        }
        
        // Check if it's a format issue
        if (video.error && video.error.code === video.error.MEDIA_ERR_SRC_NOT_SUPPORTED) {
            return 'format';
        }
        
        // Check if it's a decode issue
        if (video.error && video.error.code === video.error.MEDIA_ERR_DECODE) {
            return 'decode';
        }
        
        // Default to generic error
        return 'generic';
    }

    showFallbackImage(video, errorType = 'generic') {
        const container = video.parentElement;
        
        // Try to find fallback image in video element
        let fallbackImg = video.querySelector('img');
        
        if (!fallbackImg && video.poster) {
            // Create fallback from poster
            fallbackImg = document.createElement('img');
            fallbackImg.src = video.poster;
            fallbackImg.alt = video.querySelector('img')?.alt || 'Video fallback image';
            fallbackImg.className = video.className;
        }
        
        if (fallbackImg) {
            // Clone the fallback image and show it
            const displayImg = fallbackImg.cloneNode(true);
            displayImg.style.display = 'block';
            displayImg.style.width = '100%';
            displayImg.style.height = '100%';
            displayImg.style.objectFit = 'cover';
            
            // Hide video and show fallback
            video.style.display = 'none';
            container.appendChild(displayImg);
            
            // Add retry overlay for fallback images
            this.addRetryOverlay(container, video, errorType);
        } else {
            // Show enhanced error message if no fallback available
            this.showErrorMessage(container, video, errorType);
        }
    }

    addRetryOverlay(container, video, errorType) {
        const overlay = document.createElement('div');
        overlay.className = 'video-retry-overlay';
        overlay.innerHTML = `
            <div class="retry-content">
                <div class="retry-icon">🔄</div>
                <p class="retry-message">${this.getErrorMessage(errorType)}</p>
                <button class="retry-button" data-video-src="${video.src}">Try Again</button>
            </div>
        `;
        
        // Add click handler for retry
        const retryButton = overlay.querySelector('.retry-button');
        retryButton.addEventListener('click', () => {
            this.retryVideo(video, overlay);
        });
        
        container.appendChild(overlay);
    }

    showErrorMessage(container, video, errorType) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error enhanced';
        errorDiv.innerHTML = `
            <div class="error-content">
                <p class="error-icon">⚠️</p>
                <p class="error-title">Video Unavailable</p>
                <p class="error-message">${this.getErrorMessage(errorType)}</p>
                <button class="retry-button" data-video-src="${video.src}">Try Again</button>
            </div>
        `;
        
        // Add click handler for retry
        const retryButton = errorDiv.querySelector('.retry-button');
        retryButton.addEventListener('click', () => {
            this.retryVideo(video, errorDiv);
        });
        
        container.appendChild(errorDiv);
    }

    getErrorMessage(errorType) {
        const messages = {
            network: 'Network connection issue. Please check your internet connection.',
            format: 'Video format not supported by your browser.',
            decode: 'Video file appears to be corrupted or incomplete.',
            generic: 'Content could not be loaded. This might be a temporary issue.'
        };
        
        return messages[errorType] || messages.generic;
    }

    // Network connectivity detection
    checkNetworkConnectivity() {
        return new Promise((resolve) => {
            // Check if navigator.onLine is available
            if (!navigator.onLine) {
                resolve(false);
                return;
            }
            
            // Try to fetch a small resource to verify actual connectivity
            const timeout = 5000; // 5 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            fetch('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', {
                method: 'HEAD',
                signal: controller.signal,
                cache: 'no-cache'
            })
            .then(() => {
                clearTimeout(timeoutId);
                resolve(true);
            })
            .catch(() => {
                clearTimeout(timeoutId);
                resolve(false);
            });
        });
    }

    // Enhanced retry with network check
    async retryVideo(video, errorElement) {
        const container = video.parentElement;
        const retryOverlay = container.querySelector('.video-retry-overlay');
        
        // Show loading state
        if (retryOverlay) {
            const retryIcon = retryOverlay.querySelector('.retry-icon');
            const retryMessage = retryOverlay.querySelector('.retry-message');
            const retryButton = retryOverlay.querySelector('.retry-button');
            
            if (retryIcon) retryIcon.textContent = '🔄';
            if (retryMessage) retryMessage.textContent = 'Checking connection...';
            if (retryButton) retryButton.disabled = true;
        }
        
        // Check network connectivity first
        const isOnline = await this.checkNetworkConnectivity();
        
        if (!isOnline) {
            // Update UI to show offline state
            if (retryOverlay) {
                const retryIcon = retryOverlay.querySelector('.retry-icon');
                const retryMessage = retryOverlay.querySelector('.retry-message');
                const retryButton = retryOverlay.querySelector('.retry-button');
                
                if (retryIcon) retryIcon.textContent = '📡';
                if (retryMessage) retryMessage.textContent = 'No internet connection. Please check your network and try again.';
                if (retryButton) {
                    retryButton.disabled = false;
                    retryButton.textContent = 'Check Again';
                }
            }
            return;
        }
        
        // Remove from failed videos set
        this.failedVideos.delete(video);
        
        // Remove error element
        errorElement.remove();
        
        // Show video again
        video.style.display = 'block';
        
        // Add loading state
        this.addLoadingState(video);
        
        // Try to load video again
        video.load();
        
        console.log('Retrying video load:', video.src);
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

// Global instance - only create if one doesn't exist
if (typeof window.videoLoader === 'undefined') {
    const videoLoader = new VideoLoader();
    window.videoLoader = videoLoader;
}

// Module exports for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoLoader;
}

// Make VideoLoader class available globally
window.VideoLoader = VideoLoader;