let newPasswordValue;
let confirmationValue;

const submitBtn = document.getElementById('update-profile');
const newPassword = document.getElementById('newPassword');
const confirmation = document.getElementById('passwordConfirmation');
const validationMessage = document.getElementById('validation-message');

function validatePasswords(message, add, remove) {
    validationMessage.textContent = message;
    validationMessage.classList.add(add);
    validationMessage.classList.remove(remove);
}

function checkConfirmation(e) {
    newPasswordValue = newPassword.value;
    confirmationValue = confirmation.value;
    if(newPasswordValue !== confirmationValue) {
        validatePasswords('Passwords must match!', 'color-red', 'color-green');
        submitBtn.setAttribute('disabled', true);
    } else {
        validatePasswords('Passwords match!', 'color-green', 'color-red');
        submitBtn.removeAttribute('disabled');
    }
}

confirmation.addEventListener('input', checkConfirmation);
newPassword.addEventListener('input', checkConfirmation);