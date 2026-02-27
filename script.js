const add_btn = document.querySelector("#add-btn");
const cancel_btn = document.querySelector("#cancel_btn");
const form_data = document.querySelector("#main-form");
const main = document.querySelector(".main");
const tbody = document.querySelector("tbody");
const logout = document.querySelector("#icon-dropdown");
const logout_div = document.querySelector(".logout-div");
const form = document.querySelector("form");
const waitingInput = document.querySelector("#waiting_num");
const person = document.querySelector(".for-pending");
const statusSelect = document.querySelector("#status_id");
let edit_index = null;
const title_doc = document.querySelector("#title_doc");
const date_doc = document.querySelector("#date_doc");
const searchBox = document.querySelector("#search-box");
const edit_btn = document.querySelector(".edit");
const add_doc = document.querySelector(".add-doc");
//logout dropdown logic
if (logout) {
    logout.addEventListener("click", function () {
        if (!logout_div)
            return;
        logout_div.style.display =
            logout_div.style.display === "flex" ? "none" : "flex";
    });
}
//close when clicking outside
document.addEventListener("click", function (e) {
    // If form is open
    if (!logout_div)
        return;
    if (logout_div.style.display === "flex") {
        // Check if click is outside the form AND not the add button
        if (!(e.target instanceof HTMLElement))
            return;
        if (!logout)
            return;
        if (!logout_div.contains(e.target) && !logout.contains(e.target)) {
            logout_div.style.display = "none";
        }
    }
});
//add button
if (add_btn) {
    add_btn.addEventListener("click", function (e) {
        if (!main || !form_data || !date_doc)
            return;
        main.style.filter = "blur(5px)";
        form_data.style.display = "flex";
        //datetime
        date_doc.value = new Date().toLocaleString();
    });
}
//close edit form
document.addEventListener("click", function (e) {
    if (!form_data)
        return;
    if (form_data.style.display !== "flex")
        return;
    if (!(e.target instanceof HTMLElement))
        return;
    const formBox = document.getElementById("form-div");
    if (!formBox)
        return;
    const clickedEditButton = e.target.closest(".edit");
    const clickedAddButton = e.target.closest("#add-btn");
    if (!formBox.contains(e.target) &&
        !clickedEditButton &&
        !clickedAddButton) {
        if (!form || !main || !person || !add_doc)
            return;
        form.reset();
        form_data.style.display = "none";
        main.style.filter = "none";
        person.style.display = "none";
        edit_index = null;
        add_doc.textContent = "Add Document";
    }
});
// cancel-button
if (cancel_btn) {
    cancel_btn.addEventListener("click", function () {
        if (!form || !form_data || !main || !person || !waitingInput || !add_doc)
            return;
        form.reset();
        form_data.style.display = "none";
        main.style.filter = "none";
        person.style.display = "none";
        waitingInput.value = "";
        edit_index = null;
        add_doc.textContent = "Add Document";
    });
}
//pending persons
// hide initially
if (person) {
    person.style.display = "none";
    if (statusSelect) {
        statusSelect.addEventListener("change", function () {
            if (statusSelect.value === "Pending") {
                person.style.display = "block";
            }
            else {
                person.style.display = "none";
            }
        });
    }
}
//get data from local storage
function getdata() {
    const storedData = localStorage.getItem("DocumentData");
    return storedData ? JSON.parse(storedData) : [];
}
//set item
function setdata(data) {
    localStorage.setItem("DocumentData", JSON.stringify(data));
}
// form submission
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!(e.target instanceof HTMLFormElement) || !title_doc || !statusSelect || !waitingInput)
            return;
        const title = title_doc.value;
        const status = statusSelect.value;
        const waitingPersons = waitingInput.value;
        let waitingValue = null;
        if (status === "Pending") {
            if (!waitingPersons.trim())
                return;
            waitingValue = waitingPersons;
        }
        const DocumentData = getdata();
        const newItem = {
            title,
            status,
            waiting: waitingValue,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        if (edit_index != null) {
            DocumentData[edit_index] = newItem;
        }
        else {
            DocumentData.push(newItem);
        }
        setdata(DocumentData);
        displayData();
        form.reset();
        if (!form_data || !main || !person || !add_doc)
            return;
        person.style.display = "none";
        edit_index = null;
        form_data.style.display = "none";
        main.style.filter = "none";
        add_doc.textContent = "Add Document";
        if (add_doc) {
            add_doc.textContent = "Add Document";
        }
        if (!searchBox)
            return;
        searchBox.value = "";
    });
}
// display items from local storage
const displayData = (data) => {
    const DocumentData = data !== null && data !== void 0 ? data : getdata();
    let finalData = "";
    let button = "";
    let btn_class = "";
    DocumentData.forEach((element, i) => {
        let waitingText = "";
        if (element.status === "Needs Signing") {
            button = "Sign Now";
            btn_class = "signNow";
        }
        else if (element.status === "Pending") {
            button = "Preview";
            btn_class = "pending";
            waitingText = `<p class="waiting">Waiting for <span class="waiting-person">${element.waiting} persons</span></p>`;
        }
        else {
            button = "Download PDF";
            btn_class = "completed";
        }
        finalData += `
            <tr>
            <td ><input type="checkbox"></td>
            <td class="td-items">${element.title}</td>
            <td class="td-items "><span class=${btn_class}>${element.status}</span>
          ${waitingText}
            
            </td>
            <td class="td-items date-text">${element.date}<br>${element.time}</td>
        

            <td class="settings-wrapper">
              <div class="td-wrapper">
              <button class="btn-status">${button}</button>
              <img src="./assets/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.svg"
                alt="settings"
                class="settings-icon">
              </div>
              <div class="settings-div">
                <button class="edit" data-index="${element.originalIndex || i}">Edit
                <img src="./assets/edit.svg" class="edit-icon" alt="">
                
                </button>
                
              <button class="delete" data-index="${element.originalIndex || i}">Delete
  <img src="./assets/delete.svg" class="delete-icon"></img>
  </button>
              </div>
            </td>
            </tr>
            `;
    });
    if (!tbody)
        return;
    tbody.innerHTML = finalData;
};
displayData();
//open settings
document.addEventListener("click", function (e) {
    if (!(e.target instanceof HTMLElement))
        return;
    const settingsIcon = e.target.closest(".settings-icon");
    if (settingsIcon) {
        document.querySelectorAll(".settings-div")
            .forEach(menu => menu.style.display = "none");
        const wrapper = settingsIcon.closest(".settings-wrapper");
        if (!wrapper)
            return;
        const menu = wrapper.querySelector(".settings-div");
        if (!menu)
            return;
        menu.style.display = "flex";
    }
    else {
        document.querySelectorAll(".settings-div")
            .forEach(menu => menu.style.display = "none");
    }
});
//edit items
document.addEventListener("click", function (e) {
    var _a;
    if (!(e.target instanceof HTMLElement))
        return;
    if (e.target.classList.contains("edit")) {
        if (add_doc) {
            add_doc.textContent = "Edit Document";
        }
        const indexStr = e.target.getAttribute("data-index");
        if (!indexStr)
            return;
        const index = Number(indexStr);
        const DocumentData = getdata();
        const item = DocumentData[index];
        if (!item)
            return;
        if (!date_doc)
            return;
        date_doc.value = new Date().toLocaleString();
        if (title_doc)
            title_doc.value = item.title;
        if (statusSelect)
            statusSelect.value = item.status;
        if (item.status === "Pending") {
            if (person)
                person.style.display = "block";
            if (waitingInput)
                waitingInput.value = (_a = item.waiting) !== null && _a !== void 0 ? _a : "";
        }
        else {
            if (person)
                person.style.display = "none";
            if (waitingInput)
                waitingInput.value = "";
        }
        edit_index = index;
        if (!main || !form_data || !add_doc)
            return;
        main.style.filter = "blur(10px)";
        form_data.style.display = "flex";
    }
});
//delete items
document.addEventListener("click", function (e) {
    if (!(e.target instanceof HTMLElement))
        return;
    if (e.target.classList.contains("delete")) {
        const indexStr = e.target.getAttribute("data-index");
        const DocumentData = getdata();
        // Remove that item
        const index = Number(indexStr);
        DocumentData.splice(index, 1);
        setdata(DocumentData);
        if (!searchBox)
            return;
        searchBox.value = "";
        displayData();
        if (form) {
            form.reset();
        }
    }
});
//searchbar functionallity
if (searchBox) {
    searchBox.addEventListener("keyup", function () {
        const searchValue = searchBox.value.toLowerCase();
        const DocumentData = getdata();
        const filtered_data = DocumentData
            .map((item, index) => (Object.assign(Object.assign({}, item), { originalIndex: index })))
            .filter((item) => {
            return (item.title.toLowerCase().includes(searchValue) ||
                item.status.toLowerCase().includes(searchValue));
        });
        if (!filtered_data)
            return;
        displayData(filtered_data);
    });
}
export {};
//# sourceMappingURL=script.js.map