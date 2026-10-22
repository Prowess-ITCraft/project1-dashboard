export type Account = {
  id: string;
  name: string;
  email: string;
  designation: string;
  roles: string[];
  status: "Active" | "Deactivated";
  lastSignIn: string;
};

export const accounts: Account[] = [
  { id: "adi-demo", name: "Aditya Kumar", email: "adi@test.com", designation: "Demo login", roles: ["Sales manager", "Sales head", "Audit engineer", "Solution architect", "Project manager", "Field engineer", "Technical lead / verifier", "Admin"], status: "Active", lastSignIn: "22 Oct 2026, 12:31 pm" },
  { id: "adi", name: "Aditya Kumar", email: "aditya@itcraft.net.in", designation: "Technical lead", roles: ["Technical lead / verifier"], status: "Active", lastSignIn: "12 Oct 2026, 3:02 pm" },
  { id: "ajit", name: "Ajit Dubey", email: "ajit@itcraft.net.in", designation: "Field engineer", roles: ["Field engineer"], status: "Active", lastSignIn: "12 Oct 2026, 3:03 pm" },
  { id: "akash", name: "Akash Agadii", email: "akash@itcraft.net.in", designation: "Sales head", roles: ["Sales head"], status: "Active", lastSignIn: "12 Oct 2026, 2:59 pm" },
  { id: "ashwini", name: "Ashwini Sawant", email: "ashwini@itcraft.net.in", designation: "Project manager", roles: ["Project manager"], status: "Active", lastSignIn: "5 Oct 2026, 1:53 am" },
  { id: "bhakti", name: "Bhakti Pawar", email: "bhakti@itcraft.net.in", designation: "Audit engineer", roles: ["Audit engineer"], status: "Active", lastSignIn: "4 Oct 2026, 9:49 pm" },
  { id: "charmi", name: "Charmi Shah", email: "charmi@itcraft.net.in", designation: "Sales manager", roles: ["Sales manager"], status: "Active", lastSignIn: "12 Oct 2026, 3:02 pm" },
  { id: "field", name: "Field Example", email: "adityakumar2358@gmail.com", designation: "Field engineer", roles: ["Field engineer"], status: "Active", lastSignIn: "13 Oct 2026, 4:26 pm" },
  { id: "neeta", name: "Neeta Darge", email: "neeta@itcraft.net.in", designation: "Sales manager", roles: ["Sales manager"], status: "Active", lastSignIn: "8 Oct 2026, 5:00 am" },
  { id: "panel", name: "Panel Check", email: "check.muubwe60@example.com", designation: "Checks the accounts panel", roles: ["Project manager", "Technical lead / verifier"], status: "Deactivated", lastSignIn: "Never" },
  { id: "sakshi", name: "Sakshi Rajbhar", email: "sakshi@itcraft.net.in", designation: "Field engineer", roles: ["Field engineer"], status: "Active", lastSignIn: "12 Oct 2026, 3:03 pm" },
  { id: "satish", name: "Satish Agadi", email: "sattishagadii@iitpl.co.in", designation: "Director", roles: ["Director", "Admin"], status: "Active", lastSignIn: "12 Oct 2026, 3:01 pm" },
  { id: "sheshadri", name: "Sheshadri Chintakindi", email: "sheshadri@itcraft.net.in", designation: "Solution architect", roles: ["Solution architect"], status: "Active", lastSignIn: "4 Oct 2026, 9:49 pm" },
  { id: "shruti", name: "Shruti Satam", email: "shruti@itcraft.net.in", designation: "Audit engineer", roles: ["Audit engineer"], status: "Active", lastSignIn: "12 Oct 2026, 3:03 pm" },
  { id: "test", name: "Test", email: "test.engineer@itcraft.net.in", designation: "Audit engineer", roles: ["Audit engineer"], status: "Active", lastSignIn: "21 Oct 2026, 5:24 pm" },
  { id: "yash", name: "Yash Raikar", email: "yash@itcraft.net.in", designation: "Field engineer", roles: ["Field engineer"], status: "Active", lastSignIn: "12 Oct 2026, 3:04 pm" },
];

export const roleFilters = [
  "Everyone",
  "Sales manager",
  "Sales head",
  "Audit engineer",
  "Solution architect",
  "Project manager",
  "Field engineer",
  "Technical lead / verifier",
  "Director",
  "Admin",
];

export type ProjectRow = {
  id: string;
  name: string;
  code: string;
  customer: string;
  stage: string;
  status: string;
  started: string;
};

export const projects: ProjectRow[] = [
  ["mv51w922", "One-step BOQ check mv51w922", "P1-2627-0019", "12 Oct 2026"],
  ["test", "test", "P1-2627-0018", "12 Oct 2026"],
  ["mv4ywscu", "One-step BOQ check mv4ywscu", "P1-2627-0017", "12 Oct 2026"],
  ["mvypywtm", "One-step BOQ check mvypywtm", "P1-2627-0016", "8 Oct 2026"],
  ["muypg1xv", "One-step BOQ check muypg1xv", "P1-2627-0015", "8 Oct 2026"],
  ["muvjnetp", "One-step BOQ check muvjnetp", "P1-2627-0014", "5 Oct 2026"],
  ["muvlbelr", "One-step BOQ check muvlbelr", "P1-2627-0013", "5 Oct 2026"],
  ["muu9psl0", "One-step BOQ check muu9psl0", "P1-2627-0012", "5 Oct 2026"],
  ["muu8w2mg", "One-step BOQ check muu8w2mg", "P1-2627-0011", "5 Oct 2026"],
  ["plant", "Plant network refresh", "P1-2627-0002", "5 Oct 2026"],
].map(([id, name, code, started]) => ({
  id,
  name,
  code,
  customer: "Shakti Equipments Pvt Ltd",
  stage: "Audit intake",
  status: "active",
  started,
}));

export type CustomerRow = {
  id: string;
  name: string;
  code: string;
  city: string;
  size: string;
  gstin: string;
};

export const customers: CustomerRow[] = [
  { id: "shakti", name: "Shakti Equipments Pvt Ltd", code: "CUS-00001", city: "Thane, Maharashtra", size: "small", gstin: "" },
];

export type CatalogueItem = {
  id: string;
  name: string;
  code: string;
  category: string;
  kind: "product" | "service";
  stock: "In stock";
  price: string;
  priceState: "Valid" | "No price" | "Expired";
};

export const catalogue: CatalogueItem[] = [
  { id: "odr", name: "Phoenix ODR", code: "SW-PHOENIX-ODR", category: "Backup and disaster recovery", kind: "product", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "dlp", name: "DLP", code: "SW-DLP", category: "Data loss prevention", kind: "product", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "acronis", name: "Acronis XDR - Extended Detection and Response, per annum", code: "LIC-ACRONIS-XDR", category: "Endpoint security (EPS / XDR)", kind: "product", stock: "In stock", price: "₹1,562.00", priceState: "Valid" },
  { id: "forti", name: "FortiGate FG40F UTM with 3 year subscription", code: "HW-FW-FORTI-FG40F", category: "Firewall", kind: "product", stock: "In stock", price: "₹1,09,653.00", priceState: "Valid" },
  { id: "sophos", name: "Sophos XGS-108 Firewall with 3 years Xtreme Protection", code: "HW-FW-SOPHOS-XGS108", category: "Firewall", kind: "product", stock: "In stock", price: "₹66,812.00", priceState: "Valid" },
  { id: "harden", name: "Server hardening", code: "SVC-SRV-HARDEN", category: "Hardening service", kind: "service", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "cisco", name: "Cisco Catalyst C1300-24T-4G Giga Managed Switch", code: "HW-SW-CISCO-C1300-24T", category: "Managed switch", kind: "product", stock: "In stock", price: "₹33,972.00", priceState: "Valid" },
  { id: "ram", name: "Memory upgrade, 8 GB module", code: "HW-RAM-UPG-8G", category: "Memory upgrade", kind: "product", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "nas", name: "NAS", code: "HW-NAS", category: "NAS and storage", kind: "product", stock: "In stock", price: "₹45,500.00", priceState: "Expired" },
  { id: "office", name: "Microsoft Office licence, current version", code: "LIC-OFFICE-2024", category: "Office licence", kind: "product", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "win", name: "Windows 11 Professional licence", code: "LIC-WIN-11-PRO", category: "Operating system licence", kind: "product", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "sanitize", name: "System sanitization to quarantine and mitigate risks from malicious applications, malware or unwanted dormant programs", code: "SVC-SANITIZE", category: "System sanitization", kind: "service", stock: "In stock", price: "₹500.00", priceState: "Valid" },
  { id: "addc", name: "Server for AD/DC", code: "HW-SRV-ADDC", category: "Server", kind: "product", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "eps", name: "EPS implementation, security set up configuration and one year administration and management", code: "SVC-EPS-SETUP", category: "Setup and configuration service", kind: "service", stock: "In stock", price: "₹12,000.00", priceState: "Valid" },
  { id: "fwsetup", name: "Firewall one time setup, installation and configuration charges", code: "SVC-FW-SETUP", category: "Setup and configuration service", kind: "service", stock: "In stock", price: "₹12,000.00", priceState: "Valid" },
  { id: "fwre", name: "Firewall reconfiguration", code: "SVC-FW-RECONFIG", category: "Setup and configuration service", kind: "service", stock: "In stock", price: "Not set", priceState: "No price" },
  { id: "switch", name: "One time setup, installation and configuration charges inclusive of one year onsite or remote support for the switch", code: "SVC-SWITCH-SETUP", category: "Setup and configuration service", kind: "service", stock: "In stock", price: "₹6,000.00", priceState: "Valid" },
  { id: "vpn", name: "One year support charges for VPN firewall", code: "SVC-FW-SUPPORT", category: "Support and management service", kind: "service", stock: "In stock", price: "₹15,000.00", priceState: "Valid" },
];

export type ReviewTask = {
  id: string;
  ref: string;
  title: string;
  device: string;
  sentBack: string;
  handedOver: string;
  project: string;
  customer: string;
};

export const reviewTasks: ReviewTask[] = [
  { id: "t02a", ref: "T02", title: "Configure the managed switch: VLANs, management and firmware", device: "None", sentBack: "Never", handedOver: "4 Oct 2026, 7:55 pm", project: "Plant network refresh P1-2627-0002", customer: "Shakti Equipments Pvt Ltd" },
  { id: "t21", ref: "T21", title: "Sanitize system: remove extra antivirus agents: unit 19 of 27", device: "None", sentBack: "Never", handedOver: "4 Oct 2026, 9:30 pm", project: "Plant network refresh P1-2627-0002", customer: "Shakti Equipments Pvt Ltd" },
  { id: "t02b", ref: "T02", title: "Configure the managed switch: VLANs, management and firmware", device: "None", sentBack: "Never", handedOver: "4 Oct 2026, 9:49 pm", project: "Plant network refresh P1-2627-0002", customer: "Shakti Equipments Pvt Ltd" },
];

export const libraryFiles = [
  { id: "prism", name: "Shakti Equipments Pvt. Ltd. PrismSuite Audit Report.docx", kind: "PrismSuite", status: "Needs a person", added: "63", held: "0" },
  { id: "boq", name: "ITCraft 2627-030-Shohbaglobs Engineers Hub Private Limited- Sanitization, EPS, Switch & Firewall.pdf", kind: "Old BOQ", status: "Needs a person", added: "8", held: "1" },
];

export const libraryLine = {
  file: "ITCraft 2627-030-Shohbaglobs Engineers Hub Private Limited- Sanitization, EPS, Switch & Firewall.pdf, line 7",
  component: "Fortinet / Sophos One Time S",
  qty: "1 x ₹12,000.00",
  note: "The heading 'High Priority' was printed over this line and was taken out. Check the text.",
};

export const messages = [
  { id: "m1", title: "T02 is waiting for a verifier", body: "Configure the managed switch on Plant network refresh. Handed over 4 Oct 2026, 9:49 pm.", unread: true },
  { id: "m2", title: "NAS price expired", body: "HW-NAS is past its price validity. Enter a new price before the next quotation.", unread: true },
  { id: "m3", title: "Import needs a person", body: "Shakti Equipments PrismSuite Audit Report.docx has 63 lines to check.", unread: false },
];
