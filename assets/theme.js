/* ============================================================
   Shared theme pin: auto, light, dark
   ------------------------------------------------------------
   Any page with a <button data-theme-toggle> gets the cycle.
   Pages without one still follow the system setting, because
   the dark palette in theme.css is also under a
   prefers-color-scheme query.

   One storage key across the suite, so a choice made in one
   tool holds in the next one opened from the same origin.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "suite-theme";
  var THEMES = ["auto", "light", "dark"];
  var theme = "auto";

  try {
    var saved = localStorage.getItem(KEY);
    if (THEMES.indexOf(saved) !== -1) theme = saved;
  } catch (err) { /* private mode, stay on auto */ }

  function apply() {
    if (theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);

    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].textContent = "Theme: " + theme;
      buttons[i].setAttribute(
        "aria-label",
        "Color theme: " + (theme === "auto" ? "follow system" : theme) + ". Activate to change."
      );
    }
  }

  function wire() {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
        try { localStorage.setItem(KEY, theme); } catch (err) { /* private mode */ }
        apply();
      });
    }
    apply();
  }

  /* Set the attribute as early as possible to avoid a flash of the
     wrong palette, then label the buttons once the DOM is there. */
  apply();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
