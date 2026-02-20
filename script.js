/* ============================================================
   Model Polytechnic College Vadakara – Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
   * 1. STICKY HEADER – add shadow on scroll
   * ───────────────────────────────────────── */
  const header = document.getElementById('header');

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ─────────────────────────────────────────
   * 2. HAMBURGER MENU (mobile)
   * ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 769) {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });



  /* ─────────────────────────────────────────
 * DARK MODE TOGGLE
 * ───────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');

// Load saved preference (persists across page reloads)
const savedTheme = localStorage.getItem('mpc_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateToggleLabel(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mpc_theme', next);
  updateToggleLabel(next);
});

function updateToggleLabel(theme) {
  themeToggle.setAttribute('data-label', theme === 'dark' ? 'Light Mode' : 'Dark Mode');
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}


  /* ─────────────────────────────────────────
   * 3. NOTIFICATION DROPDOWN
   * ───────────────────────────────────────── */
  const notifBtn      = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const badge         = document.getElementById('badge');
  const markRead      = document.getElementById('markRead');

  let notifOpen = false;

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifOpen = !notifOpen;
    notifDropdown.classList.toggle('open', notifOpen);
    notifBtn.setAttribute('aria-expanded', notifOpen);
  });

  markRead.addEventListener('click', () => {
    // Remove "unread" from all items and hide badge
    document.querySelectorAll('.notif-item.unread').forEach(item => {
      item.classList.remove('unread');
    });
    badge.classList.add('hidden');
    badge.textContent = '0';
  });

  // Clicking a notification item marks it as read
  document.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('unread')) {
        item.classList.remove('unread');
        const current = parseInt(badge.textContent, 10);
        const newCount = Math.max(0, current - 1);
        badge.textContent = newCount;
        if (newCount === 0) badge.classList.add('hidden');
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (notifOpen &&
        !notifDropdown.contains(e.target) &&
        !notifBtn.contains(e.target)) {
      notifOpen = false;
      notifDropdown.classList.remove('open');
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      notifOpen = false;
      notifDropdown.classList.remove('open');
    }
  });


  /* ─────────────────────────────────────────
   * 4. LOGIN MODAL
   * ───────────────────────────────────────── */
  const loginBtn     = document.getElementById('loginBtn');
  const joinBtn      = document.getElementById('joinBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');
  const loginForm    = document.getElementById('loginForm');

  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus first input after transition
    setTimeout(() => {
      document.getElementById('username').focus();
    }, 150);
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  loginBtn.addEventListener('click', openModal);
  joinBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  // Close on overlay backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // Simulate loading state
    const btn = loginForm.querySelector('.btn-submit');
    btn.textContent = 'Signing in…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Sign In';
      btn.disabled = false;
      closeModal();
      showToast(`Welcome back, ${username}!`, 'success');
      loginForm.reset();
    }, 1500);
  });


  /* ─────────────────────────────────────────
   * 5. TOAST NOTIFICATION HELPER
   * ───────────────────────────────────────── */
  function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: ${type === 'success' ? '#1a3a6e' : '#e53935'};
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      border-left: 4px solid ${type === 'success' ? '#c9a84c' : '#ff8a80'};
      z-index: 99999;
      animation: slideInToast 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
      max-width: 320px;
    `;

    // Inject keyframe if not already present
    if (!document.getElementById('toastStyle')) {
      const style = document.createElement('style');
      style.id = 'toastStyle';
      style.textContent = `
        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideOutToast {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(10px) scale(0.95); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }


  /* ─────────────────────────────────────────
   * 6. ACTIVE NAV LINK on scroll
   * ───────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--gold-light, #e8c96d)';
          }
        });
      }
    });
  }, observerOpts);

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ─────────────────────────────────────────
   * 7. SUBTLE SCROLL-REVEAL for cards
   * ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.card, .dept-card, .footer-col');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animation =
          `fadeUp 0.6s ease ${i * 0.08}s both`;
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px' });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    revealObserver.observe(el);
  });

});
