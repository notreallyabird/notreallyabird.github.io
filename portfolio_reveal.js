(() => {
  const root = document.documentElement;
  const revealItems = document.querySelectorAll(
    "main > header, main > section, .project-grid > .project, " +
    ".project-grid > .project-link, .projects-cta"
  );
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  revealItems.forEach((item) => item.setAttribute("data-fade-in", ""));

  if (!reducedMotion && "IntersectionObserver" in window) {
    root.classList.add("fade-in-ready");

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
