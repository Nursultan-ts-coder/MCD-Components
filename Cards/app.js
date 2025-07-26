const mockData = [
  { title: "Uplink", online: "All", total: 10 },
  { title: "WAN Appliances", online: 4, total: 10 },
  { title: "Switches", online: "All", total: 10 },
  { title: "Access points", online: 7, total: 10 },
  { title: "VPN", online: 1, total: 1 },
];

const cards = htmlNode.querySelectorAll(".card");

cards.forEach((card, index) => {
  const { online, total } = mockData[index];

  const subtitle = card.querySelector(".card-subtitle");
  const progressBar = card.querySelector(".progress-bar-item");
  const statusText = card.querySelector(".status-text");

  if (online === "All") {
    subtitle.innerHTML = `All <p class="cart-child">/ ${total} total</p>`;
    progressBar.style.width = "100%";
    statusText.textContent = "Online";
    progressBar.style.backgroundColor = "#1f7c00";
  } else {
    const percentage = Math.round((online / total) * 100);
    subtitle.innerHTML = `${online} <p class="cart-child">/ ${total} total</p>`;
    progressBar.style.width = `${percentage}%`;
    statusText.textContent = "Online";
  }
});
