
// 00:09:32 --> https://www.twitch.tv/videos/1921475710?t=00h09m32s

chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.getSettings) {
        chrome.storage.sync.get().then(settings => {
            console.info('Get settings', settings)
            res({
                resumeBehavior: settings.resumeBehavior ?? 'video',
                saveAfterResume: settings.saveAfterResume ?? false
            })
        })
        return true
    }
    if (req.setSettings) {
        console.info('Set settings', req.setSettings)
        chrome.storage.sync.set({
            ...req.setSettings
        })
        return true
    }
    const urlMatch = sender.tab?.url?.match(/(twitch\.tv\/videos\/\d+)/i)
    if (urlMatch) {
        const vodUrl = urlMatch[1]
        chrome.storage.sync.get(vodUrl).then(savedTimes => {
            // get url for previously stored vod time?
            if (req.getTime) {
                const vodTime = savedTimes[vodUrl]
                // check that time format is valid (just in case)
                if (vodTime && !vodTime.match(/(\d+):(\d+):(\d+)/)) {
                    console.warn(`Invalid/Missing time ${vodTime} for ${vodUrl}`)
                    res()
                }
                else if (vodTime) {
                    const [h, m, s] = vodTime.split(':').map(p => parseInt(p))
                    const seconds = (h * 60 * 60) + (m * 60) + s
                    console.info(`Retrieved ${vodTime} (${seconds}s) for ${vodUrl}`)
                    res({ time: vodTime, seconds })
                }
                else {
                    console.info(`No time found for ${vodUrl}`)
                    res()
                }
            }
            // store vod time?
            if (req.saveTime && savedTimes[vodUrl] !== req.saveTime) {
                chrome.storage.sync.set({ [vodUrl]: req.saveTime })
                    .catch()
                    .then(() => console.info(`Save ${req.saveTime} for ${vodUrl}`))
            }
        })
    }
    return true
})