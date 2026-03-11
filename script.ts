const add_btn = document.querySelector<HTMLButtonElement>("#add-btn");
const cancel_btn = document.querySelector<HTMLButtonElement>("#cancel_btn");
const form_data = document.querySelector<HTMLDivElement>("#main-form");
const main = document.querySelector<HTMLDivElement>(".main");
const tbody = document.querySelector<HTMLTableElement>("tbody");
const logout = document.querySelector<HTMLImageElement>("#icon-dropdown");
const logout_div = document.querySelector<HTMLDivElement>(".logout-div");
const form = document.querySelector<HTMLFormElement>("form");
const waitingInput = document.querySelector<HTMLInputElement>("#waiting_num");
const person = document.querySelector<HTMLDivElement>(".for-pending");
const statusSelect = document.querySelector<HTMLSelectElement>("#status_id");
let edit_index: number | null = null;

const title_doc = document.querySelector<HTMLInputElement>("#title_doc");
const date_doc = document.querySelector<HTMLInputElement>("#date_doc");
const searchBox = document.querySelector<HTMLInputElement>("#search-box");
const add_doc = document.querySelector<HTMLHeadingElement>(".add-doc");



//interface

interface DocumentItem {
  title: string;
  status: string;
  waiting: string | null;
  date: string;
  time: string;
  originalIndex?: number;
}



//get data from local storage
function getdata(): DocumentItem[] {
  const storedData = localStorage.getItem("DocumentData");
  return storedData ? JSON.parse(storedData) : [];
}

//set data to local storage

function setdata(data: DocumentItem[]): void {
  localStorage.setItem("DocumentData", JSON.stringify(data));
}



//logout dropdown

if (logout) {
  logout.addEventListener("click", function () {
    if (!logout_div) return;
    logout_div.style.display =
      logout_div.style.display === "flex" ? "none" : "flex";
  });
}




document.addEventListener("click", function (e) {
  if (!(e.target instanceof HTMLElement)) return;



  //close logout
  if (!logout_div) return;

  if (logout_div.style.display === "flex") {
    if (!logout) return;

    if (!logout_div.contains(e.target) && !logout.contains(e.target)) {
      logout_div.style.display = "none";
    }
  }



  //form close
  if (form_data && form_data.style.display === "flex") {
    const formBox = document.getElementById("form-div");
    if (!formBox) return;

    const clickedEditButton = e.target.closest(".edit");
    const clickedAddButton = e.target.closest("#add-btn");

    if (
      !formBox.contains(e.target) &&
      !clickedEditButton &&
      !clickedAddButton
    ) {
      if (!form || !main || !person || !add_doc) return;

      form.reset();
      form_data.style.display = "none";
      main.style.filter = "none";
      person.style.display = "none";
      edit_index = null;
      add_doc.textContent = "Add Document";
    }
  }



  //settings menu 

  const settingsIcon = e.target.closest(".settings-icon");

  if (settingsIcon) {
    const wrapper = settingsIcon.closest(".settings-wrapper");
    if (!wrapper) return;

    const menu = wrapper.querySelector<HTMLDivElement>(".settings-div");
    if (!menu) return;

    const isOpen = menu.style.display === "flex";

    document
      .querySelectorAll<HTMLDivElement>(".settings-div")
      .forEach(m => (m.style.display = "none"));

    if (!isOpen) {
      menu.style.display = "flex";
    }
  } else {
    document
      .querySelectorAll<HTMLDivElement>(".settings-div")
      .forEach(menu => (menu.style.display = "none"));
  }



  //delete document

  const deleteBtn = e.target.closest(".delete");

  if (deleteBtn) {
    const indexStr = deleteBtn.getAttribute("data-index");
    if (!indexStr) return;

    const index = Number(indexStr);
    const DocumentData = getdata();

    DocumentData.splice(index, 1);
    setdata(DocumentData);

    if (searchBox) searchBox.value = "";

    displayData();

    if (form) form.reset();
  }



  //edit button

  const editBtn = e.target.closest(".edit");

  if (editBtn) {
    if (add_doc) add_doc.textContent = "Edit Document";

    const indexStr = editBtn.getAttribute("data-index");
    if (!indexStr) return;

    const index = Number(indexStr);
    const DocumentData = getdata();

    const item = DocumentData[index];
    if (!item) return;

    if (!date_doc) return;

    date_doc.value = new Date().toLocaleString();

    if (title_doc) title_doc.value = item.title;
    if (statusSelect) statusSelect.value = item.status;

    if (item.status === "Pending") {
      if (person) person.style.display = "block";
      if (waitingInput) waitingInput.value = item.waiting ?? "";
    } else {
      if (person) person.style.display = "none";
      if (waitingInput) waitingInput.value = "";
    }

    edit_index = index;

    if (!main || !form_data || !add_doc) return;

    main.style.filter = "blur(10px)";
    form_data.style.display = "flex";
  }
});



//add button

if (add_btn) {
  add_btn.addEventListener("click", function () {
    if (!main || !form_data || !date_doc) return;

    main.style.filter = "blur(5px)";
    form_data.style.display = "flex";
    date_doc.value = new Date().toLocaleString();
  });
}



//cancel button

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



//status change
if (person) {
  person.style.display = "none";

  if (statusSelect) {
    statusSelect.addEventListener("change", function () {
      if (statusSelect.value === "Pending") {
        person.style.display = "block";
      } else {
        person.style.display = "none";
      }
    });
  }
}



//form submission

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (
      !(e.target instanceof HTMLFormElement) ||
      !title_doc ||
      !statusSelect ||
      !waitingInput
    )
      return;

    const title = title_doc.value;
    const status = statusSelect.value;
    const waitingPersons = waitingInput.value;

    let waitingValue: string | null = null;

    if (status === "Pending") {
      waitingValue = waitingPersons.trim() || "0";
    }

    const DocumentData: DocumentItem[] = getdata();

    const newItem: DocumentItem = {
      title,
      status,
      waiting: waitingValue,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    if (edit_index != null) {
      DocumentData[edit_index] = newItem;
    } else {
      DocumentData.push(newItem);
    }

    setdata(DocumentData);
    displayData();

    form.reset();

    if (!form_data || !main || !person || !add_doc) return;

    person.style.display = "none";
    edit_index = null;

    form_data.style.display = "none";
    main.style.filter = "none";

    add_doc.textContent = "Add Document";

    if (!searchBox) return;
    searchBox.value = "";
  });
}


//display data

const displayData = (data?: DocumentItem[]) => {
  const DocumentData = data ?? getdata();

  let finalData = "";
  let button = "";
  let btn_class = "";

  DocumentData.forEach((element, i) => {
    let waitingText = "";

    if (element.status === "Needs Signing") {
      button = "Sign Now";
      btn_class = "signNow";
    } else if (element.status === "Pending") {
      button = "Preview";
      btn_class = "pending";

      waitingText = `
        <p class="waiting">
          Waiting for 
          <span class="waiting-person">${element.waiting} persons</span>
        </p>
      `;
    } else {
      button = "Download PDF";
      btn_class = "completed";
    }

    finalData += `
      <tr>
        <td><input type="checkbox"></td>

        <td class="td-items">${element.title}</td>

        <td class="td-items">
          <span class=${btn_class}>${element.status}</span>
          ${waitingText}
        </td>

        <td class="td-items date-text">
          ${element.date}<br>${element.time}
        </td>

        <td class="settings-wrapper">
          <div class="td-wrapper">
            <button class="btn-status">${button}</button>

            <img
              src="./assets/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.svg"
              alt="settings"
              class="settings-icon"
            >
          </div>

          <div class="settings-div">
            <button class="edit" data-index="${element.originalIndex ?? i}">
              Edit
              <img src="./assets/edit.svg" class="edit-icon" alt="">
            </button>

            <button class="delete" data-index="${element.originalIndex ?? i}">
              Delete
              <img src="./assets/delete.svg" class="delete-icon">
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  if (!tbody) return;
  tbody.innerHTML = finalData;
};

displayData();


//search functionality

if (searchBox) {
  searchBox.addEventListener("keyup", function () {
    const searchValue = searchBox.value.toLowerCase();

    const DocumentData = getdata();

    const filtered_data = DocumentData
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(searchValue) ||
          item.status.toLowerCase().includes(searchValue)
        );
      });

    displayData(filtered_data);
  });
}