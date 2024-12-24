// Check class name before using hgKElc
const API_KEY = "use own api key ";

// Add notification sound URLs
const SUCCESS_SOUND = "https://example.com/success.mp3";
const ERROR_SOUND = "https://example.com/error.mp3";

let abortController = null;

async function AIValidity(search, searchresponse) {
    if (!search || !searchresponse) {
        console.warn("Invalid inputs for AI analysis.");
        return;
    }

    const prompt = `
    just return valid or not valid with what is the reason for valid or not and return a score from 0 to 1
    query: "${search}"
    response: "${searchresponse}"
    points-to-remeber - dont consider extra information, don't expact perfect answer, check the validity
    `;

    const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

    const requestData = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
        signal: abortController.signal
    };

    let retryCount = 0;
    const maxRetries = parseInt(localStorage.getItem('maxRetries') || "3");

    const startTime = performance.now(); // Start timer
    const progressBar = document.getElementById("aiProgressBar");

    const updateProgress = (percent) => {
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    };

    const playSound = (url) => {
        const audio = new Audio(url);
        audio.play();
    };

    const logErrorToFile = (message) => {
        const blob = new Blob([message], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "error_log.txt";
        link.click();
    };

    const performFetch = async () => {
        try {
            updateProgress(30);
            const response = await fetch(`${API_URL}?key=${API_KEY}`, requestOptions);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            updateProgress(70);
            const data = await response.json();
            const content = data.candidates[0].content.parts[0].text;

            const hgKElcElement = document.getElementsByClassName("hgKElc")[0];
            const timestamp = new Date().toLocaleString();
            const isValid = content.toLowerCase().includes("valid");
            const score = Math.random().toFixed(2); // Simulate score for demo purposes

            hgKElcElement.innerHTML = `
                <div style="color: ${isValid ? "green" : "red"}; font-weight: bold; animation: fadeIn 1s;">
                    AI overview Validity - ${content} <br />
                    <small>Score: ${score}</small> <br />
                    <small>Timestamp: ${timestamp}</small>
                </div>
                ${hgKElcElement.innerHTML}
            `;
            hgKElcElement.style.display = "";

            // Add result to summary
            addToSummary(search, searchresponse, isValid, score, timestamp);

            // Cache results
            localStorage.setItem("lastAnalysis", JSON.stringify({ content, timestamp }));

            playSound(SUCCESS_SOUND); // Play success sound
            updateProgress(100);

            console.log(`AI Analysis Completed in ${performance.now() - startTime} ms`);
            showNotification("AI Analysis Complete", `Analysis completed for query: "${search}".`);
        } catch (error) {
            retryCount++;
            if (retryCount <= maxRetries) {
                console.warn(`Retrying fetch in 3 seconds... (${retryCount}/${maxRetries})`);
                showRetryCountdown(3);
                setTimeout(() => performFetch(), 3000);
            } else {
                console.error("Fetch failed after maximum retries:", error);

                // Show error in DOM
                const hgKElcElement = document.getElementsByClassName("hgKElc")[0];
                hgKElcElement.innerHTML = `
                    <div style="color: red; font-weight: bold; animation: fadeIn 1s;">
                        AI Analysis Failed: ${error.message}
                    </div>
                `;
                hgKElcElement.style.display = "";

                playSound(ERROR_SOUND); // Play error sound
                logErrorToFile(`Error: ${error.message}`);
            }
        }
    };

    await performFetch();
}

function waitForPageLoad(maxAttempts) {
    let attempts = 0;

    const checkInterval = setInterval(() => {
        attempts++;

        let aiOverviewElement = "";
        let searchTextArea = "";

        if (document.getElementsByClassName("hgKElc") && document.getElementsByTagName("textarea")) {
            const hgKElcElement = document.getElementsByClassName("hgKElc")[0];
            const searchTextAreaElement = document.getElementsByTagName("textarea")[0];

            if (hgKElcElement && searchTextAreaElement) {
                aiOverviewElement = hgKElcElement.innerText;
                searchTextArea = searchTextAreaElement.innerHTML;

                hgKElcElement.style.display = "none";

                console.log("AI overview Value ====", aiOverviewElement);
                console.log("Search Value ====", searchTextArea);

                // Provide progress bar
                if (!document.getElementById("aiProgressBar")) {
                    const progressBar = document.createElement("div");
                    progressBar.id = "aiProgressBar";
                    progressBar.style = "width: 0; height: 5px; background: green; transition: width 0.5s;";
                    document.body.prepend(progressBar);
                }

                // Trigger AI Analysis
                abortController = new AbortController();
                AIValidity(searchTextArea, aiOverviewElement);

                clearInterval(checkInterval); // Kill the timer
            }
        } else if (attempts >= maxAttempts) {
            console.log("MAX ATTEMPT REACHED....");
            clearInterval(checkInterval);

            // Graceful fallback
            if (document.getElementsByClassName("hgKElc")[0]) {
                document.getElementsByClassName("hgKElc")[0].innerText = "AI Analysis Failed to Start: Element Missing";
            }
        }
    }, 1000);
}

// Add result to summary
function addToSummary(query, response, validity, score, timestamp) {
    const summaryElement = document.getElementById("aiSummary");
    if (!summaryElement) return;

    const newEntry = document.createElement("div");
    newEntry.innerHTML = `
        <p><b>Query:</b> ${query}</p>
        <p><b>Response:</b> ${response}</p>
        <p><b>Validity:</b> ${validity ? "Valid" : "Invalid"}</p>
        <p><b>Score:</b> ${score}</p>
        <p><b>Timestamp:</b> ${timestamp}</p>
        <hr />
    `;
    summaryElement.appendChild(newEntry);
}

// Show retry countdown
function showRetryCountdown(seconds) {
    const retryElement = document.getElementById("retryCountdown");
    if (!retryElement) return;

    retryElement.innerHTML = `Retrying in ${seconds} seconds...`;
    let countdown = seconds;
    const interval = setInterval(() => {
        countdown--;
        retryElement.innerHTML = `Retrying in ${countdown} seconds...`;
        if (countdown <= 0) clearInterval(interval);
    }, 1000);
}

// Show browser notification
function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(title, { body });
            }
        });
    }
}

// Wait for page load with max attempts set to 300
waitForPageLoad(300);
