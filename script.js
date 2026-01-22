document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu functionality
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzeLpoCbH8ksbJ70ZGfGD7-SZJNqMGrZh0PR0tfj5nsyLSWTNl3soW4HSxscjSFt3rPrA/exec';

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

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
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
            header.style.backgroundColor = "var(--header-bg)";
        } else {
            header.style.boxShadow = "none";
            header.style.backgroundColor = "var(--header-bg)";
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

    // Select elements to animate
    const animateElements = document.querySelectorAll('.service-card, .course-card, .team-card, .testimonial-card, .blog-card, .placement-test-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });

    // FAQ Modal Functionality
    const faqBtn = document.getElementById('faq-btn');
    const faqModal = document.getElementById('faq-modal');
    const faqClose = document.getElementById('faq-close');
    const faqItems = document.querySelectorAll('.faq-item');

    // PQRS Modal Functionality
    const pqrsBtn = document.getElementById('pqrs-btn');
    const pqrsModal = document.getElementById('pqrs-modal');
    const pqrsClose = document.getElementById('pqrs-close');
    const footerPqrsLink = document.getElementById('footer-pqrs-link');
    const pqrsForm = document.getElementById('pqrs-form');
    const pqrsSubmitBtn = document.getElementById('pqrs-submit-btn');

    // Open FAQ modal
    if (faqBtn) {
        faqBtn.addEventListener('click', () => {
            faqModal.classList.add('active');
        });
    }

    // Open PQRS modal
    if (pqrsBtn) {
        pqrsBtn.addEventListener('click', () => {
            pqrsModal.classList.add('active');
        });
    }

    if (footerPqrsLink) {
        footerPqrsLink.addEventListener('click', () => {
            pqrsModal.classList.add('active');
        });
    }

    // Close Modals
    if (faqClose) {
        faqClose.addEventListener('click', () => {
            faqModal.classList.remove('active');
        });
    }

    if (pqrsClose) {
        pqrsClose.addEventListener('click', () => {
            pqrsModal.classList.remove('active');
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === faqModal) {
            faqModal.classList.remove('active');
        }
        if (e.target === pqrsModal) {
            pqrsModal.classList.remove('active');
        }
    });

    // PQRS Form Submission
    if (pqrsForm) {
        pqrsForm.addEventListener('submit', e => {
            e.preventDefault();

            // Visual feedback
            const originalBtnText = pqrsSubmitBtn.innerText;
            pqrsSubmitBtn.innerText = 'Enviando...';
            pqrsSubmitBtn.disabled = true;

            // Send data as URLSearchParams for better compatibility with Google Apps Script
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(new FormData(pqrsForm)).toString()
            })
                .then(() => {
                    // With no-cors, we assume success as we can't read the response
                    pqrsForm.style.display = 'none';
                    document.getElementById('pqrs-success').style.display = 'block';
                    pqrsForm.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Hubo un error al enviar tu solicitud. Por favor intenta contactarnos por WhatsApp.');
                })
                .finally(() => {
                    pqrsSubmitBtn.innerText = originalBtnText;
                    pqrsSubmitBtn.disabled = false;
                });
        });
    }


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

    // Support Widget Toggle
    const supportWidget = document.getElementById('support-widget');
    const supportMainBtn = document.getElementById('support-main-btn');

    if (supportMainBtn) {
        supportMainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            supportWidget.classList.toggle('active');
        });

        // Close widget when clicking outside
        document.addEventListener('click', (e) => {
            if (supportWidget.classList.contains('active') && !supportWidget.contains(e.target)) {
                supportWidget.classList.remove('active');
            }
        });
    }

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            // Visual feedback
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            // Send data as URLSearchParams for better compatibility with Google Apps Script
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(new FormData(contactForm)).toString()
            })
                .then(() => {
                    // With no-cors, we assume success
                    contactForm.style.display = 'none';
                    document.getElementById('form-success').style.display = 'block';
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

// Translation Functionality
function changeLanguage(lang) {
    const translateCombo = document.querySelector('.goog-te-combo');
    if (!translateCombo) {
        alert("El traductor todavía se está cargando, por favor intenta de nuevo en un segundo.");
        return;
    }

    translateCombo.value = lang;
    translateCombo.dispatchEvent(new Event('change'));

    // Update UI
    const langSpans = document.querySelectorAll('.lang-selector span');
    langSpans.forEach(span => {
        if (span.innerText.toLowerCase() === lang) {
            span.classList.add('active');
        } else if (span.innerText !== '|') {
            span.classList.remove('active');
        }
    });
}
