// Gamification Tabs Functionality
function initializeGamificationTabs() {
    const tabControllers = document.querySelectorAll('.tab-controller');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabControllers.length === 0 || tabContents.length === 0) return;
    
    function switchTab(targetTab) {
        // Remove active state from all controllers and contents
        tabControllers.forEach(controller => {
            controller.setAttribute('data-active', 'false');
        });
        
        tabContents.forEach(content => {
            content.setAttribute('data-active', 'false');
        });
        
        // Add active state to target controller
        const targetController = document.querySelector(`[data-tab="${targetTab}"]`);
        if (targetController) {
            targetController.setAttribute('data-active', 'true');
        }
        
        // Add active state to target content
        const targetContent = document.querySelector(`.tab-content[data-tab="${targetTab}"]`);
        if (targetContent) {
            targetContent.setAttribute('data-active', 'true');
            
            // Replay video when tab is selected
            const video = targetContent.querySelector(`[data-gamification-video="${targetTab}"]`);
            if (video) {
                video.currentTime = 0;
                video.play().catch(e => {
                    // Handle autoplay restrictions gracefully
                    console.log('Video autoplay prevented:', e);
                });
            }
        }
    }
    
    // Add click event listeners to tab controllers
    tabControllers.forEach(controller => {
        controller.addEventListener('click', () => {
            const tabName = controller.getAttribute('data-tab');
            if (tabName) {
                switchTab(tabName);
            }
        });
        
        // Optional: Add hover functionality for better UX
        controller.addEventListener('mouseenter', () => {
            const tabName = controller.getAttribute('data-tab');
            if (tabName) {
                switchTab(tabName);
            }
        });
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGamificationTabs);
} else {
    initializeGamificationTabs();
}