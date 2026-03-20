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

  document.querySelectorAll('.home-float').forEach(function (homeLink) {
    homeLink.remove();
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

(function () {
  var reviewForm = document.getElementById('customerReviewForm');
  if (!reviewForm) {
    return;
  }

  var storageKey = 'mpmTyresCustomerReviews';
  var reviewList = document.getElementById('customerReviewsList');
  var reviewCountBadge = document.getElementById('reviewCountBadge');
  var message = document.getElementById('reviewFormMessage');
  var photoInput = document.getElementById('reviewPhoto');
  var photoPreview = document.getElementById('reviewPhotoPreview');
  var photoPreviewImage = document.getElementById('reviewPhotoPreviewImage');

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getStoredReviews() {
    try {
      var raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function saveReviews(reviews) {
    localStorage.setItem(storageKey, JSON.stringify(reviews));
  }

  function renderStars(count) {
    return '&#9733;'.repeat(count) + '<span style="color: rgba(255,255,255,0.24);">' + '&#9733;'.repeat(5 - count) + '</span>';
  }

  function renderReviews() {
    var reviews = getStoredReviews();

    if (reviewCountBadge) {
      reviewCountBadge.textContent = reviews.length + (reviews.length === 1 ? ' Review' : ' Reviews');
    }

    if (!reviews.length) {
      reviewList.innerHTML = '<p class="review-empty-state">No reviews yet. Be the first customer to write one.</p>';
      return;
    }

    var html = reviews.map(function (review) {
      var hasPhoto = Boolean(review.photo);
      return (
        '<article class="review-card' + (hasPhoto ? '' : ' has-no-photo') + '">' +
          '<div class="review-card-content">' +
            '<div class="review-card-head">' +
              '<div>' +
                '<h4>' + escapeHtml(review.name) + '</h4>' +
                '<span class="review-date">' + escapeHtml(review.date) + '</span>' +
              '</div>' +
              '<div class="review-stars" aria-label="' + review.rating + ' out of 5 stars">' + renderStars(review.rating) + '</div>' +
            '</div>' +
            '<p class="review-text">' + escapeHtml(review.message) + '</p>' +
          '</div>' +
          (hasPhoto ? '<img class="review-card-photo" src="' + review.photo + '" alt="Customer review photo">' : '') +
        '</article>'
      );
    }).join('');

    reviewList.innerHTML = html;
  }

  function resetPreview() {
    if (photoPreview) {
      photoPreview.hidden = true;
    }
    if (photoPreviewImage) {
      photoPreviewImage.src = '';
    }
  }

  photoInput.addEventListener('change', function () {
    var file = photoInput.files && photoInput.files[0];
    if (!file) {
      resetPreview();
      return;
    }

    if (!file.type || file.type.indexOf('image/') !== 0) {
      message.textContent = 'Please select an image file only.';
      photoInput.value = '';
      resetPreview();
      return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      if (photoPreview && photoPreviewImage) {
        photoPreviewImage.src = event.target.result;
        photoPreview.hidden = false;
      }
    };
    reader.readAsDataURL(file);
  });

  reviewForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = document.getElementById('reviewerName').value.trim();
    var selectedRating = reviewForm.querySelector('input[name="reviewRating"]:checked');
    var reviewMessage = document.getElementById('reviewMessage').value.trim();
    var photo = photoPreviewImage && photoPreviewImage.src ? photoPreviewImage.src : '';

    if (!name || !selectedRating || !reviewMessage) {
      message.textContent = 'Please fill in your name, rating, and review.';
      return;
    }

    var reviews = getStoredReviews();
    reviews.unshift({
      name: name,
      rating: Number(selectedRating.value),
      message: reviewMessage,
      photo: photo,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    });

    saveReviews(reviews);
    renderReviews();
    reviewForm.reset();
    resetPreview();
    message.textContent = 'Your review has been added successfully.';
  });

  renderReviews();
})();
