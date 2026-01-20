document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu functionality
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger (optional simple transform can be added in CSS, here just toggling class if needed)
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Smooth Scrolling for anchor links (fallback for browsers that don't support scroll-behavior: smooth)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Navbar scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            header.style.backgroundColor = "rgba(15, 23, 42, 0.98)";
        } else {
            header.style.boxShadow = "none";
            header.style.backgroundColor = "rgba(15, 23, 42, 0.95)";
        }
    });

    // Intersection Observer for fade-in animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate (we can add a class .fade-in to elements we want to animate)
    // For now, let's animate the service cards and course cards
    const cards = document.querySelectorAll('.service-card, .course-card');
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        // Stagger delay
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    // FAQ Modal Functionality
    const faqBtn = document.getElementById('faq-btn');
    const faqModal = document.getElementById('faq-modal');
    const faqClose = document.getElementById('faq-close');
    const faqItems = document.querySelectorAll('.faq-item');

    // Open FAQ modal
    faqBtn.addEventListener('click', () => {
        faqModal.classList.add('active');
    });

    // Close FAQ modal
    faqClose.addEventListener('click', () => {
        faqModal.classList.remove('active');
    });

    // Close modal when clicking outside
    faqModal.addEventListener('click', (e) => {
        if (e.target === faqModal) {
            faqModal.classList.remove('active');
        }
    });

    // Toggle FAQ items
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Contact Form Submission to Google Sheets
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxnmTyZcHSpQNXrAS8Ia5oVMuKQWlAT_lgfQ1g38xWl7dI5Rqp0erTNIm45cmZ95U6QAQ/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            // Visual feedback
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: new FormData(contactForm)
            })
                .then(response => {
                    // Determine if the request was successful
                    // Note: Google Scripts might return opaque response with no-cors or JSON
                    // We'll assume success if no error is caught for simple implementations
                    alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Hubo un error al enviar el mensaje. Por favor intenta contactarnos por WhatsApp.');
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
