$('.toggle-edit-form').on('click', function() {
    // Toggle the edit button text
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    // Toggle visibility of the edit review form
    $(this).siblings('.edit-review-form').toggle();
})