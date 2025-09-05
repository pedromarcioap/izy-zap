document.addEventListener('DOMContentLoaded', function () {
  // Views
  const inputView = document.getElementById('inputView');
  const optionsView = document.getElementById('optionsView');

  // Buttons
  const generateLinkButton = document.getElementById('generateLinkButton');
  const openTabButton = document.getElementById('openTabButton');
  const copyLinkButton = document.getElementById('copyLinkButton');
  const backButton = document.getElementById('backButton');

  // Input
  const phoneNumberInput = document.getElementById('phoneNumber');

  let currentUrl = '';

  // Function to switch views
  function showView(viewToShow) {
    inputView.classList.add('hidden');
    optionsView.classList.add('hidden');
    viewToShow.classList.remove('hidden');
  }

  // Event Listeners
  generateLinkButton.addEventListener('click', function() {
    const phoneNumber = phoneNumberInput.value;
    if (phoneNumber && phoneNumber.trim() !== '') {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      currentUrl = 'https://wa.me/55' + cleanedNumber;
      showView(optionsView);
    } else {
      phoneNumberInput.focus(); // Focus input if it's empty
    }
  });

  backButton.addEventListener('click', function() {
    showView(inputView);
    phoneNumberInput.value = ''; // Clear the input field
    // Reset copy button text in case it was changed
    copyLinkButton.textContent = 'Copiar link';
  });

  openTabButton.addEventListener('click', function() {
    if (currentUrl) {
      chrome.tabs.create({ url: currentUrl });
    }
  });

  copyLinkButton.addEventListener('click', function() {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl).then(function() {
        copyLinkButton.textContent = 'Copiado!';
        setTimeout(function() {
          copyLinkButton.textContent = 'Copiar link';
        }, 1500); // Reset text after 1.5 seconds
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
        copyLinkButton.textContent = 'Erro ao copiar';
      });
    }
  });

  // Allow pressing Enter to generate the link
  phoneNumberInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if it were in a form
      generateLinkButton.click();
    }
  });
});
