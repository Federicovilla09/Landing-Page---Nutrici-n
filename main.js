const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal--visible");
    }
  });
}, {
  threshold: 0.05,
  rootMargin: "0px 0px -80px 0px"
});

reveals.forEach((element) => {
  observer.observe(element);
});