// === INICIALIZAÇÃO OTIMIZADA COM PERFORMANCE MELHORADA V3 ===
(function() {
    'use strict';
    
    // Aguarda o DOM estar pronto
    document.addEventListener('DOMContentLoaded', function() {
        // Garante visibilidade inicial
        ensureTextVisibility();
        
        // Inicializa o carrossel de imagens (independente de libs)
        initializeImageCarousels();
        
        // Verifica bibliotecas e inicializa animações avançadas com um pequeno delay
        setTimeout(checkLibrariesAndInitialize, 100);
    });

    function ensureTextVisibility() {
        // Esta função pode ser removida se as animações forem tratadas puramente por JS/GSAP
        // ou mantida como um fallback de segurança.
        const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .cta-container');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }

    function isLibraryLoaded(libName) {
        return typeof window[libName] !== 'undefined';
    }

    function safeExecute(fn, errorMsg) {
        try { return fn(); } 
        catch (error) { console.warn(errorMsg, error); return false; }
    }

    function checkLibrariesAndInitialize() {
        if (isLibraryLoaded('gsap') && isLibraryLoaded('SplitType')) {
            initializeAnimations();
        } else {
            console.warn('Bibliotecas de animação (GSAP, SplitType) não carregadas. As animações avançadas não funcionarão.');
        }
    }
    
    // === ANIMAÇÕES OTIMIZADAS COM GSAP E SCROLLTRIGGER ===
    function initializeAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animação de entrada do Hero
        const heroTitle = new SplitType('.hero-title', { types: 'words' });
        gsap.from(heroTitle.words, {
            yPercent: 100,
            opacity: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from('.hero-subtitle, .cta-container', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.3
        });

        // Animação de elementos ao entrarem na tela (Scroll)
        const animatedElements = document.querySelectorAll(
            '.section-title, .service-card, .project-item, .testimonial-card'
        );

        animatedElements.forEach(element => {
            ScrollTrigger.create({
                trigger: element,
                start: 'top 85%',
                onEnter: () => element.classList.add('is-visible'),
                once: true
            });
        });
    }

    // === CARROSSEL DE IMAGENS ===
    function initializeImageCarousels() {
        document.querySelectorAll('.image-carousel').forEach(carousel => {
            const cards = Array.from(carousel.querySelectorAll('.image-card'));
            const prevBtn = carousel.querySelector('.carousel-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-btn.next');
            const indicators = Array.from(carousel.querySelectorAll('.indicator'));
            if (cards.length <= 1) { // Se não houver imagens ou apenas uma, esconde os controles
                if (carousel.querySelector('.carousel-controls')) {
                   carousel.querySelector('.carousel-controls').style.display = 'none';
                }
                return;
            }

            let currentIndex = 0;
            let isTransitioning = false;

            function updateCarousel(newIndex, isInstant = false) {
                if (isTransitioning) return;
                isTransitioning = true;
                
                currentIndex = (newIndex + cards.length) % cards.length;
                
                cards.forEach((card, index) => {
                    card.classList.remove('active', 'prev', 'next');
                    if(index === currentIndex) card.classList.add('active');
                });

                const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
                const nextIndex = (currentIndex + 1) % cards.length;
                
                if(cards[prevIndex]) cards[prevIndex].classList.add('prev');
                if(cards[nextIndex]) cards[nextIndex].classList.add('next');
                
                indicators.forEach((ind, index) => {
                    ind.classList.toggle('active', index === currentIndex);
                });

                setTimeout(() => {
                    isTransitioning = false;
                }, isInstant ? 50 : 600); // Tempo de transição mais curto se for instantâneo
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateCarousel(currentIndex + 1);
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateCarousel(currentIndex - 1);
                });
            }
            
            indicators.forEach((indicator) => {
                indicator.addEventListener('click', (e) => {
                    e.preventDefault();
                    const slideIndex = parseInt(e.currentTarget.dataset.slide, 10);
                    updateCarousel(slideIndex);
                });
            });

            // Suporte a swipe para mobile
            let touchStartX = 0;
            const minSwipeDistance = 50;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const swipeDistance = touchStartX - touchEndX;
                
                if (Math.abs(swipeDistance) > minSwipeDistance) {
                    if (swipeDistance > 0) { // Swipe para a esquerda
                        updateCarousel(currentIndex + 1);
                    } else { // Swipe para a direita
                        updateCarousel(currentIndex - 1);
                    }
                }
            }, { passive: true });

            updateCarousel(0, true);
        });
    }

})();