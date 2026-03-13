const body = document.body;
body.classList.add("js-enabled");

const themeButtons = [...document.querySelectorAll(".theme-option")];
const modeToggle = document.querySelector(".mode-toggle");
const storedTheme = localStorage.getItem("portfolio-theme");
const storedMode = localStorage.getItem("portfolio-mode");
const defaultTheme = storedTheme || body.dataset.theme || "seaglass";
const defaultMode = storedMode || body.dataset.mode || "day";

const formatCounter = (value) => {
  if (value >= 1000) {
    return `${value.toLocaleString()}+`;
  }

  return `${value}+`;
};

const applyTheme = (theme) => {
  body.dataset.theme = theme;

  themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem("portfolio-theme", theme);
};

const applyMode = (mode) => {
  const isNight = mode === "night";
  body.dataset.mode = isNight ? "night" : "day";

  if (modeToggle) {
    modeToggle.setAttribute("aria-pressed", String(isNight));
    modeToggle.setAttribute("aria-label", isNight ? "Switch to day mode" : "Switch to night mode");
  }

  localStorage.setItem("portfolio-mode", body.dataset.mode);
};

applyTheme(defaultTheme);
applyMode(defaultMode);

document.querySelectorAll(".counter").forEach((counter) => {
  counter.textContent = "0";
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.theme));
});

modeToggle?.addEventListener("click", () => {
  applyMode(body.dataset.mode === "night" ? "day" : "night");
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.target);
      const duration = 1300;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(progress * target);
        element.textContent = formatCounter(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }

        element.textContent = formatCounter(target);
      };

      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    const panel = item.querySelector(".accordion-panel");
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".accordion-trigger").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });

    document.querySelectorAll(".accordion-panel").forEach((section) => {
      section.classList.remove("open");
    });

    if (!isOpen) {
      trigger.setAttribute("aria-expanded", "true");
      panel.classList.add("open");
    }
  });
});

const sectionLinks = [...document.querySelectorAll(".site-nav a, .mobile-nav a")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      sectionLinks.forEach((link) => {
        const matches = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", matches);
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -45% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
