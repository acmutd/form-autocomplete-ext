# Astra Autofill Chrome Extension
This Chrome extension helps you automatically fill out a frequently used form for requesting a room for your student organization. It uses stored information to fill in static and dynamically appearing questions on the form

## Features
- Automatically fills in static questions
- Detects and fills dynamically loaded questions using a MutationObserver
- Stores user information in Chrome storage for reuse

## How It Works
- Static Questions: The extension fills out the first 28 static questions on the form using stored information
- Dynamic Questions: The extension uses a MutationObserver to detect when new questions are added to the form and fills them out automatically

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
1. Open the Astra Room Request Form [here](https://forms.office.com/pages/responsepage.aspx?id=HR0ojU2c90uxbgMtFd6fbCKzmcu1b9VJokmgS-rkIMpUQkZFNFo1MkVOUFI3WjRYNlJWUEZIMkU5QSQlQCN0PWcu&route=shorturl)  
2. Open the Autofill Chrome Extension while on that page
3. Click the "Autofill" button to automatically fill the form

## Expansion Goals
Should it be desired, this app has some room for improvement.
- If Chrome storage turns out to be unreliable, save user data in a database (e.g. Mongo/Firebase), retrieve the data when autofilling
- Add more questions to the pre-filling menu to allow users with consistent requirements to avoid hassle
- Anything else that the Great Lord of ACM, Farhan Jamil, so desires
