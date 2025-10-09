/**
 * Video Last Frame Extractor
 * Extracts the last frame of a video and uses it as a poster image
 */

class VideoFrameExtractor {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        // Hide the canvas
        this.canvas.style.display = 'none';
        document.body.appendChild(this.canvas);
    }

    /**
     * Extract the last frame from a video and set it as poster
     * @param {HTMLVideoElement} video - The video element
     * @returns {Promise<string>} - Data URL of the extracted frame
     */
    async extractLastFrame(video) {
        return new Promise((resolve, reject) => {
            // Create a temporary video element to avoid affecting the original
            const tempVideo = document.createElement('video');
            tempVideo.crossOrigin = 'anonymous';
            tempVideo.muted = true;
            tempVideo.style.display = 'none';
            document.body.appendChild(tempVideo);

            const cleanup = () => {
                document.body.removeChild(tempVideo);
            };

            tempVideo.addEventListener('loadedmetadata', () => {
                try {
                    // Set canvas dimensions to match video
                    this.canvas.width = tempVideo.videoWidth || 640;
                    this.canvas.height = tempVideo.videoHeight || 360;

                    // Seek to the last frame (duration - 0.1 seconds to ensure we get a valid frame)
                    const lastFrameTime = Math.max(0, tempVideo.duration - 0.1);
                    tempVideo.currentTime = lastFrameTime;
                } catch (error) {
                    cleanup();
                    reject(error);
                }
            });

            tempVideo.addEventListener('seeked', () => {
                try {
                    // Draw the current frame to canvas
                    this.context.drawImage(tempVideo, 0, 0, this.canvas.width, this.canvas.height);
                    
                    // Convert to data URL
                    const dataURL = this.canvas.toDataURL('image/jpeg', 0.8);
                    
                    cleanup();
                    resolve(dataURL);
                } catch (error) {
                    cleanup();
                    reject(error);
                }
            });

            tempVideo.addEventListener('error', (error) => {
                cleanup();
                reject(error);
            });

            // Copy source from original video
            if (video.src) {
                tempVideo.src = video.src;
            } else {
                const sources = video.querySelectorAll('source');
                sources.forEach(source => {
                    const newSource = document.createElement('source');
                    newSource.src = source.src;
                    newSource.type = source.type;
                    tempVideo.appendChild(newSource);
                });
            }

            tempVideo.load();
        });
    }

    /**
     * Process a video element to extract and set its last frame as poster
     * @param {HTMLVideoElement} video - The video element to process
     */
    async processVideo(video) {
        try {
            // Skip if video already has a custom poster or is already processed
            if (video.dataset.frameExtracted || video.poster) {
                return;
            }

            const lastFrameDataURL = await this.extractLastFrame(video);
            
            // Set the extracted frame as poster
            video.poster = lastFrameDataURL;
            video.dataset.frameExtracted = 'true';
            
            console.log('Last frame extracted and set as poster for video:', video.src);
        } catch (error) {
            console.warn('Failed to extract last frame for video:', video.src, error);
            
            // Fallback: use a default poster if available
            const fallbackImg = video.querySelector('img');
            if (fallbackImg && fallbackImg.src) {
                video.poster = fallbackImg.src;
            }
        }
    }

    /**
     * Process all videos on the page
     */
    processAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Only process videos that don't already have posters
            if (!video.poster || video.poster === '') {
                this.processVideo(video);
            }
        });
    }

    /**
     * Setup mutation observer to handle dynamically added videos
     */
    setupMutationObserver() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'VIDEO') {
                                this.processVideo(node);
                            } else if (node.querySelectorAll) {
                                const videos = node.querySelectorAll('video');
                                videos.forEach(video => this.processVideo(video));
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Initialize the frame extractor
     */
    init() {
        // Process existing videos when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.processAllVideos();
            });
        } else {
            this.processAllVideos();
        }

        // Setup observer for dynamic content
        this.setupMutationObserver();
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Create global instance
if (typeof window.videoFrameExtractor === 'undefined') {
    const videoFrameExtractor = new VideoFrameExtractor();
    window.videoFrameExtractor = videoFrameExtractor;
    
    // Auto-initialize
    videoFrameExtractor.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoFrameExtractor;
}

window.VideoFrameExtractor = VideoFrameExtractor;