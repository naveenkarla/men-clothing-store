document.addEventListener("DOMContentLoaded", () => {
  //    --- loader ---//
  setTimeout(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    tl.to(".loader-text", {
      clipPath: "inset(0 0% 0 0)",
      duration: 1.5,
    })
      .to(
        ".loader-tagline",
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=1"
      ) // overlaps with CHHAP animation
      .to(".loader", {
        y: "-100%",
        duration: 1,
        ease: "power3.inOut",
        delay: 0.5,
        onComplete: () => {
          document.querySelector(".loader").style.display = "none";
          initPageAnimations();
        },
      });
  }, 200);

  // --- STICKY HEADER ON SCROLL ---
  const header = document.getElementById("main-header");
  const mainContent = document.getElementById("main-content");
  const headerHeight = header.offsetHeight;

  window.addEventListener("scroll", () => {
    if (window.scrollY > headerHeight) {
      if (!header.classList.contains("is-sticky")) {
        header.classList.add("is-sticky");
        mainContent.style.paddingTop = headerHeight + "px";
      }
    } else {
      if (header.classList.contains("is-sticky")) {
        header.classList.remove("is-sticky");
        mainContent.style.paddingTop = "0";
      }
    }
  });

  // --- OFF-CANVAS CART LOGIC ---
  const cartIcon = document.getElementById("cart-icon");
  const cartOffcanvas = document.getElementById("cart-offcanvas");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCartBtn = document.getElementById("cart-close-btn");
  // const body = document.getElementById('page-body');

  function openCart() {
    cartOffcanvas.classList.add("active");
    cartOverlay.classList.add("active");
    body.classList.add("cart-open");
  }

  function closeCart() {
    cartOffcanvas.classList.remove("active");
    cartOverlay.classList.remove("active");
    body.classList.remove("cart-open");
  }

  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    openCart();
  });
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  // --- GSAP & SWIPER CAROUSEL LOGIC ---
  function animateSlide(slide) {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Get elements
    const title = slide.querySelector(".slide-title");
    const subtitle = slide.querySelector(".slide-subtitle");
    const button = slide.querySelector(".slide-button");
    const image = slide.querySelector(".slide-image");

    // Set visibility before animation
    gsap.set([title, subtitle, button, image], { visibility: "visible" });

    // Animation sequence
    tl.fromTo(title, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(
        subtitle,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        button,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      )
      .fromTo(
        image,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.8"
      );
  }

  function resetSlideAnimation(slide) {
    gsap.set(
      slide.querySelectorAll(
        ".slide-title, .slide-subtitle, .slide-button, .slide-image"
      ),
      {
        opacity: 0,
        y: 0, // Reset y position
        visibility: "hidden",
      }
    );
  }

  const swiper = new Swiper(".swiper-container", {
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    on: {
      init: function () {
        animateSlide(this.slides[this.activeIndex]);
      },
      slideChangeTransitionStart: function () {
        // Reset animation for all slides before transition
        this.slides.forEach(resetSlideAnimation);
      },
      slideChangeTransitionEnd: function () {
        // Animate the new active slide
        animateSlide(this.slides[this.activeIndex]);
      },
      autoplayTimeLeft(s, time, progress) {
        const progressFill = document.querySelector(
          ".swiper-autoplay-progress span"
        );
        if (progressFill) {
          progressFill.style.transform = `scaleX(${1 - progress})`;
        }
      },
    },
  });

  // --- 3D & PARALLAX ANIMATIONS FOR CTA ---
  gsap.registerPlugin(ScrollTrigger);

  // 1. Animate the section into view on scroll
  gsap.from(".design-cta-section", {
    scrollTrigger: {
      trigger: ".design-cta-section",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 50,
    scale: 0.95,
    duration: 1,
    ease: "power2.out",
  });

  // 2. Parallax effect for the background pattern
  gsap.to(".cta-background-pattern", {
    y: "-20%", // Move vertically for a parallax effect
    ease: "none",
    scrollTrigger: {
      trigger: ".design-cta-section",
      scrub: true,
    },
  });

  // 3. 3D interactive hover effect
  const ctaPanel = document.getElementById("cta-panel");
  const floatingIcons = document.querySelectorAll(".floating-icon");

  if (window.matchMedia("(min-width: 769px)").matches) {
    ctaPanel.addEventListener("mousemove", (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } =
        currentTarget.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;
      const midX = width / 2;
      const midY = height / 2;

      const rotateX = ((y - midY) / midY) * -8;
      const rotateY = ((x - midX) / midX) * 8;

      // Animate the main panel
      gsap.to(ctaPanel, {
        "--rotateX": `${rotateX}deg`,
        "--rotateY": `${rotateY}deg`,
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out",
      });

      // Animate floating icons in the opposite direction
      floatingIcons.forEach((icon) => {
        const speed = icon.dataset.speed;
        gsap.to(icon, {
          x: rotateY * -speed,
          y: rotateX * -speed,
          duration: 1,
          ease: "power3.out",
        });
      });
    });

    ctaPanel.addEventListener("mouseleave", () => {
      // Reset the main panel
      gsap.to(ctaPanel, {
        "--rotateX": "0deg",
        "--rotateY": "0deg",
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });

      // Reset floating icons
      gsap.to(floatingIcons, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    });
  }

  // --- ARRIVALS SECTION LOGIC ---
  const productGrid = document.getElementById("product-grid");
  const productTabs = document.getElementById("product-tabs");
  const tabIndicator = document.getElementById("tab-indicator");
  const allProductCards = Array.from(productGrid.children);

  /**
   * Moves the animated tab indicator to the position of the target tab.
   */
  function moveTabIndicator(targetTab) {
    if (!targetTab) return;
    gsap.to(tabIndicator, {
      left: targetTab.offsetLeft,
      width: targetTab.offsetWidth,
      duration: 0.4,
      ease: "power3.out",
    });
  }

  /**
   * Filters products in the grid based on a category, with animations.
   */
  function filterProducts(category) {
    const tl = gsap.timeline();

    // UPDATED: Logic to handle the "all" category
    const cardsToHide =
      category === "all"
        ? []
        : allProductCards.filter(
            (card) =>
              !card.dataset.categories.includes(category) &&
              !card.hasAttribute("hidden")
          );

    const cardsToShow =
      category === "all"
        ? allProductCards
        : allProductCards.filter((card) =>
            card.dataset.categories.includes(category)
          );

    // Animate existing cards out
    if (cardsToHide.length > 0) {
      tl.to(cardsToHide, {
        opacity: 0,
        y: -20,
        scale: 0.98,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          cardsToHide.forEach((card) => card.setAttribute("hidden", true));
        },
      });
    }

    // Un-hide new cards before animating them in
    cardsToShow.forEach((card) => card.removeAttribute("hidden"));

    // Animate new cards in
    tl.fromTo(
      cardsToShow,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }

  /**
   * Initializes all event listeners and the overall section animation.
   */
  function initializeProductSection() {
    // Overall section fade-up animation
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".new-arrivals-section", {
      scrollTrigger: {
        trigger: ".new-arrivals-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.8,
      ease: "power3.out",
    });

    if (productGrid) {
      productGrid.addEventListener("click", (e) => {
        // Color swatch logic
        if (e.target.matches(".color-swatch")) {
          const parent = e.target.parentElement;
          parent.querySelector(".active")?.classList.remove("active");
          e.target.classList.add("active");
        }
        // Size option logic
        if (e.target.matches(".size-option")) {
          const parent = e.target.parentElement;
          parent.querySelector(".active")?.classList.remove("active");
          e.target.classList.add("active");
        }
      });
    }

    // Tab click handler
    productTabs.addEventListener("click", (e) => {
      const target = e.target.closest(".tab-btn");
      if (!target || target.classList.contains("active")) return;

      productTabs.querySelector(".active")?.classList.remove("active");
      target.classList.add("active");

      moveTabIndicator(target);
      filterProducts(target.dataset.category);
    });

    // Set initial state
    const initialActiveTab = productTabs.querySelector(".active");
    moveTabIndicator(initialActiveTab);
    // UPDATED: Initially show all products
    filterProducts("all");

    // Recalculate indicator position on window resize
    window.addEventListener("resize", () => {
      moveTabIndicator(productTabs.querySelector(".active"));
    });
  }

  initializeProductSection();

  // --- ULTIMATE SALE SECTION LOGIC ---
  function initializeUltimateSaleSection() {
    gsap.registerPlugin(ScrollTrigger);

    // Staggered animation for the cards
    gsap.to(".sale-card", {
      scrollTrigger: {
        trigger: ".sale-grid",
        start: "top 80%",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // 3D Hover Effect for each card
    const saleCards = document.querySelectorAll(".sale-card");
    if (window.matchMedia("(min-width: 993px)").matches) {
      saleCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const { clientX, clientY, currentTarget } = e;
          const { left, top, width, height } =
            currentTarget.getBoundingClientRect();
          const x = clientX - left;
          const y = clientY - top;
          const midX = width / 2;
          const midY = height / 2;

          const rotateX = ((y - midY) / midY) * -7; // Max rotation 7 degrees
          const rotateY = ((x - midX) / midX) * 7;

          gsap.to(card, {
            "--rotateX": `${rotateX}deg`,
            "--rotateY": `${rotateY}deg`,
            duration: 0.7,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            "--rotateX": "0deg",
            "--rotateY": "0deg",
            duration: 1,
            ease: "elastic.out(1, 0.5)", // Snap-back effect
          });
        });
      });
    }
  }

  initializeUltimateSaleSection();

  // --- INFINITE MARQUEE SECTION LOGIC ---
  function initializePartnersMarquee() {
    gsap.registerPlugin(ScrollTrigger);

    // Section Entrance Animation
    gsap.to(".marquee-section .section-header", {
      scrollTrigger: {
        trigger: ".marquee-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
    });

    const track = document.querySelector(".marquee-track");
    const container = document.getElementById("marquee-container");
    if (!track || !container) return;

    // Clone slides to simulate infinite scroll
    const slides = [...track.children];
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      track.appendChild(clone);
    });

    // GSAP Animation for the scroll
    let scrollTween = gsap.to(track, {
      x: "-50%", // Move to the start of the cloned set
      ease: "none",
      duration: 10, // Adjust duration for desired speed
      repeat: -1,
    });

    // Pause animation on hover
    container.addEventListener("mouseenter", () => {
      gsap.to(scrollTween, { timeScale: 0.2, duration: 0.5 }); // Slow down
    });
    container.addEventListener("mouseleave", () => {
      gsap.to(scrollTween, { timeScale: 1, duration: 0.5 }); // Resume normal speed
    });
  }

  initializePartnersMarquee();

  // --- PROMO CARDS SECTION LOGIC ---
  function initializePromoCardsSection() {
    gsap.registerPlugin(ScrollTrigger);

    // Staggered animation for the cards
    gsap.to(".promo-card", {
      scrollTrigger: {
        trigger: ".promo-grid",
        start: "top 85%",
      },
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Countdown Timer Logic
    const countdown = document.querySelector(".countdown-timer-promo");
    if (countdown) {
      const endDate = new Date(countdown.dataset.endDate).getTime();

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
          clearInterval(interval);
          countdown.innerHTML = "<p>Offer Ended</p>";
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.querySelector(".days").innerText = String(days).padStart(
          2,
          "0"
        );
        countdown.querySelector(".hours").innerText = String(hours).padStart(
          2,
          "0"
        );
        countdown.querySelector(".minutes").innerText = String(
          minutes
        ).padStart(2, "0");
        countdown.querySelector(".seconds").innerText = String(
          seconds
        ).padStart(2, "0");
      }, 1000);
    }
  }

  initializePromoCardsSection();

  // --- INSTAGRAM FEED SECTION LOGIC ---
  function initializeInstagramSection() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Animate the section header
    gsap.to(".instagram-feed-section .section-header", {
      scrollTrigger: {
        trigger: ".instagram-feed-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // 2. Staggered animation for the images
    gsap.to(".instagram-post", {
      scrollTrigger: {
        trigger: ".instagram-grid",
        start: "top 85%",
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1, // A quick, clean stagger
      ease: "power2.out",
    });
  }
  initializeInstagramSection();

  // --- CUSTOMER REVIEWS SECTION LOGIC ---
  function initializeCustomerReviews() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Entrance animation for the entire section
    const reviewSection = document.querySelector(".customer-reviews-section");
    if (!reviewSection) return;

    gsap.to(reviewSection.querySelector(".section-header"), {
      scrollTrigger: { trigger: reviewSection, start: "top 80%" },
      opacity: 1,
      duration: 0.8,
    });

    gsap.from(".review-slider-wrapper > *", {
      scrollTrigger: {
        trigger: ".review-slider-wrapper",
        start: "top 80%",
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // 2. Interactive slider functionality
    const avatarButtons = document.querySelectorAll(".avatar-btn");
    const reviews = document.querySelectorAll(".review");

    avatarButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetReviewId = button.dataset.reviewTarget;

        // Update active avatar
        avatarButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Switch active review with animation
        reviews.forEach((review) => {
          if (review.dataset.review === targetReviewId) {
            review.classList.add("active");
          } else {
            review.classList.remove("active");
          }
        });
      });
    });
  }
  initializeCustomerReviews();

  // --- PROMOTIONAL POPUP LOGIC ---
  function initializePromoPopup() {
    const popupOverlay = document.getElementById("promo-popup-overlay");
    const closeBtn = document.getElementById("popup-close-btn");
    const checkbox = document.getElementById("dont-show-again");
    const body = document.getElementById("page-body");

    const POPUP_COOKIE_NAME = "promoPopupDismissed";

    function showPopup() {
      // Check if cookie is set
      if (document.cookie.includes(`${POPUP_COOKIE_NAME}=true`)) {
        return;
      }

      popupOverlay.classList.add("active");
      body.classList.add("no-scroll");

      // Animate content in
      gsap.fromTo(
        [".popup-subtitle", ".popup-title", ".popup-checkbox"],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }

    function closePopup() {
      console.log("Popup is being closed.");

      // Set cookie if checkbox is checked
      if (checkbox && checkbox.checked) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `${POPUP_COOKIE_NAME}=true; expires=${expiryDate.toUTCString()}; path=/`;
      }

      popupOverlay.classList.remove("active");
      body.classList.remove("no-scroll");
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closePopup);
    }

    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        closePopup();
      }
    });

    // Show popup after 2 seconds
    setTimeout(showPopup, 2000);
  }
  initializePromoPopup();

  // --- FINAL FOOTER LOGIC ---
  function initializeFooter() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Entrance animation for the footer columns
    gsap.to(".footer-column", {
      scrollTrigger: {
        trigger: ".site-footer",
        start: "top 85%",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });

    // 2. Back to Top button functionality
    const backToTopButton = document.getElementById("back-to-top");

    if (backToTopButton) {
      // Show/hide button based on scroll position
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add("visible");
        } else {
          backToTopButton.classList.remove("visible");
        }
      });

      // Smooth scroll to top on click
      backToTopButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }
  initializeFooter();

  // --- THEME CUSTOMIZER LOGIC (Unchanged) ---
  const customizerToggle = document.getElementById("customizerToggle");
  const customizerPanel = document.getElementById("customizerPanel");
  const themeToggle = document.getElementById("themeToggle");
  const colorSwatches = document
    .getElementById("colorSwatches")
    .querySelectorAll(".swatch");
  const body = document.body;
  const root = document.documentElement;
  customizerToggle.addEventListener("click", () => {
    customizerPanel.classList.toggle("active");
    customizerToggle.classList.toggle("active");
  });
  const applySavedSettings = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark-theme") {
      body.classList.add("dark-theme");
      themeToggle.checked = true;
    } else {
      body.classList.remove("dark-theme");
      themeToggle.checked = false;
    }
    const savedColor = localStorage.getItem("accentColor") || "#5E35B1";
    root.style.setProperty("--secondary-color", savedColor);
    colorSwatches.forEach((swatch) => {
      swatch.classList.remove("active");
      if (swatch.dataset.color === savedColor) {
        swatch.classList.add("active");
      }
    });
  };
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark-theme");
    } else {
      body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light-theme");
    }
  });
  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      const newColor = this.dataset.color;
      root.style.setProperty("--secondary-color", newColor);
      localStorage.setItem("accentColor", newColor);
      colorSwatches.forEach((s) => s.classList.remove("active"));
      this.classList.add("active");
    });
  });
  applySavedSettings();

  // --- MENUS & DROPDOWNS LOGIC (Unchanged) ---
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const mobileNav = document.getElementById("mobile-nav");
  hamburgerMenu.addEventListener("click", () =>
    mobileNav.classList.toggle("active")
  );

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      //  e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const currentDropdown = this.nextElementSibling;
      document.querySelectorAll(".dropdown-menu.active").forEach((dropdown) => {
        if (dropdown !== currentDropdown) {
          dropdown.classList.remove("active");
          dropdown.previousElementSibling.classList.remove("active");
        }
      });
      currentDropdown.classList.toggle("active");
      this.classList.toggle("active");
    });
  });
  window.addEventListener("click", function (e) {
    if (!e.target.closest(".icon-container")) {
      document.querySelectorAll(".dropdown-menu.active").forEach((dropdown) => {
        dropdown.classList.remove("active");
        dropdown.previousElementSibling.classList.remove("active");
      });
    }
    if (!e.target.closest(".theme-customizer")) {
      customizerPanel.classList.remove("active");
      customizerToggle.classList.remove("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(Flip, ScrollTrigger);

  // 1. STATE MANAGEMENT
  let state = {
    currentPage: 1,
    productsPerPage: 6,
    activeFilters: { category: "all" },
    sortOrder: "newest",
    allCards: Array.from(document.querySelectorAll(".product-card")),
  };

  const productGrid = document.getElementById("product-grid");
  const noResultsMessage = document.getElementById("no-results-message");

  // 2. MAIN UPDATE & RENDER FUNCTION
  function updatePage() {
    const gridState = Flip.getState(state.allCards, { props: "display" });

    // Filter
    let visibleCards = state.allCards.filter((card) => {
      const matchesCategory =
        state.activeFilters.category === "all" ||
        card.classList.contains(state.activeFilters.category);
      return matchesCategory;
    });

    // Sort
    visibleCards.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);
      const dateA = new Date(a.dataset.date);
      const dateB = new Date(b.dataset.date);
      switch (state.sortOrder) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        default:
          return dateB - dateA;
      }
    });

    // Paginate
    const totalPages = Math.ceil(visibleCards.length / state.productsPerPage);
    state.currentPage = Math.min(state.currentPage, totalPages) || 1;
    const start = (state.currentPage - 1) * state.productsPerPage;
    const end = start + state.productsPerPage;
    const paginatedCards = visibleCards.slice(start, end);

    // Update DOM visibility
    state.allCards.forEach((card) => (card.style.display = "none"));
    paginatedCards.forEach((card) => (card.style.display = "block"));
    noResultsMessage.style.display =
      visibleCards.length === 0 ? "block" : "none";

    // Update results count and pagination UI
    document.getElementById(
      "results-count"
    ).textContent = `Showing ${paginatedCards.length} of ${visibleCards.length} products`;
    renderPagination(totalPages);

    // Animate with Flip
    Flip.from(gridState, {
      duration: 0.7,
      scale: true,
      ease: "power1.inOut",
      stagger: 0.08,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5 }
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.5 }),
    });
  }

  function renderPagination(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === state.currentPage) pageBtn.classList.add("active");
      pageBtn.addEventListener("click", () => {
        state.currentPage = i;
        updatePage();
      });
      paginationContainer.appendChild(pageBtn);
    }
  }

  // 3. EVENT LISTENERS
  function initializeEventListeners() {
    document
      .getElementById("explore-sidebar")
      .addEventListener("click", (e) => {
        if (e.target.matches(".filter-list a")) {
          e.preventDefault();
          const filterValue = e.target.dataset.filter;
          state.activeFilters.category = filterValue;
          state.currentPage = 1;
          document
            .querySelector(".filter-list a.active")
            ?.classList.remove("active");
          e.target.classList.add("active");
          updatePage();
        }
      });
    document.getElementById("sort-select").addEventListener("change", (e) => {
      state.sortOrder = e.target.value;
      state.currentPage = 1;
      updatePage();
    });
    document
      .getElementById("clear-filters-btn")
      .addEventListener("click", () => {
        state.activeFilters = { category: "all" };
        state.sortOrder = "newest";
        state.currentPage = 1;
        document.getElementById("sort-select").value = "newest";
        document
          .querySelectorAll(".filter-list a.active")
          .forEach((el) => el.classList.remove("active"));
        document.querySelector('[data-filter="all"]').classList.add("active");
        updatePage();
      });
  }

  // 4. INITIALIZATION
  function initializePage() {
    gsap.from(".page-header", { opacity: 0, y: -30, duration: 0.8 });
    gsap.from(".explore-sidebar .filter-group", {
      opacity: 0,
      x: -30,
      stagger: 0.2,
      duration: 0.6,
      delay: 0.3,
    });
    initializeEventListeners();
    updatePage();
  }

  initializePage();
});

// ---- This is the typing container ----//
document.querySelectorAll(".js-typewriter").forEach((el) => {
  const text = el.getAttribute("data-text");
  let index = 0;
  let isDeleting = false;

  // Measure full word and set min-width
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.whiteSpace = "nowrap";
  span.style.font = getComputedStyle(el).font;
  span.textContent = text;
  document.body.appendChild(span);
  const width = span.offsetWidth;
  document.body.removeChild(span);

  el.style.minWidth = width + "px";

  function type() {
    const current = isDeleting
      ? text.substring(0, index--)
      : text.substring(0, index++);
    el.textContent = current;

    if (!isDeleting && index > text.length) {
      setTimeout(() => (isDeleting = true), 1000); // pause before deleting
    } else if (isDeleting && index === 0) {
      isDeleting = false;
    }

    const speed = isDeleting ? 70 : 120;
    setTimeout(type, speed);
  }

  type();
});


// -----
const wrapper = document.getElementById("scroll-wrapper");
const track = document.getElementById("scroll-track");

// Clone all cards to enable seamless loop
track.innerHTML += track.innerHTML;

const cards = Array.from(track.children);
let scrollPaused = false;
let activeIndex = -1;
let scrollSpeed = 1; // pixels per frame

function autoScroll() {
  if (!scrollPaused) {
    wrapper.scrollLeft += scrollSpeed;

    // Reset scroll position when it reaches halfway (duplicate starts)
    if (wrapper.scrollLeft >= track.scrollWidth / 2) {
      wrapper.scrollLeft = 0;
    }
  }
}

function getCenterX(element) {
  const rect = element.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

function detectCenterCard() {
  if (scrollPaused) return;

  const viewportCenter = window.innerWidth / 2;

  let closestCard = null;
  let closestDistance = Infinity;
  let closestIndex = -1;

  cards.forEach((card, index) => {
    const cardCenter = getCenterX(card);
    const distance = Math.abs(viewportCenter - cardCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
      closestIndex = index;
    }
  });

  if (closestCard && closestIndex !== activeIndex) {
    pauseScroll();
    cards.forEach((card) => card.classList.remove("zoomed"));
    closestCard.classList.add("zoomed");
    activeIndex = closestIndex;

    setTimeout(() => {
      closestCard.classList.remove("zoomed");
      resumeScroll();
    }, 2000);
  }
}

function pauseScroll() {
  scrollPaused = true;
}

function resumeScroll() {
  scrollPaused = false;
}

// Pause on hover
wrapper.addEventListener("mouseenter", pauseScroll);
wrapper.addEventListener("mouseleave", resumeScroll);

// Start auto scrolling
setInterval(autoScroll, 16); // ~60fps
setInterval(detectCenterCard, 500);

