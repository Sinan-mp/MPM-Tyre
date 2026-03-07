(function () {
  function closeAllDropdowns(exceptMenu) {
    document.querySelectorAll('.dropdown-menu.show').forEach(function (menu) {
      if (menu !== exceptMenu) {
        menu.classList.remove('show');
      }
    });
  }

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-ui-toggle="dropdown"]');
    if (toggle) {
      event.preventDefault();
      var menu = toggle.parentElement ? toggle.parentElement.querySelector('.dropdown-menu') : null;
      if (!menu) {
        return;
      }

      var willShow = !menu.classList.contains('show');
      closeAllDropdowns(menu);
      if (willShow) {
        menu.classList.add('show');
      } else {
        menu.classList.remove('show');
      }
      return;
    }

    if (!event.target.closest('.dropdown')) {
      closeAllDropdowns(null);
    }
  });

  document.querySelectorAll('.navbar-toggler[data-ui-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetSelector = btn.getAttribute('data-ui-target');
      if (!targetSelector) {
        return;
      }

      var target = document.querySelector(targetSelector);
      if (!target) {
        return;
      }

      target.classList.toggle('show');
    });
  });

  if (!document.querySelector('.whatsapp-float')) {
    var whatsappLink = document.createElement('a');
    whatsappLink.className = 'whatsapp-float';
    whatsappLink.href = 'https://wa.me/919946392113?text=Hello%20MPM%20Tyres%2C%20I%20need%20more%20details%20about%20your%20services.';
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.setAttribute('aria-label', 'Chat with MPM Tyres on WhatsApp');
    whatsappLink.textContent = 'WhatsApp Chat';
    document.body.appendChild(whatsappLink);
  }

})();
