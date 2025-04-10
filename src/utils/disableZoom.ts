/**
 * Utility to disable pinch zoom and double-tap zoom on mobile devices
 */
export function disableZoom() {
    // Update meta viewport tag to prevent zooming
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    } else {
        // Create meta viewport tag if it doesn't exist
        const meta = document.createElement('meta')
        meta.name = 'viewport'
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        document.head.appendChild(meta)
    }

    // Prevent touchmove events with more than one touch (pinch)
    document.addEventListener(
        'touchmove',
        function (event) {
            if (event.touches.length > 1) {
                event.preventDefault()
            }
        },
        { passive: false },
    )

    // Prevent double-tap from zooming
    let lastTouchEnd = 0
    document.addEventListener(
        'touchend',
        function (event) {
            const now = Date.now()
            if (now - lastTouchEnd < 300) {
                event.preventDefault()
            }
            lastTouchEnd = now
        },
        { passive: false },
    )
}
