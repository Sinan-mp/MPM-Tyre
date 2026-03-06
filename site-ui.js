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
<<<<<<< HEAD
})();

=======
})();

>>>>>>> 61632fd7412b8d00170d70ed5d13ab4b12015e1b
