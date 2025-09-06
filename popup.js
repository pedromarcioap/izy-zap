document.addEventListener('DOMContentLoaded', function () {
  // --- DOM Elements ---
  const inputView = document.getElementById('inputView');
  const optionsView = document.getElementById('optionsView');
  const qrCodeView = document.getElementById('qrCodeView');

  const generateLinkButton = document.getElementById('generateLinkButton');
  const openTabButton = document.getElementById('openTabButton');
  const copyLinkButton = document.getElementById('copyLinkButton');
  const generateQrButton = document.getElementById('generateQrButton');
  const backButton = document.getElementById('backButton');
  const qrBackButton = document.getElementById('qrBackButton');

  const countryCodeInput = document.getElementById('countryCodeInput');
  const countryCodesList = document.getElementById('countryCodesList');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const messageInput = document.getElementById('prewrittenMessage');

  const qrCodeContainer = document.getElementById('qrCodeContainer');

  // --- State ---
  let currentUrl = '';
  let qrcode = null;
  let countries = [];

  // --- Functions ---
  async function loadAndPopulateCountries() {
    try {
      const response = await fetch('countries.json');
      countries = await response.json();

      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = `${country.flag} ${country.name} (+${country.code})`;
        option.dataset.code = country.code; // Use data-code for the numeric value
        countryCodesList.appendChild(option);
      });
    } catch (error) {
      console.error("Could not load countries data:", error);
    }
  }

  function parseCountryCode(inputValue) {
    if (!inputValue) return null;
    const selectedOption = Array.from(countryCodesList.options).find(opt => opt.value === inputValue);
    if (selectedOption && selectedOption.dataset.code) {
      return selectedOption.dataset.code;
    }
    const digits = inputValue.replace(/\D/g, '');
    return digits || null;
  }

  function saveLastDDI(numericCode) {
    chrome.storage.local.set({ lastNumericDDI: numericCode });
  }

  function loadLastDDI() {
    chrome.storage.local.get(['lastNumericDDI'], function(result) {
      if (result.lastNumericDDI) {
        const foundCountry = countries.find(c => c.code === result.lastNumericDDI);
        if (foundCountry) {
          countryCodeInput.value = `${foundCountry.flag} ${foundCountry.name} (+${foundCountry.code})`;
        } else {
            // If the saved code isn't in our list, just show the code.
            countryCodeInput.value = result.lastNumericDDI;
        }
      }
    });
  }

  function showView(viewToShow) {
    inputView.classList.add('hidden');
    optionsView.classList.add('hidden');
    qrCodeView.classList.add('hidden');
    viewToShow.classList.remove('hidden');
  }

  // --- Event Listeners ---
  generateLinkButton.addEventListener('click', function() {
    const ddiValue = countryCodeInput.value;
    const phoneNumber = phoneNumberInput.value;
    const message = messageInput.value.trim();

    const countryCode = parseCountryCode(ddiValue);
    const cleanedNumber = phoneNumber.replace(/\D/g, '');

    if (countryCode && cleanedNumber) {
      let baseUrl = `https://wa.me/${countryCode}${cleanedNumber}`;
      if (message) {
        baseUrl += `?text=${encodeURIComponent(message)}`;
      }
      currentUrl = baseUrl;
      saveLastDDI(countryCode); // Save the numeric code
      showView(optionsView);
    } else {
      if (!countryCode) countryCodeInput.focus();
      else phoneNumberInput.focus();
    }
  });

  backButton.addEventListener('click', function() {
    showView(inputView);
    phoneNumberInput.value = '';
    messageInput.value = '';
    copyLinkButton.textContent = 'Copiar link';
  });

  qrBackButton.addEventListener('click', function() {
    showView(optionsView);
  });

  openTabButton.addEventListener('click', function() {
    if (currentUrl) chrome.tabs.create({ url: currentUrl });
  });

  copyLinkButton.addEventListener('click', function() {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        copyLinkButton.textContent = 'Copiado!';
        setTimeout(() => { copyLinkButton.textContent = 'Copiar link'; }, 1500);
      }).catch(err => {
        console.error('Could not copy text: ', err);
        copyLinkButton.textContent = 'Erro ao copiar';
      });
    }
  });

  generateQrButton.addEventListener('click', function() {
    if (currentUrl) {
      qrCodeContainer.innerHTML = '';
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
  async function initialize() {
    await loadAndPopulateCountries();
    loadLastDDI();
  }

  initialize();
});
