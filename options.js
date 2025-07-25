async function updateui() {
    stored = await chrome.storage.sync.get("sitesToRedirect")
    stores = stored.sitesToRedirect || []
    stored = await chrome.storage.sync.get("destinationUrl")
    destinationstores = stored.destinationUrl || "127.0.0.1"
    joined = stores.join("\n")
    document.getElementById("pagetoredirect").value = joined
    document.getElementById("destination").value = destinationstores
}


async function updatesites() {
    const sites = document.getElementById("pagetoredirect").value
    const sitesclean = sites.split("\n")
    const desturl = document.getElementById("destination").value
    if (sites.includes(desturl)) {
        console.log("Destination and source can't be the same")
        return
    }
    destinationstores = cleanDestination(desturl)
    console.log("url cleaned", desturl, " to ", destinationstores)
    chrome.storage.sync.set(
        { sitesToRedirect: sitesclean, destinationUrl: destinationstores }
    )

    chrome.runtime.sendMessage({ action: "refreshRedirectRules" })

    const status = document.getElementById("status")
    status.textContent = "Options saved"

    setTimeout(() => {
        status.textContent = ''
    }, 750);
}

function cleanDestination(stored) {
    if (stored) {
        if (stored.slice(0, 7) == "http://" || stored.slice(0, 8) == "https://") {
            return stored
        } else {
            return "https://" + stored
        }
    } else {
        return "http://127.0.0.1"
    }
}

updateui()
document.getElementById("save").addEventListener('click', updatesites)