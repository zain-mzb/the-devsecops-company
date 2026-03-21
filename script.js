const header = document.querySelector('.site-header');
const revealElements = document.querySelectorAll('.reveal');
const yearNode = document.querySelector('#year');
const copyEmailButton = document.querySelector('[data-copy-email]');
const copyFeedback = document.querySelector('#contact-copy-feedback');

let copyFeedbackResetTimer;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const syncHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

syncHeaderState();
window.addEventListener('scroll', syncHeaderState, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  observer.observe(element);
});

const writeEmailToClipboard = async (email) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(email);
    return;
  }

  const tempInput = document.createElement('textarea');
  tempInput.value = email;
  tempInput.setAttribute('readonly', '');
  tempInput.style.position = 'absolute';
  tempInput.style.left = '-9999px';
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

const setCopyFeedback = (message, copied = false) => {
  if (!copyFeedback || !copyEmailButton) {
    return;
  }

  copyFeedback.textContent = message;
  copyEmailButton.classList.toggle('is-copied', copied);
  copyEmailButton.textContent = copied ? 'Email Copied' : 'Copy Email Address';

  window.clearTimeout(copyFeedbackResetTimer);

  if (!copied) {
    return;
  }

  copyFeedbackResetTimer = window.setTimeout(() => {
    copyFeedback.textContent = `Email: ${copyEmailButton.dataset.copyEmail}`;
    copyEmailButton.classList.remove('is-copied');
    copyEmailButton.textContent = 'Copy Email Address';
  }, 2200);
};

if (copyEmailButton) {
  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.copyEmail;

    if (!email) {
      return;
    }

    try {
      await writeEmailToClipboard(email);
      setCopyFeedback('Email copied to clipboard.', true);
    } catch (error) {
      setCopyFeedback('Could not copy automatically. Please copy the email shown below.');
    }
  });
}