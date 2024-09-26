// Set up to run when the content script is loaded
window.onload = async function () {
  // Get stored values from Chrome storage
  const data = await chrome.storage.sync.get([
    "orgName",
    "name",
    "phone",
    "email",
    "presName",
    "presPhone",
    "presEmail",
    "ruoName",
    "ruoPhone",
    "ruoEmail",
    "advName",
    "advPhone",
    "advEmail",
  ]);
  console.log("data: ", data);

  // Select the input field using the ID or a more precise selector
  const orgName = document.getElementById("orgName");
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const presName = document.getElementById("presName");
  const presPhone = document.getElementById("presPhone");
  const presEmail = document.getElementById("presEmail");
  const ruoName = document.getElementById("ruoName");
  const ruoPhone = document.getElementById("ruoPhone");
  const ruoEmail = document.getElementById("ruoEmail");
  const advName = document.getElementById("advName");
  const advPhone = document.getElementById("advPhone");
  const advEmail = document.getElementById("advEmail");

  // If a stored value exists, display it
  orgName.value = data.orgName || "";
  name.value = data.name || "";
  phone.value = data.phone || "";
  email.value = data.email || "";
  presName.value = data.presName || "";
  presPhone.value = data.presPhone || "";
  presEmail.value = data.presEmail || "";
  ruoName.value = data.ruoName || "";
  ruoPhone.value = data.ruoPhone || "";
  ruoEmail.value = data.ruoEmail || "";
  advName.value = data.advName || "";
  advPhone.value = data.advPhone || "";
  advEmail.value = data.advEmail || "";

  // Add an event listener to save the new value when the input changes
  // and save the current value to Chrome storage
  orgName.addEventListener("change", function () {
    chrome.storage.sync.set({ orgName: orgName.value });
  });

  name.addEventListener("change", function () {
    chrome.storage.sync.set({ name: name.value });
  });
  phone.addEventListener("change", function () {
    chrome.storage.sync.set({ phone: phone.value });
  });
  email.addEventListener("change", function () {
    chrome.storage.sync.set({ email: email.value });
  });

  presName.addEventListener("change", function () {
    chrome.storage.sync.set({ presName: presName.value });
  });
  presPhone.addEventListener("change", function () {
    chrome.storage.sync.set({ presPhone: presPhone.value });
  });
  presEmail.addEventListener("change", function () {
    chrome.storage.sync.set({ presEmail: presEmail.value });
  });

  ruoName.addEventListener("change", function () {
    chrome.storage.sync.set({ ruoName: ruoName.value });
  });
  ruoPhone.addEventListener("change", function () {
    chrome.storage.sync.set({ ruoPhone: ruoPhone.value });
  });
  ruoEmail.addEventListener("change", function () {
    chrome.storage.sync.set({ ruoEmail: ruoEmail.value });
  });

  advName.addEventListener("change", function () {
    chrome.storage.sync.set({ advName: advName.value });
  });
  advPhone.addEventListener("change", function () {
    chrome.storage.sync.set({ advPhone: advPhone.value });
  });
  advEmail.addEventListener("change", function () {
    chrome.storage.sync.set({ advEmail: advEmail.value });
  });
};

document.getElementById("fill").addEventListener("click", async () => {
  const keys = [
    "orgName",
    "name",
    "phone",
    "email",
    "presName",
    "presPhone",
    "presEmail",
    "ruoName",
    "ruoPhone",
    "ruoEmail",
    "advName",
    "advPhone",
    "advEmail",
  ];

  const data = await chrome.storage.sync.get(keys);

  // Ensure each value is serializable (replace undefined with an empty string)
  const sanitizedData = keys.map((key) => data[key] || "");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: autofillForm,
      args: sanitizedData,
    });
  });
});

function autofillForm(
  orgName,
  name,
  phone,
  email,
  presName,
  presPhone,
  presEmail,
  ruoName,
  ruoPhone,
  ruoEmail,
  advName,
  advPhone,
  advEmail
) {
  // Nested bc of chrome.scripting.executeScript jank
  function getInputField(questionText) {
    const questionElement = Array.from(
      document.querySelectorAll('[data-automation-id="questionTitle"]')
    ).find((el) => el.textContent.includes(questionText));

    if (questionElement) {
      // Locate the input field within the same question container
      const inputField = questionElement
        .closest('[data-automation-id="questionItem"]')
        .querySelector('input[data-automation-id="textInput"]');
      return inputField;
    }
    console.error(`ERROR: Question with text "${questionText}" not found.`);
    return null;
  }

  function getRadioButton(questionText, labelText) {
    // Find the div containing the specific question text
    const questions = document.querySelectorAll(
      '[data-automation-id="questionItem"]'
    );
    let questionContainer = null;

    questions.forEach((question) => {
      const questionTitle = question.querySelector(
        '[data-automation-id="questionTitle"]'
      );
      if (questionTitle && questionTitle.innerText.includes(questionText)) {
        questionContainer = question;
      }
    });

    if (!questionContainer) {
      console.error(`ERROR: Question with text "${questionText}" not found.`);
      return null;
    }

    // Find the radio button label based on the label text within the identified question container
    const labels = questionContainer.querySelectorAll("label");
    let foundRadioButton = null;

    labels.forEach((label) => {
      const labelSpan = label.querySelector("span[aria-label]");
      if (labelSpan && labelSpan.innerText.includes(labelText)) {
        foundRadioButton = label.querySelector('input[type="radio"]');
      }
    });

    if (!foundRadioButton) {
      console.error(
        `ERROR: Radio button with label "${labelText}" not found for question "${questionText}".`
      );
      return null;
    }

    return foundRadioButton;
  }

  // ---Initial Static Questions---
  function autofillStaticQuestions() {
    const q1 = getRadioButton(
      "Do you agree to the above Room Usage Policies?",
      "I agree"
    );
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
    const q23 = getRadioButton(
      "Who will be attending this event?",
      "Members and other UTD students"
    );
    const q24 = getRadioButton(
      "Will you need access to the projector?",
      "No, Projector access is not needed"
    );
    const q25 = getRadioButton(
      "Will you need access to the built-in room audio system?",
      "No"
    );
    const q26 = getRadioButton(
      "Will you need a Microphone?",
      "No, a microphone is not needed"
    );
    const q27 = getInputField(
      "If you need more than one microphone for this event, list the number and type of microphones needed below: * Type N/A if no microphone is needed. *"
    );
    const q28 = getRadioButton(
      "Will Parking Passes Need to be Ordered for this Event?",
      "No"
    );

    // Fill the static questions
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
  }

  // ---Handler for Dynamic Questions---
  function autofillDynamicQuestions() {
    const q32 = getRadioButton(
      "Will There be Food or Beverages Served at This Event? *For allowed areas only*",
      "No"
    );
    const q33 = getRadioButton("Will Press be Attending this Event?", "No");
    const q34 = getRadioButton(
      "Do You Have a Co-Sponsor(s) for This Event? (Ex: Another Student Organization, UTD Department, business, etc.)",
      "No"
    );
    const q36 = getRadioButton(
      "Is This Event a Fundraiser for a charity or your Organization?",
      "No"
    );
    const q37 = getRadioButton(
      "Will Money be Exchanged for/at This Event? (Admission Fee, Monetary Prizes, Selling merch, etc.)",
      "No"
    );
    const q38 = getRadioButton(
      "Will a Video/Movie/TV Show be Shown at This Event?",
      "No"
    );
    const q39 = getInputField("Describe How You Will Be Promoting This Event:");
    const q40 = getInputField("Additional Comments:");

    // Fill the dynamic questions if they exist
    if (q32) q32.click();
    if (q33) q33.click();
    if (q34) q34.click();
    if (q36) q36.click();
    if (q37) q37.click();
    if (q38) q38.click();
    if (q39) q39.value = "Through our social media and posters";
    if (q40) q40.value = "N/A";
  }

  // Call the autofill functions
  autofillStaticQuestions();

  // Delay to allow dynamic questions to load
  setTimeout(autofillDynamicQuestions, 100); // Adjust delay as needed
}
