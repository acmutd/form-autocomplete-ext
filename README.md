# Astra Autofill Chrome Extension
This Chrome extension helps you automatically fill out a frequently used form for requesting a room for your student organization. It uses stored information to fill in static and dynamically appearing questions on the form. This extension is designed to work using the Special Room Request form and not the General Room Request form, as the formats are different and will require new handling logic to work for the General form.

## Features
- Automatically fills in static questions
- Detects and fills dynamically loaded questions using a MutationObserver
- Stores user information in Chrome storage for reuse

## How It Works
- Static Questions: The extension fills out the first 28 static questions on the form using stored information
- Dynamic Questions: The extension uses a MutationObserver to detect when new questions are added to the form and fills them out automatically
- Due to the React state of the site not being updated through pure injection, we simulate typing in the form at the document level so the React state is updated and the form submission recognizes that the inputs are filled

## Installation and Setup
1. Clone or Download the Repository:
   ```
   git clone https://github.com/yourusername/form-autofill-extension.git
   ```
2. Load the Extension in Chrome:
  - Open Chrome and go to chrome://extensions/
  - Enable "Developer mode" by toggling the switch in the top right corner
  - Click on "Load unpacked" and select the directory where you cloned/downloaded the repository. 
3. Set Up Your Information
  - Click on the extension icon in the Chrome toolbar
  - Fill in your information (e.g., organization name, requestor's name, phone number, email, etc.)
  - This information will be saved in Chrome storage and used to autofill the form

## Usage
1. Fill out the necessary requestor information saved in the extension
2. Go to Astra [here](https://www.aaiscloud.com/UTXDallas/default.aspx?home) and click Special Room Request Form or go there directly [here](https://forms.office.com/pages/responsepage.aspx?id=HR0ojU2c90uxbgMtFd6fbCKzmcu1b9VJokmgS-rkIMpUQkZFNFo1MkVOUFI3WjRYNlJWUEZIMkU5QSQlQCN0PWcu&route=shorturl)  
3. Open the Autofill Chrome Extension while on that page
4. Click the "Autofill" button to automatically fill the form

## Updating the Extension
If any changes are made to the extension after installation and you would like to update it, follow these steps:
1. Pull the latest changes
   - Open a terminal and navigate to where the extension repo was originally cloned to
   - Run ```git pull``` to collect the updates
   - Alternatively, if Git was not used to install it, just re-download the latest ZIP file from GitHub and extract it again
3. Reload the Extension in Chrome
   - Go to ```chrome://extensions/```
   - Make sure Developer mode is still turned on
   - Find the Astra Autofill Extension
   - Click the Reload button (🔄 icon) to apply the latest updates

## Expansion Goals
Should it be desired, this app has some room for improvement.
- Possibly add an advanced config option to fill in the other dynamic question and/or some repeatable sections (i.e. if every projects build night is being scheduled and the event name / purpose is going to be consistent)
- Possibly add a version or separate check for the general request form, since the general form has a calendar interface that allows for repeatable events to be scheduled all at once (the calendar interface sucks but 16 requests for a weekly event is way worse than one slightly more tedious request)
- Anything else required by ACM officers for ease of usage
