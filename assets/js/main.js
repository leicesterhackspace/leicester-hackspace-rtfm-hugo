/**
 * Open the modal dialog with an image
 * @param src The path to the image to open in the modal
 */
function spawnModal(src) {
    const modal = document.querySelector("#image-modal");

    const preload = new Image();
    preload.src = src;
    preload.addEventListener("load", () => {
        modal.querySelector("img").src = preload.src;
        modal.showModal();
    })
}

function setNav(state) {
    const nav = document.querySelector("nav");
    if (state || !nav.classList.contains("toggled")) {
        nav.classList.add("toggled");
    } else {
        nav.classList.remove("toggled");
    }
}

window.addEventListener("load", () => {
    document.querySelectorAll(".nav-hamburger, .dismiss").forEach(button => button.addEventListener("click", (event) => {
        setNav()
    }));
});
