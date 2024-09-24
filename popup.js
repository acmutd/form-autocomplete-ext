// Set up to run when the content script is loaded
window.onload = async function() {
  // Get stored values from Chrome storage
  const data = await chrome.storage.sync.get(['orgName', 'name', 'phone', 'email', 'presEmail', 'ruoName', 'ruoEmail', 'advName', 'advPhone']);
  console.log("data: ", data);
  
  // Select the input field using the ID or a more precise selector
  const orgName = document.getElementById("orgName");
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const presEmail = document.getElementById('presEmail');
  const ruoName = document.getElementById('ruoName');
  const ruoEmail = document.getElementById('ruoEmail');
  const advName = document.getElementById('advName');
  const advPhone = document.getElementById('advPhone');

  // If a stored value exists, display it
  if (data) {
    if (data.orgName) orgName.value = data.orgName;
    if (data.name) name.value = data.name;
    if (data.phone) phone.value = data.phone;
    if (data.email) email.value = data.email;
    if (data.presEmail) presEmail.value = data.presEmail;
    if (data.ruoName) ruoName.value = data.ruoName;
    if (data.ruoEmail) ruoEmail.value = data.ruoEmail;
    if (data.advName) advName.value = data.advName;
    if (data.advPhone) advPhone.value = data.advPhone;
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
  presEmail.addEventListener("change", function() {
    chrome.storage.sync.set({ presEmail: presEmail.value });
  });
  ruoName.addEventListener("change", function() {
    chrome.storage.sync.set({ ruoName: ruoName.value });
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
};

document.getElementById('fill').addEventListener('click', async () => {
  const data = await chrome.storage.sync.get(['orgName', 'name', 'phone', 'email', 'presEmail', 'ruoName', 'ruoEmail', 'advName', 'advPhone']);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: autofillForm,
      args: [data.orgName, data.name, data.phone, data.email, data.presEmail, data.ruoName, data.ruoEmail, data.advName, data.advPhone]
    });
  });
});

function autofillForm(orgName, name, phone, email, presEmail, ruoName, ruoEmail, advName, advPhone) {
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
  const q24 = getRadioButton("Will you need access to the projector?", "Yes");
  const q25 = getRadioButton("Will you need access to the built-in room audio system?", "Yes");
  const q26 = getRadioButton("Will you need a Microphone?", "Yes, 1 lapel microphone");
  const q27 = getRadioButton("Will Parking Passes Need to be Ordered for this Event?", "No");
  
  q1.click();
  q6.value = orgName;
  q7.value = name;
  q8.value = phone;
  q9.value = email;
  q10.value = ""; // president's name
  q11.value = ""; // president's phone
  q12.value = presEmail;
  q13.value = ruoName;
  q14.value = ""; // ruo phone
  q15.value = ruoEmail;
  q16.value = advName;
  q17.value = advPhone;
  q18.value = ""; // adv email
  q24.click();
  q25.click();
  q26.click();
  q27.click();
}
