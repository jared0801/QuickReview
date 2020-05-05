$(document).ready(() => {
    const disabledLink = $('.page-link.disabled');
    
    disabledLink.attr('href', '');
    disabledLink.attr('aria-disabled', 'true');
    disabledLink.attr('tabindex', '-1');

    disabledLink.click(function(e) {
        e.preventDefault();
        return false;
    });
});