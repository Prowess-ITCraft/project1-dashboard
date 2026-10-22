export const helpIntro =
  "Project One takes a customer from an IT audit to a signed certificate. Each person does their part, and someone else approves it.";

export const helpRoles: { title: string; steps: string[] }[] = [
  {
    title: "Sales",
    steps: [
      "Open Projects and choose New project. Pick the customer, or add a new one.",
      "For a quick BOQ, open the project and choose Upload report and draft BOQ on the Overview. Pick the PrismSuite report, answer five questions and the estimate appears with PDF and Excel downloads. It is marked \"Not approved\" and is not saved.",
      "Prices come only from the price book. Enter or refresh them by hand under Catalogue: open an item and choose Enter a new price. Lines without a price stay blank until you do.",
      "When the gaps are approved, use Draft the BOQ from the gap register. Adjust lines with Add from catalogue or Add by hand.",
      "Download the quotation as PDF or Excel from the BOQ tab, then submit the stage for approval.",
      "Prices last a few days. When they lapse you get a message; choose Re-price for a new version on the BOQ tab to take today's prices.",
      "If the customer says no, choose Record a lost quote and pick why. It helps the next quote.",
      "Looking for something? Type in Search customers, quotes, tasks at the top of any page.",
    ],
  },
  {
    title: "Sales head",
    steps: [
      "Check the BOQ lines and prices on the BOQ tab, then choose Approve pricing.",
      "Lines under the minimum margin are listed above the button. Tick each one you accept and say why in the note; the reason is kept with the BOQ.",
      "Approve or send back stages the sales team submitted. Someone else always approves what a person submitted.",
    ],
  },
  {
    title: "Audit engineer",
    steps: [
      "Open the project, go to Audit intake, choose the PrismSuite Word or JSON file and select Upload and import. Or use Upload report and draft BOQ on the Overview to see the BOQ estimate straight away.",
      "Read what was imported. Where the report disagrees with itself, pick the right value. Then approve the import.",
      "Fill in the Questionnaire tab and choose Save questionnaire.",
      "At the top of the project, pick the locked output and choose Submit for approval.",
    ],
  },
  {
    title: "Solution architect",
    steps: [
      "On Infrastructure, confirm the current IT and the ideal IT. Each is submitted for approval like any other stage.",
      "On Gaps, review the gaps found between the two. Use Add a gap by hand for anything the rules missed, then submit.",
    ],
  },
  {
    title: "Project manager",
    steps: [
      "On Plan, choose Draft the plan to turn the accepted BOQ into tasks, then Schedule the plan to set dates and engineers.",
      "Check the plan and choose Lock the plan. Engineers see their tasks under My tasks.",
      "Follow progress on Field work. If a task cannot be done, use Ask for a waiver on Completion; the Director decides and the customer acknowledges it.",
      "When field work is finished, choose Lock the report on Completion.",
    ],
  },
  {
    title: "Field engineer (on your phone)",
    steps: [
      "Install the app once: in Chrome on Android choose Install the app; on iPhone tap Share, then Add to Home Screen. Messages on iPhone arrive only once the app is added.",
      "Open My tasks. Needs you lists what you can do now, with the customer and project on each task.",
      "Open a task and choose Accept task.",
      "On site, allow location when the phone asks, add the arrival photo and choose Check in. Check-in needs the phone's location. When the work is checked, show the customer and choose Confirm hand over.",
      "Work through Before you change anything and the Steps. Record What the device shows and add photos under Evidence.",
      "For a configuration export on a laptop, choose Upload from another device and scan the code or open the link there. It works once, for 15 minutes.",
      "Choose Send for the check. If a setting does not match, the page says which; fix it and send again.",
      "Finish with Hand over to the customer. The technical lead then verifies your work.",
      "Stuck? Choose I cannot continue and say what stops you. The task is marked blocked and your project manager sees it straight away.",
      "No signal? Keep working, for up to three days. The app saves your steps on the phone and sends them by itself when the signal is back; Sync now sends straight away. If the server refuses one, the task says why: fix it and choose Try again, or Remove it.",
      "Sign out only when everything is sent. If something is still on the phone, the app says so first; only you can send it, the next time you sign in on that phone.",
    ],
  },
  {
    title: "Technical lead / verifier",
    steps: [
      "Open Review to see tasks waiting for you.",
      "Open a task, compare Target and Found for each setting, and look at the evidence.",
      "Choose Approve and close, or Send back with what must be fixed. You never verify your own work.",
    ],
  },
  {
    title: "Admin",
    steps: [
      "Open Accounts and choose New account. Fill in the name and email, tick one or more roles, and keep the strong password filled in for you.",
      "Give the person their email and temporary password in person. Directors and admins set up an authenticator at first sign-in.",
      "Click a name to change roles or details, Reset password, Reset authenticator (a lost phone), Unlock, or Deactivate account when someone leaves. Their history stays.",
      "For developers and other systems: the API reference, where every call can be tried, is at /docs. The full list of routes is in docs/API_ROUTES.md in the project.",
    ],
  },
  {
    title: "Director",
    steps: [
      "Approves waivers, signs the certificate, and can do what an admin does.",
      "When every condition on Completion is met, choose Sign the certificate.",
    ],
  },
];

export const projectSteps: { title: string; who: string; body: string }[] = [
  { title: "Audit intake", who: "Audit engineer", body: "Upload the PrismSuite audit report and check what was read from it." },
  { title: "Questionnaire", who: "Audit engineer", body: "Answer the questions the report cannot: budget, priorities, what the customer wants." },
  { title: "Infrastructure", who: "Solution architect", body: "Confirm the current IT and agree the ideal IT for this customer." },
  { title: "Gaps", who: "Solution architect", body: "The difference between current and ideal, as a list of gaps to close." },
  { title: "BOQ", who: "Sales", body: "The bill of quantities and the quotation, drafted from the gaps and priced from the catalogue." },
  { title: "Plan", who: "Project manager", body: "Turn the accepted BOQ into tasks, dates and engineers." },
  { title: "Field work", who: "Field engineers, Technical lead", body: "Engineers do each task on site; the technical lead verifies it." },
  { title: "Completion", who: "Project manager, Director", body: "Lock the completion report; the Director signs the certificate." },
];

export const gettingAround = [
  "The sidebar on the left (the menu at the top on a phone) lists only what your role can open.",
  "Inside a project, a task or a catalogue item, Back at the top returns you to where you were.",
  "A project has tabs, one per step. The step that needs attention is shown at the top of the project.",
  "A message at the bottom of the screen confirms each action, or says what to fix.",
  "Theme at the bottom of the sidebar switches between light, dark and your device's setting.",
];

export const firstSignIn = [
  "Sign in with your work email and the temporary password your admin gave you.",
  "Directors and admins: install Google Authenticator or Microsoft Authenticator, choose Show my code, scan the QR code and type the 6 digit code. Save the recovery codes somewhere safe.",
  "Afterwards, signing in asks for the code from the app. You then stay signed in on that computer or phone for 14 days, until you sign out.",
];

export const whenWrong: { title: string; body: string }[] = [
  { title: "Account locked", body: "Too many wrong passwords. It unlocks by itself after a while, or an admin can unlock it from Accounts." },
  { title: "Lost your phone", body: "Use one of your recovery codes at sign-in, or ask an admin to reset your authenticator." },
  { title: "Forgot your password", body: "Ask an admin for a new temporary one (Accounts, then your name, then Reset password)." },
  { title: "Too many requests", body: "Wait a minute and try again." },
  { title: "A button is greyed out", body: "Something before it is not done yet, or another role does that step. The page usually says which." },
];

export const glossary: { title: string; body: string }[] = [
  { title: "PrismSuite report", body: "The audit of the customer's IT, as a Word or JSON file. Everything starts from it." },
  { title: "Stage", body: "One step of a project (see the list above). Each is submitted by one person and approved by another." },
  { title: "Gap", body: "Something the customer's IT is missing compared with the ideal." },
  { title: "BOQ", body: "Bill of quantities: the products and services to close the gaps, with prices." },
  { title: "Deviation", body: "A setting found on a device that does not match the target. Critical ones block the certificate." },
  { title: "Waiver", body: "An agreed exclusion: work left out by agreement, approved by the Director and acknowledged by the customer." },
  { title: "Certificate", body: "The signed record that IITPL implemented the listed work. Its QR code opens a public check." },
];
