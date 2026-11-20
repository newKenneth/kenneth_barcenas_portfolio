document.addEventListener("DOMContentLoaded", () => {
  const refreshIcons = () => {
    if (window.lucide) {
      lucide.createIcons();
    }
  };

  refreshIcons();

  // 1. Dynamic Footer Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Typing Effect in Hero
  const roles = [
    "UI/UX Designer.",
    "BSIT Student.",
    "Web Developer.",
    "Java & Python Builder."
  ];
  const typedEl = document.getElementById("typedRole");
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const typeLoop = () => {
    if (!typedEl) return;
    const current = roles[roleIdx];
    typedEl.textContent = isDeleting
      ? current.substring(0, charIdx - 1)
      : current.substring(0, charIdx + 1);

    charIdx += isDeleting ? -1 : 1;
    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && charIdx === current.length) {
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 300;
    }
    setTimeout(typeLoop, delay);
  };
  typeLoop();

  // 3. Dark / Light Theme Toggle
  const rootEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  const syncThemeIcons = (isLight) => {
    if (!sunIcon || !moonIcon) return;
    sunIcon.classList.toggle("hidden", !isLight);
    moonIcon.classList.toggle("hidden", isLight);
  };

  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    rootEl.classList.add("light");
    syncThemeIcons(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      rootEl.classList.toggle("light");
      const isLight = rootEl.classList.contains("light");
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
      syncThemeIcons(isLight);
    });
  }

  // 4. Improved Mobile Menu Toggle (Icon Swap + Outside Click + Escape)
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  const setMobileMenuState = (isOpen) => {
    if (!mobileMenu || !mobileMenuBtn) return;
    mobileMenu.classList.toggle("hidden", !isOpen);
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}" class="w-5 h-5"></i>`;
    refreshIcons();
  };

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.setAttribute("aria-expanded", "false");

    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = !mobileMenu.classList.contains("hidden");
      setMobileMenuState(!isCurrentlyOpen);
    });

    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => setMobileMenuState(false));
    });

    document.addEventListener("click", (e) => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      if (isOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        setMobileMenuState(false);
      }
    });
  }

  // 5. Scroll Progress Bar & Active Nav Scroll-Spy
  const scrollProgress = document.getElementById("scrollProgress");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && docHeight > 0) {
      scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;
    }

    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollTop >= top && scrollTop < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  });

  // 6. Interactive 3D Card Tilt on Mouse Move
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // 7. Skill Category Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      skillCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  // 8. Project Category Filtering
  const projFilterBtns = document.querySelectorAll(".proj-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  projFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      projFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.proj;

      projectCards.forEach((card) => {
        const match = filter === "all" || card.dataset.projCat === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  // 9. Interactive Case Study Modal (with Scroll Lock & Focus Return)
  const modal = document.getElementById("projectModal");
  const modalBox = document.getElementById("modalBox");
  const closeModalBtn = document.getElementById("closeModalBtn");
  let lastFocusedTrigger = null;

  const isModalOpen = () => Boolean(modal && !modal.classList.contains("hidden"));

  const openModal = (btn) => {
    if (!modal || !modalBox) return;
    lastFocusedTrigger = btn;

    document.getElementById("modalTitle").textContent = btn.dataset.title || "";
    document.getElementById("modalRole").textContent = btn.dataset.role || "";
    document.getElementById("modalSummary").textContent = btn.dataset.summary || "";

    const modalStackEl = document.getElementById("modalStack");
    if (modalStackEl) {
      modalStackEl.textContent = btn.dataset.stack || "";
    }

    const list = document.getElementById("modalHighlights");
    if (list) {
      list.innerHTML = "";
      (btn.dataset.highlights || "").split(";").forEach((item) => {
        if (item.trim()) {
          const li = document.createElement("li");
          li.className = "flex items-start gap-2";
          li.innerHTML = `<span class="text-sky-400 mt-0.5">▹</span><span>${item.trim()}</span>`;
          list.appendChild(li);
        }
      });
    }

    // Lock background scrolling
    document.body.classList.add("overflow-hidden");

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    requestAnimationFrame(() => {
      modalBox.classList.remove("scale-95");
      closeModalBtn?.focus();
    });
  };

  const closeModal = () => {
    if (!modal || !modalBox) return;
    modalBox.classList.add("scale-95");

    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.classList.remove("overflow-hidden");

      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
        lastFocusedTrigger.focus();
        lastFocusedTrigger = null;
      }
    }, 150);
  };

  document.querySelectorAll(".open-modal-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn));
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Global Escape handler for Modal & Mobile Menu
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (isModalOpen()) {
      closeModal();
      return;
    }

    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      setMobileMenuState(false);
      mobileMenuBtn?.focus();
    }
  });

  // 10. Toast, Copy Email, Resume Download & Form Submission
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  let toastTimeout = null;

  const showToast = (msg) => {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove("hidden");
    toast.classList.add("flex");
    refreshIcons();

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add("hidden");
      toast.classList.remove("flex");
    }, 3000);
  };

  const copyEmail = async () => {
    const email = document.getElementById("emailText")?.textContent.trim();
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied to clipboard!");
    } catch {
      showToast("Failed to copy email.");
    }
  };

  document.getElementById("copyEmailBtn")?.addEventListener("click", copyEmail);
  document.getElementById("quickCopyBtn")?.addEventListener("click", copyEmail);

  const resumeBtn = document.querySelector('a[download]');
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      showToast("Downloading Kenneth-B-Barcenas-Resume.pdf...");
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method || "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          showToast("Message sent! Thanks for reaching out.");
          contactForm.reset();
        } else {
          showToast("Could not send message. Check your form endpoint.");
        }
      } catch {
        showToast("Network error. Please try again.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          refreshIcons();
        }
      }
    });
  }

  // 11. Scroll Reveal Animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
});