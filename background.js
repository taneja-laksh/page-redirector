
// Define the pages to redirect from and the destination URL.
// You can customize these arrays.
const pagesToRedirectFrom = [
    "https://reddit.com"
];

const destinationUrl = "http://127.0.0.1"; // The URL you want to redirect to.

/**
 * Sets up dynamic redirection rules using the declarativeNetRequest API.
 * This function will remove any previously set dynamic rules and then add new ones.
 */
async function setupRedirectRules() {
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

        // Create new rules based on the 'pagesToRedirectFrom' array.
        // Each URL to redirect from will have its own rule.
        const newRules = pagesToRedirectFrom.map((sourceUrl, index) => ({
            id: index + 1, // Rule IDs must be unique integers and are typically positive.
            priority: 1,   // Priority of the rule. Higher priority rules are evaluated first.
            action: {
                type: "redirect", // The action to perform: redirect the request.
                redirect: {
                    url: destinationUrl // The URL to redirect to.
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
        if (newRules.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules: newRules
            });
            console.log("Added new redirection rules:", newRules);
        } else {
            console.log("No redirection rules to add.");
        }
    } catch (error) {
        console.error("Error setting up redirect rules:", error);
    }
}

// Call the setup function when the service worker is initialized.
// This ensures that the redirection rules are set up as soon as the extension loads or updates.
setupRedirectRules();

console.log("Page Redirector extension loaded. Rules are being set up via declarativeNetRequest.");
