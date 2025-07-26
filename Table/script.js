const data = {
  series: [
    {
      fields: [
        {
          name: "lat",
          values: [],
        },
        {
          name: "lan",
          values: [],
        },
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
          name: "deviceId",
          values: [],
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
const rowsPerPage = 10;
let selectedCol = null;
const headerNames = [];

function initData() {
  const series = data.series[0];
  if (series) {
    const restaurantNames = series.fields[2].values;
    const deviceNames = series.fields[4].values;
    const deviceTypes = series.fields[5].values;
    const serialNumbers = series.fields[6].values;
    const statuses = series.fields[7].values;

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

  root.innerHTML = `
      <table class="min-w-full border-separate">${tableHead}${tableBody}</table>
      <div class="flex justify-end items-center mt-2">${navButtons}</div>
`;

  setupHeaderEvents();
  bindPaginationEvents();
  updateSortIndicators();
  setupExport();
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

function renderFilters() {
  const container = document.getElementById("mcd-filters-container");

  const statusButtons = `
    <div class="flex items-center gap-2 mr-4">
      <button class="status-btn bg-gray-100 font-semibold py-2 px-4 rounded" data-status="">All</button>
      <button class="status-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" data-status="Alerting">Alerting</button>
      <button class="status-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" data-status="Offline">Offline</button>
      <button class="status-btn bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" data-status="Online">Online</button>
    </div>
  `;

  const inputFilters = columns
    .filter((col) => col.key !== "meraki_device_status (lastNotNull)")
    .map(
      (col) =>
        `<input
        type="text"
        placeholder="${col.label} ..."
        id="mcd-filter-input"
        data-col="${col.key}"
        class="px-2 py-1 mr-2 border rounded"
        style="min-width: 150px;"
      />`
    )
    .join("");

  container.innerHTML = `
    <div class="flex flex-wrap items-center gap-2">${statusButtons}${inputFilters}</div>
  `;

  setupTextFilters();
  setupStatusFilterButtons();
}

function setupTextFilters() {
  const inputList = document.querySelectorAll("#mcd-filter-input");
  inputList.forEach((input) => {
    const colKey = input.getAttribute("data-col");

    input.addEventListener(
      "input",
      debounce((e) => {
        const val = e.target.value.toLowerCase();
        debugger;
        const colIndex = columns.findIndex((c) => c.key === colKey);

        if (val) {
          filters[colKey] = allData
            .map((row) => row[colIndex])
            .filter((v) => v.toLowerCase().includes(val));
        } else {
          delete filters[colKey];
        }

        currentPage = 1;
        renderTable(getFilteredSortedData());
      }, 300),
      { capture: true }
    );
  });
}

function setupStatusFilterButtons() {
  const buttons = document.querySelectorAll(".status-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) =>
        b.classList.remove("bg-blue-100", "font-semibold")
      );
      btn.classList.add("bg-blue-100", "font-semibold");

      const selected = btn.getAttribute("data-status");
      if (!selected) {
        delete filters["meraki_device_status (lastNotNull)"];
      } else {
        filters["meraki_device_status (lastNotNull)"] = [selected];
      }

      currentPage = 1;
      renderTable(getFilteredSortedData());
    });
  });
}

function setupToggleFilters() {
  const btn = document.getElementById("mcd-toggle-filters");
  const filtersDiv = document.getElementById("mcd-filters-container");
  btn.addEventListener("click", () => {
    if (filtersDiv.style.display === "none") {
      filtersDiv.style.display = "flex";
      btn.textContent = "Hide Filters";
    } else {
      filtersDiv.style.display = "none";
      btn.textContent = "Show Filters";
    }
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
    const headerText = filterHeader.querySelector(".header-text");

    headerNames[i] = headerText.textContent
      .trim()
      .replace(/[\u25B2\u25BC]/g, "");

    headerText.addEventListener("click", () => {
      if (sortCol === i) sortAsc = !sortAsc;
      else {
        sortCol = i;
        sortAsc = true;
      }
      currentPage = 1;
      renderTable(getFilteredSortedData());
    });
  });
}

// Export
function setupExport() {
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
}

function init() {
  initData();
  renderFilters();
  setupToggleFilters();
  renderTable(getFilteredSortedData());
}

init();

function debounce(fn, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}
