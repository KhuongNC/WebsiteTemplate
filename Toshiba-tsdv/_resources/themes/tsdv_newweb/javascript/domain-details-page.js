jQuery.noConflict();

jQuery(document).ready(function () {
    const mainDesktop = jQuery('#main-desktop');
    jQuery('li.overview-list-item > span').click(function () {
        const section = jQuery(this).data('forSection');
        const idToFind = mainDesktop.is(':visible') ? 'desktop' : 'mobile';
        const elementQuery = '#main-' + idToFind + ' h2.section-header[data-section-name="'
            + section + '"]';
        jQuery(elementQuery)[0].scrollIntoView({behavior: "smooth"});
    })
})
