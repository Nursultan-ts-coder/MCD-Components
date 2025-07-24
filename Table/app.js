// script.js

const tableData = Array.from({ length: 30 }).map((_, i) => ({
  siteName: `Downtown Chicago #${247 + i}`,
  address: "123 Michigan Ave, Chicago, IL",
  region: "North America",
  status: "Offline",
  duration: "Jun 24, 2025",
  lastSeen: "2025-07-03 14:45 UTC",
  contact: "operation@company.com",
}));

const columns = [
  { key: "siteName", label: "Site Name" },
  { key: "address", label: "Address" },
  { key: "region", label: "Region" },
  { key: "status", label: "Status" },
  { key: "duration", label: "Duration" },
  { key: "lastSeen", label: "Last Seen" },
  { key: "contact", label: "Contact" },
];

const rowsPerPage = 3;
let currentPage = 1;

function renderTable() {
  const root = document.getElementById("table-root");
  root.innerHTML = "";

  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const pageData = tableData.slice(start, start + rowsPerPage);

  const title = `<h2 class="font-bold text-xl mb-4">Sticky Pagination Table</h2>`;
  const navButtons = renderPagination(currentPage, totalPages);

  const tableHead = `
    <thead>
      <tr>
        ${columns
          .map(
            (col) =>
              `<th class="sticky text-left top-0 px-6 py-4 text-sm font-medium text-gray-600">${col.label}</th>`
          )
          .join("")}
      </tr>
    </thead>`;

  const tableBody = `
    <tbody>
      ${pageData
        .map((row, idx) => {
          const bgColor = idx % 2 === 0 ? "bg-indigo-50" : "bg-blue-50";
          return `<tr class="${bgColor}">${columns
            .map((col, i) => {
              let cell = row[col.key];
              if (col.key === "status") {
                cell = `<span class="inline-block px-3 py-1 text-sm font-medium text-white rounded-full bg-red-500">${cell}</span>`;
              }
              if (col.key === "duration") {
                cell = `<span class="inline-block px-3 py-1 text-sm font-medium text-white rounded-full bg-yellow-500 w-max">${cell}</span>`;
              }
              if (col.key === "contact") {
                cell = `<a href="mailto:${cell}" class="text-blue-600 hover:underline">${cell}</a>`;
              }
              const radius = `${i === 0 ? "rounded-l-lg" : ""} ${
                i === columns.length - 1 ? "rounded-r-lg" : ""
              }`;
              return `<td class="px-6 text-sm text-gray-700 ${radius}">${cell}</td>`;
            })
            .join("")}</tr>`;
        })
        .join("")}
    </tbody>`;

  const tableHtml = `
    <div class="flex justify-between items-center mb-4">${title}${navButtons}</div>
    <div class="overflow-x-auto">
      <table class="min-w-full border-separate">${tableHead}${tableBody}</table>
    </div>`;

  root.innerHTML = tableHtml;

  bindPaginationEvents(); // привязываем события после рендера
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

// initial render
renderTable();
