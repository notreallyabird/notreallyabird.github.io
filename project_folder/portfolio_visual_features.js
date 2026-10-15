(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const candidateImages = document.querySelectorAll(
    "main img, header .hero-image img, .about-portrait img"
  );
  const lightboxImages = [...candidateImages].filter((image) =>
    !image.closest("a") &&
    !image.closest("[aria-hidden='true']") &&
    !image.classList.contains("cover-image-backdrop")
  );
  const revealItems = document.querySelectorAll(
    "main > section, main > .content-section, .project-grid > .project, " +
    ".photo-card, .paper-card, .design-card, .stat, .technical-layout, " +
    ".overview-layout, .results-panel, main figure, .about-portrait"
  );

  root.classList.add("visual-enhanced");

  revealItems.forEach((item) => item.setAttribute("data-visual-reveal", ""));

  if (lightboxImages.length) {
    const dialog = document.createElement("dialog");
    dialog.className = "portfolio-lightbox";
    dialog.setAttribute("aria-label", "Project photo viewer");
    dialog.innerHTML = `
      <div class="portfolio-lightbox-toolbar">
        <span class="portfolio-lightbox-count" aria-live="polite"></span>
        <button class="portfolio-lightbox-button" type="button" data-lightbox-close aria-label="Close photo viewer">Close</button>
      </div>
      <figure class="portfolio-lightbox-figure">
        <img alt="">
        <figcaption></figcaption>
      </figure>
      <div class="portfolio-lightbox-controls">
        <button class="portfolio-lightbox-button" type="button" data-lightbox-previous aria-label="Previous photo">&larr; Previous</button>
        <button class="portfolio-lightbox-button" type="button" data-lightbox-next aria-label="Next photo">Next &rarr;</button>
      </div>`;

    document.body.append(dialog);

    const imageElement = dialog.querySelector("img");
    const captionElement = dialog.querySelector("figcaption");
    const countElement = dialog.querySelector(".portfolio-lightbox-count");
    let activeIndex = 0;

    function showImage(index) {
      activeIndex = (index + lightboxImages.length) % lightboxImages.length;
      const sourceImage = lightboxImages[activeIndex];
      imageElement.src = sourceImage.currentSrc || sourceImage.src;
      imageElement.alt = sourceImage.alt;
      captionElement.textContent =
        sourceImage.closest("figure")?.querySelector("figcaption")?.textContent.trim() ||
        sourceImage.alt;
      countElement.textContent = `${activeIndex + 1} / ${lightboxImages.length}`;
    }

    lightboxImages.forEach((image, index) => {
      const trigger = document.createElement("button");
      trigger.className = "visual-photo-trigger";
      trigger.type = "button";
      trigger.setAttribute("aria-label", `View photo: ${image.alt || "Project image"}`);
      trigger.setAttribute("aria-haspopup", "dialog");
      image.replaceWith(trigger);
      trigger.append(image);
      trigger.addEventListener("click", () => {
        showImage(index);
        dialog.showModal();
      });
    });

    dialog.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
    dialog.querySelector("[data-lightbox-previous]").addEventListener("click", () => {
      showImage(activeIndex - 1);
    });
    dialog.querySelector("[data-lightbox-next]").addEventListener("click", () => {
      showImage(activeIndex + 1);
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (!dialog.open) {
        return;
      }
      if (event.key === "ArrowLeft") {
        showImage(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        showImage(activeIndex + 1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        dialog.close();
      }
    });
  }

  if (!reducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
    requestAnimationFrame(() => root.classList.add("visual-ready"));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    root.classList.add("visual-ready");
  }
})();
