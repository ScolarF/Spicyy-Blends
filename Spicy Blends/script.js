// ====================================
// SPICY BLENDS - INTERACTIVE FEATURES
// ====================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ====================================
    // PARALLAX SCROLLING EFFECT
    // ====================================
    const floatingElements = document.querySelectorAll('.floating-spice');

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;

        floatingElements.forEach(element => {
            const speed = element.dataset.speed || 1;
            const yPos = -(scrolled * speed / 10);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });


    // ====================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ====================================
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only smooth scroll for anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // ====================================
    // PRICE CARD INTERACTIONS
    // ====================================
    const priceCards = document.querySelectorAll('.price-card');

    priceCards.forEach(card => {
        // Add click effect
        card.addEventListener('click', function () {
            // Small pulse animation
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 150);
        });

        // Enhanced hover tracking for cursor-based invert effect
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Optional: Add subtle rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });


    // ====================================
    // INTERSECTION OBSERVER FOR FADE-IN
    // ====================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe pricing cards for staggered fade-in
    priceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });


    // ====================================
    // GRAIN ANIMATION RANDOMIZATION
    // ====================================
    const grainOverlay = document.querySelector('.grain-overlay');

    // Add random grain patterns
    setInterval(() => {
        const randomOpacity = 0.1 + Math.random() * 0.1;
        grainOverlay.style.opacity = randomOpacity;
    }, 100);


    // ====================================
    // HEADER BACKGROUND ON SCROLL
    // ====================================
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
            header.style.boxShadow = 'none';
        }
    });


    // ====================================
    // CONSOLE EASTER EGG
    // ====================================
    console.log('%c🌶️ Spicy Blends', 'font-size: 24px; font-weight: bold; color: #F0F0F0; background: #050505; padding: 10px;');
    console.log('%cاكتشف النكهة - Explore the Flavor', 'font-size: 14px; color: #F0F0F0;');
    console.log('%cWebsite crafted with love and spices ✨', 'font-size: 12px; color: #999;');


    // ====================================
    // SEARCH & CATEGORY FILTERING
    // ====================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('spice-search');

    let currentCategory = 'all';
    let currentSearchTerm = '';

    function filterCards() {
        priceCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.spice-name').textContent.toLowerCase();
            const cardTitleEn = card.querySelector('.spice-name-en').textContent.toLowerCase();
            const cardDesc = card.querySelector('.description').textContent.toLowerCase();

            const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
            const matchesSearch = cardTitle.includes(currentSearchTerm) ||
                cardTitleEn.includes(currentSearchTerm) ||
                cardDesc.includes(currentSearchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                // Fade in animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Category Button Click
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update current category
            currentCategory = this.getAttribute('data-category');

            // Apply filter
            filterCards();
        });
    });

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            filterCards();
        });
    }

    // ====================================
    // SHOPPING CART FUNCTIONALITY
    // ====================================
    const cart = [];
    const weightModal = document.getElementById('weight-modal');
    const cartModal = document.getElementById('cart-modal');
    const cartFab = document.getElementById('cart-fab');
    const cartCount = document.getElementById('cart-count');
    const closeModal = document.querySelector('.close-modal');
    const closeCart = document.querySelector('.close-cart');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const weightBtns = document.querySelectorAll('.weight-btn');
    const customWeightInput = document.getElementById('custom-weight-input');
    const cartItemsList = document.getElementById('cart-items');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const modalSpiceName = document.getElementById('modal-spice-name');

    let selectedSpice = null;
    let selectedWeight = null;

    // Open Weight Modal
    priceCards.forEach(card => {
        card.addEventListener('click', function () {
            selectedSpice = this.querySelector('.spice-name').textContent;
            modalSpiceName.textContent = selectedSpice;
            weightModal.classList.add('show');

            // Reset selection
            selectedWeight = null;
            weightBtns.forEach(btn => btn.classList.remove('selected'));
            customWeightInput.value = '';
        });
    });

    // Close Modals
    function closeAllModals() {
        weightModal.classList.remove('show');
        cartModal.classList.remove('show');
    }

    if (closeModal) closeModal.addEventListener('click', closeAllModals);
    if (closeCart) closeCart.addEventListener('click', closeAllModals);

    window.addEventListener('click', (e) => {
        if (e.target === weightModal || e.target === cartModal) {
            closeAllModals();
        }
    });

    // Weight Selection
    weightBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            weightBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedWeight = this.dataset.weight;
            customWeightInput.value = ''; // Clear custom input
        });
    });

    if (customWeightInput) {
        customWeightInput.addEventListener('input', function () {
            if (this.value) {
                weightBtns.forEach(b => b.classList.remove('selected'));
                selectedWeight = this.value;
            }
        });
    }

    // Add to Cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            if (!selectedSpice || !selectedWeight) {
                alert('الرجاء اختيار الوزن');
                return;
            }

            const item = {
                id: Date.now(),
                name: selectedSpice,
                weight: selectedWeight
            };

            cart.push(item);
            updateCartUI();
            closeAllModals();

            // Animation for FAB
            cartFab.classList.add('cart-bump');
            setTimeout(() => cartFab.classList.remove('cart-bump'), 300);
        });
    }

    // Update Cart UI
    function updateCartUI() {
        if (cartCount) cartCount.textContent = cart.length;

        // Update Cart List
        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            if (cart.length === 0) {
                if (emptyCartMsg) emptyCartMsg.style.display = 'block';
            } else {
                if (emptyCartMsg) emptyCartMsg.style.display = 'none';
                cart.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'cart-item';
                    li.innerHTML = `
                        <div class="cart-item-details">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-weight">${item.weight} غرام</span>
                        </div>
                        <span class="cart-item-remove" onclick="removeCartItem(${item.id})">&times;</span>
                    `;
                    cartItemsList.appendChild(li);
                });
            }
        }
    }

    // Remove Item (Global function to be accessible from HTML onclick)
    window.removeCartItem = function (id) {
        const index = cart.findIndex(item => item.id === id);
        if (index > -1) {
            cart.splice(index, 1);
            updateCartUI();
        }
    };

    // Open Cart Modal
    if (cartFab) {
        cartFab.addEventListener('click', () => {
            cartModal.classList.add('show');
        });
    }

    // Clear Cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart.length = 0;
            updateCartUI();
        });
    }

    // Send to WhatsApp
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            let message = "مرحبا، أريد طلب التوابل التالية:%0a";
            cart.forEach(item => {
                message += `- ${item.name} (${item.weight} غرام)%0a`;
            });

            const phoneNumber = "96181079758";
            const url = `https://wa.me/${phoneNumber}?text=${message}`;

            window.open(url, '_blank');
        });
    }

});
