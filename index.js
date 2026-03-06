// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
      if (el.isIntersecting) el.target.classList.add("visible");
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
