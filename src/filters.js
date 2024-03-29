import Vue from 'vue';

Vue.filter('getDay', function (val) {
  return new Date(Date(val)).getDate();
});

Vue.filter('_moment', function (val, format = "YYYY/MM/DD HH:mm", optionFormat = 'YYYY/MM/DD HH:mm') {
  const str = Vue.moment(val, optionFormat).format(format)
  return str;
});

Vue.filter('_add', function (val, format = "YYYY/MM/DD HH:mm", optionFormat = 'YYYY/MM/DD HH:mm', time, option) {
  const str = Vue.moment(val, optionFormat).add(+time, option).format(format)
  return str;
});

Vue.filter('kitcut', function (text, limit) {
  if (!text && !limit) { return text }
  text = text.trim();
  if (text.length <= limit) return text;
  text = text.slice(0, limit);
  let lastSpace = text.lastIndexOf(" ");
  if (lastSpace > 0) {
    text = text.substr(0, lastSpace);
  }
  return text + "...";
});

Vue.filter('commasNumbers', (val) => {
  if (!val) { return '' };
  let parts = val.toString().split(".");
  let str = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
  return str
});

Vue.filter('_round', val => {
  if (!val) { return val }
  else {
    let num = Math.round(val * 100) / 100;
    return num.toFixed(2)
  }
})