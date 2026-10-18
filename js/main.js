/* Emmanuel Obasi | Portfolio scripts */
(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function paintThemeIcon() {
    if (!themeBtn) return;
    var dark = currentTheme() === "dark";
    themeBtn.innerHTML = dark ? '<i class="fas fa-moon" aria-hidden="true"></i>' : '<i class="fas fa-sun" aria-hidden="true"></i>';
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.setAttribute("aria-label", dark ? "Dark theme active. Activate light theme" : "Light theme active. Activate dark theme");
  }
  try {
    var saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) { /* storage unavailable */ }
  paintThemeIcon();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paintThemeIcon();
    });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    function updateCurrentSectionLink() {
      var currentHash = window.location.hash;
      links.querySelectorAll('a[href^="#"]').forEach(function (link) {
        if (currentHash && link.getAttribute("href") === currentHash) {
          link.setAttribute("aria-current", "location");
        } else if (link.getAttribute("aria-current") === "location") {
          link.removeAttribute("aria-current");
        }
      });
    }

    updateCurrentSectionLink();
    window.addEventListener("hashchange", updateCurrentSectionLink);
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });
    links.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (link && links.contains(link)) {
        if (link.matches('a[href^="#"]')) {
          links.querySelectorAll('a[href^="#"]').forEach(function (sectionLink) {
            sectionLink.removeAttribute("aria-current");
          });
          link.setAttribute("aria-current", "location");
        }
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Problem -> solution switcher (home page) ---------- */
  var tabs = document.querySelectorAll(".switcher-tab");
  var panelText = document.getElementById("switcherText");
  if (tabs.length && panelText) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
        tab.setAttribute("aria-selected", "true");
        panelText.textContent = tab.getAttribute("data-solution");
      });
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  if (!form) return;

  var status = document.getElementById("formStatus");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, msg) {
    var slot = document.getElementById(field.id + "-error");
    if (slot) slot.textContent = msg;
    field.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function validate() {
    var ok = true;
    var name = form.elements["name"];
    var email = form.elements["email"];
    var type = form.elements["project_type"];
    var message = form.elements["message"];

    setError(name, name.value.trim() ? "" : "Enter your name.");
    setError(email, EMAIL_RE.test(email.value.trim()) ? "" : "Enter a valid email address, like you@example.com.");
    setError(type, type.value ? "" : "Choose what you need help with.");
    setError(message, message.value.trim().length >= 15 ? "" : "Tell me a little more (at least 15 characters).");

    [name, email, type, message].forEach(function (f) {
      if (f.getAttribute("aria-invalid") === "true") ok = false;
    });
    if (!ok) {
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
    }
    return ok;
  }

  function show(msg, kind) {
    status.textContent = msg;
    status.className = "form-status " + (kind || "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    show("", "");
    if (form.elements["website"] && form.elements["website"].value) return; // honeypot
    if (!validate()) return;

    var action = form.getAttribute("action") || "";
    var btn = form.querySelector("button[type=submit]");
    var data = new FormData(form);

    // Until you add your own Formspree/Web3Forms endpoint, fall back to the visitor's email app.
    if (!action || action.indexOf("YOUR_FORM_ID") !== -1) {
      var body = "Name: " + data.get("name") + "\nEmail: " + data.get("email") +
        "\nNeed: " + data.get("project_type") + "\nTimeline: " + (data.get("timeline") || "-") +
        "\n\n" + data.get("message");
      window.location.href = "mailto:obasiemma2007@gmail.com?subject=" +
        encodeURIComponent("New portfolio enquiry from " + data.get("name")) +
        "&body=" + encodeURIComponent(body);
      show("Opening your email app. If nothing opens, email me directly at the address on this page.", "is-ok");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";
    fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        show("Message sent. I reply within two working days.", "is-ok");
      })
      .catch(function () {
        show("The message did not send. Check your connection and try again, or email me directly.", "is-error");
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = "Send message";
      });
  });
})();
