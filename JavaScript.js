document.addEventListener('DOMContentLoaded', () => {

  // 1. Dynamic Footer Year
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your-form-id';

  function showStatus(message, isSuccess) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.style.color = isSuccess ? '#3fb950' : '#f85149';
  }

  function setLoading(isLoading) {
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Sending...' : 'Send Message';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill out all fields.', false);
        return;
      }

      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', false);
        return;
      }

      setLoading(true);
      showStatus('Sending your message...', true);

      try {
        if (FORMSPREE_ENDPOINT.includes('your-form-id')) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          contactForm.reset();
          showStatus('Demo mode: form is ready. Replace the Formspree endpoint in JavaScript.js with your real form ID.', true);
          return;
        }

        const formData = new FormData(contactForm);
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        contactForm.reset();
        showStatus(`Thank you, ${name}! Your message has been sent.`, true);
      } catch (error) {
        showStatus('Something went wrong. Please try again later.', false);
      } finally {
        setLoading(false);
      }
    });
  }

});


