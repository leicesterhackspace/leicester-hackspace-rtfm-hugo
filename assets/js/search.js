/**
 * The URL of the server (Since we cannot rely on / being the site root)
 * @type {string}
 */
const BASE_URL = document.documentElement.dataset.siteUrl;

/**
 * Make a single search result
 *
 * @param {ResultData} result The result data representing a search result
 * @returns {HTMLAnchorElement} An element represeting the given search result
 */
function makeSearchResult(result) {
    const container = document.createElement("a");
    container.classList.add("search-result");
    container.href = result.url;

    const title = document.createElement("h2");
    title.textContent = result.meta.title;
    container.appendChild(title);

    for (const subResult of result.sub_results) {
        const excerpt = document.createElement("p");
        excerpt.innerHTML = subResult.excerpt;
        container.appendChild(excerpt);
    }

    return container;
}

async function performSearch(pagefind, searchText) {
    let searchContainer = document.querySelector("#search-container");
    let searchInput = document.querySelector("#search-input");

    if (searchText.length === 0) {
        searchInput.parentElement.classList.add("error")
        searchContainer.innerText = "Nothing searched.";
        return
    }

    const search = await pagefind.debouncedSearch(searchText);

    if (!search) {
        return;
    } else if (search.results.length == 0) {
        searchContainer.innerHTML = "No results.";
        return;
    }

    searchContainer.innerHTML = "";
    for (const result of search.results) {
        const resultData = await result.data();

        searchContainer.append(makeSearchResult(resultData));
    }
}

let searchTimeoutHandle;
async function handleSearchInput(event, pagefind) {
    const searchText = event.currentTarget.value;
    if (searchTimeoutHandle) clearTimeout(searchTimeoutHandle);
    const params = new URLSearchParams(window.location.search);
    params.set("q", searchText);
    searchTimeoutHandle = setTimeout(() => {window.history.replaceState(searchText, "", "?"+params.toString())}, 500)

    await performSearch(pagefind, searchText);
}

window.addEventListener('DOMContentLoaded', async () => {
    const pagefind = await import(`${BASE_URL}/pagefind/pagefind.js`);
    await pagefind.options({
        highlightParam: "highlight"
    });
    pagefind.init();

    const searchText = new URLSearchParams(window.location.search).get("q") || "";
    let searchInput = document.querySelector("#search-input");

    searchInput.addEventListener("input", (e) => handleSearchInput(e, pagefind));

    searchInput.value = searchText;
    await performSearch(pagefind, searchText);
})
