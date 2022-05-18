'use strict';
jQuery.noConflict();

jQuery(document).ready(function () {
    const title = jQuery('#domain-page-title-desktop').text()

    // set active sidebar section
    jQuery("div.row.nav-cell[data-title='" + title + "']").addClass('active')
        .parent().removeAttr('href');

    // Set active tab
    jQuery("#tab-nav a[data-title='Business Domain']").addClass('active');
    jQuery("#domain-dropdown-selector a[data-title='Business Domain'] p")
        .toggleClass('bold');
    jQuery("#domain-dropdown-selector a[data-title='Business Domain']").click(function () {
        jQuery('#domain-dropdown-selector').slideUp(0);
        jQuery('#domain-dropdown-current').removeClass('hidden');
        return false;
    })
});
