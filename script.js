const addBtn = document.querySelector(".content-add-btn");
const pageAdd = document.querySelector(".page-add");
const formAdd = document.querySelector(".page-add #myform");
const contentMain = document.querySelector(".content-main");
const search = document.getElementById("search");
const btnExport = document.getElementById("btn-export");
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let monthUi = document.getElementById("month");
let filtersBtn = document.querySelectorAll(".content-filter-filters .filter");
let transactionTotalUi = document.querySelector(
  ".content-card-footer-item-title h2",
);
let totalExpense = document.querySelector(".content-card-header h1");
let totalNum = 0;
let countService = document.querySelector(".content-filter-header p");
let inputFormName = document.querySelector(".page-add #myform #name");

let index = 0;

inputFormName.oninput = () => {
  inputFormName.value = inputFormName.value.replace(/\b\w/g, (char) =>
    char.toUpperCase(),
  );
};

addBtn.onclick = (e) => {
  e.stopPropagation();
  pageAdd.classList.remove("hide");
};
document.onclick = (e) => {
  if (!formAdd.contains(e.target)) {
    pageAdd.classList.add("hide");
  }
};

function monthInitiation() {
  let monthName = new Date();
  monthUi.innerText = month[monthName.getMonth()];
}
function exportToExcel() {
  let data = JSON.parse(localStorage.getItem("datas"));
  if (data.length === 0) {
    alert("There are no data to export");
    return;
  }
  let dataFormatted = data.map((item, i) => ({
    No: (i += 1),
    Date: item.date || "-",
    "Transaction Name": item.name || "-",
    Category: item.category || "-",
    "Nominal (Rp)": Number(item.nominal) || 0,
  }));
  const worksheet = XLSX.utils.json_to_sheet(dataFormatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");
  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, `Transaction_Data_${monthUi.innerText}.xlsx`);
}
if (btnExport) {
  btnExport.addEventListener("click", exportToExcel);
}
function format(angka) {
  return new Intl.NumberFormat("id-ID").format(angka);
}
function count(num) {
  let totalNum = num == undefined ? (num = 0) : (num = num);
  let transactionTotal = JSON.parse(localStorage.getItem("datas"))?.length || 0;
  countService.innerText = `${totalNum} dari ${transactionTotal}`;
  transactionTotalUi.innerText = `${transactionTotal} Transaction`;
}
function countAll() {
  let data = JSON.parse(localStorage.getItem("datas")) || [];
  const total = data.reduce((acc, item) => acc + Number(item.nominal || 0), 0);
  totalExpense.innerText = `Rp. ${format(total)}`;
}
function del() {
  contentMain.addEventListener("click", (e) => {
    if (e.target.classList.contains("icon")) {
      let itemIndex = e.target.dataset.index;
      let data = JSON.parse(localStorage.getItem("datas")) || [];
      let dataBaru = data.filter((filter) => filter.id != itemIndex);
      save(dataBaru);
      filtersBtn.forEach((filter) => filter.classList.remove("filter-active"));
      filtersBtn[0].classList.add("filter-active");
      render();
    }
  });
}

function save(newData) {
  localStorage.setItem("datas", JSON.stringify(newData)) || [];
}
function render() {
  countAll();
  let data = JSON.parse(localStorage.getItem("datas")) || [];
  contentMain.innerHTML = "";
  totalNum = 0;
  index = 0;
  data.forEach((el, i) => {
    let newEl = document.createElement("div");
    let badge = null;
    let icon = null;
    index += 1;
    if (el.category == "Food") {
      badge = "icon-makan";
      icon = "flatware";
    } else if (el.category == "Transportation") {
      badge = "icon-trans";
      icon = "transportation";
    } else if (el.category == "Bill") {
      badge = "icon-bill";
      icon = "payments";
    } else if (el.category == "Shopping") {
      badge = "icon-shop";
      icon = "shopping_bag";
    } else if (el.category == "Other") {
      badge = "icon-other";
      icon = "list_alt";
    }
    newEl.classList.add("content-main-card");
    newEl.innerHTML = `
      <h2 class="index">${index}.</h2>
      <span class="material-symbols-outlined ${badge}"> ${icon} </span>
      <div class="content-main-card-title">
        <h2>${el.name}</h2>
        <div class="content-main-card-title-tags">
          <h2>${el.date} |</h2>
          <p>${el.category}</p>
        </div>
      </div>
      <div class="content-main-card-price">
        <h2>Rp. ${format(el.nominal)}</h2>
        <span class="material-symbols-outlined icon" data-index="${el.id}"> delete </span>
      </div>
    `;
    contentMain.appendChild(newEl);
  });
  count(data.length);
  del();
  monthInitiation();
}
render();

formAdd.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(formAdd);
  let newData = Object.fromEntries(formData.entries());
  let data = JSON.parse(localStorage.getItem("datas")) || [];
  newData.id = Date.now();
  console.log(formData, newData);
  data.push(newData);
  save(data);
  render();
  formAdd.reset();
  pageAdd.classList.add("hide");
  filtersBtn.forEach((filter) => filter.classList.remove("filter-active"));
  filtersBtn[0].classList.add("filter-active");
});

function renderFilter(dataArray) {
  contentMain.innerHTML = "";
  totalNum = 0;
  index = 0;
  dataArray.forEach((el) => {
    let newEl = document.createElement("div");
    let badge = null;
    let icon = null;
    index += 1;
    if (el.category == "Food") {
      badge = "icon-makan";
      icon = "flatware";
    } else if (el.category == "Transportation") {
      badge = "icon-trans";
      icon = "transportation";
    } else if (el.category == "Bill") {
      badge = "icon-bill";
      icon = "payments";
    } else if (el.category == "Shopping") {
      badge = "icon-shop";
      icon = "shopping_bag";
    } else if (el.category == "Other") {
      badge = "icon-other";
      icon = "list_alt";
    }
    newEl.classList.add("content-main-card");
    newEl.innerHTML = `
      <h2 class="index">${index}.</h2>
      <span class="material-symbols-outlined ${badge}"> ${icon} </span>
      <div class="content-main-card-title">
        <h2>${el.name}</h2>
        <div class="content-main-card-title-tags">
          <h2>${el.date} |</h2>
          <p>${el.category}</p>
        </div>
      </div>
      <div class="content-main-card-price">
        <h2>Rp. ${format(el.nominal)}</h2>
        <span class="material-symbols-outlined icon" data-index="${el.id}"> delete </span>
      </div>
    `;
    contentMain.appendChild(newEl);
  });
  count(dataArray.length);
  del();
  monthInitiation();
}
filtersBtn.forEach((filter) => {
  filter.onclick = () => {
    search.value = "";
    filtersBtn.forEach((filter) => filter.classList.remove("filter-active"));
    filter.classList.add("filter-active");
    if (filter.textContent === "All") {
      render();
    } else {
      let data = JSON.parse(localStorage.getItem("datas")) || [];
      let dataCategory = data.filter(
        (item) => item.category === filter.textContent,
      );
      renderFilter(dataCategory);
    }
  };
});
search.oninput = () => {
  search.value = search.value.replace(/\b\w/g, (char) => char.toUpperCase());
  if (search.value.trim()) {
    filtersBtn.forEach((filter) => filter.classList.remove("filter-active"));
    filtersBtn[0].classList.add("filter-active");
  }
  let data = JSON.parse(localStorage.getItem("datas")) || [];
  let dataCategory = data.filter((item) =>
    item.name
      ?.toLocaleLowerCase()
      .includes(search.value.trim().toLocaleLowerCase()),
  );
  renderFilter(dataCategory);
};
