# AI-Chrome-Extension

AI-Chrome-Extension is a browser extension that evaluates the validity of AI-generated responses to user queries. It analyzes the input and output content, providing a validity assessment, a score, and additional contextual feedback. 

---

## Features
- Validates AI-generated responses for correctness and relevance.
- Displays validity results, scores, and timestamps dynamically in the DOM.
- Includes progress bar and retry mechanism with configurable retry limits.
- Plays notification sounds for success and error events.
- Supports browser notifications for status updates.
- Logs errors into a downloadable file if the analysis fails.
- Summarizes results for a consolidated view of AI evaluations.

---

## How It Works
1. **Input Validation**: Captures a query and its AI-generated response from the DOM.
2. **AI Analysis**: Sends the data to the API for validation and retrieves the result.
3. **Result Display**: Dynamically updates the UI to show the validity status, score, and analysis timestamp.
4. **Retry Mechanism**: Automatically retries the API call on failure, up to a configurable limit.
5. **Error Handling**: Displays errors in the UI, logs them into a file, and notifies the user.
6. **Sound Effects**: Plays sounds based on success or failure.

---

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle switch at the top right corner).
4. Click **Load Unpacked** and select the directory containing the extension's source code.

---

## Usage

1. Open a webpage with AI-generated content.
2. The extension will automatically analyze the content and display the results.
3. View the validity, score, and timestamp in the UI.
4. Check the summary for consolidated results.

---

## Configuration

- **API Key**: Update the `API_KEY` variable in `main.js` with your API key.
- **Retry Limit**: Set the maximum retries for API calls in `localStorage` using the key `maxRetries`.
- **Notification Sounds**: Update the `SUCCESS_SOUND` and `ERROR_SOUND` URLs in `main.js` with your preferred audio files.

---

## Files

- `main.js`: Contains the core logic for content analysis and UI updates.
- `manifest.json`: Chrome extension configuration file.
- `README.md`: Documentation for the project.

---

## APIs Used
- Google Gemini API for analyzing content validity.

---

## Technologies
- JavaScript
- HTML/CSS
- Chrome Extensions API

---

## Contribution
Feel free to submit pull requests or open issues for any improvements or bug fixes.

---

## License
This project is licensed under the MIT License.
