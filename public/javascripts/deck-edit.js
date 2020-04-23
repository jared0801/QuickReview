let deckEditForm = document.getElementById('deckEditForm');
// add submit listener to deck edit form
deckEditForm.addEventListener('submit', (event) => {
    // Find number of uploaded images
    let imgUploads = document.getElementById('imageUpload').files.length;
    // Find total number of existing images
    let imgExisting = document.querySelectorAll('.imageDeleteCheckbox').length;
    // find total number of potential deletions
    let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // figure out if the form can be submitted or not
    let newTotal = imgExisting - imgDeletions + imgUploads;
    if(newTotal > 4) {
        event.preventDefault();
        alert(`You cannot upload more than 4 images. Please delete at least ${newTotal - 4} image(s).`);
    }
});