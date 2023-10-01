

export const postContent = (dict) => ({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(dict),
});

export const queryValue = (query) => {
    if (window.location.search.length === 0) {
        return undefined;
    }
    const result = window.location.search.slice(1)
        .split('&')
        .map(entry => entry.split('=').map(v => decodeURI(v)))
        .filter(entry => entry[0] === query);
    if (result.length === 0) {
        return undefined;
    }
    return result[0][1];
}
