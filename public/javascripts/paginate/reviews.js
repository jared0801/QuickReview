
function updateDisabledButtons(page) {
    // Update active, important, and mobile-only classes
    $('.page-item.important').removeClass('important');

    const pageBtn = $(`.page-${page}`);
    pageBtn.addClass('active');
    pageBtn.parent().addClass('important');
    pageBtn.parent().next().addClass('important');
    if(page === 1) pageBtn.parent().next().next().addClass('important');
    pageBtn.parent().prev().addClass('important');
    if(page === totalPages) pageBtn.parent().prev().prev().addClass('important');

    // Remove disabled from other buttons
    const disabledLink = $('.page-link.disabled');
    disabledLink.removeClass('disabled');
    disabledLink.attr('aria-disabled', 'false');
    disabledLink.attr('tabindex', '0');

    if(page <= 1) {
        // Add disabled to next page button
        const disabledLink = $('#start-link,#prev-link,#prev-link-2');
        disabledLink.addClass('disabled');
        disabledLink.attr('aria-disabled', 'true');
        disabledLink.attr('tabindex', '-1');
    } else if(page >= totalPages) {
        // Add disabled to next page button
        const disabledLink = $('#last-link,#next-link,#next-link-2');
        disabledLink.addClass('disabled');
        disabledLink.attr('aria-disabled', 'true');
        disabledLink.attr('tabindex', '-1');
    }
}

$(document).ready(() => {
    let activePageNum = Number.parseInt($('.page-link.active').text());
    let activePage = $(`.review-page-${activePageNum}`);
    activePage.addClass('show');

    $('.page-link:not(.disabled)').click((e) => {
        // Get current active page
        activePageNum = Number.parseInt($('.page-link.active').text());
        activePage = $(`.review-page-${activePageNum}`);

        // Get target page
        const target = $(event.target);
        const page = e.target.getAttribute('page');

        // Break if target page is out of range
        if(page > totalPages || page < 1) return;

        // Remove active/shown from active page
        activePage.removeClass('show');
        $('.page-link.active').removeClass('active');

        // Add active/remove to new page
        $(`.review-page-${page}`).addClass('show');


        
        updateDisabledButtons(page);
    });

    // Prev page buttons
    $('#prev-link,#prev-link-2').click((e) => {
        // Get current active page
        activePageNum = Number.parseInt($('.page-link.active').text());
        activePage = $(`.review-page-${activePageNum}`);

        // Get target page
        const page = activePageNum - 1;

        // Break if target page is out of range
        if(page > totalPages || page < 1) return;

        // Remove active/shown from active page
        activePage.removeClass('show');
        $('.page-link.active').removeClass('active');

        // Add active/remove to new page
        $(`.review-page-${page}`).addClass('show');
        $(`.page-${page}`).addClass('active');
        updateDisabledButtons(page);
    });

    // First page button
    $('#start-link').click((e) => {
        // Get current active page
        activePageNum = Number.parseInt($('.page-link.active').text());
        activePage = $(`.review-page-${activePageNum}`);

        // Get target page
        const page = 1;

        // Remove active/shown from active page
        activePage.removeClass('show');
        $('.page-link.active').removeClass('active');

        // Add active/remove to new page
        $(`.review-page-${page}`).addClass('show');
        $(`.page-${page}`).addClass('active');
        updateDisabledButtons(page);
    });

    // Next page buttons
    $('#next-link,#next-link-2').click((e) => {
        // Get current active page
        activePageNum = Number.parseInt($('.page-link.active').text());
        activePage = $(`.review-page-${activePageNum}`);

        // Get target page
        const page = activePageNum + 1;

        // Break if target page is out of range
        if(page > totalPages || page < 1) return;

        // Remove active/shown from active page
        activePage.removeClass('show');
        $('.page-link.active').removeClass('active');

        // Add active/remove to new page
        $(`.review-page-${page}`).addClass('show');
        $(`.page-${page}`).addClass('active');
        updateDisabledButtons(page);
    });

    // Last page button
    $('#last-link').click((e) => {
        // Get current active page
        activePageNum = Number.parseInt($('.page-link.active').text());
        activePage = $(`.review-page-${activePageNum}`);

        // Get target page
        const page = totalPages;

        // Remove active/shown from active page
        activePage.removeClass('show');
        $('.page-link.active').removeClass('active');

        // Add active/remove to new page
        $(`.review-page-${page}`).addClass('show');
        $(`.page-${page}`).addClass('active');
        updateDisabledButtons(page);
    });

    const disabledLink = $('.page-link.disabled');
    
    disabledLink.attr('page', '');
    disabledLink.attr('aria-disabled', 'true');
    disabledLink.attr('tabindex', '-1');

});