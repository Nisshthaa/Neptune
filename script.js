const add_btn = document.querySelector("#add-btn");
const delete_btn = document.querySelector("#delete_btn");
const form_data = document.querySelector("#main-form");
const main = document.querySelector(".main");
const tbody = document.querySelector("tbody");
const settings = document.querySelector(".settings");
const settings_div = document.querySelector(".settings-div");
const logout = document.querySelector("#icon-dropdown");
const logout_div = document.querySelector(".logout-div");
const form = document.querySelector("form");
const waitingInput = document.querySelector("#waiting_num");
const person = document.querySelector(".for-pending");
const statusSelect = document.querySelector("#status_id");
let edit_index = null;
const title_doc = document.querySelector("#title_doc");
const date_doc = document.querySelector("#date_doc");
//logout dropdown logic
if (logout) {
    logout.addEventListener("click", function () {
        if (!logout_div)
            return;
        logout_div.style.display =
            logout_div.style.display === "block" ? "none" : "block";
    });
}
//close when clicking outside
document.addEventListener("click", function (e) {
    // If form is open
    if (!logout_div)
        return;
    if (logout_div.style.display === "block") {
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
        main.style.filter = "blur(10px)";
        form_data.style.display = "flex";
        //datetime
        date_doc.value = new Date().toLocaleString();
    });
    //close the button when clicked anywhere else
    document.addEventListener("click", function (e) {
        if (!form_data)
            return;
        if (form_data.style.display === "flex") {
            const formBox = document.getElementById("form-div");
            if (!formBox || !(e.target instanceof HTMLElement))
                return;
            if (!formBox.contains(e.target) &&
                !add_btn.contains(e.target)) {
                if (!form || !form_data || !main || !person)
                    return;
                form.reset();
                form_data.style.display = "none";
                main.style.filter = "none";
                person.style.display = "none";
                edit_index = null;
            }
        }
    });
}
// cancel-button
if (delete_btn) {
    delete_btn.addEventListener("click", function () {
        if (!form || !form_data || !main || !person || !waitingInput)
            return;
        form.reset();
        form_data.style.display = "none";
        main.style.filter = "none";
        person.style.display = "none";
        waitingInput.value = "";
        edit_index = null;
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
        let title = title_doc.value;
        let status = statusSelect.value;
        let waitingPersons = waitingInput.value;
        let DocumentData = getdata();
        const newItem = {
            title,
            status,
            waiting: status === "Pending" ? waitingPersons : null,
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
        if (!form_data || !main || !person)
            return;
        person.style.display = "none";
        edit_index = null;
        form_data.style.display = "none";
        main.style.filter = "none";
    });
}
// display items from local storage
let displayData = () => {
    let DocumentData = getdata();
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
              <button class="edit" data-index="${i}">Edit
               <img src="./assets/edit.svg" class="edit-icon" alt="">

              </button>
             <button class="delete" data-index="${i}">Delete
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
export {};
// document.addEventListener("click", function (e) {
//   //close all existing ones
//   if(!(e.target instanceof HTMLElement)) return
//   if (e.target.classList.contains("settings-icon")) {
//     document.querySelectorAll<HTMLDivElement>(".settings-div").forEach((menu) => {
//       menu.style.display = "none";
//     });
//     // Open clicked one
//     let menu = e.target
//       .closest(".settings-wrapper")
//       .querySelector<HTMLDivElement>(".settings-div");
//     menu.style.display = "flex";
//   }
//   // If clicked anywhere else → close all
//   else {
//     document.querySelectorAll(".settings-div").forEach((menu) => {
//       menu.style.display = "none";
//     });
//   }
// });
//# sourceMappingURL=script.js.map