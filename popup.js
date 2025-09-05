document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById("myModal");
  var openButton = document.getElementById("openButton");
  var span = document.getElementsByClassName("close")[0];
  var openTabButton = document.getElementById("openTabButton");
  var copyLinkButton = document.getElementById("copyLinkButton");

  var currentUrl = '';

  openButton.onclick = function() {
    var phoneNumber = document.getElementById('phoneNumber').value;
    if (phoneNumber) {
      var cleanedNumber = phoneNumber.replace(/\D/g, '');
      currentUrl = 'https://wa.me/55' + cleanedNumber;
      modal.style.display = "block";
    } else {
      // Optional: Show an error or do nothing if the input is empty
    }
  }

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  openTabButton.onclick = function() {
    if (currentUrl) {
      chrome.tabs.create({ url: currentUrl });
      modal.style.display = "none";
    }
  }

  copyLinkButton.onclick = function() {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl).then(function() {
        // Optional: Give user feedback that text was copied
        copyLinkButton.textContent = 'Copiado!';
        setTimeout(function() {
            copyLinkButton.textContent = 'Copiar link';
            modal.style.display = "none";
        }, 1000);
      }, function(err) {
        // Optional: Handle errors
        console.error('Could not copy text: ', err);
      });
    }
  }
});
