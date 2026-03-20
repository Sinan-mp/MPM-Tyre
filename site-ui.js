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

  var reviewList = document.getElementById('customerReviewsList');
  var reviewCountBadge = document.getElementById('reviewCountBadge');
  var message = document.getElementById('reviewFormMessage');
  var submitButton = reviewForm.querySelector('button[type="submit"]');
  var apiBaseUrl = getApiBaseUrl();

  function getApiBaseUrl() {
    var isLiveServer =
      window.location.port === '5500' &&
      (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');

    if (isLiveServer) {
      return window.location.protocol + '//localhost:4000';
    }

    return '';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderStars(count) {
    return '&#9733;'.repeat(count) + '<span style="color: rgba(255,255,255,0.24);">' + '&#9733;'.repeat(5 - count) + '</span>';
  }

  async function readApiResponse(response) {
    var contentType = response.headers.get('content-type') || '';

    if (contentType.indexOf('application/json') !== -1) {
      return response.json();
    }

    var text = await response.text();
    if (text && text.trim().charAt(0) === '<') {
      throw new Error('Reviews need the Node server. Open this site through http://localhost:4000, not Live Server.');
    }

    if (!text) {
      throw new Error('Empty response from the review service.');
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Invalid response from the review service.');
    }
  }

  function formatDate(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function renderReviews(reviews) {
    reviews = Array.isArray(reviews) ? reviews : [];

    if (reviewCountBadge) {
      reviewCountBadge.textContent = reviews.length + (reviews.length === 1 ? ' Review' : ' Reviews');
    }

    if (!reviews.length) {
      reviewList.innerHTML = '<p class="review-empty-state">No reviews yet. Be the first customer to write one.</p>';
      return;
    }

    var html = reviews.map(function (review) {
      return (
        '<article class="review-card">' +
          '<div class="review-card-content">' +
            '<div class="review-card-head">' +
              '<div>' +
                '<h4>' + escapeHtml(review.name) + '</h4>' +
                '<span class="review-date">' + escapeHtml(formatDate(review.createdAt)) + '</span>' +
              '</div>' +
              '<div class="review-stars" aria-label="' + review.rating + ' out of 5 stars">' + renderStars(review.rating) + '</div>' +
            '</div>' +
            '<p class="review-text">' + escapeHtml(review.message) + '</p>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    reviewList.innerHTML = html;
  }

  async function loadReviews() {
    try {
      reviewList.innerHTML = '<p class="review-empty-state">Loading reviews...</p>';
      var response = await fetch(apiBaseUrl + '/api/reviews');
      var reviews = await readApiResponse(response);
      if (!response.ok) {
        throw new Error(reviews.message || 'Could not load reviews.');
      }
      renderReviews(reviews);
    } catch (error) {
      reviewList.innerHTML = '<p class="review-empty-state">' + escapeHtml(error.message || 'Could not load reviews right now.') + '</p>';
    }
  }

  reviewForm.addEventListener('submit', function (event) {
    event.preventDefault();
    submitReview();
  });

  async function submitReview() {
    var name = document.getElementById('reviewerName').value.trim();
    var selectedRating = reviewForm.querySelector('input[name="reviewRating"]:checked');
    var reviewMessage = document.getElementById('reviewMessage').value.trim();

    if (!name || !selectedRating || !reviewMessage) {
      message.textContent = 'Please fill in your name, rating, and review.';
      return;
    }

    message.textContent = 'Posting your review...';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Posting...';
    }

    try {
      var response = await fetch(apiBaseUrl + '/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          rating: Number(selectedRating.value),
          message: reviewMessage
        })
      });
      var payload = await readApiResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Could not save review.');
      }

      reviewForm.reset();
      message.textContent = 'Your review has been added successfully.';
      await loadReviews();
    } catch (error) {
      message.textContent = error.message || 'Could not save review.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Post Review';
      }
    }
  }

  loadReviews();
})();
