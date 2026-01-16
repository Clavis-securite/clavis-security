// /js/app-mode.js
(function () {
  const isStandalone =
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;

  if (isStandalone) {
    document.documentElement.classList.add("app-mode");
  }

  // Bonus : éviter le bounce/scroll chelou iOS en mode app
  if (isStandalone) {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
  }
})();
