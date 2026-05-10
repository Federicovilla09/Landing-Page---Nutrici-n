/* ============================================
   On-scroll reveal — premium minimal system.

   Elements opt in via .reveal (+ optional modifiers
   .reveal--image / .reveal--divider / .reveal--cta).
   Stagger inside a .reveal-group is handled by CSS
   via :nth-child(N) transition-delay.

   When an element enters the viewport we toggle
   .is-visible, then strip the .reveal/* classes once
   the transition has played so they don't keep the
   slow easing on subsequent transforms (button press,
   hover micro-interactions, etc.).
   ============================================ */
(function () {
    "use strict";

    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const supportsIO = "IntersectionObserver" in window;

    // Fallback: show everything instantly, drop the
    // reveal hooks so they never interfere with styles.
    if (!supportsIO || prefersReducedMotion) {
        targets.forEach((el) => {
            el.classList.remove(
                "reveal",
                "reveal--image",
                "reveal--divider",
                "reveal--cta"
            );
        });
        return;
    }

    // Max possible duration before cleanup:
    //   reveal--cta = 900ms transition
    // + 240ms nth-child(4) stagger delay
    // + 60ms safety buffer
    const CLEANUP_AFTER_MS = 1200;

    const cleanup = (el) => {
        el.classList.remove(
            "reveal",
            "reveal--image",
            "reveal--divider",
            "reveal--cta",
            "is-visible"
        );
        el.style.willChange = "";
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add("is-visible");
                obs.unobserve(el);
                window.setTimeout(() => cleanup(el), CLEANUP_AFTER_MS);
            });
        },
        {
            // Element needs ~15% visible before we trigger,
            // and we shrink the viewport by 10% from the bottom
            // so the reveal fires when the element is well into
            // view rather than at the very edge.
            threshold: 0.15,
            rootMargin: "0px 0px -10% 0px",
        }
    );

    targets.forEach((el) => observer.observe(el));
})();
