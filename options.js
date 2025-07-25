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
    const sites = document.getElementById("pagetoredirect").value.trim()
    const sitesclean = sites.split("\n")
    const desturl = document.getElementById("destination").value
    destinationstores = cleanDestination(desturl)

    for (elements of sitesclean) {
        if (cleanSite(elements) == destinationstores) {
            console.log("Source and destination cant be the same", elements, "=>", destinationstores)
            return
        }
    }
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
        return cleanSite(stored)
    } else {
        return "http://127.0.0.1"
    }
}

function cleanSite(site) {
    if (site.slice(0, 7) == "http://" || site.slice(0, 8) == "https://") {
        return site
    } else {
        return "https://" + site
    }
}

updateui()
document.getElementById("save").addEventListener('click', updatesites)