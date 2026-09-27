import { Camp, EmergencyRequest, Hospital, BloodBank, AuditLog, SystemNotification, UserProfile, Registration } from '../types';

export const initialCamps: Camp[] = [
  {
    id: "CAMP-001",
    name: "Nagpur Community Life Camp",
    organisation: "Red Cross Community Network",
    location: "Nagpur",
    city: "Nagpur",
    venue: "Central Community Hall, Sitabuldi",
    date: "2026-10-03",
    time: "09:00 AM – 04:00 PM",
    status: "upcoming",
    target: 180,
    registered: 132,
    confirmed: 105,
    present: 0,
    bloodGroups: ["A+", "B+", "O+", "O-"],
    distance: "4.2 km",
    coordinates: { lat: 21.1458, lng: 79.0882 },
    emergency: false,
    description: "A city-wide community mobilisation camp focused on accessible donor registration and coordinated attendance.",
    contactPhone: "+91 98230 11223",
    hlaFilterSupported: true
  },
  {
    id: "CAMP-002",
    name: "Maharashtra Youth Donor Camp",
    organisation: "Youth Health Collective",
    location: "Nagpur",
    city: "Nagpur",
    venue: "Youth Convention Centre, Sadar",
    date: "2026-10-06",
    time: "10:00 AM – 05:00 PM",
    status: "upcoming",
    target: 250,
    registered: 198,
    confirmed: 160,
    present: 0,
    bloodGroups: ["A+", "B+", "AB+", "O+"],
    distance: "7.8 km",
    coordinates: { lat: 21.1610, lng: 79.0820 },
    emergency: false,
    description: "Large youth mobilisation event connecting students, volunteers and donor communities.",
    contactPhone: "+91 97654 32109",
    hlaFilterSupported: false
  },
  {
    id: "CAMP-003",
    name: "City Health Mobilisation Camp",
    organisation: "Rotary Community Initiative",
    location: "Mumbai",
    city: "Mumbai",
    venue: "Civic Centre, Dadar West",
    date: "2026-10-09",
    time: "08:30 AM – 03:30 PM",
    status: "upcoming",
    target: 300,
    registered: 221,
    confirmed: 190,
    present: 0,
    bloodGroups: ["A-", "B-", "O-", "AB-"],
    distance: "12.4 km",
    coordinates: { lat: 19.0176, lng: 72.8472 },
    emergency: true,
    description: "A high-priority mobilisation camp with additional communication support for selected rare blood donor groups.",
    contactPhone: "+91 98200 44556",
    hlaFilterSupported: true
  },
  {
    id: "CAMP-004",
    name: "Nagpur Corporate CSR Camp",
    organisation: "TechNova CSR Foundation",
    location: "Nagpur",
    city: "Nagpur",
    venue: "TechNova Campus, MIHAN",
    date: "2026-10-12",
    time: "09:30 AM – 02:30 PM",
    status: "upcoming",
    target: 150,
    registered: 92,
    confirmed: 75,
    present: 0,
    bloodGroups: ["A+", "B+", "O+"],
    distance: "10.2 km",
    coordinates: { lat: 21.0620, lng: 79.0480 },
    emergency: false,
    description: "Corporate CSR mobilisation programme designed around employee participation and community response.",
    contactPhone: "+91 99112 23344",
    hlaFilterSupported: false
  },
  {
    id: "CAMP-005",
    name: "Central Nagpur Live Camp",
    organisation: "City Health Network",
    location: "Nagpur",
    city: "Nagpur",
    venue: "Central Medical Community Centre, Ramdaspeth",
    date: "2026-09-26",
    time: "08:00 AM – 05:00 PM",
    status: "ongoing",
    target: 220,
    registered: 186,
    confirmed: 154,
    present: 112,
    bloodGroups: ["A+", "B+", "O+", "AB+"],
    distance: "3.1 km",
    coordinates: { lat: 21.1350, lng: 79.0750 },
    emergency: false,
    description: "Currently active mobilisation camp with live attendance check-in and donor support.",
    contactPhone: "+91 94221 88990",
    hlaFilterSupported: true
  },
  {
    id: "CAMP-006",
    name: "Mumbai Emergency Mobilisation Camp",
    organisation: "Community Response Alliance",
    location: "Mumbai",
    city: "Mumbai",
    venue: "Western Civic Centre, Bandra",
    date: "2026-09-26",
    time: "09:00 AM – 06:00 PM",
    status: "ongoing",
    target: 350,
    registered: 304,
    confirmed: 270,
    present: 218,
    bloodGroups: ["O+", "O-", "B+", "B-"],
    distance: "5.6 km",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    emergency: true,
    description: "High-response camp operating with adaptive mobilisation and emergency communication support.",
    contactPhone: "+91 98210 99887",
    hlaFilterSupported: true
  },
  {
    id: "CAMP-007",
    name: "Pune Student Response Camp",
    organisation: "Campus Life Network",
    location: "Pune",
    city: "Pune",
    venue: "University Activity Centre, Shivajinagar",
    date: "2026-09-26",
    time: "09:30 AM – 04:00 PM",
    status: "ongoing",
    target: 200,
    registered: 144,
    confirmed: 120,
    present: 89,
    bloodGroups: ["A+", "A-", "O+", "O-"],
    distance: "8.5 km",
    coordinates: { lat: 18.5308, lng: 73.8474 },
    emergency: false,
    description: "Campus-based mobilisation programme with student volunteers and multilingual outreach.",
    contactPhone: "+91 93710 55443",
    hlaFilterSupported: false
  }
];

export const initialEmergencies: EmergencyRequest[] = [
  {
    id: "EMG-1029",
    patientName: "Aarav Sharma",
    hospitalName: "AIIMS General Hospital",
    hospitalAddress: "SEZ Area, MIHAN, Nagpur",
    bloodGroup: "O-",
    unitsNeeded: 3,
    urgency: "critical",
    contactPerson: "Dr. K. V. Deshmukh",
    contactPhone: "+91 98224 19002",
    city: "Nagpur",
    coordinates: { lat: 21.0620, lng: 79.0480 },
    radiusKm: 15,
    reachableDonorsCount: 42,
    respondedDonorsCount: 14,
    createdAt: "2026-09-26T23:15:00Z",
    status: "active",
    description: "Urgent O- negative donor needed for emergency vascular trauma surgery."
  },
  {
    id: "EMG-1028",
    patientName: "Priya Kulkarni",
    hospitalName: "Lilavati Hospital",
    hospitalAddress: "Bandra Reclamation, Mumbai",
    bloodGroup: "AB-",
    unitsNeeded: 2,
    urgency: "high",
    contactPerson: "Sister Sunita",
    contactPhone: "+91 98201 33442",
    city: "Mumbai",
    coordinates: { lat: 19.0510, lng: 72.8270 },
    radiusKm: 25,
    reachableDonorsCount: 18,
    respondedDonorsCount: 6,
    createdAt: "2026-09-26T21:40:00Z",
    status: "active",
    description: "Required for scheduled bone marrow transplant preparation."
  }
];

export const initialHospitals: Hospital[] = [
  {
    id: "HOSP-01",
    name: "AIIMS Nagpur",
    city: "Nagpur",
    address: "MIHAN Campus, Nagpur, Maharashtra",
    phone: "+91 712 2800000",
    availableUnits: { "A+": 14, "B+": 22, "O+": 30, "O-": 2, "AB+": 8, "AB-": 1 },
    coordinates: { lat: 21.0620, lng: 79.0480 },
    hasEmergencyICU: true
  },
  {
    id: "HOSP-02",
    name: "Government Medical College & Hospital (GMCH)",
    city: "Nagpur",
    address: "Medical Square, Hanuman Nagar, Nagpur",
    phone: "+91 712 2744400",
    availableUnits: { "A+": 25, "B+": 38, "O+": 45, "O-": 4, "AB+": 12, "AB-": 3 },
    coordinates: { lat: 21.1270, lng: 79.0980 },
    hasEmergencyICU: true
  },
  {
    id: "HOSP-03",
    name: "KEM Hospital",
    city: "Mumbai",
    address: "Parel, Mumbai, Maharashtra",
    phone: "+91 22 24107000",
    availableUnits: { "A+": 40, "B+": 55, "O+": 60, "O-": 5, "AB+": 18, "AB-": 2 },
    coordinates: { lat: 19.0024, lng: 72.8422 },
    hasEmergencyICU: true
  }
];

export const initialBloodBanks: BloodBank[] = [
  {
    id: "BB-01",
    name: "Nagpur Central Blood Bank",
    city: "Nagpur",
    address: "Near Mayo Hospital, Central Avenue, Nagpur",
    phone: "+91 712 2721100",
    inventory: { "A+": 18, "B+": 26, "O+": 34, "O-": 3, "A-": 4, "B-": 5, "AB+": 10, "AB-": 2 },
    coordinates: { lat: 21.1520, lng: 79.0910 },
    is24Hours: true
  },
  {
    id: "BB-02",
    name: "LifeLine Blood Bank & Components",
    city: "Nagpur",
    address: "Dharampeth Main Road, Nagpur",
    phone: "+91 712 2533322",
    inventory: { "A+": 12, "B+": 19, "O+": 22, "O-": 1, "AB+": 6, "AB-": 0 },
    coordinates: { lat: 21.1410, lng: 79.0640 },
    is24Hours: true
  }
];

export const initialRegistrations: Registration[] = [
  {
    id: "BC-TKT-89402",
    campId: "CAMP-005",
    campName: "Central Nagpur Live Camp",
    userId: "USR-001",
    userName: "Mahi Qureshi",
    userEmail: "mahi.q@example.com",
    userPhone: "+91 98765 43210",
    bloodGroup: "O+",
    city: "Nagpur",
    registrationDate: "2026-09-25T14:20:00Z",
    status: "Confirmed",
    preferredTimeSlot: "10:00 AM – 11:30 AM",
    consentGiven: true,
    emergencyAlertOptIn: true,
    hlaInfo: "HLA-A*02:01, HLA-B*07:02",
    qrCodeToken: "TOKEN-BC-TKT-89402-MAHI-O+"
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "LOG-501",
    timestamp: "2026-09-26 23:45:10",
    actor: "Mahi Qureshi",
    actorRole: "individual",
    action: "Consent Preference Updated",
    category: "consent",
    details: "Toggled emergency alert opt-in to Active for O+ blood group alerts.",
    ipAddress: "103.22.140.12"
  },
  {
    id: "LOG-502",
    timestamp: "2026-09-26 22:15:30",
    actor: "Red Cross Admin",
    actorRole: "organization",
    action: "Camp Attendance Verification",
    category: "organization",
    details: "Scanned QR Ticket BC-TKT-89402 for donor Mahi Qureshi at Central Nagpur Camp.",
    ipAddress: "49.36.192.88"
  },
  {
    id: "LOG-503",
    timestamp: "2026-09-26 21:40:05",
    actor: "Dr. K. V. Deshmukh",
    actorRole: "organization",
    action: "Emergency SOS Broadcast",
    category: "emergency",
    details: "Broadcasted critical O- emergency request EMG-1029 with 15km radius in Nagpur.",
    ipAddress: "114.143.20.10"
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: "NOTIF-01",
    title: "Critical O- Emergency Alert",
    message: "Immediate emergency donation requested at AIIMS Nagpur (15km away).",
    type: "emergency",
    timestamp: "10 mins ago",
    read: false,
    linkSection: "emergency"
  },
  {
    id: "NOTIF-02",
    title: "Registration Confirmed",
    message: "Your ticket BC-TKT-89402 for Central Nagpur Live Camp is active.",
    type: "success",
    timestamp: "2 hours ago",
    read: false,
    linkSection: "donor"
  },
  {
    id: "NOTIF-03",
    title: "New Camp Announced",
    message: "Maharashtra Youth Donor Camp is scheduled for Oct 6 in Nagpur.",
    type: "info",
    timestamp: "1 day ago",
    read: true,
    linkSection: "camps"
  }
];

export const defaultIndividualUser: UserProfile = {
  id: "USR-001",
  name: "Mahi Qureshi",
  email: "mahi.q@example.com",
  phone: "+91 98765 43210",
  role: "individual",
  userType: "donor",
  bloodGroup: "O+",
  location: "Sitabuldi, Nagpur",
  city: "Nagpur",
  hlaType: "HLA-A*02:01, HLA-B*07:02",
  donationCount: 5,
  lastDonationDate: "2026-06-15",
  isAvailableForEmergency: true,
  preferredLanguage: "en"
};

export const defaultOrganizationUser: UserProfile = {
  id: "ORG-001",
  name: "Red Cross Nagpur Chapter",
  email: "contact@redcrossnagpur.org",
  phone: "+91 712 2554433",
  role: "organization",
  userType: "ngo",
  bloodGroup: "N/A",
  location: "Civil Lines, Nagpur",
  city: "Nagpur",
  donationCount: 0,
  isAvailableForEmergency: true,
  preferredLanguage: "en",
  organizationName: "Red Cross Society (Nagpur)",
  verifiedOrganization: true
};
