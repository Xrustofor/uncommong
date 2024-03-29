export const firstLetterBig = (str) => {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}


const data = {
  key: '',
  name: '',
  mainId: null,
  childId: null,
}
export const changeCheckboxList = (data, params = data) => {
  const items = [];
  data.map(el => {
    if (el.key === params.name) {
      items.push({
        ...el,
        menu: el.menu.map((m, index) => {
          if (index === params.mainId) {
            return {
              title: m.title,
              items: m.items.map((mi, i) => {
                if (i === params.childId) {
                  return { ...mi, checked: true }
                } else {
                  return { ...mi, checked: false }
                }
              })
            }
          } else {
            return {
              title: m.title,
              items: m.items.map(mi => {
                return { ...mi, checked: false }
              })
            }
          }
        })
      })
    } else {
      if (el.menu) {
        items.push({
          ...el,
          menu: el.menu.map(m => {
            return {
              title: m.title,
              items: m.items.map(mi => {
                return { ...mi, checked: false }
              })
            }
          })
        })
      } else {
        items.push(el)
      }
    }
  });

  return items;
}

export const formDateParse = (str) => {
  return str.replace(/-/g, "/");
}

export const commissionCalculation = (amount = 0, type = 'credit', percent = 'default') => {
  const price = +amount;
  const APP_FEE = 0.015;
  const HEIGHTENED_APP_FEE = 0.2;

  const STRIPE_STATIC_FEE = 0.3;
  const STRIPE_PERCENT_FEE = 0.029;
  const STRIPE_PERCENT_BANK_ACOOUNT = 0.008;

  let UG_FEE = percent === 'heightened' ? +(price * HEIGHTENED_APP_FEE) : +(price * APP_FEE);
  UG_FEE = +Math.round(UG_FEE * 100) / 100


  switch (type) {
    case 'credit': {
      const result = +(price + UG_FEE + STRIPE_STATIC_FEE) / (1 - STRIPE_PERCENT_FEE);
      return +(result - +price).toFixed(2);
    }
    case 'bank': {
      let amountResult = +price + +UG_FEE;
      let result = +(amountResult * STRIPE_PERCENT_BANK_ACOOUNT).toFixed(2);
      let finalCommission = ((+amountResult + result) * STRIPE_PERCENT_BANK_ACOOUNT).toFixed(2);

      result = result > 5 ? (5 + UG_FEE) : (+finalCommission + UG_FEE)
      return result;
    };
    default: return +price;
  }

}


export function separateInitials(name, lastName) {
  let letterName = '', letterLastName = '';
  letterName = name.length ? name[0].toUpperCase() : '';
  letterLastName = lastName.length ? lastName[0].toUpperCase() : '';

  return letterName + letterLastName;
}

export function dateTransform(date) {
  return date.split(' ')[0].replaceAll('-', '/');
}


export const substituteId = (str, params) => {
  let result = str;

  for (let key in params) {
    result = result.replace(`:${key}`, +params[key]);
  }

  return result;
}

export const paramsUrlReplace = (path, params) => {

  if (typeof path !== "string") return "";
  if (typeof params !== "object") return "";

  let src = path;

  for (let key in params) {
    src = src.replace(`:${key}`, params[key] ? params[key] : '');
  }

  return src;

};
