export { fetchJSON };

async function fetchJSON(path) {
    // YOUR CODE HERE
    const response = await fetch(`bd/${path}.json`)
    return await response.json()
}
