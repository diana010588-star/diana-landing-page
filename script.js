const header = document.getElementById("header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "פתיחת תפריט" : "סגירת תפריט");
  nav.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "פתיחת תפריט");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

// Highlight active navigation item.
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  },
  { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.2, 0.5] }
);

observedSections.forEach((section) => sectionObserver.observe(section));

// FAQ accordion.
document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector("button").setAttribute("aria-expanded", "false");
      }
    });

    item.classList.toggle("open", !isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));
  });
});

// Testimonials slider.
const testimonials = [...document.querySelectorAll(".testimonial")];
const dots = [...document.querySelectorAll(".dot")];
let activeSlide = 0;
let sliderTimer;

function showSlide(index) {
  activeSlide = index;
  testimonials.forEach((item, i) => item.classList.toggle("is-active", i === index));
  dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
}

function startSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    showSlide((activeSlide + 1) % testimonials.length);
  }, 5500);
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
    startSlider();
  });
});

showSlide(0);
startSlider();

// Reveal elements on scroll.
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  revealObserver.observe(element);
});

// Front-end form validation.
// Connect this form to Formspree, EmailJS or your server before publishing.
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

function setFieldError(field, message) {
  field.classList.toggle("invalid", Boolean(message));
  const error = field.closest("label")?.querySelector(".error-message");
  if (error) error.textContent = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.elements.name;
  const phone = form.elements.phone;
  const consent = form.elements.consent;
  const phoneDigits = phone.value.replace(/\D/g, "");

  setFieldError(name, name.value.trim().length < 2 ? "כתבי שם מלא." : "");
  setFieldError(
    phone,
    phoneDigits.length < 9 || phoneDigits.length > 12
      ? "כתבי מספר טלפון תקין."
      : ""
  );

  const consentError = form.querySelector(".consent-error");
  consentError.textContent = consent.checked
    ? ""
    : "יש לאשר שניתן לחזור אלייך בקשר לפנייה.";

  const hasErrors =
    form.querySelectorAll(".invalid").length > 0 || !consent.checked;

  if (hasErrors) {
    formStatus.textContent = "כדאי לבדוק את השדות המסומנים.";
    return;
  }

  formStatus.textContent =
    "הטופס תקין. לפני פרסום האתר יש לחבר אותו לשירות שליחת טפסים.";
});

// Clear errors while typing.
form.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.classList.contains("invalid")) setFieldError(field, "");
    formStatus.textContent = "";
  });
});

form.elements.consent.addEventListener("change", () => {
  form.querySelector(".consent-error").textContent = "";
  formStatus.textContent = "";
});

document.getElementById("current-year").textContent = new Date().getFullYear();
