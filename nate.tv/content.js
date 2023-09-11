let resumed = false
const addResumeButton = (time, seconds, resumeBehavior) => {
    const $oldButton = document.getElementById('natetv')
    if ($oldButton) {
        $oldButton.remove()
    }

    const $button = document.createElement(resumeBehavior === 'js' ? 'button' : 'a')
    $button.id = 'natetv-resume'
    $button.style.backgroundColor = 'var(--color-background-button-primary-default)'
    $button.style.padding = '0px 10px'
    $button.style.height = '100%'
    $button.style.borderRadius = '3px'
    $button.style.margin = '0px 5px'
    $button.style.color = 'white'
    $button.style.display = 'flex'
    $button.style.alignItems = 'center'
    $button.style.whiteSpace = 'break-spaces'
    if (resumeBehavior === 'url') {
        const parts = time.split(':')
        $button.href = `${window.location.origin}${window.location.pathname}?t=${parts[0]}h${parts[1]}m${parts[2]}s`
    }
    
    const $text1 = document.createElement('span')
    $text1.innerText = 'Resume from '
    $button.appendChild($text1)

    const $text2 = document.createElement('span')
    $text2.innerText = time
    $text2.style.fontWeight = 'bold'
    $button.appendChild($text2)

    document.querySelector('.player-controls__right-control-group').prepend($button)

    $button.addEventListener('click', () => {
        resumed = true
        const $video = document.querySelector('.persistent-player video')
        if ($video) {
            $video.currentTime = seconds
        }
    })
}

window.addEventListener('load', async () => {
    const settings = await chrome.runtime.sendMessage({ getSettings: true }).catch(console.error)
    const getTime = await chrome.runtime.sendMessage({ getTime: true }).catch(console.error)
    if (getTime && getTime.seconds && getTime.time) {
        console.info(`Add resume button for ${getTime.time} ${getTime.seconds}s`)
        addResumeButton(getTime.time, getTime.seconds, settings.resumeBehavior)
    }
    setInterval(() => {
        const $currentTime = document.querySelector('[data-a-target="player-seekbar-current-time"]')
        if ($currentTime && (resumed || !settings.saveAfterResume || !getTime)) {
            chrome.runtime.sendMessage({ saveTime: $currentTime.textContent })
        }
    }, 1000)
})