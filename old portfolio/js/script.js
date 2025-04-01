const searchElement = document.querySelector('.search');
const dropDownOptions = document.querySelector('.drop-down-options');
const selectedOption = document.querySelector('.selected');
const options = document.querySelectorAll('.options');
const dealtCardsContainer = document.getElementById('dealtCardsContainer');
const dropDownIcon = document.querySelector('.drop_down_icon');
const search = document.querySelector('.search');
const originalCard = document.getElementById('originalCard');
const portfolioCards = document.querySelectorAll('.portfolio-cards');

const maxColumns = 5;
let currentColumn = 0;
let currentRow = 0;


searchElement.addEventListener('click', () => {
    dropDownIcon.classList.toggle('rotate');
    dropDownOptions.classList.toggle('show');
    if (!dropDownOptions.classList.contains('show')) {
        dropDownOptions.style.animationName = 'fade_reverse, slide_reverse';
        search.style = 'border-bottom: black 3px solid';
    } else {
        dropDownOptions.style.animationName = 'fade, slide';
    }
});

function dealCards(selectedClass) {
    currentColumn = 0;
    currentRow = 0;
    dealtCardsContainer.innerHTML = '';

    // Convert NodeList to Array and filter based on selectedClass
    let cardsToDeal = Array.from(portfolioCards).filter(card => 
        selectedClass === 'all' || card.classList.contains(selectedClass)
    );

    // Shuffle the array of cards
    for (let i = cardsToDeal.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsToDeal[i], cardsToDeal[j]] = [cardsToDeal[j], cardsToDeal[i]];
    }

    cardsToDeal.forEach(function(card, index) {
        const dealtCard = card.cloneNode(true);
        dealtCard.classList.add('dealt-card');
        dealtCard.style.display = 'block';

        const originalCardRect = originalCard.getBoundingClientRect();
        const originalCardLeft = originalCardRect.left;
        const originalCardTop = originalCardRect.top;

        dealtCard.style.backgroundImage = `url(${originalCard.src})`;
        dealtCard.style.backgroundSize = 'cover';
        dealtCard.style.backgroundPosition = 'center';
        dealtCard.style.backgroundRepeat = 'no-repeat';
        dealtCard.style.transform = `translateX(${originalCardLeft}px) translateY(${originalCardTop}px) scale(0.3)`;

        setTimeout(() => {
            dealtCardsContainer.appendChild(dealtCard);
            // Add the location of where the card was before dealt
            dealtCard.style.transform = `translateX(${originalCardLeft-90}px) translateY(${originalCardTop-2400}px) scale(0.3) rotateY(180deg)`;
            dealtCard.style.transitionDelay = `${index * 0.1}s`;
        }, 300);

        setTimeout(() => {
            dealtCard.style.backgroundImage = 'none';
            applyAutoHoverEffect(dealtCard);
            dealtCard.classList.add('in-slot');
        }, 500 + (index * 200));

        currentColumn++;
        if (currentColumn === maxColumns) {
            currentColumn = 0;
            currentRow++;
        }
    });

    setTimeout(() => {
        addHoverEffectToCards();
    }, 500 + (cardsToDeal.length * 200));
}

function returnCards() {
    const dealtCards = document.querySelectorAll('.dealt-card');
    const originalCardRect = originalCard.getBoundingClientRect();
    const originalCardLeft = originalCardRect.left;
    const originalCardTop = originalCardRect.top;

    dealtCards.forEach((card, index) => {
        card.removeEventListener('mousemove', handleCardHover);
        card.removeEventListener('mouseleave', handleCardLeave);

        setTimeout(() => {
            card.style.transition = 'transform 0.5s';
            card.style.transform = `translate(${originalCardLeft - card.offsetLeft}px, ${originalCardTop - card.offsetTop}px) scale(0.01)`;
            setTimeout(() => {
                card.remove();
            }, 500);
        }, index * 100);
    });
}

function applyAutoHoverEffect(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = (Math.random() - 0.5) * 5;
    const rotateY = (Math.random() - 0.5) * 5;

    card.style.transition = 'transform 0.3s';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    setTimeout(() => {
        card.style.transition = 'transform 0.5s';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }, 300);
}

originalCard.addEventListener('click', function() {
    const selectedClass = selectedOption.classList[2];
    originalCard.classList.add('animate');
    setTimeout(() => {
        originalCard.classList.remove('animate');
    }, 500);

    const dealtCards = dealtCardsContainer.querySelectorAll('.dealt-card');
    dealtCards.forEach(card => {
        card.style.transition = 'transform 0.5s';
        card.style.transform = 'scale(0)';
    });

    setTimeout(() => {
        dealtCardsContainer.innerHTML = '';
        dealCards(selectedClass);
    }, 500);
});

options.forEach(option => {
    option.addEventListener('click', () => {
        const selectedClass = option.dataset.sort.slice(1);
        selectedOption.textContent = option.textContent;
        selectedOption.classList.remove(...selectedOption.classList);
        selectedOption.classList.add('options', 'selected', selectedClass);
        dropDownIcon.classList.toggle('rotate');
        dropDownOptions.classList.toggle('show');
        dropDownOptions.style.animationName = 'fade_reverse, slide_reverse';

        returnCards();
        setTimeout(() => {
            dealCards(selectedClass);
        }, 300); // Adjust this delay if needed to match the retraction animation
    });
});

document.addEventListener('click', (event) => {
    const target = event.target;
    if (!dropDownOptions.contains(target) && !searchElement.contains(target)) {
        dropDownIcon.classList.remove('rotate');
        dropDownOptions.classList.remove('show');
        dropDownOptions.style.animationName = 'fade_reverse, slide_reverse';
        search.style = 'border-bottom: black 3px solid';
    }
});

function addHoverEffectToCards() {
    const dealtCards = dealtCardsContainer.querySelectorAll('.dealt-card');
    dealtCards.forEach(card => {
        card.addEventListener('mousemove', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
}

function handleCardHover(e) {
    if (this.classList.contains('enlarged')) return;

    const rect = this.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxRotation = 5; // Maximum rotation in degrees
    const rotateX = (mouseY / (rect.height / 2)) * -maxRotation;
    const rotateY = (mouseX / (rect.width / 2)) * maxRotation;

    this.style.transition = 'transform 0.1s ease-out';
    requestAnimationFrame(() => {
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
}

function handleCardLeave() {
    this.style.transition = 'transform 0.3s ease-out';
    requestAnimationFrame(() => {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

function addHoverEffectToCards() {
    const dealtCards = dealtCardsContainer.querySelectorAll('.dealt-card');
    dealtCards.forEach(card => {
        card.addEventListener('mousemove', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
}

function resetCardTransform(card) {
    card.style.transition = 'transform 0.3s ease-out';
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

dealtCardsContainer.addEventListener('click', function (e) {
    const clickedCard = e.target.closest('.dealt-card');
    if (clickedCard) {
        if (!clickedCard.classList.contains('enlarged')) {
            // Reset the card's transform before enlarging
            resetCardTransform(clickedCard);

            // Small delay to ensure the reset is applied before enlarging
            setTimeout(() => {
                clickedCard.classList.add('enlarged');
                const overlay = document.createElement('div');
                overlay.classList.add('overlay');
                document.body.appendChild(overlay);
                overlay.addEventListener('click', function () {
                    clickedCard.classList.remove('enlarged');
                    overlay.remove();
                    const closeButton = document.querySelector('.close-button');
                    if (closeButton) {
                        closeButton.remove();
                    }
                });

                // Create a close button for mobile devices
                const closeButton = document.createElement('button');
                closeButton.classList.add('close-button');
                closeButton.innerHTML = '&times;';
                closeButton.style.display = 'block'; // Ensure the button is visible
                closeButton.style.position = 'fixed'; // Fix position in viewport
                closeButton.style.zIndex = '1001'; // Ensure it's above the overlay
                closeButton.addEventListener('click', function() {
                    clickedCard.classList.remove('enlarged');
                    overlay.remove();
                    closeButton.remove();
                });
                document.body.appendChild(closeButton);

                // Push a new state to the browser history
                history.pushState({cardEnlarged: true}, '');
            }, 50);
        }
    }
});

// Add event listener for popstate (back button)
window.addEventListener('popstate', function(event) {
    const enlargedCard = document.querySelector('.dealt-card.enlarged');
    if (enlargedCard) {
        enlargedCard.classList.remove('enlarged');
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }
        const closeButton = document.querySelector('.close-button');
        if (closeButton) {
            closeButton.remove();
        }
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const selectedClass = selectedOption.classList[2] || 'all';

    // Add a slight delay before dealing cards
    setTimeout(() => {
        dealCards(selectedClass);
    }, 500); // 500ms delay
});