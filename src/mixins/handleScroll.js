export const handleScroll = {
    methods: {
        handleScroll: function (evt, el) {
            if (el.getBoundingClientRect().top <= 300 && !el.classList.contains("scrolled")) {
                el.className += ' scrolled'
            }
            return;
        },
    }
}