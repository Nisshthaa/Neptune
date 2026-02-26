const add_btn = document.querySelector<HTMLButtonElement>("#add-btn");
const delete_btn = document.querySelector<HTMLButtonElement>("#delete_btn");
const form_data = document.querySelector<HTMLDivElement>("#main-form");
const main = document.querySelector<HTMLDivElement>(".main");
const tbody = document.querySelector<HTMLTableElement>("tbody");
const settings = document.querySelector<HTMLDivElement>(".settings");
const settings_div = document.querySelector<HTMLDivElement>(".settings-div");
const logout = document.querySelector<HTMLButtonElement>("#icon-dropdown");
const logout_div = document.querySelector<HTMLDivElement>(".logout-div");
const form = document.querySelector<HTMLFormElement>("form");
const waitingInput = document.querySelector<HTMLInputElement>("#waiting_num");
const person = document.querySelector<HTMLDivElement>(".for-pending");
const statusSelect = document.querySelector<HTMLSelectElement>("#status_id");
let edit_index :number|null= null;
const title_doc = document.querySelector<HTMLInputElement>("#title_doc");
const date_doc=document.querySelector<HTMLInputElement>("#date_doc")


//logout dropdown logic

if(logout ) {
logout.addEventListener("click", function () {
    if(!logout_div) return
  logout_div.style.display =
    logout_div.style.display === "block" ? "none" : "block";
})}


//close when clicking outside
document.addEventListener("click", function (e) {
  // If form is open
  if(!logout_div) return
  if (logout_div.style.display === "block") {
    // Check if click is outside the form AND not the add button
    if(!(e.target instanceof HTMLElement)) return
    if(!logout) return
    if (!logout_div.contains(e.target) && !logout.contains(e.target)) {
      logout_div.style.display = "none";
    }
  }
});


//add button
if(add_btn)
{add_btn.addEventListener("click", function (e) {
    if(!main || !form_data||!date_doc) return
  main.style.filter = "blur(10px)";
  form_data.style.display = "flex";
  //datetime
date_doc.value=new Date().toLocaleString()
});

//close the button when clicked anywhere else
document.addEventListener("click", function (e) {
    if(!form_data) return
  if (form_data.style.display === "flex") {
    const formBox = document.getElementById("form-div");

    if(!formBox || !(e.target instanceof HTMLElement)) return

    if (!formBox.contains(e.target) &&
      !add_btn.contains(e.target)
    ) {
         if(!form || !form_data||!main || !person) return
      form.reset()
      form_data.style.display = "none";
      main.style.filter = "none";
      person.style.display = "none";
      edit_index = null;
    }
  }
});
}

// cancel-button

if(delete_btn){
delete_btn.addEventListener("click", function () {
   if(!form || !form_data||!main || !person || !waitingInput) return;
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
if(person){
    person.style.display = "none";
    if(statusSelect){
statusSelect.addEventListener("change", function () {
  if (statusSelect.value === "Pending") {
    person.style.display = "block";
  } else {
    person.style.display = "none";
  }
});
    }

}

//interface creation
interface DocumentItem {
  title: string;
  status: string;
  waiting: string | null;
  date: string;
  time: string;
}

//get data from local storage
function getdata(): DocumentItem[] {
  const storedData = localStorage.getItem("DocumentData");
  return storedData ? JSON.parse(storedData) : [];
}

//set item
function setdata(data:DocumentItem[]):void{
      localStorage.setItem("DocumentData", JSON.stringify(data));

}


// form submission
if(form){
form.addEventListener("submit", function (e) {
  e.preventDefault();
if(!(e.target instanceof HTMLFormElement)|| !title_doc || !statusSelect || !waitingInput) return
  let title = title_doc.value
  let status = statusSelect.value;
  let waitingPersons = waitingInput.value;

  let DocumentData : DocumentItem[]= getdata()
  
 const newItem: DocumentItem = {
      title,
      status,
      waiting: status === "Pending" ? waitingPersons : null,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    
  if (edit_index != null) {
    DocumentData[edit_index]=newItem
  } else {
    DocumentData.push(newItem)
      
  }
setdata(DocumentData)

  displayData();
  form.reset();
     if(!form_data||!main || !person ) return;

  person.style.display = "none";
  edit_index = null
  form_data.style.display = "none";
  main.style.filter = "none";
});

}


// display items from local storage
let displayData = () => {
  let DocumentData = getdata()
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

      waitingText = `<p class="waiting">Waiting for <span class="waiting-person">${element.waiting} persons</span></p>`;
    } else {
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
  if(!tbody) return
  tbody.innerHTML = finalData;
};

displayData();

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

// const add_btn = document.getElementById("add-btn");
// const delete_btn = document.getElementById("delete_btn");
// const form_data = document.getElementById("main-form");
// const main = document.querySelector(".main");
// const tbody = document.querySelector("tbody");
// const settings = document.querySelector("settings");
// const settings_div = document.querySelector("settings-div");
// const logout = document.querySelector("#icon-dropdown");
// const logout_div = document.querySelector(".logout-div");
// const form = document.querySelector("form");
// const waitingInput = document.getElementById("waiting_num");
// const person = document.querySelector(".for-pending");
// const statusSelect = document.getElementById("status_id");
// let edit_index = null;
// const title_doc = document.getElementById("title_doc");
// const status_id = document.getElementById("status_id");
// const date_doc=document.querySelector("#date_doc")

// //logout dropdown logic

// logout.addEventListener("click", function () {
//   logout_div.style.display =
//     logout_div.style.display === "block" ? "none" : "block";
// });

// //close when clicking outside
// document.addEventListener("click", function (e) {
//   // If form is open
//   if (logout_div.style.display === "block") {
//     // Check if click is outside the form AND not the add button
//     if (!logout_div.contains(e.target) && !logout.contains(e.target)) {
//       logout_div.style.display = "none";
//     }
//   }
// });


// //Open form using add button
// add_btn.addEventListener("click", function (e) {
//   main.style.filter = "blur(10px)";
//   form_data.style.display = "flex";
//   //datetime
// date_doc.value=new Date().toLocaleString()
// });

// //close the button when clicked anywhere else
// document.addEventListener("click", function (e) {
//   if (form_data.style.display === "flex") {
//     const formBox = document.getElementById("form-div");

//     if (
//       !formBox.contains(e.target) &&
//       !add_btn.contains(e.target)
//     ) {
//       form.reset();
//       form_data.style.display = "none";
//       main.style.filter = "none";
//       person.style.display = "none";
//       edit_index = null;
//     }
//   }
// });



// // cancel-button
// delete_btn.addEventListener("click", function () {
//   form.reset();
//   form_data.style.display = "none";
//   main.style.filter = "none";
//   person.style.display = "none";
//   waitingInput.value = "";
//   edit_index = null;
// });

// //pending persons
// // hide initially
// person.style.display = "none";
// statusSelect.addEventListener("change", function () {
//   if (statusSelect.value === "Pending") {
//     person.style.display = "block";
//   } else {
//     person.style.display = "none";
//   }
// });



// // form submission

// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   let title = e.target.title.value;
//   let status = e.target.status.value;
//   let waitingPersons = waitingInput.value;

//   let DocumentData = JSON.parse(localStorage.getItem("DocumentData")) ?? [];

//   if (edit_index != null) {
//     DocumentData[edit_index] = {
//       title: title,
//       status: status,
//       waiting: status === "Pending" ? waitingPersons : null,
//       date: new Date().toLocaleDateString(),
//       time: new Date().toLocaleTimeString()
//     };
//   } else {
//     DocumentData.push({
//       title: title,
//       status: status,
//       waiting: status === "Pending" ? waitingPersons : null,
//       date: new Date().toLocaleDateString(),
//       time: new Date().toLocaleTimeString(),
//     });
//   }

//   localStorage.setItem("DocumentData", JSON.stringify(DocumentData));

//   displayData();
//   form.reset();
//   person.style.display = "none";
//   edit_index = null
//   form_data.style.display = "none";
//   main.style.filter = "none";
// });

// // display items from local storage
// let displayData = (data = null) => {
//   let DocumentData = data ?? JSON.parse(localStorage.getItem("DocumentData")) ?? [];
//   let finalData = "";
//   let button = "";
//   let btn_class = "";

//   DocumentData.forEach((element, i) => {
//     let waitingText = "";
//     if (element.status === "Needs Signing") {
//       button = "Sign Now";
//       btn_class = "signNow";
//     } else if (element.status === "Pending") {
//       button = "Preview";
//       btn_class = "pending";

//       waitingText = `<p class="waiting">Waiting for <span class="waiting-person">${element.waiting} persons</span></p>`;
//     } else {
//       button = "Download PDF";
//       btn_class = "completed";
//     }

//     finalData += `
//           <tr>
//           <td ><input type="checkbox"></td>
//           <td class="td-items">${element.title}</td>
//           <td class="td-items "><span class=${btn_class}>${element.status}</span>
//         ${waitingText}
          
//           </td>
//           <td class="td-items date-text">${element.date}<br>${element.time}</td>
       

//           <td class="settings-wrapper">
//             <div class="td-wrapper">
//             <button class="btn-status">${button}</button>
//             <img src="./assets/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.svg"
//               alt="settings"
//               class="settings-icon">
//             </div>
//             <div class="settings-div">
//               <button class="edit" data-index="${element.originalIndex ?? i}">Edit
//                <img src="./assets/edit.svg" class="edit-icon" alt="">

//               </button>
//              <button class="delete" data-index="${element.originalIndex ?? i}">Delete
//  <img src="./assets/delete.svg" class="delete-icon"></img>
// </button>
//             </div>
//           </td>
//           </tr>
//           `;
//   });
//   tbody.innerHTML = finalData;
// };

// displayData();

// document.addEventListener("click", function (e) {
//   //close all existing ones
//   if (e.target.classList.contains("settings-icon")) {
//     document.querySelectorAll(".settings-div").forEach((menu) => {
//       menu.style.display = "none";
//     });

//     // Open clicked one
//     let menu = e.target
//       .closest(".settings-wrapper")
//       .querySelector(".settings-div");

//     menu.style.display = "flex";
//   }

//   // If clicked anywhere else → close all
//   else {
//     document.querySelectorAll(".settings-div").forEach((menu) => {
//       menu.style.display = "none";
//     });
//   }
// });


// //edit items

// document.addEventListener("click", function (e) {
//   date_doc.value=new Date().toLocaleString()
//   if (e.target.classList.contains("edit")) {
//     let index = e.target.getAttribute("data-index");
//     let DocumentData = JSON.parse(localStorage.getItem("DocumentData")) ?? [];
//       //datetime
    

//     let item = DocumentData[index];
//     title_doc.value = item.title;
//     status_id.value = item.status;
//     if (item.status === "Pending") {
//       person.style.display = "block";
//       waitingInput.value = item.waiting ?? "";
//     } else {
//       person.style.display = "none";
//       waitingInput.value = "";
//     }
//     edit_index = index;
//     main.style.filter = "blur(10px)";
//     form_data.style.display = "block";
//   }
// });

// //delete items

// document.addEventListener("click", function (e) {
//   if (e.target.classList.contains("delete")) {
//     let index = e.target.getAttribute("data-index");
//     let DocumentData = JSON.parse(localStorage.getItem("DocumentData")) ?? [];
//     // Remove that item
//     DocumentData.splice(index, 1);

//     localStorage.setItem("DocumentData", JSON.stringify(DocumentData));
//     searchBox.value = "";
//     displayData();
//     form.reset();
//   }
// });

// //searchbar functionallity

// let searchBox = document.querySelector("#search-box");

// searchBox.addEventListener("keyup", function () {
//   const searchValue = searchBox.value.toLowerCase();
//   let DocumentData = JSON.parse(localStorage.getItem("DocumentData")) ?? [];

//   let filtered_data = DocumentData
//     .map((item, index) => ({ ...item, originalIndex: index }))
//     .filter((item) => {
//       return (
//         item.title.toLowerCase().includes(searchValue) ||
//         item.status.toLowerCase().includes(searchValue)
//       );
//     });
//   displayData(filtered_data);
// });

