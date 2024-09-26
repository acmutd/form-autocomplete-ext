// Set up to run when the content script is loaded
window.onload = async function() {
  // Get stored values from Chrome storage
  const data = await chrome.storage.sync.get(
    ['orgName', 
      'name', 'phone', 'email', 
      'presName', 'presPhone', 'presEmail', 
      'ruoName', 'ruoPhone', 'ruoEmail', 
      'advName', 'advPhone', 'advEmail']);
  console.log("data: ", data);
  
  // Select the input field using the ID or a more precise selector
  const orgName = document.getElementById("orgName");
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const presName = document.getElementById('presName');
  const presPhone = document.getElementById('presPhone');
  const presEmail = document.getElementById('presEmail');
  const ruoName = document.getElementById('ruoName');
  const ruoPhone = document.getElementById('ruoPhone');
  const ruoEmail = document.getElementById('ruoEmail');
  const advName = document.getElementById('advName');
  const advPhone = document.getElementById('advPhone');
  const advEmail = document.getElementById('advEmail');

  // If a stored value exists, display it
  if (data) {
    if (data.orgName) orgName.value = data.orgName;
    if (data.name) name.value = data.name;
    if (data.phone) phone.value = data.phone;
    if (data.email) email.value = data.email;
    if (data.presName) presName.value = data.presName;
    if (data.presPhone) presPhone.value = data.presPhone;
    if (data.presEmail) presEmail.value = data.presEmail;
    if (data.ruoName) ruoName.value = data.ruoName;
    if (data.ruoPhone) ruoPhone.value = data.ruoPhone;
    if (data.ruoEmail) ruoEmail.value = data.ruoEmail;
    if (data.advName) advName.value = data.advName;
    if (data.advPhone) advPhone.value = data.advPhone;
    if (data.advEmail) advEmail.value = data.advEmail;
  }

  // Add an event listener to save the new value when the input changes
  // and save the current value to Chrome storage
  orgName.addEventListener("change", function() {
      chrome.storage.sync.set({ orgName: orgName.value });
  });

  name.addEventListener("change", function() {
    chrome.storage.sync.set({ name: name.value });
  });
  phone.addEventListener("change", function() {
    chrome.storage.sync.set({ phone: phone.value });
  });
  email.addEventListener("change", function() {
    chrome.storage.sync.set({ email: email.value });
  });

  presName.addEventListener("change", function() {
    chrome.storage.sync.set({ presName: presName.value });
  });
  presPhone.addEventListener("change", function() {
    chrome.storage.sync.set({ presPhone: presPhone.value });
  });
  presEmail.addEventListener("change", function() {
    chrome.storage.sync.set({ presEmail: presEmail.value });
  });

  ruoName.addEventListener("change", function() {
    chrome.storage.sync.set({ ruoName: ruoName.value });
  });
  ruoPhone.addEventListener("change", function() {
    chrome.storage.sync.set({ ruoPhone: ruoPhone.value });
  });
  ruoEmail.addEventListener("change", function() {
    chrome.storage.sync.set({ ruoEmail: ruoEmail.value });
  });

  advName.addEventListener("change", function() {
    chrome.storage.sync.set({ advName: advName.value });
  });
  advPhone.addEventListener("change", function() {
    chrome.storage.sync.set({ advPhone: advPhone.value });
  });
  advEmail.addEventListener("change", function() {
    chrome.storage.sync.set({ advEmail: advEmail.value });
  });
};

document.getElementById('fill').addEventListener('click', async () => {
  const data = await chrome.storage.sync.get(
    ['orgName', 
      'name', 'phone', 'email', 
      'presName', 'presPhone', 'presEmail', 
      'ruoName', 'ruoPhone', 'ruoEmail', 
      'advName', 'advPhone', 'advEmail']);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: autofillForm,
      args: [
        data.orgName, 
        data.name, data.phone, data.email, 
        data.presName, data.presPhone, data.presEmail, 
        data.ruoName, data.ruoPhone, data.ruoEmail, 
        data.advName, data.advPhone, data.advEmail]
    });
  });
});

function autofillForm(orgName, name, phone, email, presName, presPhone, presEmail, ruoName, ruoPhone, ruoEmail, advName, advPhone, advEmail) {
  // Nested bc of chrome.scripting.executeScript jank
  function getInputField(questionText) {
    const questionElement = Array.from(document.querySelectorAll('[data-automation-id="questionTitle"]'))
      .find(el => el.textContent.includes(questionText));

    if (questionElement) {
      // Locate the input field within the same question container
      const inputField = questionElement.closest('[data-automation-id="questionItem"]').querySelector('input[data-automation-id="textInput"]');
      return inputField;
    }
    console.error(`ERROR: Question with text "${questionText}" not found.`);
    return null;
  }

  function getRadioButton(questionText, labelText) {
    // Find the div containing the specific question text
    const questions = document.querySelectorAll('[data-automation-id="questionItem"]');
    let questionContainer = null;
  
    questions.forEach((question) => {
      const questionTitle = question.querySelector('[data-automation-id="questionTitle"]');
      if (questionTitle && questionTitle.innerText.includes(questionText)) {
        questionContainer = question;
      }
    });
  
    if (!questionContainer) {
      console.error(`ERROR: Question with text "${questionText}" not found.`);
      return null;
    }
  
    // Find the radio button label based on the label text within the identified question container
    const labels = questionContainer.querySelectorAll('label');
    let foundRadioButton = null;
  
    labels.forEach((label) => {
      const labelSpan = label.querySelector('span[aria-label]');
      if (labelSpan && labelSpan.innerText.includes(labelText)) {
        foundRadioButton = label.querySelector('input[type="radio"]');
      }
    });
  
    if (!foundRadioButton) {
      console.error(`ERROR: Radio button with label "${labelText}" not found for question "${questionText}".`);
      return null;
    }
  
    return foundRadioButton;
  }

  // Questions!
  const q1 = getRadioButton("Do you agree to the above Room Usage Policies?", "I agree");
  // q2 is rooms being requested
  // q3 is second choice room being requested
  // q4 is third choice room being requested
  // q5 is event date(s)
  const q6 = getInputField("Full Organization Name- No Acronyms");
  const q7 = getInputField("Requestor's Name:");
  const q8 = getInputField("Requestor's Phone Number:");
  const q9 = getInputField("Requestor's UTD Email:");
  const q10 = getInputField("President's Name:");
  const q11 = getInputField("President's Phone Number:");
  const q12 = getInputField("President's UTD Email:");
  const q13 = getInputField("RUO's Name:");
  const q14 = getInputField("RUO's Phone Number:");
  const q15 = getInputField("RUO's UTD Email:");
  const q16 = getInputField("Advisor's Name:");
  const q17 = getInputField("Advisor's Phone Number:");
  const q18 = getInputField("Advisor's UTD Email:");
  // q19 is event name
  // q20 is event description
  // q21 is event time (including setup and teardown)
  // q22 is estimated attendance
  const q23 = getRadioButton("Who will be attending this event?", "Members and other UTD students");
  const q24 = getRadioButton("Will you need access to the projector?", "No, Projector access is not needed");
  const q25 = getRadioButton("Will you need access to the built-in room audio system?", "No");
  const q26 = getRadioButton("Will you need a Microphone?", "No, a microphone is not needed");
  const q27 = getInputField("If you need more than one microphone for this event, list the number and type of microphones needed below: * Type N/A if no microphone is needed. *", "N/A");
  const q28 = getRadioButton("Will Parking Passes Need to be Ordered for this Event?", "No");
  // const q29 = getRadioButton("How many parking passes will you need?", "");
  // const q30 = getRadioButton("Will There be Any Off-Campus Guests, Guest Speaker(s), Performer(s), or Vendor(s)?", "")
  // const q31 = getInputField("Names(s) and Number of Off-Campus Guests, Guest Speakers, Performers, or Vendors: (Write N/A if there will not be any Off-Campus Guests, etc.)", "N/A");
  const q32 = getRadioButton("Will There be Food or Beverages Served at This Event? *For allowed areas only*", "No");
  const q33 = getRadioButton("Will Press be Attending this Event?", "No");
  const q34 = getRadioButton("Do You Have a Co-Sponsor(s) for This Event? (Ex: Another Student Organization, UTD Department, business, etc.)", "");
  const q35 = getInputField("Name of Co-Sponsor(s) and Description of Sponsorship (ex: Co-Sponsor will be collaborating on all aspects of this event, Co-Sponsor will be provided financial support, Co-Sponsor will be providing food, etc.):", "");
  const q36 = getRadioButton("Is This Event a Fundraiser for a charity or your Organization?", "No");
  const q37 = getRadioButton("Will Money be Exchanged for/at This Event? (Admission Fee, Monetary Prizes, Selling merch, etc.)", "No");
  const q38 = getRadioButton("Will a Video/Movie/TV Show be Shown at This Event?", "No");
  const q39 = getInputField("Describe How You Will Be Promoting This Event:", "Through our social media and posters");
  const q40 = getInputField("Additional Comments:", "N/A");
  
  q1.click();
  q6.value = orgName;
  q7.value = name;
  q8.value = phone;
  q9.value = email;
  q10.value = presName;
  q11.value = presPhone;
  q12.value = presEmail;
  q13.value = ruoName;
  q14.value = ruoPhone;
  q15.value = ruoEmail;
  q16.value = advName;
  q17.value = advPhone;
  q18.value = advEmail;
  q23.click();
  q24.click();
  q25.click();
  q26.click();
  q27.value = "N/A";
  q28.click();
  //q29.value = "";
  //q30.click();
  //q31.value = "N/A";
  q32.click();
  q33.click();
  q34.click();
  q35.value = "";
  q36.click();
  q37.click();
  q38.click();
  q39.value = "Through our social media and posters";
  q40.value = "N/A";

}
