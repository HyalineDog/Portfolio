/**
 * Universal Insight Hover System
 * Handles insight card interactions across all portfolio pages
 * Supports: Notetaking App, Student Pad, Classroom Platform
 */

class InsightHoverSystem {
    constructor(config) {
        this.quoteMap = config.quoteMap;
        this.pageType = config.pageType;
        this.selectors = config.selectors || {
            insightCards: '.insight-item',
            teacherQuote: '#teacher-quote',
            problemSummary: '#problem-summary',
            summaryCards: '.summary-card'
        };
        this.currentlySelected = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the insight hover system
     */
    init() {
        if (this.isInitialized) {
            console.log('InsightHoverSystem already initialized');
            return;
        }

        console.log(`Initializing InsightHoverSystem for ${this.pageType} page`);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    /**
     * Set up event listeners for insight cards
     */
    setupEventListeners() {
        const insightCards = document.querySelectorAll(this.selectors.insightCards);
        const teacherQuote = document.getElementById('teacher-quote');
        const problemSummary = document.getElementById('problem-summary');

        console.log(`Found ${insightCards.length} insight cards`);
        console.log('Teacher quote element:', !!teacherQuote);
        console.log('Problem summary element:', !!problemSummary);

        if (insightCards.length === 0) {
            console.warn('No insight cards found');
            return;
        }

        if (!teacherQuote || !problemSummary) {
            console.warn('Required elements not found:', {
                teacherQuote: !!teacherQuote,
                problemSummary: !!problemSummary
            });
            return;
        }

        // Add event listeners to each insight card
        insightCards.forEach((card, index) => {
            const insightType = card.getAttribute('data-insight');
            console.log(`Setting up card ${index}: ${insightType}`);

            // Mouse enter event for hover effect
            card.addEventListener('mouseenter', () => {
                console.log(`Hovering over: ${insightType}`);
                this.selectInsight(card);
            });

            // Click event for selection
            card.addEventListener('click', () => {
                console.log(`Clicked: ${insightType}`);
                this.selectInsight(card);
            });
        });

        // Select the first card by default
        if (insightCards.length > 0) {
            this.selectInsight(insightCards[0]);
        }

        this.isInitialized = true;
        console.log(`InsightHoverSystem initialized successfully for ${this.pageType}`);
    }

    /**
     * Select an insight card and update the display
     */
    selectInsight(card) {
        const insightCards = document.querySelectorAll(this.selectors.insightCards);
        const summaryCards = document.querySelectorAll(this.selectors.summaryCards);
        const teacherQuote = document.getElementById('teacher-quote');
        const problemSummary = document.getElementById('problem-summary');

        // Remove selected class from all insight cards
        insightCards.forEach(c => c.classList.remove('selected'));
        
        // Remove highlighted class from all summary cards
        summaryCards.forEach(c => c.classList.remove('highlighted'));

        // Add selected class to the current card
        card.classList.add('selected');
        this.currentlySelected = card;

        // Get the insight type
        const insightType = card.getAttribute('data-insight');
        
        // Highlight corresponding summary card if it exists
        const correspondingSummaryCard = document.querySelector(`[data-summary="${insightType}"]`);
        if (correspondingSummaryCard) {
            correspondingSummaryCard.classList.add('highlighted');
        }

        // Update content if quote data exists
        if (this.quoteMap[insightType]) {
            this.updateContent(insightType, teacherQuote, problemSummary);
        } else {
            console.warn(`No quote data found for insight type: ${insightType}`);
        }
    }

    /**
     * Update the problem summary and teacher quote content
     */
    updateContent(insightType, teacherQuote, problemSummary) {
        const quoteData = this.quoteMap[insightType];
        
        // Update problem summary
        const problemNumber = problemSummary.querySelector('.problem-number');
        const problemText = problemSummary.querySelector('.problem-text');
        
        if (problemNumber && problemText) {
            problemNumber.textContent = quoteData.No;
            problemText.textContent = quoteData.problem;
        }

        // Update teacher quote
        const blockquote = teacherQuote.querySelector('blockquote');
        const cite = teacherQuote.querySelector('cite');
        
        if (blockquote && cite) {
            blockquote.textContent = quoteData.quote;
            cite.textContent = quoteData.author;
        }
    }

    /**
     * Factory method to create system for specific pages
     */
    static createForPage(pageType) {
        const configs = {
            'notetaking': {
                pageType: 'notetaking',
                quoteMap: {
                    'processing': {
                        No: ".01",
                        problem: "Students weren't failing because they couldn't capture information—they were failing because no one had taught them how to process it.",
                        quote: "When I look back at my notes later, I can't even make sense of what I wrote. It's like I was writing for someone else.",
                        author: "Grade 10 Student, Hefei"
                    },
                    'strategies': {
                        No: ".02",
                        problem: "High-performing students had discovered effective strategies but kept them to themselves",
                        quote: "I learned a structured method from my cousin who goes to a top university, but I never shared it with my classmates. I thought everyone already knew how to take good notes.",
                        author: "Grade 11 Student, Hefei"
                    },
                    'subjects': {
                        No: ".03",
                        problem: "One-size-fits-all approach ignored the unique demands of different disciplines",
                        quote: "Taking notes for physics is completely different from Chinese literature class. I need space for formulas and diagrams, but the app just gives me blank pages like I'm writing a composition.",
                        author: "Grade 9 Student, Shanghai"
                    },
                    'community': {
                        No: ".04",
                        problem: "Students wanted to learn from each other but had no platform for sharing strategies",
                        quote: "I always notice how neat and organized my deskmate's notes are, especially her use of colors and symbols. I want to ask her method, but it feels awkward. There should be a way for us to share good study techniques.",
                        author: "Grade 8 Student, Guangzhou"
                    }
                }
            },
            'studentpad': {
                pageType: 'studentpad',
                quoteMap: {
                    'motivation': {
                        No: ".01",
                        problem: "Students struggle with independent learning without teacher guidance",
                        quote: "I know I should be studying, but when there's no assignment due, I just don't know where to start or what to focus on.",
                        author: "9th Grade Student, Hefei"
                    },
                    'skepticism': {
                        No: ".02",
                        problem: "Teachers questioned technology's educational value in classroom settings",
                        quote: "These look just like iPads to them. If I let them have free access, they'd treat them like gaming devices instead of learning tools.",
                        author: "Elementary Teacher, Hefei"
                    },
                    'balance': {
                        No: ".03",
                        problem: "Parents view all screen as entertainment",
                        quote: "My parents don't like me using screens too much. They think I'm playing games even when I'm doing homework.",
                        author: "Hefei Fourteenth High School Freshman"
                    },
                    'rewards': {
                        No: ".04",
                        problem: "Visual customization motivated learning without creating dependency",
                        quote: "I like earning new avatars and themes when I complete my study goals. It makes me want to keep learning, but I don't feel like I have to use it all the time.",
                        author: "7th Grade Student, Beijing"
                    }
                }
            },
            'classroom': {
                pageType: 'classroom',
                quoteMap: {
                    'apps': {
                        No: ".01",
                        problem: "Application overload disrupts current learning flow",
                        quote: "I start with PowerPoint, then switch to the textbook app, then open the activity platform, then back to PowerPoint. My students lose focus every time I'm fumbling with technology instead of teaching.",
                        author: "Middle School Science Teacher"
                    },
                    'time': {
                        No: ".02",
                        problem: "Inefficient resource management drains productivity",
                        quote: "I spend my entire Sunday searching for resources that match our curriculum, then another few hours during the week adapting them to fit our lesson plans. It's exhausting.",
                        author: "High School Math Teacher"
                    },
                    'adoption': {
                        No: ".03",
                        problem: "Resistance to change due to tool's learning cost",
                        quote: "Sure, I know there are probably better tools out there, but learning a new system means weeks of preparation time I don't have. I'll stick with what I know, even if it's frustrating.",
                        author: "Elementary School Teacher"
                    },
                    'controls': {
                        No: ".04",
                        problem: "Poor smartboard interaction hinders classroom engagement",
                        quote: "When I have to turn my back to the students to click something on the computer, I immediately lose their attention. The controls need to be where I can reach them while still facing my class.",
                        author: "High School English Teacher"
                    }
                }
            }
        };

        if (!configs[pageType]) {
            console.error(`Unknown page type: ${pageType}`);
            return null;
        }

        return new InsightHoverSystem(configs[pageType]);
    }

    /**
     * Auto-detect page type and initialize
     */
    static autoInit() {
        const pathname = window.location.pathname.toLowerCase();
        const title = document.title.toLowerCase();
        
        let pageType = null;
        
        if (pathname.includes('notetaking') || title.includes('notetaking')) {
            pageType = 'notetaking';
        } else if (pathname.includes('student') && pathname.includes('pad')) {
            pageType = 'studentpad';
        } else if (pathname.includes('classroom') || pathname.includes('zhike')) {
            pageType = 'classroom';
        }
        
        if (pageType) {
            console.log(`Auto-detected page type: ${pageType}`);
            const system = InsightHoverSystem.createForPage(pageType);
            if (system) {
                system.init();
                return system;
            }
        } else {
            console.log('No matching page type found for insight hover system');
        }
        
        return null;
    }
}

// Global test function for debugging
window.testInsightHover = function() {
    console.log('=== Insight Hover System Debug ===');
    console.log('Page URL:', window.location.href);
    console.log('Page Title:', document.title);
    
    const insightCards = document.querySelectorAll('.insight-item');
    console.log(`Found ${insightCards.length} insight cards:`);
    insightCards.forEach((card, index) => {
        console.log(`  Card ${index}: ${card.getAttribute('data-insight')}`);
    });
    
    const teacherQuote = document.getElementById('teacher-quote');
    const problemSummary = document.getElementById('problem-summary');
    console.log('Required elements:', {
        teacherQuote: !!teacherQuote,
        problemSummary: !!problemSummary
    });
    
    // Try auto-initialization
    const system = InsightHoverSystem.autoInit();
    if (system) {
        console.log('System initialized successfully');
    } else {
        console.log('Failed to initialize system');
    }
};

// Auto-initialize when script loads
InsightHoverSystem.autoInit();