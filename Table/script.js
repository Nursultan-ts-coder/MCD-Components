const data = {
  series: [
    {
      fields: [
        {
          name: "network_name",
          values: [
            "219 Caltex Farlim DT 10.80.219.0",
            "025 GREENLANE DT 10.80.25.0",
            "053 Taipan 10.80.53.0",
            "089 KLUANG 10.80.89.0",
            "096 PERMAS JAYA 10.80.96.0",
            "184 Bukit Tinggi DT 10.80.184.0",
            "186 Damansara Damai DT 10.80.186.0",
            "242 Kota Bahru DT 10.80.242.0",
            "271 Mount Austin DT 10.80.70.0",
            "271 Mount Austin DT 10.80.70.0",
            "286 JALAN SULAMAN DT 2 KK 10.80.102.0",
            "298 Pengkalan Chepa DT 10.80.154.0",
            "350 Caltex Chukai DT 10.149.50.0",
            "388 Bagan Ajam DT 10.149.88.0",
            "466 1 Shamelin Mall DT 10.149.166.0",
          ],
        },
        {
          name: "name",
          values: [
            "219-GF-AP01",
            "025-GF-AP01",
            "053 AP-01",
            "089-GF-AP01",
            "096-1F-AP02",
            "184-GF-AP02",
            "186-GF-AP02",
            "242-GF-AP01",
            "271-GF-AP01",
            "271-GF-AP02",
            "286-GF-AP01",
            "298-GF-AP02",
            "350-1F-AP01",
            "388-1F-AP02",
            "466-GF-AP01",
          ],
        },
        {
          name: "productType",
          values: [
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
            "wireless",
          ],
        },
        {
          name: "serial",
          values: [
            "Q3KA-5K8P-7V7M",
            "Q3KA-PM9E-A6UF",
            "Q2YD-7FYV-ZLVZ",
            "Q3KA-SJXR-CJPG",
            "Q3KA-4TBH-5SF4",
            "Q3KA-4JHT-FRBU",
            "Q3KA-STLB-29V4",
            "Q3KA-LK6Y-L7NV",
            "Q3KA-JQ23-TVMT",
            "Q3KA-BFC5-9L8G",
            "Q3AJ-SD2F-9QV7",
            "Q3KA-83ES-NHZ2",
            "Q3KA-SRR6-HGHK",
            "Q3KA-FLNT-WXU7",
            "Q3KA-XFXD-UF2W",
          ],
        },
        {
          name: "meraki_device_status (lastNotNull)",
          values: [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        },
      ],
    },
  ],
};

const tbody = document.querySelector("#custom-table-body");
const popup = document.querySelector("#filter-popup");
const searchInput = popup.querySelector("#filter-search");
const optionsDiv = popup.querySelector("#filter-options");
const pageInfo = document.querySelector("#page-info");
const columns = [
  { key: "network_name", label: "Network Name" },
  { key: "name", label: "Device Name" },
  { key: "meraki_device_status (lastNotNull)", label: "Status" },
  { key: "productType", label: "Device Type" },
  { key: "serial", label: "Serial Number" },
];

let allData = [];
let filters = {};
let sortCol = null;
let sortAsc = true;
let currentPage = 1;
const rowsPerPage = 5;
let selectedCol = null;
const headerNames = [];

function initData() {
  const series = data.series[0];
  if (series) {
    const [networkName, name, productType, serial, status] = series.fields.map(
      (f) => f.values
    );
    allData = networkName.map((_, i) => [
      networkName[i] ?? "No data",
      name[i] ?? "No data",
      status[i] == 0
        ? "Offline"
        : status[i] == 2
        ? "Alerting"
        : status[i] ?? "Unknown",
      productType[i] ?? "No data",
      serial[i] ?? "No data",
    ]);
  }
}

function getFilteredSortedData() {
  let filteredData = [...allData];
  Object.keys(filters).forEach((colKey) => {
    const colIndex = columns.findIndex((c) => c.key === colKey);
    if (colIndex === -1) return;
    const allowed = filters[colKey];
    filteredData = filteredData.filter((row) =>
      allowed.includes(row[colIndex])
    );
  });

  if (sortCol !== null) {
    filteredData.sort((a, b) => {
      const v1 = a[sortCol];
      const v2 = b[sortCol];
      return sortAsc ? v1.localeCompare(v2) : v2.localeCompare(v1);
    });
  }
  return filteredData;
}

function renderTable(tableData) {
  const root = document.getElementById("table-root");
  root.innerHTML = "";
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const pageData = tableData.slice(start, start + rowsPerPage);

  const title = `<h2 class="font-bold text-xl mb-4">Networks Down</h2>`;
  const navButtons = renderPagination(currentPage, totalPages);

  const tableHead = `<thead><tr>${columns
    .map(
      (
        col
      ) => `<th class="sticky text-left top-0 text-sm font-medium text-gray-600">
        <span class="filter-header sticky top-0 px-6 py-4 text-left text-sm font-medium text-gray-600" data-col="0">
          <span class="header-text">${col.label}</span>
          <img src="https://img.icons8.com/material-outlined/20/filter.png" class="filter-icon" />
        </span>
      </th>`
    )
    .join("")}</tr></thead>`;

  const totalColumns = columns.length;
  const tableBody = `<tbody>${pageData
    .map(
      (row, idx) =>
        `<tr class="${idx % 2 === 0 ? "bg-indigo-50" : "bg-blue-50"}">${columns
          .map((_, i) => {
            let cell = row[i];

            if (i === 2)
              cell = `<span class="inline-block px-3 py-1 text-sm font-medium text-white rounded-full bg-red-500">${row[i]}</span>`;

            if (i === 0)
              return `<td class="px-6 text-sm text-gray-700 rounded-l-lg">${cell}</td>`;
            else if (i === totalColumns - 1)
              return `<td class="px-6 text-sm text-gray-700 rounded-r-lg">${cell}</td>`;

            return `<td class="px-6 text-sm text-gray-700">${cell}</td>`;
          })
          .join("")}</tr>`
    )
    .join("")}</tbody>`;

  root.innerHTML = `<div class="flex justify-between items-center mt-2">${title}${navButtons}</div>
    <div class="overflow-x-auto">
      <table class="min-w-full border-separate">${tableHead}${tableBody}</table>
    </div>`;

  setupHeaderEvents();
  setupPopupEvents();
  bindPaginationEvents();
  updateSortIndicators();
}

function openFilter(colKey, icon, thRect) {
  selectedCol = colKey;
  const colIndex = columns.findIndex((c) => c.key === colKey);
  const values = [...new Set(allData.map((row) => row[colIndex]))];
  const selected = filters[colKey] || [];

  optionsDiv.innerHTML = `
    <label><input type="checkbox" value="__all__" ${
      selected.length === 0 ? "checked" : ""
    }/> All</label>
    ${values
      .map(
        (val) =>
          `<label><input type="checkbox" value="${val}" ${
            selected.length === 0 || selected.includes(val) ? "checked" : ""
          }/> ${val}</label>`
      )
      .join("")}`;

  const allCheckbox = optionsDiv.querySelector('input[value="__all__"]');
  allCheckbox.addEventListener("change", function () {
    const checked = this.checked;
    optionsDiv
      .querySelectorAll("input[type=checkbox]")
      .forEach((cb) => (cb.checked = checked));
  });
  optionsDiv.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    if (cb.value !== "__all__") {
      cb.addEventListener("change", function () {
        if (!this.checked) allCheckbox.checked = false;
      });
    }
  });

  const container = document.querySelector("#table-root");
  const top = thRect.top + window.scrollY + thRect.height + 5;
  const left = thRect.left + window.scrollX;
  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
  popup.style.width = "auto";
  popup.style.display = "block";
  searchInput.value = "";
}

function renderPagination(page, totalPages) {
  let pages =
    totalPages <= 3
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : page === 1
      ? [1, 2, 3]
      : page === totalPages
      ? [totalPages - 2, totalPages - 1, totalPages]
      : [page - 1, page, page + 1];

  return `<nav id="pagination" class="inline-flex items-center space-x-2">
    <button class="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100" data-page="${
      page - 1
    }" ${page === 1 ? 'disabled style="opacity: 0.5"' : ""}>Prev</button>
    ${pages
      .map(
        (p) =>
          `<button class="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 ${
            p === page ? "bg-blue-100 font-semibold" : ""
          }" data-page="${p}">${p}</button>`
      )
      .join("")}
    <button class="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100" data-page="${
      page + 1
    }" ${
    page === totalPages ? 'disabled style="opacity: 0.5"' : ""
  }>Next</button>
  </nav>`;
}

function bindPaginationEvents() {
  const nav = document.getElementById("pagination");
  if (!nav) return;
  const tableData = getFilteredSortedData();
  nav.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.getAttribute("data-page"));
      if (
        !isNaN(page) &&
        page >= 1 &&
        page <= Math.ceil(tableData.length / rowsPerPage)
      ) {
        currentPage = page;
        renderTable(tableData);
      }
    });
  });
}

function updateSortIndicators() {
  document.querySelectorAll("thead th").forEach((th, i) => {
    const filterHeader = th.querySelector(".filter-header");
    let textNode = filterHeader.querySelector(".header-text");
    let text = headerNames[i];
    if (sortCol === i) text += sortAsc ? " ▲" : " ▼";
    textNode.textContent = text;
  });
}

function setupHeaderEvents() {
  document.querySelectorAll("thead th").forEach((th, i) => {
    const filterHeader = th.querySelector(".filter-header");
    const filterIcon = filterHeader.querySelector(".filter-icon");
    const headerText = filterHeader.querySelector(".header-text");

    headerNames[i] = headerText.textContent
      .trim()
      .replace(/[\u25B2\u25BC]/g, "");

    headerText.addEventListener("click", () => {
      console.log("filterHeader:", filterHeader);
      console.log("headerText:", headerText);
      console.log("filterIcon:", filterIcon);
      console.log("sortCol:", sortCol);
      console.log("th:", th);

      if (sortCol === i) sortAsc = !sortAsc;
      else {
        sortCol = i;
        sortAsc = true;
      }
      currentPage = 1;
      renderTable(getFilteredSortedData());
    });

    filterIcon.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      const thRect = th.getBoundingClientRect();
      openFilter(columns[i].key, filterIcon, thRect);
    });
  });
}

function setupPopupEvents() {
  popup.addEventListener("mousedown", (e) => e.stopPropagation());
  popup.querySelector("#filter-apply").onclick = (e) => {
    e.stopPropagation();
    const checks = [...optionsDiv.querySelectorAll("input[type=checkbox]")];
    const selected = checks
      .filter((c) => c.checked && c.value !== "__all__")
      .map((c) => c.value);
    filters[selectedCol] = selected.length ? selected : undefined;
    if (!filters[selectedCol]) delete filters[selectedCol];
    popup.style.display = "none";
    currentPage = 1;
    renderTable(getFilteredSortedData());
  };
  popup.querySelector("#filter-clear").onclick = (e) => {
    e.stopPropagation();
    delete filters[selectedCol];
    popup.style.display = "none";
    currentPage = 1;
    renderTable(getFilteredSortedData());
  };
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    optionsDiv.querySelectorAll("label").forEach((label) => {
      const text = label.textContent.toLowerCase();
      label.style.display = text.includes(keyword) ? "" : "none";
    });
  });
  document.addEventListener("mousedown", (e) => {
    if (
      !popup.contains(e.target) &&
      !e.target.classList.contains("filter-icon")
    ) {
      popup.style.display = "none";
    }
  });
}

function init() {
  initData();
  renderTable(getFilteredSortedData());
}

init();
