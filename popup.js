// Set up to run when the content script is loaded
window.onload = function() {
  console.log("yo")
  // Get stored values from Chrome storage
  chrome.storage.sync.get(["orgName"], function(data) {
      // Select the input field using the ID or a more precise selector
      const orgNameInput = document.querySelector("orgName");

      // If a stored value exists, display it
      if (data.orgName) {
        orgNameInput.value = data.orgName;
      }
  });

  // Add an event listener to save the new value when the input changes
  const orgNameInput = document.querySelector("orgName");
  orgNameInput.addEventListener("change", function() {
      // Save the current value to Chrome storage
      chrome.storage.sync.set({ orgName: orgNameInput.value });
  });
};

document.getElementById('save').addEventListener('click', () => {
  const orgName = document.getElementById('orgName').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const presEmail = document.getElementById('presEmail').value;
  const ruoName = document.getElementById('ruoName').value;
  const ruoEmail = document.getElementById('ruoEmail').value;
  const advName = document.getElementById('advName').value;
  const advPhone = document.getElementById('advPhone').value;

  chrome.storage.sync.set({ orgName, name, phone, email, presEmail, ruoName, ruoEmail, advName, advPhone }, () => {
    alert('Data saved!');
  });
});

document.getElementById('fill').addEventListener('click', () => {
  chrome.storage.sync.get(['orgName', 'name', 'phone', 'email', 'presEmail', 'ruoName', 'ruoEmail', 'advName', 'advPhone'], (data) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: autofillForm,
        args: [data.orgName, data.name, data.phone, data.email, data.presEmail, data.ruoName, data.ruoEmail, data.advName, data.advPhone]
      });
    });
  });
});

function autofillForm(orgName, name, phone, email, presEmail, ruoName, ruoEmail, advName, advPhone) {
  const orgNameField = document.querySelector('input[name="organizationName"]');
  const nameField = document.querySelector('input[name="name"]');
  const phoneField = document.querySelector('input[name="phone"]');
  const emailField = document.querySelector('input[name="email"]');
  const presEmailField = document.querySelector('input[name="presidentEmail"]');
  const ruoNameField = document.querySelector('input[name="ruoName"]');
  const ruoEmailField = document.querySelector('input[name="ruoEmail"]');
  const advNameField = document.querySelector('input[name="advisorName"]');
  const advPhoneField = document.querySelector('input[name="advisorPhone"]');
  
  if (orgNameField) orgNameField.value = orgName;
  if (nameField) nameField.value = name;
  if (phoneField) phoneField.value = phone;
  if (emailField) emailField.value = email;
  if (presEmailField) presEmailField.value = presEmail;
  if (ruoNameField) ruoNameField.value = ruoName;
  if (ruoEmailField) ruoEmailField.value = ruoEmail;
  if (advNameField) advNameField.value = advName;
  if (advPhoneField) advPhoneField.value = advPhone;
}
