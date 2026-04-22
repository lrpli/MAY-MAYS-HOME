(function () {
  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const pageName = document.body.dataset.page;
  if (pageName) {
    const activeNav = document.querySelector('.primary-nav a[data-nav="' + pageName + '"]');
    if (activeNav) {
      activeNav.classList.add("active");
    }
  }

  const menuToggle = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      const clickedInsideNav = primaryNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);
      if (!clickedInsideNav && !clickedToggle) {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const revealNodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add("is-visible");
    });
  }

  const progressBars = document.querySelectorAll(".progress-fill");
  if (progressBars.length && "IntersectionObserver" in window) {
    const progressObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const progressValue = Number(entry.target.getAttribute("data-progress") || "0");
            const safeValue = Math.max(0, Math.min(100, progressValue));
            entry.target.style.width = safeValue + "%";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    progressBars.forEach(function (bar) {
      progressObserver.observe(bar);
    });
  } else {
    progressBars.forEach(function (bar) {
      const progressValue = Number(bar.getAttribute("data-progress") || "0");
      bar.style.width = Math.max(0, Math.min(100, progressValue)) + "%";
    });
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const programCards = document.querySelectorAll("#program-grid .program-card");
  if (filterButtons.length && programCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filterValue = button.getAttribute("data-filter");

        filterButtons.forEach(function (btn) {
          btn.classList.remove("active");
        });
        button.classList.add("active");

        programCards.forEach(function (card) {
          const category = card.getAttribute("data-category");
          if (filterValue === "all" || filterValue === category) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  const contactForm = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (contactForm && note) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = String(contactForm.fullName.value || "").trim();
      const email = String(contactForm.email.value || "").trim();
      const topic = String(contactForm.topic.value || "").trim();
      const message = String(contactForm.message.value || "").trim();

      if (!fullName || !email || !topic || !message) {
        note.className = "form-note error";
        note.textContent = "Please complete all fields before sending.";
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        note.className = "form-note error";
        note.textContent = "Please enter a valid email address.";
        return;
      }

      const subject = topic + " | MAY MAYS HOME Website";
      const bodyText =
        "Name: " +
        fullName +
        "\n" +
        "Email: " +
        email +
        "\n" +
        "Topic: " +
        topic +
        "\n\n" +
        "Message:\n" +
        message;

      const mailtoHref =
        "mailto:info@MAYMAYSHOME.us?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyText);

      note.className = "form-note success";
      note.textContent = "Opening your email app now...";
      window.location.href = mailtoHref;
      contactForm.reset();
    });
  }
})();
