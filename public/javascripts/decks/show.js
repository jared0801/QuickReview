$('.toggle-edit-form').on('click', function() {
    // Toggle the edit button text
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    // Toggle visibility of the edit review form
    $(this).parent().parent().find('.edit-review-form').toggle();
});

// Add click listener for clearing rating from edit/new form
$('.clear-rating').click(function() {
    $(this).siblings('.starability-basic').find('#rate0').click();
    $(this).siblings('.starability-basic').find('#edit-rate0').click();
});

$('#viewCtrl').change(function(e) {
    state = e.target.selectedOptions[0].value;
    if(state === 'card') {
        $('.card-list').removeClass('show');
        $('.card-grid').addClass('show');
    } else {
        $('.card-grid').removeClass('show');
        $('.card-list').addClass('show');
    }
});