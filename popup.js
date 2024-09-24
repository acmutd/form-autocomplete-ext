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
