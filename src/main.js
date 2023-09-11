(async () => {
    const settings = await chrome.runtime.sendMessage({ getSettings: true }).catch(console.error)
    if (settings.resumeBehavior) {
        document.querySelector('[name="resume-behavior"]').value = settings.resumeBehavior
    }
    if (settings.saveAfterResume) {
        document.querySelector('[name="save-after-resume"]').checked = !!settings.saveAfterResume
    }
})()

document.querySelector('[name="resume-behavior"]').addEventListener('change', e => {
    chrome.runtime.sendMessage({ setSettings: { resumeBehavior: e.target.value } })
})

document.querySelector('[name="save-after-resume"]').addEventListener('change', e => {
    chrome.runtime.sendMessage({ setSettings: { saveAfterResume: !!e.target.checked } })
})