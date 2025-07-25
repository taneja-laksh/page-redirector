
async function init() {

    data = await chrome.storage.sync.get("sitesToRedirect");
    sourceUrls = data.sitesToRedirect || []

    data = await chrome.storage.sync.get("destinationUrl");
    destinationUrl = data.destinationUrl

    console.log("urls to redirect ->\n" + sourceUrls)
    await setupRedirectRules(sourceUrls, destinationUrl);

    console.log("Page Redirector extension loaded. Rules are being set up via declarativeNetRequest.");
}

async function setupRedirectRules(sourceUrls, destinationUrl) {
    try {
        // First, get all existing dynamic rules.
        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        const existingRuleIds = existingRules.map(rule => rule.id);

        // If there are existing rules, remove them to ensure a clean slate.
        if (existingRuleIds.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: existingRuleIds
            });
            console.log("Removed existing dynamic rules:", existingRuleIds);
        }

        if ((sourceUrls[0] == "" && sourceUrls.length == 1) || sourceUrls.length == 0) {
            console.log("No urls to redirect")
            return
        }

        // Each URL to redirect from will have its own rule.
        const newRules = sourceUrls.map((sourceUrl, index) => ({
            id: index + 1, // Rule IDs must be unique integers and are typically positive.
            priority: 1,   // Priority of the rule. Higher priority rules are evaluated first.
            action: {
                type: "redirect",
                redirect: {
                    url: destinationUrl
                }
            },
            condition: {
                urlFilter: sourceUrl, // The URL pattern to match for redirection.
                resourceTypes: [      // Apply this rule only to main frame navigations.
                    "main_frame"        // This prevents redirecting resources like images, scripts, etc.
                ]
            }
        }));
        // Add the newly created dynamic rules.
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: newRules
        });
        console.log("Added new redirection rules:", newRules)
    } catch (error) {
        console.error("Error setting up redirect rules:", error)
    }
}

init();

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.action === "refreshRedirectRules") {
        init()
        console.log("Received request to refresh redirect rules.")
    }
});
