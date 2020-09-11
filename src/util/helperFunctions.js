export function updateScroll(){
    try {
        setTimeout(() => {
            const element = document.getElementsByClassName("chat-list")[0];
            element.scrollTop = element.scrollHeight;
        })
    } catch {
        console.error("No chat-box")
    }
}