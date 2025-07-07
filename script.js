// === INICIALIZAÇÃO OTIMIZADA COM PERFORMANCE MELHORADA V2 ===
(function() {
    'use strict';
    
    // Aguarda o DOM estar pronto
    document.addEventListener('DOMContentLoaded', function() {
        // Garante visibilidade inicial
        ensureTextVisibility();
        
        // Inicializa o carrossel de imagens (independente de libs)
        initializeImageCarousels();
        
        // Inicializa comportamento de scroll suave
      //  initializeScrollBehavior();
        
        // Verifica bibliotecas e inicializa animações avançadas com um pequeno delay
        setTimeout(checkLibrariesAndInitialize, 100);
    });

    function ensureTextVisibility() {
        const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .cta-container, .section-title, .project-content h3, .project-content p');
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
            console.log('Bibliotecas de animação carregadas. Iniciando...');
            initializeAnimations();
        } else {
            console.warn('Bibliotecas de animação (GSAP, SplitType) não carregadas.');
        }
    }

    // === SCROLL SUAVE OTIMIZADO ===
    function initializeScrollBehavior() {
        if (!isLibraryLoaded('Lenis')) return;
        safeExecute(() => {
            const lenis = new Lenis({
                lerp: 20.90, // Valor ajustado para maior suavidade
                smoothTouch: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            if (isLibraryLoaded('gsap') && isLibraryLoaded('ScrollTrigger')) {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => { lenis.raf(time * 1000); });
                gsap.ticker.lagSmoothing(0);
            }
        }, 'Erro ao inicializar Lenis');
    }
    
    // === ANIMAÇÕES OTIMIZADAS V3 (COM CLASSES CSS) ===
function initializeAnimations() {
    if (!isLibraryLoaded('gsap') || !isLibraryLoaded('ScrollTrigger')) return;

    gsap.registerPlugin(ScrollTrigger);

    // Seleciona todos os elementos que devem ser animados ao aparecer na tela
    const animatedElements = document.querySelectorAll(
        '.section-title, .service-card, .project-item, .testimonial-card'
    );

    animatedElements.forEach(element => {
        ScrollTrigger.create({
            trigger: element, // O elemento que dispara a animação
            start: 'top 85%', // Quando o topo do elemento atinge 85% da altura da tela
            onEnter: () => element.classList.add('is-visible'), // A única ação: adiciona a classe
            once: true // Garante que a animação aconteça apenas uma vez
        });
    });

    // A animação de entrada do site (Hero) pode ser mantida, pois só ocorre uma vez no carregamento.
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


        // ANIMAÇÃO DE TÍTULOS DE SEÇÃO (MUITO MAIS LEVE)
        document.querySelectorAll('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none none' },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // ANIMAÇÃO DOS PROJETOS (CORRIGIDA E MAIS LEVE)
        document.querySelectorAll('.project-item').forEach(item => {
            const image = item.querySelector('.project-image');
            const contentElements = item.querySelectorAll('.project-content > *');

            // Animação da IMAGEM: removido o opacity:0 para garantir que ela sempre apareça.
            // Apenas um efeito sutil de escala.
            gsap.from(image, {
                scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none none' },
                scale: 0.95, // Efeito de zoom sutil
                duration: 1.2,
                ease: 'expo.out'
            });

            // Animação do CONTEÚDO do projeto
            gsap.from(contentElements, {
                scrollTrigger: { trigger: item, start: 'top 75%', toggleActions: 'play none none none' },
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }

    // === CARROSSEL DE IMAGENS ===
    function initializeImageCarousels() {
        document.querySelectorAll('.image-carousel').forEach(carousel => {
            const cards = carousel.querySelectorAll('.image-card');
            const prevBtn = carousel.querySelector('.carousel-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-btn.next');
            const indicators = carousel.querySelectorAll('.indicator');
            if (cards.length === 0) return;

            let currentIndex = 0;

            function updateCarousel(newIndex) {
                currentIndex = (newIndex + cards.length) % cards.length;
                
                cards.forEach((card, index) => {
                    card.classList.remove('active', 'prev', 'next');
                    if(index === currentIndex) {
                        card.classList.add('active');
                    }
                });

                const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
                const nextIndex = (currentIndex + 1) % cards.length;
                if(cards[prevIndex]) cards[prevIndex].classList.add('prev');
                if(cards[nextIndex]) cards[nextIndex].classList.add('next');
                
                indicators.forEach((ind, index) => {
                    ind.classList.toggle('active', index === currentIndex);
                });
            }

            if (nextBtn) nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
            if (prevBtn) prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
            
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => updateCarousel(index));
            });

            // Garante que o estado inicial seja aplicado
            updateCarousel(0);
        });
    }

})();