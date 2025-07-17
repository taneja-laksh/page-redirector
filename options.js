async function updateui() {
    stored = await chrome.storage.sync.get("sitesToRedirect")
    stores = stored.sitesToRedirect || []
    joined = stores.join("\n")
    document.getElementById("pagetoredirect").value = joined
}


async function updatesites() {
    const sites = document.getElementById("pagetoredirect").value
    const sitesclean = sites.split("\n")

    chrome.storage.sync.set(
        { sitesToRedirect: sitesclean }
    )

    chrome.runtime.sendMessage({ action: "refreshRedirectRules" })

    const status = document.getElementById("status")
    status.textContent = "Options saved"

    setTimeout(() => {
        status.textContent = ''
    }, 750);
}

updateui()
document.getElementById("save").addEventListener('click', updatesites)