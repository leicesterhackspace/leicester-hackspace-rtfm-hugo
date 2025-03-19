/**
 * Handle for search error timeout
 * @type {Number}
 */
let timeoutHandle;

/**
 * The URL of the server (Since we cannot rely on / being the site root)
 * @type {string}
 */
const BASE_URL = document.documentElement.dataset.siteUrl;

/**
 * Event method for when a search is submitted
 *
 * @param {Event} event Handle for the event
 */
function searchEvent(event) {
    const search = document.querySelector('#search-input').value;

    if (!search || !search.trim()) {
        let container = event.currentTarget.parentElement;
        container.classList.add("error")
        if (timeoutHandle) clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(() => container.classList.remove("error"), 2000);

        return;
    };

    window.location.href = `${BASE_URL}/search?q=${search}`;
}

window.addEventListener("load", async () => {
    const modal = document.querySelector("#image-modal");
    modal.querySelector("button").addEventListener("click", () => modal.close());

    modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.close()
    });

    document.querySelectorAll("picture[data-large]")
        .forEach(picture => {
            picture.addEventListener("click", () => {
                spawnModal(picture.dataset.large);
            });
        });

    document.querySelector('#search-button')
        .addEventListener('click', searchEvent);

    document.querySelector("#search-input")
        .addEventListener("keyup", (e) => {
            if (e.keyCode === 13) searchEvent(e)
        });


    await import(`${BASE_URL}/pagefind/pagefind-highlight.js`);
    new PagefindHighlight({highlightParam: "highlight"});
})
