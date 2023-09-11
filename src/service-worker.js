const INITIAL_STORAGE = {
    vods: {} // { url:  }
}

chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.storage.local.set(INITIAL_STORAGE)
    }
})