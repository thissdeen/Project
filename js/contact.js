/* ==========================================================================
   CONTACT FORM JAVASCRIPT VALIDATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');

  // Input event listeners to clear error styling on typing
  [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        clearInputError(input);
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // 1. Check for empty fields
    if (!name) {
      showInputError(nameInput, 'Please enter your name.');
      isValid = false;
    } else {
      clearInputError(nameInput);
    }

    // 2. Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showInputError(emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showInputError(emailInput, 'Please enter a valid email address (e.g. name@example.com).');
      isValid = false;
    } else {
      clearInputError(emailInput);
    }

    // 3. Validate Phone Number (Must contain ONLY digits)
    const digitsOnlyRegex = /^[0-9]+$/;
    if (!phone) {
      showInputError(phoneInput, 'Please enter your phone number.');
      isValid = false;
    } else if (!digitsOnlyRegex.test(phone)) {
      showInputError(phoneInput, 'Phone number must contain only digits (0-9, no letters or special characters).');
      isValid = false;
    } else if (phone.length < 8 || phone.length > 15) {
      showInputError(phoneInput, 'Phone number should be between 8 and 15 digits.');
      isValid = false;
    } else {
      clearInputError(phoneInput);
    }

    // 4. Validate Message
    if (!message) {
      showInputError(messageInput, 'Please enter your message.');
      isValid = false;
    } else {
      clearInputError(messageInput);
    }

    if (!isValid) {
      window.showToast?.('Please resolve the errors highlighted in the form.', 'error');
      return;
    }

    // Submit Simulation
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      contactForm.reset();
      window.showToast?.('Message sent successfully! Sheriff will get back to you soon.', 'success');
    }, 1200);
  });
});

function showInputError(inputElement, errorMessage) {
  inputElement.classList.add('input-error');
  let errorDisplay = inputElement.parentElement.querySelector('.field-error-msg');
  if (!errorDisplay) {
    errorDisplay = document.createElement('span');
    errorDisplay.className = 'field-error-msg';
    inputElement.parentElement.appendChild(errorDisplay);
  }
  errorDisplay.textContent = errorMessage;
}

function clearInputError(inputElement) {
  inputElement.classList.remove('input-error');
  const errorDisplay = inputElement.parentElement.querySelector('.field-error-msg');
  if (errorDisplay) {
    errorDisplay.remove();
  }
}
