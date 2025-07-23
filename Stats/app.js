function updateStat(statNode, data, serialNumber, convertCallback) {
  console.log(data);
  statNode.textContent = "-";

  if (data.series.length > 0) {
    const valField = data?.series[serialNumber]?.fields.find(
      (f) => f.type === "number"
    );
    const val = valField?.values.get(0);
    if (val != null) {
      statNode.textContent = convertCallback
        ? convertCallback(val)
        : val.toLocaleString(); // Formats as "7,265"
    }
  }
}

function toPercent(value) {
  const percent = parseFloat(value);
  if (!isNaN(percent)) {
    return percent.toFixed(1).replace(".", ".") + "%";
  }
  return "";
}

const totalSitesNode = htmlNode.querySelector("#total-sites");
const onlineNode = htmlNode.querySelector("#online");
const offlineNode = htmlNode.querySelector("#offline");
const uptimeNode = htmlNode.querySelector("#uptime");
const alertsNode = htmlNode.querySelector("#alerts");
const switchesNode = htmlNode.querySelector("#switches");
const accessPointsNode = htmlNode.querySelector("#access-points");
const appliencesNode = htmlNode.querySelector("#appliences");

updateStat(totalSitesNode, data, 0);
updateStat(onlineNode, data, 1);
updateStat(offlineNode, data, 2);
updateStat(uptimeNode, data, 3, toPercent);
