let add_btn = document.getElementById("add-btn");
let delete_btn = document.getElementById("delete_btn");
let form_data = document.getElementById("main-form");
let main = document.querySelector(".main");
let tbody = document.querySelector("tbody");
let settings = document.querySelector("settings");
let settings_div = document.querySelector("settings-div");

//logout
let logout = document.querySelector("#icon-dropdown");
let logout_div = document.querySelector(".logout-div");
logout.addEventListener("click", function (e) {
  if ((logout_div.style.display = "none")) {
    logout_div.style.display = "block";
  } else {
    logout_div.style.display = "none";
  }
});
document.addEventListener("click", function (e) {
  // If form is open
  if (logout_div.style.display === "block") {
    // Check if click is outside the form AND not the add button
    if (!logout_div.contains(e.target) && !logout.contains(e.target)) {
      logout_div.style.display = "none";
    }
  }
});

// delete-items
delete_btn.addEventListener("click", function () {
  form_data.style.display = "none";
  main.style.filter = "none";
});

// add-items
add_btn.addEventListener("click", function (e) {
  main.style.filter = "blur(10px)";
  form_data.style.display = "block";
});

document.addEventListener("click", function (e) {
  // If form is open
  if (form_data.style.display === "block") {
    // Check if click is outside the form AND not the add button
    if (!form_data.contains(e.target) && !add_btn.contains(e.target)) {
      form_data.style.display = "none";
      main.style.filter = "none";
    }
  }
});

// delete-items
delete_btn.addEventListener("click", function () {
  form_data.style.display = "none";
  main.style.filter = "none";
});

// form working
let form = document.querySelector("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let title = e.target.title.value;
  let status = e.target.status.value;

  let userData = JSON.parse(localStorage.getItem("userDetails")) ?? [];

  if (edit_index != null) {
    userData[edit_index] = {
      title: title,
      status: status,
    };
    editIndex = null;
  } else {
    userData.push({
      title: title,
      status: status,
    });
  }

  localStorage.setItem("userDetails", JSON.stringify(userData));

  displayData();
  form.reset()
});

// add button working
add_btn_id.addEventListener("click", function () {
  form_data.style.display = "none";
  main.style.filter = "none";
});

// display items from local storage
let displayData = () => {
  let userData = JSON.parse(localStorage.getItem("userDetails")) ?? [];
  let finalData = "";
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  let button = "";
  let btn_class = "";

  userData.forEach((element, i) => {
    if (element.status === "Needs Signing") {
      button = "Sign Now";
      btn_class = "signNow";
    } else if (element.status === "Pending") {
      button = "Preview";
      btn_class = "pending";
    } else {
      button = "Download PDF";
      btn_class = "completed";
    }

    finalData += `
          <tr>
          <td ><input type="checkbox"></td>
          <td class="td-items">${element.title}</td>
          <td class="td-items "><span class=${btn_class}>${element.status}</span></td>
          <td class="td-items date-text">${date}<br>${time}</td>
          <td class="td-btn-status"><span class="btn-status">${button}</span></td>

          <td class="settings-wrapper">
            <img src="./assets/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.svg"
              alt="settings"
              class="settings-icon">
            <div class="settings-div">
              <button class="edit" data-index="${i}">Edit</button>
              <button class="delete" data-index="${i}">Delete</button>
            </div>
          </td>
          </tr>
          `;
  });
  tbody.innerHTML = finalData;
};

displayData();

document.addEventListener("click", function (e) {
  //close all existing ones
  if (e.target.classList.contains("settings-icon")) {
    document.querySelectorAll(".settings-div").forEach((menu) => {
      menu.style.display = "none";
    });

    // Open clicked one
    let menu = e.target
      .closest(".settings-wrapper")
      .querySelector(".settings-div");

    menu.style.display = "flex";
  }

  // If clicked anywhere else → close all
  else {
    document.querySelectorAll(".settings-div").forEach((menu) => {
      menu.style.display = "none";
    });
  }
});

//edit items
let edit_index = null;
let title_doc = document.getElementById("title_doc");
let status_id = document.getElementById("status_id");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit")) {
    let index = e.target.getAttribute("data-index");
    let userData = JSON.parse(localStorage.getItem("userDetails")) ?? [];

    let item = userData[index];
    title_doc.value = item.title;
    status_id.value = item.status;
    edit_index = index;
    main.style.filter = "blur(10px)";
    form_data.style.display = "block";
  }
});

//delete items

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    let index = e.target.getAttribute("data-index");
    let userData = JSON.parse(localStorage.getItem("userDetails")) ?? [];
    // Remove that item
    userData.splice(index, 1);

    localStorage.setItem("userDetails", JSON.stringify(userData));
    displayData();
  }
});

//searchbar functionallity

let searchBox = document.querySelector("#search-box");

searchBox.addEventListener("keyup", function () {
  const searchValue = searchBox.value.toLowerCase();
  let userData = JSON.parse(localStorage.getItem("userDetails")) ?? [];

  let filtered_data = userData.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchValue) ||
      item.status.toLowerCase().includes(searchValue)
    );
  });
  displayFilteredData(filtered_data);
});

function displayFilteredData(data) {
  let finalData = "";
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  let button = "";
  let btn_class = "";

  data.forEach((element, i) => {
    if (element.status === "Needs Signing") {
      button = "Sign Now";
      btn_class = "signNow";
    } else if (element.status === "Pending") {
      button = "Preview";
      btn_class = "pending";
    } else {
      button = "Download PDF";
      btn_class = "completed";
      btn_status = "completed";
    }

    finalData += `
          <tr class="tr-style">
          <td ><input type="checkbox"></td>
          <td class="td-items">${element.title}</td>
          <td class="td-items ${btn_class}">${element.status}</td>
          <td class="td-items date-text">${date}<br>${time}</td>
          <td class="btn-status">${button}</td>
          
          <td class="settings-wrapper">
            <img src="./assets/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.svg"
              alt="settings"
              class="settings-icon">
            <div class="settings-div">
              <button class="edit" data-index="${i}">Edit</button>
              <button class="delete" data-index="${i}">Delete</button>
            </div>
          </td>
          </tr>
          `;
  });
  tbody.innerHTML = finalData;
}
