let data = {
    slovensko: {
        sever: {
            "Žilinský kraj": [
                { name: "Oravský hrad", description: "<p>Oravský hrad je jedným z najkrajších hradov na Slovensku, nachádza sa nad riekou Orava.</p>", images: ["https://via.placeholder.com/200"] },
                { name: "Liptovský hrad", description: "<p>Liptovský hrad je zrúcanina v Liptove.</p>", images: ["https://via.placeholder.com/200"] }
            ],
            "Prešovský kraj": [
                { name: "Spišský hrad", description: "<p>Spišský hrad je jedným z najväčších hradov v strednej Európe.</p>", images: ["https://via.placeholder.com/200"] }
            ]
        },
        Západ: {
            "Trenčiansky kraj": [
                { name: Beckov", description: "<p>Býva tam krásna Lauuu.</p>", images: ["https://lh3.googleusercontent.com/gps-cs-s/AC9h4no0fq6p8vRkP8NaeJMCbtwr8yPcIiWcheBnG8UefB03_slRwTO4dd2rcsjx0kSOiJMTDshYqHYYH9K7h3xi4oddjI09Iv-oo_w_l-UQ3AvWz6u2rNVnxN0o6clkNFmYc4FyDP_f=s1360-w1360-h1020"] }
            ]
        }
    }
};

let isAdmin = false;
let addQuill, editQuill;
let deleteCountryPending = null;

document.addEventListener("DOMContentLoaded", () => {
    addQuill = new Quill('#add-desc-editor', { theme: 'snow', modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link']] } });
    editQuill = new Quill('#edit-desc-editor', { theme: 'snow', modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link']] } });
    updateCountry();
    updateAdminCountry();
    updateEditCountry();
});

function saveData() {
    console.log("Dáta sú pripravené na uloženie do súboru. Kliknite na 'Uložiť dáta do súboru' v admin paneli.");
}

function saveDataToFile() {
    try {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'castleData.json';
        a.click();
        URL.revokeObjectURL(url);
        alert("Dáta boli uložené do súboru 'castleData.json'.");
    } catch (e) {
        alert("Chyba pri ukladaní dát do súboru: " + e.message);
    }
}

function loadDataFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
        alert("Vyberte platný JSON súbor!");
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loadedData = JSON.parse(e.target.result);
            if (typeof loadedData !== 'object' || loadedData === null) {
                throw new Error("Neplatná štruktúra dát.");
            }
            data = loadedData;
            updateCountry();
            updateAdminCountry();
            updateEditCountry();
            alert("Dáta boli úspešne načítané!");
        } catch (err) {
            alert("Chyba pri načítavaní dát: " + err.message);
        }
    };
    reader.onerror = () => {
        alert("Chyba pri čítaní súboru!");
    };
    reader.readAsText(file);
}

function showLogin() {
    document.getElementById("login-form").style.display = "block";
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "password123") {
        isAdmin = true;
        document.getElementById("login-form").style.display = "none";
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("admin-panel").style.display = "block";
        updateAdminCountry();
        updateEditCountry();
        updateCountry();
    } else {
        alert("Nesprávne meno alebo heslo!");
    }
}

function logout() {
    isAdmin = false;
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("admin-panel").style.display = "none";
    updateCountry();
}

function updateCountry() {
    const countrySelect = document.getElementById("country");
    const regionSelect = document.getElementById("region");
    const krajSelect = document.getElementById("kraj");
    const castleSelect = document.getElementById("castle");
    countrySelect.innerHTML = '<option value="">Vyber krajinu</option>';
    regionSelect.innerHTML = '<option value="">Vyber časť</option>';
    krajSelect.innerHTML = '<option value="">Vyber kraj</option>';
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    regionSelect.disabled = true;
    krajSelect.disabled = true;
    castleSelect.disabled = true;
    document.getElementById("castle-info").style.display = "none";
    Object.keys(data).forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.text = country.charAt(0).toUpperCase() + country.slice(1);
        countrySelect.appendChild(option);
    });
}

function updateRegions() {
    const country = document.getElementById("country").value;
    const regionSelect = document.getElementById("region");
    const krajSelect = document.getElementById("kraj");
    const castleSelect = document.getElementById("castle");
    regionSelect.innerHTML = '<option value="">Vyber časť</option>';
    krajSelect.innerHTML = '<option value="">Vyber kraj</option>';
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    regionSelect.disabled = true;
    krajSelect.disabled = true;
    castleSelect.disabled = true;
    document.getElementById("castle-info").style.display = "none";
    if (country && data[country]) {
        Object.keys(data[country]).forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.text = region.charAt(0).toUpperCase() + region.slice(1);
            regionSelect.appendChild(option);
        });
        regionSelect.disabled = false;
    }
}

function updateKraj() {
    const country = document.getElementById("country").value;
    const region = document.getElementById("region").value;
    const krajSelect = document.getElementById("kraj");
    const castleSelect = document.getElementById("castle");
    krajSelect.innerHTML = '<option value="">Vyber kraj</option>';
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    krajSelect.disabled = true;
    castleSelect.disabled = true;
    document.getElementById("castle-info").style.display = "none";
    if (country && region && data[country][region]) {
        Object.keys(data[country][region]).forEach(kraj => {
            const option = document.createElement("option");
            option.value = kraj;
            option.text = kraj;
            krajSelect.appendChild(option);
        });
        krajSelect.disabled = false;
    }
}

function updateCastles() {
    const country = document.getElementById("country").value;
    const region = document.getElementById("region").value;
    const kraj = document.getElementById("kraj").value;
    const castleSelect = document.getElementById("castle");
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    castleSelect.disabled = true;
    document.getElementById("castle-info").style.display = "none";
    if (country && region && kraj && data[country][region][kraj]) {
        data[country][region][kraj].forEach(castle => {
            const option = document.createElement("option");
            option.value = castle.name;
            option.text = castle.name;
            castleSelect.appendChild(option);
        });
        castleSelect.disabled = false;
    }
}

function displayCastle() {
    const country = document.getElementById("country").value;
    const region = document.getElementById("region").value;
    const kraj = document.getElementById("kraj").value;
    const castleName = document.getElementById("castle").value;
    const castleInfo = document.getElementById("castle-info");
    const castleNameEl = document.getElementById("castle-name");
    const castleDescEl = document.getElementById("castle-description");
    const castleGallery = document.getElementById("castle-gallery");
    if (country && region && kraj && castleName) {
        const castle = data[country][region][kraj].find(c => c.name === castleName);
        if (castle) {
            castleNameEl.textContent = castle.name;
            castleDescEl.innerHTML = castle.description || "<p>Žiaden popis.</p>";
            castleGallery.innerHTML = "";
            castle.images.forEach(img => {
                const imgEl = document.createElement("img");
                imgEl.src = img;
                castleGallery.appendChild(imgEl);
            });
            castleInfo.style.display = "block";
        }
    } else {
        castleInfo.style.display = "none";
    }
}

function updateAdminCountry() {
    const countrySelect = document.getElementById("admin-country");
    countrySelect.innerHTML = '<option value="">Vyber krajinu</option>';
    Object.keys(data).forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.text = country.charAt(0).toUpperCase() + country.slice(1);
        countrySelect.appendChild(option);
    });
    updateAdminRegion();
}

function updateAdminRegion() {
    const country = document.getElementById("admin-country").value;
    const regionSelect = document.getElementById("admin-region");
    const krajSelect = document.getElementById("admin-kraj");
    const castleSelect = document.getElementById("admin-castle");
    regionSelect.innerHTML = '<option value="">Vyber časť</option>';
    krajSelect.innerHTML = '<option value="">Vyber kraj</option>';
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    regionSelect.disabled = true;
    krajSelect.disabled = true;
    castleSelect.disabled = true;
    document.getElementById("delete-region-btn").disabled = true;
    document.getElementById("delete-kraj-btn").disabled = true;
    document.getElementById("delete-castle-btn").disabled = true;
    if (country && data[country]) {
        Object.keys(data[country]).forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.text = region.charAt(0).toUpperCase() + region.slice(1);
            regionSelect.appendChild(option);
        });
        regionSelect.disabled = false;
        document.getElementById("delete-region-btn").disabled = false;
    }
}

function updateAdminKraj() {
    const country = document.getElementById("admin-country").value;
    const region = document.getElementById("admin-region").value;
    const krajSelect = document.getElementById("admin-kraj");
    const castleSelect = document.getElementById("admin-castle");
    krajSelect.innerHTML = '<option value="">Vyber kraj</option>';
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    krajSelect.disabled = true;
    castleSelect.disabled = true;
    document.getElementById("delete-kraj-btn").disabled = true;
    document.getElementById("delete-castle-btn").disabled = true;
    if (country && region && data[country][region]) {
        Object.keys(data[country][region]).forEach(kraj => {
            const option = document.createElement("option");
            option.value = kraj;
            option.text = kraj;
            krajSelect.appendChild(option);
        });
        krajSelect.disabled = false;
        document.getElementById("delete-kraj-btn").disabled = false;
    }
}

function updateAdminCastles() {
    const country = document.getElementById("admin-country").value;
    const region = document.getElementById("admin-region").value;
    const kraj = document.getElementById("admin-kraj").value;
    const castleSelect = document.getElementById("admin-castle");
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    castleSelect.disabled = true;
    document.getElementById("delete-castle-btn").disabled = true;
    if (country && region && kraj && data[country][region][kraj]) {
        data[country][region][kraj].forEach(castle => {
            const option = document.createElement("option");
            option.value = castle.name;
            option.text = castle.name;
            castleSelect.appendChild(option);
        });
        castleSelect.disabled = false;
        document.getElementById("delete-castle-btn").disabled = false;
    }
}

function updateEditCountry() {
    const countrySelect = document.getElementById("edit-country");
    countrySelect.innerHTML = '<option value="">Vyber krajinu</option>';
    Object.keys(data).forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.text = country.charAt(0).toUpperCase() + country.slice(1);
        countrySelect.appendChild(option);
    });
    updateEditRegion();
}

function updateEditRegion() {
    const country = document.getElementById("edit-country").value;
    const regionSelect = document.getElementById("edit-region");
    const krajSelect = document.getElementById("edit-kraj");
    const castleSelect = document.getElementById("edit-castle");
    regionSelect.innerHTML = '<option value="">Vyber časť</option>';
    krajSelect.innerHTML = '<option value="">Vyber kraj</option>';
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    regionSelect.disabled = true;
    krajSelect.disabled = true;
    castleSelect.disabled = true;
    document.getElementById("edit-form").style.display = "none";
    if (country && data[country]) {
        Object.keys(data[country]).forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.text = region.charAt(0).toUpperCase() + region.slice(1);
            regionSelect.appendChild(option);
        });
        regionSelect.disabled = false;
    }
}

function updateEditKraj() {
    const country = document.getElementById("edit-country").value;
    const region = document.getElementById("edit-region").value;
    const krajSelect = document.getElementById("edit-kraj");
    const castleSelect = document.getElementById("edit-castle");
    krajSelect.innerHTML = '<option value="">Vyber kraj</option>';
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    krajSelect.disabled = true;
    castleSelect.disabled = true;
    document.getElementById("edit-form").style.display = "none";
    if (country && region && data[country][region]) {
        Object.keys(data[country][region]).forEach(kraj => {
            const option = document.createElement("option");
            option.value = kraj;
            option.text = kraj;
            krajSelect.appendChild(option);
        });
        krajSelect.disabled = false;
    }
}

function updateEditCastles() {
    const country = document.getElementById("edit-country").value;
    const region = document.getElementById("edit-region").value;
    const kraj = document.getElementById("edit-kraj").value;
    const castleSelect = document.getElementById("edit-castle");
    castleSelect.innerHTML = '<option value="">Vyber hrad</option>';
    castleSelect.disabled = true;
    document.getElementById("edit-form").style.display = "none";
    if (country && region && kraj && data[country][region][kraj]) {
        data[country][region][kraj].forEach(castle => {
            const option = document.createElement("option");
            option.value = castle.name;
            option.text = castle.name;
            castleSelect.appendChild(option);
        });
        castleSelect.disabled = false;
    }
}

function showAddForm(type) {
    document.getElementById("add-type").value = type;
    document.getElementById("add-name").value = "";
    addQuill.root.innerHTML = "";
    document.getElementById("add-img-url").value = "";
    document.getElementById("add-img-file").value = "";
    document.getElementById("castle-fields").style.display = type === "castle" ? "block" : "none";
    document.getElementById("add-form-title").textContent = `Pridať/Upraviť ${type === "country" ? "krajinu" : type === "region" ? "časť" : type === "kraj" ? "kraj" : "hrad"}`;
    document.getElementById("add-form").style.display = "block";
}

function hideAddForm() {
    document.getElementById("add-form").style.display = "none";
}

function processImages(fileInput, callback) {
    const files = fileInput.files;
    const images = [];
    let processed = 0;
    if (!files || files.length === 0) {
        callback(images);
        return;
    }
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            alert(`Súbor ${file.name} nie je obrázok!`);
            processed++;
            if (processed === files.length) callback(images);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            images.push(e.target.result);
            processed++;
            if (processed === files.length) callback(images);
        };
        reader.onerror = () => {
            alert(`Chyba pri načítavaní súboru ${file.name}!`);
            processed++;
            if (processed === files.length) callback(images);
        };
        reader.readAsDataURL(file);
    });
}

function addOrUpdateItem(event) {
    event.preventDefault();
    const type = document.getElementById("add-type").value;
    const name = document.getElementById("add-name").value.trim();
    const country = document.getElementById("admin-country").value;
    const region = document.getElementById("admin-region").value;
    const kraj = document.getElementById("admin-kraj").value;
    if (!name) {
        alert("Názov je povinný!");
        return;
    }
    if (type === "country") {
        const countryKey = name.toLowerCase();
        if (!data[countryKey]) {
            data[countryKey] = {};
            saveData();
            updateAdminCountry();
            updateEditCountry();
            updateCountry();
            hideAddForm();
            alert("Krajina pridaná!");
        } else {
            alert("Krajina už existuje!");
        }
    } else if (type === "region") {
        if (!country) {
            alert("Vyberte krajinu!");
            return;
        }
        const regionKey = name.toLowerCase();
        if (!data[country][regionKey]) {
            data[country][regionKey] = {};
            saveData();
            updateAdminRegion();
            updateEditRegion();
            updateRegions();
            hideAddForm();
            alert("Časť pridaná!");
        } else {
            alert("Časť už existuje!");
        }
    } else if (type === "kraj") {
        if (!country || !region) {
            alert("Vyberte krajinu a časť!");
            return;
        }
        if (!data[country][region][name]) {
            data[country][region][name] = [];
            saveData();
            updateAdminKraj();
            updateEditKraj();
            updateKraj();
            hideAddForm();
            alert("Kraj pridaný!");
        } else {
            alert("Kraj už existuje!");
        }
    } else if (type === "castle") {
        if (!country || !region || !kraj) {
            alert("Vyberte krajinu, časť a kraj!");
            return;
        }
        const description = addQuill.root.innerHTML;
        const urlImages = document.getElementById("add-img-url").value.split(",").map(img => img.trim()).filter(img => img);
        processImages(document.getElementById("add-img-file"), (fileImages) => {
            const images = [...urlImages, ...fileImages];
            const existingCastle = data[country][region][kraj].find(c => c.name === name);
            if (existingCastle) {
                existingCastle.description = description;
                existingCastle.images = images;
                alert("Hrad upravený!");
            } else {
                data[country][region][kraj].push({ name, description, images });
                alert("Hrad pridaný!");
            }
            saveData();
            updateAdminCastles();
            updateEditCastles();
            updateCastles();
            hideAddForm();
        });
    }
}

function deleteItem(type) {
    const country = document.getElementById("admin-country").value;
    const region = document.getElementById("admin-region").value;
    const kraj = document.getElementById("admin-kraj").value;
    const castle = document.getElementById("admin-castle").value;
    if (type === "country" && country) {
        deleteCountryPending = country;
        document.getElementById("delete-confirm").style.display = "block";
    } else if (type === "region" && country && region) {
        delete data[country][region];
        saveData();
        updateAdminRegion();
        updateEditRegion();
        updateRegions();
        alert("Časť odstránená!");
    } else if (type === "kraj" && country && region && kraj) {
        delete data[country][region][kraj];
        saveData();
        updateAdminKraj();
        updateEditKraj();
        updateKraj();
        alert("Kraj odstránený!");
    } else if (type === "castle" && country && region && kraj && castle) {
        data[country][region][kraj] = data[country][region][kraj].filter(c => c.name !== castle);
        saveData();
        updateAdminCastles();
        updateEditCastles();
        updateCastles();
        alert("Hrad odstránený!");
    } else {
        alert("Vyberte správne položky!");
    }
}

function confirmDeleteCountry(event) {
    event.preventDefault();
    const password = document.getElementById("delete-password").value;
    if (password === "password123") {
        if (deleteCountryPending) {
            delete data[deleteCountryPending];
            saveData();
            updateAdminCountry();
            updateEditCountry();
            updateCountry();
            document.getElementById("delete-confirm").style.display = "none";
            deleteCountryPending = null;
            alert("Krajina odstránená!");
        }
    } else {
        alert("Nesprávne heslo!");
    }
}

function cancelDelete() {
    document.getElementById("delete-confirm").style.display = "none";
    deleteCountryPending = null;
}

function loadCastleData() {
    const country = document.getElementById("edit-country").value;
    const region = document.getElementById("edit-region").value;
    const kraj = document.getElementById("edit-kraj").value;
    const castleName = document.getElementById("edit-castle").value;
    if (country && region && kraj && castleName) {
        const castle = data[country][region][kraj].find(c => c.name === castleName);
        if (castle) {
            document.getElementById("edit-castle-name").textContent = castle.name;
            editQuill.root.innerHTML = castle.description || "";
            document.getElementById("edit-img-url").value = castle.images.filter(img => !img.startsWith("data:image")).join(",");
            document.getElementById("edit-img-file").value = "";
            document.getElementById("edit-form").style.display = "block";
        }
    } else {
        document.getElementById("edit-form").style.display = "none";
    }
}

function editCastle(event) {
    event.preventDefault();
    const country = document.getElementById("edit-country").value;
    const region = document.getElementById("edit-region").value;
    const kraj = document.getElementById("edit-kraj").value;
    const castleName = document.getElementById("edit-castle").value;
    if (country && region && kraj && castleName) {
        const description = editQuill.root.innerHTML;
        const urlImages = document.getElementById("edit-img-url").value.split(",").map(img => img.trim()).filter(img => img);
        processImages(document.getElementById("edit-img-file"), (fileImages) => {
            const images = [...urlImages, ...fileImages];
            const castle = data[country][region][kraj].find(c => c.name === castleName);
            if (castle) {
                castle.description = description;
                castle.images = images;
                saveData();
                updateCastles();
                updateEditCastles();
                alert("Hrad upravený!");
                if (document.getElementById("castle").value === castleName) displayCastle();
            } else {
                alert("Hrad nenájdený!");
            }
        });
    } else {
        alert("Vyberte hrad!");
    }
}
