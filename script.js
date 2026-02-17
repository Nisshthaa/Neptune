let add_btn = document.getElementById("add-btn");
let form_data = document.getElementById("form-div");
let main=document.querySelector(".main")

add_btn.addEventListener("click", function () {
  if (form_data.style.display === "none") {
    main.style.filter="blur(10px)"
    form_data.style.display = "block";
  } else {
    form_data.style.display = "none";
  }
});






let title_doc = document.getElementById("title_doc");
let status_label = document.getElementById("status_label");
let add_btn_id = document.getElementById("add_btn_id");
let tbody = document.getElementById("tbody");

add_btn_id.addEventListener("click", function (e) {
  e.preventDefault();
  let row_id = document.createElement("tr");
  tbody.appendChild(row_id);
  // Check status
  if (status_label.value === "Needs Signing") {
    //checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let check_id = document.createElement("td");

    check_id.appendChild(checkbox);
    row_id.appendChild(check_id);

    //td title creation
    let title_id = document.createElement("td");
    title_id.innerText = title_doc.value;
    title_id.classList.add("table-td");
    row_id.appendChild(title_id);

    //status button creation
    let status_td = document.createElement("td");

    let status_btn = document.createElement("button");
    status_btn.classList.add("status_btn");
    status_btn.innerText = status_label.value; 

    status_td.appendChild(status_btn);
    row_id.appendChild(status_td);

    //date creation
    let date_id = document.createElement("td");
    date_id.innerText = new Date().toLocaleDateString();
    date_id.classList.add("table-td");
    row_id.appendChild(date_id);

    // //time creation
    // let span_id=document.createElement("br")
    // date_id.appendChild(span_id)
    // let time_id=document.createElement("p")
    // time_id.innerText=new Date().toLocaleTimeString()
    // time_id.appendChild(time_id)

    //button creation
    let btn_id = document.createElement("td");
    btn_id.innerText = "Sign Now";
    btn_id.classList.add("table-td");
    row_id.appendChild(btn_id);
  } else if (status_label.value === "Pending") {
    //checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let check_id = document.createElement("td");

    check_id.appendChild(checkbox);
    row_id.appendChild(check_id);

    //td title creation
    let title_id = document.createElement("td");
    title_id.innerText = title_doc.value;
    title_id.classList.add("table-td");
    row_id.appendChild(title_id);

    //status button creation
    let status_id = document.createElement("td");
    status_id.textContent = status_label.value;
    status_id.classList.add("table-td");
    row_id.appendChild(status_id);

    //date creation
    let date_id = document.createElement("td");
    date_id.innerText = new Date().toLocaleDateString();
    date_id.classList.add("table-td");
    row_id.appendChild(date_id);

    // //time creation
    // let span_id=document.createElement("br")
    // date_id.appendChild(span_id)
    // let time_id=document.createElement("p")
    // time_id.innerText=new Date().toLocaleTimeString()
    // time_id.appendChild(time_id)

    //button creation
    let btn_id = document.createElement("td");
    btn_id.innerText = "Sign Now";
    btn_id.classList.add("table-td");
    row_id.appendChild(btn_id);
  } else {
    //checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let check_id = document.createElement("td");

    check_id.appendChild(checkbox);
    row_id.appendChild(check_id);

    //td title creation
    let title_id = document.createElement("td");
    title_id.innerText = title_doc.value;
    title_id.classList.add("table-td");

    row_id.appendChild(title_id);

    //status button creation
    let status_td = document.createElement("td");

    let status_btn = document.createElement("button");
    status_btn.classList.add("status_btn");
    status_btn.innerText = status_label.value; // "Sign Now", "Pending", etc.

    status_td.appendChild(status_btn);
    row_id.appendChild(status_td);

    //date creation
    let date_id = document.createElement("td");
    date_id.innerText = new Date().toLocaleDateString();
    date_id.classList.add("table-td");
    row_id.appendChild(date_id);

    // //time creation
    // let span_id=document.createElement("br")
    // date_id.appendChild(span_id)
    // let time_id=document.createElement("p")
    // time_id.innerText=new Date().toLocaleTimeString()
    // time_id.appendChild(time_id)

    //button creation
    let btn_id = document.createElement("td");
    btn_id.innerText = "Sign Now";
    btn_id.classList.add("table-td");
    row_id.appendChild(btn_id);
  }
});
