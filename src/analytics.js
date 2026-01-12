export const pageview = (url) => {
    if (!window.gtag) return;

    window.gtag("config", "G-93S0WE2EEM", {
        page_path: url,
    });
};
