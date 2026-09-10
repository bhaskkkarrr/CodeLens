document.addEventListener("DOMContentLoaded", function () {
    const errorMessage = document.getElementById("errorMessage");

    if (errorMessage) {
        showModal(errorMessage.value);
    }

    function showModal(message) {
        const modalMessage = document.getElementById('errorModalMessage');
        modalMessage.textContent = message;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
});

function confirmLogout() {
    return confirm('Are you sure you want to logout?');
}