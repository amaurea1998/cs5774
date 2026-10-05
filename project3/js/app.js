$(function () {
  const query = new URLSearchParams(window.location.search).get('q') || '';
  const $searchResults = $('#search-results');

  $('#header-search').val(query);

  if ($searchResults.length) {
    $('#search-heading').text(
      query.trim() ? 'Results for "' + query.trim() + '"' : 'Search results',
    );

    // This is a simulated search with one supported keyphrase.
    if (query.trim().toLowerCase() === 'kettle') {
      const $result = $('<article>', { class: 'search-result' });
      $result.append(
        $('<p>', { class: 'case-id small' }).text('PS-1042'),
        $('<h2>').append($('<a>', { href: 'detail.html' }).text('Countertop kettle')),
        $('<p>').text('Model K1. An AI update weakened a required verification step.'),
        $('<a>', { href: 'review-update.html' }).text('Review the AI update'),
      );
      $('#search-count').text('1 matching case');
      $searchResults.append($result);
    } else {
      $('#search-count').text('No matching cases');
      $searchResults.append(
        $('<p>').text(
          query.trim()
            ? 'No results for "' + query.trim() + '". Try kettle.'
            : 'Enter kettle in the search box to find the example case.',
        ),
      );
    }
  }

  const $caseList = $('.case-list');

  function filterCases(showMessage) {
    const status = $('#status').val();
    const sort = $('#sort').val();
    const $cases = $caseList.children('li');
    let count = 0;

    $cases.each(function () {
      const matches = status === 'all' || $(this).attr('data-status') === status;
      $(this).prop('hidden', !matches);
      if (matches) count += 1;
    });

    $cases
      .sort(function (first, second) {
        if (sort === 'product') {
          return $(first).find('h2').text().localeCompare($(second).find('h2').text());
        }
        const difference =
          Number($(first).attr('data-order')) - Number($(second).attr('data-order'));
        return sort === 'oldest' ? -difference : difference;
      })
      .appendTo($caseList);

    const label = $('#status option:selected').text();
    $('#results').text(count + (count === 1 ? ' case' : ' cases') + ' · ' + label);

    if (showMessage) {
      const message =
        count === 0
          ? 'No cases have this status. Choose another status to see the queue.'
          : 'Showing ' + label.toLowerCase() + '.';
      $('#filter-notices')
        .empty()
        .append($('<p>', { id: 'filter-feedback', class: 'muted small' }).text(message));
    }
  }

  if ($caseList.length) {
    filterCases(false);
    $('.filters').on('change', 'select', function () {
      filterCases(true);
    });
  }

  // Delegation keeps the handler on the review section; traversal limits edits to that section.
  $('#review-workflow').on('click', '.restore-requirement', function () {
    const $review = $(this).closest('#review-workflow');
    const note = $review.find('#review-note').val().trim();
    const $entry = $('<li>', { class: 'restored-entry' });

    $review
      .find('.proposed-wording')
      .text('Do not close the case until the independent incident report has been verified.');
    $review
      .find('.proposed-status')
      .removeClass('warning')
      .addClass('good')
      .text('Verification required');
    $review.find('.pending-version').text('Reviewed version 3');
    $review.find('.update-warning strong').text('R1 restored in the reviewed plan');
    $review
      .find('.update-warning p')
      .text('Independent verification is still outstanding. Closure remains blocked.');
    $review.find('.update-warning .version').text('v3 · corrected');

    $entry.append(
      $('<strong>').text('4. Reviewer correction'),
      $('<p>').text('Independent verification is required before closure.'),
    );
    if (note) $entry.append($('<p>').text('Review note: ' + note));
    $review.find('.handoffs').append($entry);
    $review
      .find('.review-feedback')
      .empty()
      .append(
        $('<p>').text('Requirement restored. The case remains open while the report is checked.'),
      );
    $(this).prop('disabled', true).text('Requirement restored');
    $('a[href="detail.html"]').attr('href', 'detail.html#restored');
  });

  if (window.location.hash === '#restored') {
    $('a[href="review-update.html"]').attr('href', 'review-update.html#restored');
  }
});
