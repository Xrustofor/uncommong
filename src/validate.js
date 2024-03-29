import { extend, localize, configure } from "vee-validate";
import { min, max, required, email, confirmed, numeric } from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";

// Install rules
extend("required", {
    ...required,
    message: ' '
});

extend("datapicker", {
    ...required,
    message: 'has error'
});

extend("email", {
    ...email,
    message: "Invalid email"
});
extend("numeric", {
    ...numeric,
    message: "Only numbers"
});

extend("login_email", {
    ...email,
    message: "The Email you’ve entered is incorrect"
});

extend('verify_password', {
    message: "too weak",
    validate: value => {
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\"#$%&\'\(\)*+,-./:;<=>?@^_`{|}~\[])(?=.{8,50})");

        return strongRegex.test(value);
    }
});


extend('phone_number', {
    message: "invalid",
    validate: value => {
        var strongRegex = new RegExp(/^1?\s?(\([0-9]{3}\)[- ]?|[0-9]{3}[- ]?)[0-9]{3}[- ]?[0-9]{4}$/);

        return strongRegex.test(value);
    }
});
extend('limitNumber', {
    validate: (value) => {
        return value * 1 < 21474836;
    },
    message: 'Please enter value less then 21 474 836'
})
extend('website', {
    validate: (value) => {
        const regex = RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/);

        return regex.test(value);
    },
    message: 'Website URL must be a link to your website'
})
extend('customURL', {
    validate: (value) => {
        const regex = RegExp(/^[a-zA-Z0-9 -]+$/);

        return regex.test(value);
    },
    message: 'Custom URL must be valid. Only dashes, english letters and numbers. Example "my-name"'
})
extend("min", (value) => {
    if (value.replace(/\s+/g, '').length >= 3) {
        return true;
    }
    return "min 3 char"
});
extend("max", {
    ...max,
    message: "max 200 char"
});
extend("confirmed", {
    ...confirmed,
    message: "doesn't match"
});

extend('positive', value => {
    if (value >= 0) {
        return true;
    }
    return 'This field must be a positive number';
});

extend('true', (value) => {
    if (value === true) {
        return true;
    }

    return 'This value must be a positive number';
});

configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid'
    }
})

// Install messages
localize({
    en
});
