window.onload = async function () {
  // when the script is loaded, get stored values from Chrome storage
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

  // select the input field using the ID or a more precise selector
  const fields = {
    orgName: document.getElementById("orgName"),
    name: document.getElementById("name"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    presName: document.getElementById("presName"),
    presPhone: document.getElementById("presPhone"),
    presEmail: document.getElementById("presEmail"),
    ruoName: document.getElementById("ruoName"),
    ruoPhone: document.getElementById("ruoPhone"),
    ruoEmail: document.getElementById("ruoEmail"),
    advName: document.getElementById("advName"),
    advPhone: document.getElementById("advPhone"),
    advEmail: document.getElementById("advEmail"),
  };

  // if a stored value exists, display it
  for (const [key, field] of Object.entries(fields)) {
    field.value = data[key] || "";
  }

  // helper function to add event listeners to input fields
  function addChangeListener(field, key) {
    field.addEventListener("change", function () {
      chrome.storage.sync.set({ [key]: field.value });
    });
  }

  // create event listeners for each stored config value to save the new value when the input changes
  for (const [key, field] of Object.entries(fields)) {
    addChangeListener(field, key);
  }
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

  // ensure each value is serializable (replace undefined with an empty string)
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
  // nested bc of chrome.scripting.executeScript jank
  function getInputField(questionText) {
    const questionElement = Array.from(
      document.querySelectorAll('[data-automation-id="questionTitle"]')
    ).find((el) => el.textContent.includes(questionText));

    if (questionElement) {
      // locate the input field within the same question container
      const inputField = questionElement
        .closest('[data-automation-id="questionItem"]')
        .querySelector('input[data-automation-id="textInput"]');
      return inputField;
    }
    console.error(`ERROR: Question with text "${questionText}" not found.`);
    return null;
  }

  function getRadioButton(questionText, labelText) {
    // get the div containing the specific question text
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

    // find the radio button label based on the label text within the identified question container
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

  // react intercepts events at document-level, so we need to use execCommand to simulate typing
  // for the form to recognize that the inputs have been filled
  function typeText(element, text) {
    element.focus();
    document.execCommand("selectAll", false);
    document.execCommand("insertText", false, text);
  }

  // ---Handler for Static Questions---
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

    // fill the static questions
    q1.click();
    typeText(q6, orgName);
    typeText(q7, name);
    typeText(q8, phone);
    typeText(q9, email);
    typeText(q10, presName);
    typeText(q11, presPhone);
    typeText(q12, presEmail);
    typeText(q13, ruoName);
    typeText(q14, ruoPhone);
    typeText(q15, ruoEmail);
    typeText(q16, advName);
    typeText(q17, advPhone);
    typeText(q18, advEmail);
    q23.click();
    q24.click();
    q25.click();
    q26.click();
    typeText(q27, "N/A");
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

    // fill the dynamic questions if they exist
    if (q32) q32.click();
    if (q33) q33.click();
    if (q34) q34.click();
    if (q36) q36.click();
    if (q37) q37.click();
    if (q38) q38.click();
    if (q39) typeText(q39, "Through our social media and posters");
    if (q40) typeText(q40, "N/A");
  }

  // fill out the regular static questions
  autofillStaticQuestions();

  // mutation observer watches for changes in the form container, i.e. the list of questions
  const formContainer = document.querySelector("#question-list");
  if (!formContainer) {
    console.error("ERROR: Form container with id 'question-list' not found.");
    return;
  }

  // every time a change is detected, call autofillDynamicQuestions which fills the dynamic questions
  // causing a new dynamic question to appear until all questions are filled
  const observer = new MutationObserver((mutations) => {
    console.log("Mutation observed:", mutations);
    autofillDynamicQuestions();
  });

  // start observing the form container for changes
  observer.observe(formContainer, { childList: true, subtree: true });

  // initial call to fill dynamic questions if any are already loaded
  autofillDynamicQuestions();
}
