export function exportCSV(str) {
  var blob = new Blob([str], { type: "text/csv;charset=utf-8;" });

  var link = document.createElement("a");
  var url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "csvfilename.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}