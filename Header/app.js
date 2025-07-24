// function handleRefresh() {
//   console.log("Refresh clicked!");
//   alert("Data refreshed (mock)");
// }

// Optional: auto-update date
document.getElementById("today-date").textContent =
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
