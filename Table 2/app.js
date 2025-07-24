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

// DO NOT redeclare document! It is provided by your environment.

const tbody = document.querySelector("#custom-table-body");
const popup = document.querySelector("#filter-popup");
const searchInput = popup.querySelector("#filter-search");
const optionsDiv = popup.querySelector("#filter-options");
const pageInfo = document.querySelector("#page-info");

let allData = [];
let filters = {};
let sortCol = null;
let sortAsc = true;
let currentPage = 1;
const rowsPerPage = 10;
let selectedCol = null;

// Get data from Grafana
const series = data.series[0];
console.log("series:", series);
if (series) {
  const restaurantNames = series.fields[0].values;
  const deviceNames = series.fields[1].values;
  const deviceTypes = series.fields[2].values;
  const serialNumbers = series.fields[3].values;
  const statuses = series.fields[4].values;

  allData = restaurantNames.map((_, i) => [
    restaurantNames[i] ?? "No data",
    deviceNames[i] ?? "No data",
    statuses[i] == 0
      ? "Offline"
      : statuses[i] == 2
      ? "Alerting"
      : statuses[i] ?? "Unknown",
    deviceTypes[i] ?? "No data",
    serialNumbers[i] ?? "No data",
  ]);
}

function renderTable(data) {
  tbody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const pageData = data.slice(start, start + rowsPerPage);

    // const totalPages = Math.ceil(tableData.length / rowsPerPage);
    // const start = (currentPage - 1) * rowsPerPage;
    // const pageData = tableData.slice(start, start + rowsPerPage);

    // const title = `<h2 class="font-bold text-xl mb-4">Sticky Pagination Table</h2>`;
    // const navButtons = renderPagination(currentPage, totalPages);
  

  pageData.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell, i) => {
      const td = document.createElement("td");
      if (i === 2) {
        const span = document.createElement("span");
        span.textContent = cell;
        span.className =
          cell === "Offline"
            ? "status-offline"
            : cell === "Alerting"
            ? "status-alerting"
            : "";
        td.appendChild(span);
      } else {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  pageInfo.textContent = `Page ${currentPage} of ${Math.max(
    1,
    Math.ceil(data.length / rowsPerPage)
  )}`;
  updateSortIndicators();
  // bindPaginationEvents();
}

function getFilteredSortedData() {
  let data = [...allData];
  Object.keys(filters).forEach((col) => {
    const allowed = filters[col];
    data = data.filter((row) => allowed.includes(row[col]));
  });

  if (sortCol !== null) {
    data.sort((a, b) => {
      const v1 = a[sortCol];
      const v2 = b[sortCol];
      return sortAsc
        ? v1.toString().localeCompare(v2.toString())
        : v2.toString().localeCompare(v1.toString());
    });
  }

  return data;
}

// Pagination
// document.querySelector("#prev-page").onclick = () => {
//   if (currentPage > 1) {
//     currentPage--;
//     renderTable(getFilteredSortedData());
//   }
// };
// document.querySelector("#next-page").onclick = () => {
//   const totalPages = Math.ceil(getFilteredSortedData().length / rowsPerPage);
//   if (currentPage < totalPages) {
//     currentPage++;
//     renderTable(getFilteredSortedData());
//   }
// };

// Export
document.querySelector("#export-btn").onclick = () => {
  const header = [
    "Restaurant Name",
    "Device Name",
    "Status",
    "Device Type",
    "Serial Number",
  ];
  const rows = [header, ...getFilteredSortedData()];
  const csv = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "table_export.csv";
  a.click();
};

// Filtering
function openFilter(colIndex, icon, thRect) {
  selectedCol = colIndex;
  const values = [...new Set(allData.map((row) => row[colIndex]))];
  const selected = filters[colIndex] || [];

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
      .join("")}
  `;

  // Multi-select 'All' logic
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
        if (!this.checked) {
          allCheckbox.checked = false;
        }
      });
    }
  });

  // Position popup relative to the table container, not the viewport
  const container = document.querySelector(".custom-table-container");
  const iconRect = icon.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  popup.style.top = `${
    iconRect.bottom - containerRect.top + container.scrollTop + 5
  }px`;

  const top = thRect.top + window.scrollY + thRect.height + 5;
  const left = thRect.left + window.scrollX;

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;

  popup.style.width = "auto";

  popup.style.display = "block";
  searchInput.value = "";
}

// Prevent popup from closing when clicking inside it
popup.addEventListener("mousedown", function (e) {
  e.stopPropagation();
});

// Apply filter
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

// Clear filter
popup.querySelector("#filter-clear").onclick = (e) => {
  e.stopPropagation();
  delete filters[selectedCol];
  popup.style.display = "none";
  currentPage = 1;
  renderTable(getFilteredSortedData());
};

// Filter search
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  optionsDiv.querySelectorAll("label").forEach((label) => {
    const text = label.textContent.toLowerCase();
    label.style.display = text.includes(keyword) ? "" : "none";
  });
});

// Only close popup if click is outside both popup and filter icons
document.addEventListener("mousedown", (e) => {
  if (
    !popup.contains(e.target) &&
    !e.target.classList.contains("filter-icon")
  ) {
    popup.style.display = "none";
  }
});

// Sorting and filter icon handling
const headerNames = [];
document.querySelectorAll("thead th").forEach((th, i) => {
  const filterHeader = th.querySelector(".filter-header");
  const filterIcon = filterHeader.querySelector(".filter-icon");
  const headerText = filterHeader.querySelector(".header-text");
  headerNames[i] = headerText.textContent.trim().replace(/[\u25B2\u25BC]/g, "");

  // Sort on text click
  headerText.addEventListener("click", (e) => {
    if (sortCol === i) {
      sortAsc = !sortAsc;
    } else {
      sortCol = i;
      sortAsc = true;
    }
    currentPage = 1;
    renderTable(getFilteredSortedData());
  });

  // Filter popup on icon click
  filterIcon.addEventListener("mousedown", (e) => {
    e.stopPropagation();

    const thRect = th.getBoundingClientRect();
    openFilter(i, filterIcon, thRect);
  });
});

// Sort indicator
function updateSortIndicators() {
  document.querySelectorAll("thead th").forEach((th, i) => {
    const filterHeader = th.querySelector(".filter-header");
    let textNode = filterHeader.querySelector(".header-text");
    let text = headerNames[i];
    if (sortCol === i) {
      text += sortAsc ? " ▲" : " ▼";
    }
    textNode.textContent = text;
  });
}

function renderPagination(page, totalPages) {
  let pages = [];
  if (totalPages <= 3) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (page === 1) {
    pages = [1, 2, 3];
  } else if (page === totalPages) {
    pages = [totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [page - 1, page, page + 1];
  }

  return `
    <nav id="pagination" class="inline-flex items-center space-x-2">
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

  nav.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.getAttribute("data-page"));
      if (
        !isNaN(page) &&
        page >= 1 &&
        page <= Math.ceil(tableData.length / rowsPerPage)
      ) {
        currentPage = page;
        renderTable();
      }
    });
  });
}

// Initial render
renderTable(getFilteredSortedData());
