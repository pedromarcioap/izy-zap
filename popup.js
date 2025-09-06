document.addEventListener('DOMContentLoaded', function () {
  // Views
  const inputView = document.getElementById('inputView');
  const optionsView = document.getElementById('optionsView');
  const qrCodeView = document.getElementById('qrCodeView');

  // Buttons
  const generateLinkButton = document.getElementById('generateLinkButton');
  const openTabButton = document.getElementById('openTabButton');
  const copyLinkButton = document.getElementById('copyLinkButton');
  const generateQrButton = document.getElementById('generateQrButton');
  const backButton = document.getElementById('backButton');
  const qrBackButton = document.getElementById('qrBackButton');

  // Inputs
  const countryCodeInput = document.getElementById('countryCode');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const messageInput = document.getElementById('prewrittenMessage');

  // QR Code Container
  const qrCodeContainer = document.getElementById('qrCodeContainer');

  let currentUrl = '';
  let qrcode = null; // To hold the QRCode instance

  // --- Storage Functions ---
  function saveCountryCode(code) {
    chrome.storage.local.set({ savedCountryCode: code });
  }

  function loadCountryCode() {
    chrome.storage.local.get(['savedCountryCode'], function(result) {
      if (result.savedCountryCode) {
        countryCodeInput.value = result.savedCountryCode;
      }
    });
  }

  // --- View Management ---
  function showView(viewToShow) {
    inputView.classList.add('hidden');
    optionsView.classList.add('hidden');
    qrCodeView.classList.add('hidden');
    viewToShow.classList.remove('hidden');
  }

  // --- Event Listeners ---
  generateLinkButton.addEventListener('click', function() {
    const phoneNumber = phoneNumberInput.value;
    const countryCode = countryCodeInput.value;
    const message = messageInput.value.trim();

    if (phoneNumber && phoneNumber.trim() !== '') {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      let baseUrl = `https://wa.me/${countryCode}${cleanedNumber}`;

      if (message) {
        baseUrl += `?text=${encodeURIComponent(message)}`;
      }

      currentUrl = baseUrl;
      saveCountryCode(countryCode);
      showView(optionsView);
    } else {
      phoneNumberInput.focus();
    }
  });

  backButton.addEventListener('click', function() {
    showView(inputView);
    phoneNumberInput.value = '';
    messageInput.value = '';
    copyLinkButton.textContent = 'Copiar link';
  });

  qrBackButton.addEventListener('click', function() {
    showView(optionsView); // Go back to the options view
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
        }, 1500);
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
        copyLinkButton.textContent = 'Erro ao copiar';
      });
    }
  });

  generateQrButton.addEventListener('click', function() {
    if (currentUrl) {
      qrCodeContainer.innerHTML = ''; // Clear previous QR code
      qrcode = new QRCode(qrCodeContainer, {
        text: currentUrl,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.H
      });
      showView(qrCodeView);
    }
  });

  phoneNumberInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      generateLinkButton.click();
    }
  });

  // --- Initial Load ---
  loadCountryCode();
});
