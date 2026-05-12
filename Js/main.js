/* ============================================
   Revelado al hacer scroll — sistema minimalista premium.

   Los elementos optan por el efecto con .reveal (+ modificadores
   opcionales .reveal--image / .reveal--divider / .reveal--cta).
   El escalonado dentro de un .reveal-group se gestiona desde
   el CSS mediante transition-delay con :nth-child(N).

   Cuando un elemento entra en el viewport se alterna la clase
   .is-visible y luego se quitan las clases .reveal/* una vez
   reproducida la transición, para que no sigan aplicando el
   easing lento sobre transformaciones posteriores (pulsación
   de botones, microinteracciones de hover, etc.).
   ============================================ */
(function () {
    "use strict";

    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const supportsIO = "IntersectionObserver" in window;

    // Fallback: mostramos todo al instante y retiramos los hooks
    // de reveal para que no interfieran con los estilos.
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

    // Duración máxima posible antes de la limpieza:
    //   reveal--cta = 900ms de transición
    // + 240ms de retraso de escalonado en nth-child(4)
    // + 60ms de margen de seguridad
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
            // El elemento necesita ~15% visible antes de disparar
            // el efecto, y reducimos el viewport un 10% desde abajo
            // para que el reveal se active cuando el elemento esté
            // bien dentro de la vista y no apenas en el borde.
            threshold: 0.15,
            rootMargin: "0px 0px -10% 0px",
        }
    );

    targets.forEach((el) => observer.observe(el));
})();
