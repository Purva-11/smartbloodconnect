/* =========================================================
   BLOOD CONNECT
   COMPLETE FRONTEND APPLICATION
========================================================= */


/* =========================================================
   MOCK DATA
========================================================= */

const camps = [

    {
        id: "CAMP-001",
        name: "Nagpur Community Life Camp",
        organisation: "Red Cross Community Network",
        location: "Nagpur",
        venue: "Central Community Hall",
        date: "2026-10-03",
        time: "09:00 AM – 04:00 PM",
        status: "upcoming",
        target: 180,
        registered: 132,
        bloodGroups: ["A+", "B+", "O+", "O-"],
        distance: "4.2 km",
        emergency: false,
        description:
            "A city-wide community mobilisation camp focused on accessible donor registration and coordinated attendance."
    },

    {
        id: "CAMP-002",
        name: "Maharashtra Youth Donor Camp",
        organisation: "Youth Health Collective",
        location: "Nagpur",
        venue: "Youth Convention Centre",
        date: "2026-10-06",
        time: "10:00 AM – 05:00 PM",
        status: "upcoming",
        target: 250,
        registered: 198,
        bloodGroups: ["A+", "B+", "AB+", "O+"],
        distance: "7.8 km",
        emergency: false,
        description:
            "Large youth mobilisation event connecting students, volunteers and donor communities."
    },

    {
        id: "CAMP-003",
        name: "City Health Mobilisation Camp",
        organisation: "Rotary Community Initiative",
        location: "Mumbai",
        venue: "Civic Centre",
        date: "2026-10-09",
        time: "08:30 AM – 03:30 PM",
        status: "upcoming",
        target: 300,
        registered: 221,
        bloodGroups: ["A-", "B-", "O-", "AB-"],
        distance: "12.4 km",
        emergency: true,
        description:
            "A high-priority mobilisation camp with additional communication support for selected donor groups."
    },

    {
        id: "CAMP-004",
        name: "Nagpur Corporate CSR Camp",
        organisation: "TechNova CSR",
        location: "Nagpur",
        venue: "TechNova Campus",
        date: "2026-10-12",
        time: "09:30 AM – 02:30 PM",
        status: "upcoming",
        target: 150,
        registered: 92,
        bloodGroups: ["A+", "B+", "O+"],
        distance: "10.2 km",
        emergency: false,
        description:
            "Corporate CSR mobilisation programme designed around employee participation and community response."
    },

    {
        id: "CAMP-005",
        name: "Central Nagpur Live Camp",
        organisation: "City Health Network",
        location: "Nagpur",
        venue: "Central Medical Community Centre",
        date: "2026-09-26",
        time: "08:00 AM – 05:00 PM",
        status: "ongoing",
        target: 220,
        registered: 186,
        bloodGroups: ["A+", "B+", "O+", "AB+"],
        distance: "3.1 km",
        emergency: false,
        description:
            "Currently active mobilisation camp with live attendance and organiser check-in."
    },

    {
        id: "CAMP-006",
        name: "Mumbai Emergency Mobilisation Camp",
        organisation: "Community Response Alliance",
        location: "Mumbai",
        venue: "Western Civic Centre",
        date: "2026-09-26",
        time: "09:00 AM – 06:00 PM",
        status: "ongoing",
        target: 350,
        registered: 304,
        bloodGroups: ["O+", "O-", "B+", "B-"],
        distance: "5.6 km",
        emergency: true,
        description:
            "High-response camp operating with adaptive mobilisation and emergency communication support."
    },

    {
        id: "CAMP-007",
        name: "Pune Student Response Camp",
        organisation: "Campus Life Network",
        location: "Pune",
        venue: "University Activity Centre",
        date: "2026-09-26",
        time: "09:30 AM – 04:00 PM",
        status: "ongoing",
        target: 200,
        registered: 144,
        bloodGroups: ["A+", "A-", "O+", "O-"],
        distance: "8.5 km",
        emergency: false,
        description:
            "Campus-based mobilisation programme with student volunteers and multilingual outreach."
    },

    {
        id: "CAMP-008",
        name: "Bengaluru Community Camp",
        organisation: "Bengaluru Civic Network",
        location: "Bengaluru",
        venue: "Community Convention Hall",
        date: "2026-10-15",
        time: "10:00 AM – 04:00 PM",
        status: "upcoming",
        target: 240,
        registered: 161,
        bloodGroups: ["B+", "O+", "AB+", "A+"],
        distance: "6.7 km",
        emergency: false,
        description:
            "Community-led donor mobilisation camp with regional language communication."
    },

    {
        id: "CAMP-009",
        name: "Hyderabad Life Support Camp",
        organisation: "Hyderabad Community Alliance",
        location: "Hyderabad",
        venue: "People's Convention Centre",
        date: "2026-10-19",
        time: "09:00 AM – 03:00 PM",
        status: "upcoming",
        target: 175,
        registered: 118,
        bloodGroups: ["O+", "B+", "A+"],
        distance: "9.4 km",
        emergency: false,
        description:
            "Regional donor mobilisation camp with volunteer coordination and digital registration."
    }

];


let emergencies = [

    {
        id: "SOS-001",
        blood: "O+",
        hospital: "CityCare Hospital",
        location: "Nagpur",
        units: 4,
        fulfilled: 2,
        urgency: "Critical",
        time: "12 min ago"
    },

    {
        id: "SOS-002",
        blood: "B-",
        hospital: "Western Medical Centre",
        location: "Mumbai",
        units: 3,
        fulfilled: 1,
        urgency: "High",
        time: "28 min ago"
    },

    {
        id: "SOS-003",
        blood: "A+",
        hospital: "Central Community Hospital",
        location: "Pune",
        units: 5,
        fulfilled: 3,
        urgency: "Moderate",
        time: "43 min ago"
    },

    {
        id: "SOS-004",
        blood: "AB+",
        hospital: "Unity Care Centre",
        location: "Delhi",
        units: 2,
        fulfilled: 0,
        urgency: "High",
        time: "51 min ago"
    }

];


let auditLogs = [

    {
        time: "18:32",
        action: "Camp registration confirmed",
        user: "Mahi Qureshi",
        module: "Camps",
        status: "Success"
    },

    {
        time: "18:21",
        action: "Emergency consent reviewed",
        user: "Mahi Qureshi",
        module: "Consent",
        status: "Success"
    },

    {
        time: "17:54",
        action: "Emergency SOS broadcast",
        user: "Organiser",
        module: "Emergency",
        status: "Broadcast"
    },

    {
        time: "17:31",
        action: "QR ticket verified",
        user: "Volunteer 014",
        module: "Scanner",
        status: "Success"
    },

    {
        time: "16:48",
        action: "Camp created",
        user: "Organiser",
        module: "Camps",
        status: "Created"
    },

    {
        time: "16:22",
        action: "Reminder campaign triggered",
        user: "Organiser",
        module: "Communication",
        status: "Sent"
    }

];


let appState = {

    user: JSON.parse(
        localStorage.getItem("bloodConnectUser")
    ) || {
        name: "Mahi Qureshi",
        email: "mahi@example.com",
        phone: "+91 90000 00000",
        blood: "O+",
        language: "English",
        donorId: "BC-48291"
    },

    darkMode:
        localStorage.getItem("bloodConnectDark") === "true",

    campTab: "upcoming",

    registrationCamp: null,

    registrationStep: 1,

    consent: JSON.parse(
        localStorage.getItem("bloodConnectConsent")
    ) || {
        emergency: true,
        whatsapp: true,
        sms: true
    }

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);


/* =========================================================
   INITIALISE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initialiseTheme();

    initialiseAuth();

    initialiseNavigation();

    initialiseSearch();

    initialiseCamps();

    initialiseEmergency();

    initialiseIntelligence();

    initialiseDonor();

    initialiseScanner();

    initialiseAudit();

    initialiseModals();

    initialiseCommandPalette();

    initialiseProfile();

    initialiseNotifications();

    initialiseCounters();

    renderEmergencies();

    renderAudit();

    updateUserUI();

    if (
        localStorage.getItem("bloodConnectLoggedIn") === "true"
    ) {
        showApplication();
    }

});


/* =========================================================
   AUTHENTICATION
========================================================= */

function initialiseAuth() {

    $$(".auth-tab").forEach(tab => {

        tab.addEventListener("click", () => {

            const target = tab.dataset.authTab;

            $$(".auth-tab").forEach(item => {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            $$(".auth-form").forEach(form => {
                form.classList.remove("active");
            });

            if (target === "signin") {
                $("#signInForm").classList.add("active");
            } else {
                $("#signUpForm").classList.add("active");
            }

        });

    });


    $("#signInForm").addEventListener("submit", event => {

        event.preventDefault();

        const identifier =
            $("#loginIdentifier").value.trim();

        if (!identifier) {
            showToast(
                "Enter your login details.",
                "warning"
            );
            return;
        }

        localStorage.setItem(
            "bloodConnectLoggedIn",
            "true"
        );

        addAudit(
            "User signed in",
            "Authentication",
            "Success"
        );

        showToast(
            "Welcome back to Blood Connect.",
            "success"
        );

        showApplication();

    });


    $("#signUpForm").addEventListener("submit", event => {

        event.preventDefault();

        const name =
            $("#signupName").value.trim();

        const email =
            $("#signupEmail").value.trim();

        const phone =
            $("#signupPhone").value.trim();

        const blood =
            $("#signupBlood").value;

        if (!name || !email || !phone || !blood) {

            showToast(
                "Please complete all required fields.",
                "warning"
            );

            return;
        }


        appState.user = {

            name,

            email,

            phone,

            blood,

            language: "English",

            donorId:
                "BC-" +
                Math.floor(
                    10000 + Math.random() * 89999
                )

        };


        localStorage.setItem(
            "bloodConnectUser",
            JSON.stringify(appState.user)
        );

        localStorage.setItem(
            "bloodConnectLoggedIn",
            "true"
        );

        addAudit(
            "Account created",
            "Authentication",
            "Success"
        );

        showToast(
            "Account created successfully.",
            "success"
        );

        showApplication();

    });


    $$(".password-toggle").forEach(button => {

        button.addEventListener("click", () => {

            const input =
                document.getElementById(
                    button.dataset.password
                );

            input.type =
                input.type === "password"
                    ? "text"
                    : "password";

        });

    });


    $("#forgotPassword").addEventListener(
        "click",
        () => {

            showToast(
                "Password recovery would connect to your backend.",
                "info"
            );

        }
    );

}


/* =========================================================
   SHOW APP
========================================================= */

function showApplication() {

    $("#authScreen").classList.add("hidden");

    $("#app").classList.remove("hidden");

    updateUserUI();

    renderCamps();

    setTimeout(() => {

        animateCounters();

    }, 300);

}


/* =========================================================
   NAVIGATION
========================================================= */

function initialiseNavigation() {

    $$("[data-section]").forEach(button => {

        button.addEventListener("click", () => {

            const section =
                button.dataset.section;

            navigateTo(section);

        });

    });


    $("#mobileMenuButton").addEventListener(
        "click",
        () => {

            $("#mobileNav").classList.toggle("open");

        }
    );

}


function navigateTo(section) {

    $$(".page-section").forEach(item => {

        item.classList.remove("active");

    });


    const target =
        document.getElementById(section);

    if (!target) return;

    target.classList.add("active");


    $$(".nav-item").forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === section
        );

    });


    $("#mobileNav").classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   THEME
========================================================= */

function initialiseTheme() {

    if (appState.darkMode) {
        document.body.classList.add("dark");
    }

    updateThemeButton();


    $("#themeToggle").addEventListener(
        "click",
        toggleTheme
    );

}


function toggleTheme() {

    appState.darkMode =
        !appState.darkMode;

    document.body.classList.toggle(
        "dark",
        appState.darkMode
    );

    localStorage.setItem(
        "bloodConnectDark",
        appState.darkMode
    );

    updateThemeButton();

    addAudit(
        appState.darkMode
            ? "Dark mode enabled"
            : "Light mode enabled",
        "Appearance",
        "Success"
    );

    showToast(
        appState.darkMode
            ? "Dark Mode enabled."
            : "Light Mode enabled.",
        "success"
    );

}


function updateThemeButton() {

    const button =
        $("#themeToggle");

    if (!button) return;

    button.querySelector(".theme-symbol").textContent =
        appState.darkMode ? "☀" : "☾";

    button.querySelector("span:last-child").textContent =
        appState.darkMode
            ? "Light Mode"
            : "Dark Mode";

}


/* =========================================================
   USER UI
========================================================= */

function updateUserUI() {

    const user =
        appState.user;

    if (!user) return;

    const initials =
        user.name
            .split(" ")
            .map(word => word[0])
            .slice(0,2)
            .join("")
            .toUpperCase();


    $("#navName").textContent =
        user.name;

    $("#navAvatar").textContent =
        initials;

    $("#largeAvatar").textContent =
        initials;

    $("#donorName").textContent =
        user.name;

    $("#donorBlood").textContent =
        user.blood || "O+";

    $("#donorId").textContent =
        user.donorId;


    $("#passName").textContent =
        user.name;

    $("#passBlood").textContent =
        user.blood || "O+";

}


/* =========================================================
   SMART SEARCH
========================================================= */

function initialiseSearch() {

    $("#searchButton").addEventListener(
        "click",
        performSmartSearch
    );


    $("#smartSearch").addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                performSmartSearch();

            }

        }
    );

}


function performSmartSearch() {

    const query =
        $("#smartSearch").value
            .trim()
            .toLowerCase();

    const blood =
        $("#searchBlood").value;

    const hla =
        $("#hlaSearch").value
            .trim();


    if (!query && !blood && !hla) {

        showToast(
            "Enter a search term, blood group or HLA typing.",
            "info"
        );

        return;

    }


    let results =
        camps.filter(camp => {

            const matchesQuery =
                !query ||
                camp.name.toLowerCase().includes(query) ||
                camp.organisation.toLowerCase().includes(query) ||
                camp.location.toLowerCase().includes(query);

            const matchesBlood =
                !blood ||
                camp.bloodGroups.includes(blood);

            return matchesQuery && matchesBlood;

        });


    navigateTo("camps");

    $("#campSearch").value =
        query;

    $("#campBloodFilter").value =
        blood;

    renderCamps();


    if (hla) {

        showToast(
            `${results.length} camp result(s) found. HLA "${hla}" recorded as a search field.`,
            "success"
        );

        addAudit(
            `Smart search with HLA: ${hla}`,
            "Smart Search",
            "Success"
        );

    } else {

        showToast(
            `${results.length} camp result(s) found.`,
            "success"
        );

    }

}


/* =========================================================
   CAMPS
========================================================= */

function initialiseCamps() {

    $$(".camp-tab").forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                appState.campTab =
                    tab.dataset.campTab;

                $$(".camp-tab").forEach(item => {

                    item.classList.toggle(
                        "active",
                        item === tab
                    );

                });

                renderCamps();

            }
        );

    });


    $("#campSearch").addEventListener(
        "input",
        renderCamps
    );

    $("#campBloodFilter").addEventListener(
        "change",
        renderCamps
    );

    $("#campLocationFilter").addEventListener(
        "change",
        renderCamps
    );


    $("#clearCampFilters").addEventListener(
        "click",
        () => {

            $("#campSearch").value = "";
            $("#campBloodFilter").value = "";
            $("#campLocationFilter").value = "";

            renderCamps();

            showToast(
                "Camp filters cleared.",
                "info"
            );

        }
    );


    $("#createCampButton").addEventListener(
        "click",
        () => openModal("createCampModal")
    );


    $("#createCampForm").addEventListener(
        "submit",
        createCamp
    );

}


function renderCamps() {

    const query =
        $("#campSearch")
            ?.value
            .trim()
            .toLowerCase() || "";

    const blood =
        $("#campBloodFilter")
            ?.value || "";

    const location =
        $("#campLocationFilter")
            ?.value || "";


    const filtered =
        camps.filter(camp => {

            const statusMatch =
                camp.status === appState.campTab;

            const queryMatch =
                !query ||
                camp.name.toLowerCase().includes(query) ||
                camp.organisation.toLowerCase().includes(query) ||
                camp.location.toLowerCase().includes(query);

            const bloodMatch =
                !blood ||
                camp.bloodGroups.includes(blood);

            const locationMatch =
                !location ||
                camp.location === location;

            return (
                statusMatch &&
                queryMatch &&
                bloodMatch &&
                locationMatch
            );

        });


    const upcoming =
        camps.filter(
            camp => camp.status === "upcoming"
        ).length;

    const ongoing =
        camps.filter(
            camp => camp.status === "ongoing"
        ).length;


    $("#upcomingCount").textContent =
        upcoming;

    $("#ongoingCount").textContent =
        ongoing;


    const grid =
        $("#campGrid");

    if (!filtered.length) {

        grid.innerHTML = `
            <div class="glass-card" style="
                grid-column:1/-1;
                padding:50px;
                text-align:center;
                border-radius:20px;
            ">
                <div style="font-size:35px;margin-bottom:12px;">◇</div>
                <h3>No camps found</h3>
                <p style="
                    color:var(--muted);
                    font-size:10px;
                    margin-top:7px;
                ">
                    Try changing your filters or search criteria.
                </p>
            </div>
        `;

        return;
    }


    grid.innerHTML =
        filtered.map(camp => campCardHTML(camp)).join("");


    grid.querySelectorAll(
        "[data-camp-view]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const camp =
                    camps.find(
                        item =>
                            item.id ===
                            button.dataset.campView
                    );

                openCampDetails(camp);

            }
        );

    });


    grid.querySelectorAll(
        "[data-camp-register]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const camp =
                    camps.find(
                        item =>
                            item.id ===
                            button.dataset.campRegister
                    );

                openRegistration(camp);

            }
        );

    });

}


function campCardHTML(camp) {

    const percentage =
        Math.min(
            100,
            Math.round(
                camp.registered /
                camp.target *
                100
            )
        );


    return `
        <article class="camp-card glass-card">

            <div class="camp-cover">

                <div class="camp-cover-top">

                    <span class="camp-status ${camp.status}">
                        ${camp.status === "ongoing"
                            ? "● Ongoing"
                            : "Upcoming"}
                    </span>

                    ${
                        camp.emergency
                            ? `<span class="camp-emergency">EMERGENCY</span>`
                            : ""
                    }

                </div>

                <div class="camp-cover-symbol">
                    ◇
                </div>

            </div>


            <div class="camp-content">

                <div class="camp-org">

                    <span class="org-dot">
                        ${camp.organisation.charAt(0)}
                    </span>

                    ${camp.organisation}

                </div>

                <h3>${camp.name}</h3>

                <p class="camp-description">
                    ${camp.description}
                </p>

                <div class="camp-meta">

                    <div>
                        <span>DATE</span>
                        <strong>${formatDate(camp.date)}</strong>
                    </div>

                    <div>
                        <span>LOCATION</span>
                        <strong>${camp.location}</strong>
                    </div>

                    <div>
                        <span>VENUE</span>
                        <strong>${camp.venue}</strong>
                    </div>

                    <div>
                        <span>DISTANCE</span>
                        <strong>${camp.distance}</strong>
                    </div>

                </div>

                <div class="camp-progress-head">

                    <span>
                        ${camp.registered} registered
                    </span>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>

                <div class="progress-bar">
                    <span style="width:${percentage}%"></span>
                </div>

                <div class="camp-actions">

                    <button
                        class="camp-view"
                        data-camp-view="${camp.id}"
                    >
                        View Details
                    </button>

                    <button
                        class="camp-register"
                        data-camp-register="${camp.id}"
                    >
                        Register
                    </button>

                </div>

            </div>

        </article>
    `;

}


function openCampDetails(camp) {

    $("#campDetail").innerHTML = `

        <div class="camp-detail-cover">
            <span>◇</span>
        </div>

        <span class="camp-status ${camp.status}">
            ${camp.status === "ongoing"
                ? "● Ongoing Camp"
                : "Upcoming Camp"}
        </span>

        <h2>${camp.name}</h2>

        <p class="camp-detail-org">
            ${camp.organisation}
        </p>

        <p class="detail-description">
            ${camp.description}
        </p>

        <div class="detail-grid">

            <div>
                <span>DATE</span>
                <strong>${formatDate(camp.date)}</strong>
            </div>

            <div>
                <span>TIME</span>
                <strong>${camp.time}</strong>
            </div>

            <div>
                <span>LOCATION</span>
                <strong>${camp.location}</strong>
            </div>

            <div>
                <span>VENUE</span>
                <strong>${camp.venue}</strong>
            </div>

            <div>
                <span>TARGET</span>
                <strong>${camp.target} donors</strong>
            </div>

            <div>
                <span>REGISTERED</span>
                <strong>${camp.registered}</strong>
            </div>

        </div>

        <div class="camp-progress-head">
            <span>Camp registration</span>
            <strong>
                ${Math.round(camp.registered / camp.target * 100)}%
            </strong>
        </div>

        <div class="progress-bar">
            <span
                style="
                    width:${Math.min(
                        100,
                        camp.registered /
                        camp.target *
                        100
                    )}%
                "
            ></span>
        </div>

        <div style="
            display:flex;
            flex-wrap:wrap;
            gap:7px;
            margin:18px 0;
        ">

            ${camp.bloodGroups.map(
                group =>
                    `<span class="blood-chip">${group}</span>`
            ).join("")}

        </div>

        <div style="
            display:flex;
            gap:8px;
        ">

            <button
                class="primary-btn"
                id="detailRegisterButton"
            >
                Register for Camp
                <span>→</span>
            </button>

            <button
                class="secondary-btn"
                id="shareCampButton"
            >
                Share
                <span>↗</span>
            </button>

        </div>

    `;


    $("#detailRegisterButton").addEventListener(
        "click",
        () => {

            closeModal("campModal");

            openRegistration(camp);

        }
    );


    $("#shareCampButton").addEventListener(
        "click",
        async () => {

            const shareText =
                `${camp.name} — ${formatDate(camp.date)} at ${camp.venue}`;

            if (
                navigator.share
            ) {

                try {

                    await navigator.share({
                        title: camp.name,
                        text: shareText
                    });

                } catch {}

            } else {

                await copyText(shareText);

                showToast(
                    "Camp information copied.",
                    "success"
                );

            }

        }
    );


    openModal("campModal");

}


function createCamp(event) {

    event.preventDefault();


    const newCamp = {

        id:
            "CAMP-" +
            String(camps.length + 1)
                .padStart(3, "0"),

        name:
            $("#newCampName").value.trim(),

        organisation:
            $("#newCampOrg").value.trim(),

        location:
            $("#newCampLocation").value.trim(),

        venue:
            $("#newCampVenue").value.trim(),

        date:
            $("#newCampDate").value,

        time:
            "09:00 AM – 04:00 PM",

        status:
            $("#newCampDate").value === todayISO()
                ? "ongoing"
                : "upcoming",

        target:
            Number(
                $("#newCampTarget").value
            ),

        registered: 0,

        bloodGroups:
            ["A+", "B+", "O+"],

        distance:
            "New",

        emergency: false,

        description:
            "Newly created Blood Connect mobilisation camp."

    };


    camps.unshift(newCamp);

    closeModal("createCampModal");

    $("#createCampForm").reset();

    appState.campTab =
        newCamp.status;

    $$(".camp-tab").forEach(tab => {

        tab.classList.toggle(
            "active",
            tab.dataset.campTab ===
            appState.campTab
        );

    });

    renderCamps();

    addAudit(
        `Camp created: ${newCamp.name}`,
        "Camps",
        "Created"
    );

    showToast(
        "Camp created successfully.",
        "success"
    );

}


/* =========================================================
   REGISTRATION
========================================================= */

function openRegistration(camp) {

    appState.registrationCamp =
        camp;

    appState.registrationStep =
        1;


    $("#registrationStepNumber")
        .textContent = "1";

    $("#registrationTitle")
        .textContent =
        "Donor information";

    $("#registrationSubtitle")
        .textContent =
        "Tell us who is attending this camp.";


    $("#regName").value =
        appState.user.name;

    $("#regPhone").value =
        appState.user.phone;

    $("#regEmail").value =
        appState.user.email;

    $("#regBlood").value =
        appState.user.blood;


    updateRegistrationStep();

    openModal("registrationModal");

}


function updateRegistrationStep() {

    const step =
        appState.registrationStep;


    $$(".registration-step").forEach(
        item => {

            item.classList.toggle(
                "active",
                Number(item.dataset.step) === step
            );

        }
    );


    $("#registrationStepNumber")
        .textContent = step;


    if (step === 1) {

        $("#registrationTitle")
            .textContent =
            "Donor information";

        $("#registrationSubtitle")
            .textContent =
            "Tell us who is attending this camp.";

    }

    if (step === 2) {

        $("#registrationTitle")
            .textContent =
            "Consent preferences";

        $("#registrationSubtitle")
            .textContent =
            "Choose how Blood Connect may communicate.";

    }

    if (step === 3) {

        $("#registrationTitle")
            .textContent =
            "Administrative pre-check";

        $("#registrationSubtitle")
            .textContent =
            "Confirm the platform checklist.";

    }


    $("#registrationBack").style.display =
        step === 1
            ? "none"
            : "inline-flex";


    $("#registrationNext").innerHTML =
        step === 3
            ? "Complete Registration <span>✓</span>"
            : "Continue <span>→</span>";

}


$("#registrationNext").addEventListener(
    "click",
    () => {

        const step =
            appState.registrationStep;


        if (step === 1) {

            if (
                !$("#regName").value.trim() ||
                !$("#regPhone").value.trim() ||
                !$("#regEmail").value.trim() ||
                !$("#regBlood").value
            ) {

                showToast(
                    "Complete the donor information first.",
                    "warning"
                );

                return;

            }

            appState.registrationStep = 2;

            updateRegistrationStep();

            return;
        }


        if (step === 2) {

            appState.registrationStep = 3;

            updateRegistrationStep();

            return;

        }


        if (step === 3) {

            if (
                !$("#ageCheck").checked ||
                !$("#weightCheck").checked ||
                !$("#professionalCheck").checked
            ) {

                showToast(
                    "Complete all three confirmations.",
                    "warning"
                );

                return;

            }

            completeRegistration();

        }

    }
);


$("#registrationBack").addEventListener(
    "click",
    () => {

        if (
            appState.registrationStep > 1
        ) {

            appState.registrationStep--;

            updateRegistrationStep();

        }

    }
);


function completeRegistration() {

    const camp =
        appState.registrationCamp;


    camp.registered =
        Math.min(
            camp.target,
            camp.registered + 1
        );


    appState.user.blood =
        $("#regBlood").value;


    appState.user.language =
        $("#regLanguage").value;


    appState.consent.emergency =
        $("#regEmergencyConsent").checked;


    appState.consent.whatsapp =
        $("#regCommunicationConsent").checked;

    localStorage.setItem(
        "bloodConnectUser",
        JSON.stringify(appState.user)
    );

    localStorage.setItem(
        "bloodConnectConsent",
        JSON.stringify(appState.consent)
    );


    const ticket =
        "BC-TKT-" +
        Math.floor(
            10000 + Math.random() * 89999
        );


    $("#passTicket").textContent =
        ticket;


    closeModal("registrationModal");

    setTimeout(
        () => openModal("passModal"),
        250
    );


    addAudit(
        `Registered for ${camp.name}`,
        "Camps",
        "Success"
    );


    showToast(
        "Registration complete. Your digital pass is ready.",
        "success"
    );


    updateUserUI();

    renderCamps();

}


/* =========================================================
   EMERGENCY
========================================================= */

function initialiseEmergency() {

    $("#emergencyForm").addEventListener(
        "submit",
        createEmergency
    );


    $("#radiusSlider").addEventListener(
        "input",
        updateRadius
    );


    $("#expandBroadcast").addEventListener(
        "click",
        () => {

            let value =
                Number(
                    $("#radiusSlider").value
                );

            value =
                Math.min(
                    50,
                    value + 5
                );

            $("#radiusSlider").value =
                value;

            updateRadius();

            addAudit(
                `Broadcast radius expanded to ${value} km`,
                "Emergency",
                "Broadcast"
            );

            showToast(
                `Mobilisation radius expanded to ${value} km.`,
                "success"
            );

        }
    );

}


function createEmergency(event) {

    event.preventDefault();


    const blood =
        $("#emergencyBlood").value;

    const hospital =
        $("#emergencyHospital").value.trim();

    const location =
        $("#emergencyLocation").value.trim();

    const units =
        Number(
            $("#emergencyUnits").value
        );

    const urgency =
        document.querySelector(
            'input[name="urgency"]:checked'
        ).value;


    const emergency = {

        id:
            "SOS-" +
            String(emergencies.length + 1)
                .padStart(3, "0"),

        blood,

        hospital,

        location,

        units,

        fulfilled: 0,

        urgency,

        time: "Just now"

    };


    emergencies.unshift(
        emergency
    );


    $("#emergencyForm").reset();

    renderEmergencies();

    addAudit(
        `Emergency SOS created for ${blood}`,
        "Emergency",
        "Broadcast"
    );

    showToast(
        "Emergency SOS broadcast created.",
        "success"
    );

}


function renderEmergencies() {

    const list =
        $("#emergencyList");

    const preview =
        $("#emergencyPreview");


    const cards =
        emergencies.map(
            emergency => emergencyHTML(
                emergency
            )
        ).join("");


    if (list) {
        list.innerHTML = cards;
    }


    if (preview) {

        preview.innerHTML =
            emergencies
                .slice(0,3)
                .map(
                    emergency =>
                        emergencyPreviewHTML(
                            emergency
                        )
                )
                .join("");

    }

}


function emergencyPreviewHTML(item) {

    const percent =
        Math.round(
            item.fulfilled /
            item.units *
            100
        );


    return `

        <article class="emergency-mini glass-card">

            <div class="emergency-mini-head">

                <span class="blood-chip">
                    ${item.blood}
                </span>

                <span class="urgency-chip">
                    ${item.urgency}
                </span>

            </div>

            <h3>${item.hospital}</h3>

            <p>
                ${item.location} · ${item.units} units required
            </p>

            <div class="emergency-progress">
                <span style="width:${Math.min(percent,100)}%"></span>
            </div>

            <div class="emergency-mini-footer">
                <span>${item.fulfilled}/${item.units} fulfilled</span>
                <span>${item.time}</span>
            </div>

        </article>

    `;

}


function emergencyHTML(item) {

    const percent =
        Math.round(
            item.fulfilled /
            item.units *
            100
        );


    return `

        <article class="emergency-row glass-card">

            <div class="emergency-row-head">

                <span class="blood-chip">
                    ${item.blood}
                </span>

                <span class="urgency-chip">
                    ${item.urgency}
                </span>

            </div>

            <h3>${item.hospital}</h3>

            <p>
                ${item.location} · ${item.units} units requested
            </p>

            <div class="emergency-progress">
                <span style="width:${Math.min(percent,100)}%"></span>
            </div>

            <div class="emergency-row-footer">

                <span>
                    ${item.fulfilled}/${item.units} fulfilled
                </span>

                <span>
                    ${item.time}
                </span>

            </div>

        </article>

    `;

}


function updateRadius() {

    const value =
        Number(
            $("#radiusSlider").value
        );


    $("#radiusValue").textContent =
        `${value} km`;


    const reachable =
        Math.round(
            310 +
            value * 38
        );


    $("#reachableCount")
        .textContent =
        reachable.toLocaleString();

}


/* =========================================================
   INTELLIGENCE
========================================================= */

function initialiseIntelligence() {

    $("#reminderSlider").addEventListener(
        "input",
        updateSimulation
    );

    $("#confirmationSlider").addEventListener(
        "input",
        updateSimulation
    );


    $("#demoModeButton").addEventListener(
        "click",
        runDemoScenario
    );


    $$("[data-action]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;

                    handleAction(action);

                }
            );

        }
    );

}


function updateSimulation() {

    const reminder =
        Number(
            $("#reminderSlider").value
        );

    const confirmation =
        Number(
            $("#confirmationSlider").value
        );


    $("#reminderValue").textContent =
        `${reminder}%`;

    $("#confirmationValue").textContent =
        `${confirmation}%`;


    const predicted =
        Math.round(
            1284 *
            (
                .65 +
                reminder / 100 * .18 +
                confirmation / 100 * .17
            )
        );


    $("#simulationNumber")
        .textContent =
        Math.min(
            1500,
            predicted
        ).toLocaleString();

}


function runDemoScenario() {

    $("#reminderSlider").value = 90;
    $("#confirmationSlider").value = 88;

    updateSimulation();

    showToast(
        "National mobilisation demo scenario loaded.",
        "success"
    );

    addAudit(
        "Demo intelligence scenario executed",
        "Intelligence",
        "Success"
    );

}


function handleAction(action) {

    if (action === "reminder") {

        showToast(
            "32 donors are ready for reminder review.",
            "info"
        );

    }

    if (action === "language") {

        showToast(
            "Language analytics panel opened.",
            "info"
        );

    }

    if (action === "capacity") {

        navigateTo("camps");

        showToast(
            "High-capacity camps are shown.",
            "info"
        );

    }

    if (action === "saved") {

        showToast(
            "Saved camps panel loaded.",
            "info"
        );

    }

    if (action === "history") {

        showToast(
            "Donation activity history loaded.",
            "info"
        );

    }

}


/* =========================================================
   DONOR
========================================================= */

function initialiseDonor() {

    $("#openPassButton").addEventListener(
        "click",
        () => openModal("passModal")
    );


    $("#manageConsent").addEventListener(
        "click",
        () => {

            document
                .querySelector(".consent-card")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


    $("#editProfile").addEventListener(
        "click",
        () => {

            showToast(
                "Profile editing interface opened.",
                "info"
            );

        }
    );


    $$(".consent-row input").forEach(
        input => {

            input.addEventListener(
                "change",
                () => {

                    const id =
                        input.id;

                    if (id === "emergencyConsent") {
                        appState.consent.emergency =
                            input.checked;
                    }

                    if (id === "whatsappConsent") {
                        appState.consent.whatsapp =
                            input.checked;
                    }

                    if (id === "smsConsent") {
                        appState.consent.sms =
                            input.checked;
                    }


                    localStorage.setItem(
                        "bloodConnectConsent",
                        JSON.stringify(
                            appState.consent
                        )
                    );


                    $("#emergencyConsentStatus")
                        .textContent =
                        appState.consent.emergency
                            ? "Enabled"
                            : "Disabled";


                    addAudit(
                        `Consent updated: ${id}`,
                        "Consent",
                        "Success"
                    );


                    showToast(
                        "Consent preference updated.",
                        "success"
                    );

                }
            );

        }
    );


    $("#downloadPass").addEventListener(
        "click",
        downloadPass
    );


    $("#printPass").addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* =========================================================
   SCANNER
========================================================= */

function initialiseScanner() {

    $("#simulateScan").addEventListener(
        "click",
        simulateScan
    );


    $("#manualScanButton").addEventListener(
        "click",
        manualScan
    );

}


function simulateScan() {

    const result =
        $("#scanResult");


    result.innerHTML = `
        <strong style="color:var(--green);">
            ✓ Check-in Successful
        </strong>
        <br>
        Welcome ${escapeHTML(appState.user.name)}
        (${escapeHTML(appState.user.blood || "O+")})
        <br>
        <small style="color:var(--muted);">
            Ticket verified at ${new Date().toLocaleTimeString()}
        </small>
    `;


    addAudit(
        "QR donor ticket scanned",
        "Scanner",
        "Success"
    );

    showToast(
        "Donor check-in successful.",
        "success"
    );

}


function manualScan() {

    const value =
        $("#manualTicket").value.trim();


    if (!value) {

        showToast(
            "Enter a phone number or ticket ID.",
            "warning"
        );

        return;

    }


    $("#scanResult").innerHTML = `
        <strong style="color:var(--green);">
            ✓ Ticket Recognized
        </strong>
        <br>
        Donor: ${escapeHTML(appState.user.name)}
        <br>
        Blood group: ${escapeHTML(appState.user.blood || "O+")}
        <br>
        Ticket: ${escapeHTML(value)}
    `;


    addAudit(
        "Manual ticket verification",
        "Scanner",
        "Success"
    );

}


/* =========================================================
   AUDIT
========================================================= */

function initialiseAudit() {

    $("#auditSearch").addEventListener(
        "input",
        renderAudit
    );


    $("#exportAudit").addEventListener(
        "click",
        exportAuditCSV
    );

}


function addAudit(
    action,
    module,
    status
) {

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    auditLogs.unshift({

        time,

        action,

        user:
            appState.user.name,

        module,

        status

    });


    if (
        auditLogs.length > 100
    ) {

        auditLogs =
            auditLogs.slice(0,100);

    }


    renderAudit();

}


function renderAudit() {

    const table =
        $("#auditTable");

    if (!table) return;


    const query =
        $("#auditSearch")
            ?.value
            .trim()
            .toLowerCase() || "";


    const logs =
        auditLogs.filter(
            log =>
                !query ||
                log.action
                    .toLowerCase()
                    .includes(query) ||
                log.module
                    .toLowerCase()
                    .includes(query) ||
                log.user
                    .toLowerCase()
                    .includes(query)
        );


    table.innerHTML =
        logs.map(
            log => `

                <tr>

                    <td>${escapeHTML(log.time)}</td>

                    <td>
                        ${escapeHTML(log.action)}
                    </td>

                    <td>
                        ${escapeHTML(log.user)}
                    </td>

                    <td>
                        ${escapeHTML(log.module)}
                    </td>

                    <td>
                        <span class="status-chip">
                            ${escapeHTML(log.status)}
                        </span>
                    </td>

                </tr>

            `
        ).join("");

}


function exportAuditCSV() {

    const header =
        [
            "Time",
            "Action",
            "User",
            "Module",
            "Status"
        ].join(",");


    const rows =
        auditLogs.map(
            log =>
                [
                    log.time,
                    csvEscape(log.action),
                    csvEscape(log.user),
                    csvEscape(log.module),
                    log.status
                ].join(",")
        );


    downloadFile(
        "blood-connect-audit.csv",
        [
            header,
            ...rows
        ].join("\n"),
        "text/csv"
    );


    showToast(
        "Audit CSV exported.",
        "success"
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function initialiseNotifications() {

    $("#notificationButton").addEventListener(
        "click",
        () => {

            $("#notificationPanel")
                .classList.add("open");

        }
    );


    $("#closeNotifications").addEventListener(
        "click",
        () => {

            $("#notificationPanel")
                .classList.remove("open");

        }
    );

}


/* =========================================================
   PROFILE MENU
========================================================= */

function initialiseProfile() {

    $("#profileButton").addEventListener(
        "click",
        () => {

            openModal("profileModal");

        }
    );


    $("#logoutButton").addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "bloodConnectLoggedIn"
            );

            closeModal("profileModal");

            $("#app").classList.add("hidden");

            $("#authScreen")
                .classList.remove("hidden");

            showToast(
                "You have been logged out.",
                "info"
            );

        }
    );


    $("#profileScanner").addEventListener(
        "click",
        () => {

            closeModal("profileModal");

            navigateTo("scanner");

        }
    );

}


/* =========================================================
   COMMAND PALETTE
========================================================= */

function initialiseCommandPalette() {

    $("#commandButton").addEventListener(
        "click",
        openCommandPalette
    );


    $("#commandSearch").addEventListener(
        "input",
        renderCommandResults
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openCommandPalette();

            }


            if (
                event.key === "Escape"
            ) {

                closeModal("commandModal");

            }

        }
    );


    renderCommandResults();

}


const commands = [

    {
        icon: "◇",
        title: "Find Camps",
        description: "Open upcoming and ongoing camps",
        section: "camps"
    },

    {
        icon: "+",
        title: "Emergency Response",
        description: "Create or review emergency requests",
        section: "emergency"
    },

    {
        icon: "✦",
        title: "Intelligence Centre",
        description: "Open turnout intelligence",
        section: "intelligence"
    },

    {
        icon: "♙",
        title: "My Donor Space",
        description: "Manage donor profile and consent",
        section: "donor"
    },

    {
        icon: "⌁",
        title: "QR Scanner",
        description: "Open camp check-in scanner",
        section: "scanner"
    },

    {
        icon: "◇",
        title: "Audit & Security",
        description: "Review platform activity",
        section: "audit"
    }

];


function openCommandPalette() {

    openModal("commandModal");

    setTimeout(
        () => {

            $("#commandSearch")
                .focus();

        },
        100
    );

}


function renderCommandResults() {

    const query =
        $("#commandSearch")
            ?.value
            .trim()
            .toLowerCase() || "";


    const results =
        commands.filter(
            command =>
                command.title
                    .toLowerCase()
                    .includes(query) ||
                command.description
                    .toLowerCase()
                    .includes(query)
        );


    $("#commandResults").innerHTML =
        results.map(
            command => `

                <button
                    class="command-item"
                    data-command-section="${command.section}"
                >

                    <span>
                        ${command.icon}
                    </span>

                    <div>

                        <strong>
                            ${command.title}
                        </strong>

                        <small>
                            ${command.description}
                        </small>

                    </div>

                </button>

            `
        ).join("");


    $("#commandResults")
        .querySelectorAll(
            "[data-command-section]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const section =
                            button.dataset.commandSection;

                        closeModal("commandModal");

                        navigateTo(section);

                    }
                );

            }
        );

}


/* =========================================================
   MODALS
========================================================= */

function initialiseModals() {

    $$("[data-close]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.close
                    );

                }
            );

        }
    );


    $$(".modal-overlay").forEach(
        overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target === overlay
                    ) {

                        overlay.classList.remove(
                            "open"
                        );

                    }

                }
            );

        }
    );

}


function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("open");

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("open");

}


/* =========================================================
   COUNTERS
========================================================= */

function initialiseCounters() {

    const counters =
        $$(".counter");

    counters.forEach(
        counter => {

            counter.textContent = "0";

        }
    );

}


function animateCounters() {

    $$(".counter").forEach(
        counter => {

            const target =
                Number(
                    counter.dataset.value
                );

            const duration =
                1200;

            const start =
                performance.now();


            function update(time) {

                const progress =
                    Math.min(
                        (time - start) /
                        duration,
                        1
                    );


                const value =
                    Math.floor(
                        progress * target
                    );


                counter.textContent =
                    value.toLocaleString();


                if (progress < 1) {

                    requestAnimationFrame(
                        update
                    );

                }

            }


            requestAnimationFrame(update);

        }
    );

}


/* =========================================================
   DIGITAL PASS DOWNLOAD
========================================================= */

function downloadPass() {

    const name =
        appState.user.name;

    const blood =
        appState.user.blood || "O+";

    const ticket =
        $("#passTicket").textContent;


    const content = `

BLOOD CONNECT
DIGITAL DONOR PASS

Donor: ${name}
Blood Group: ${blood}
Ticket ID: ${ticket}
Donor ID: ${appState.user.donorId}

This is a digital prototype donor pass.
Final medical eligibility is determined by qualified healthcare professionals.

    `;


    downloadFile(
        "blood-connect-donor-pass.txt",
        content,
        "text/plain"
    );


    showToast(
        "Digital donor pass downloaded.",
        "success"
    );

}


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function formatDate(dateString) {

    const date =
        new Date(
            `${dateString}T12:00:00`
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function todayISO() {

    const date =
        new Date();

    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(2,"0"),
        String(
            date.getDate()
        ).padStart(2,"0")
    ].join("-");

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function csvEscape(value) {

    return `"${String(value)
        .replaceAll('"','""')}"`;

}


function downloadFile(
    filename,
    content,
    type
) {

    const blob =
        new Blob(
            [content],
            {
                type
            }
        );


    const url =
        URL.createObjectURL(blob);


    const anchor =
        document.createElement("a");

    anchor.href = url;

    anchor.download =
        filename;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);

}


async function copyText(text) {

    try {

        await navigator.clipboard.writeText(
            text
        );

    } catch {

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

    }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    const container =
        $("#toastContainer");


    const toast =
        document.createElement("div");

    toast.className =
        "toast";


    const icon =
        type === "warning"
            ? "!"
            : type === "info"
                ? "i"
                : "✓";


    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div>

            <strong>
                ${
                    type === "warning"
                        ? "Attention"
                        : type === "info"
                            ? "Blood Connect"
                            : "Success"
                }
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

        <button>×</button>

    `;


    toast.querySelector(
        "button"
    ).addEventListener(
        "click",
        () => toast.remove()
    );


    container.appendChild(toast);


    setTimeout(
        () => {

            toast.style.opacity = "0";
            toast.style.transform =
                "translateX(30px)";

            setTimeout(
                () => toast.remove(),
                300
            );

        },
        4000
    );

}
