'use strict';
jQuery.noConflict();

jQuery(document).ready(function () {
    const gallery = jQuery('.gallery-masonry');
    const header = jQuery('div.header-all').first();
    const preferReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const filterSelector = jQuery('#img-tag-select');

    setupActiveTag();
    setupGallery();
    setupSelectorDropdown();
    setupImageFiltering();

    preferReducedMotion.addEventListener('change', setupGallery);

    function setupActiveTag() {
        jQuery('a.banner-menu').each(function () {
            const elem = jQuery(this);
            if (elem.html().trim().toLowerCase() === 'gallery') {
                elem.addClass('active');
            } else {
                elem.removeClass('active');
            }
        })
    }

    function setupGallery() {
        const albumCount = jQuery('h2.subgallery-title').length
        if (albumCount < 1) return;

        for (let idx = 1; idx <= albumCount; idx++) {
            const rel = 'gallery-' + idx;
            const galleryClass = '.gallery-masonry.gallery-masonry-rel-' + idx;

            const gallerySection = jQuery(galleryClass).justifiedGallery({
                rowHeight: 200,
                margins: 10,
                lastRow: 'center',
                refreshTime: 400,
                captions: false,
                randomize: true,
                rel: rel
            });
            gallerySection.on('jg.complete', function () {
                const disableMotion = preferReducedMotion.matches

                // Get all children elements that are not hidden
                const visibleImages = jQuery(this).find('a:not(.jg-filtered)');
                const currentGallerySection = jQuery(this).parents('.gallery-section');
                if (visibleImages.length > 0) {
                    // attach colorbox overlay, and show section if hidden
                    const showTime = disableMotion ? 0 : 50;
                    currentGallerySection.show(showTime);
                    visibleImages.colorbox({
                        maxWidth: '80%',
                        maxHeight: '80%',
                        opacity: 0.8,
                        scrolling: false,
                        rel: rel,
                        fixed: true,
                        onOpen: hideHeader,
                        onClosed: showHeader,

                        // Disable transitions on computers with accessibility features
                        transition: disableMotion ? 'none' : 'elastic',
                        fadeOut: disableMotion ? 0 : 300,
                        current: ''
                    });
                } else {
                    const hideTime = disableMotion ? 0 : 'normal';
                    currentGallerySection.hide(hideTime);
                }
            });
        }
    }

    function setupSelectorDropdown() {
        const tagSet = new Set();
        jQuery('div.gallery-masonry img.gallery-masonry-image').each(function () {
            const tags = jQuery(this).data('tags').toString();
            if (tags) {
                const separatedTags = tags.trim().split(/\s*,\s*/);
                separatedTags.forEach(tagSet.add, tagSet);
            }
        });

        // remove empty tag
        tagSet.delete('');

        if (tagSet.size > 0) {
            const sortedTags = Array.from(tagSet);
            sortedTags.sort();
            sortedTags.forEach(function (tag) {
                const option = new Option(tag);
                filterSelector.append(option);
            })
            jQuery('#img-filter-section').show();
        }
    }

    function setupImageFiltering() {
        filterSelector.change(function () {
            // Reset the preview - preventing it from showing images
            // outside of the current filter
            gallery.colorbox.remove();
            filterSelector.prop('disabled', true);

            gallery.justifiedGallery({
                filter: filterImages,
                refreshTime: 400
            });

            gallery.one('jg.complete', enableFilterSelector);
        })
    }

    function hideHeader() {
        header.addClass('put-to-back')
    }

    function showHeader() {
        header.removeClass('put-to-back')
    }

    function filterImages(entry) {
        const filterQuery = filterSelector.find(':selected').val();
        if (!filterQuery) {
            // no filter - get all images
            return true;
        }
        const tags = jQuery(entry).find('img').data('tags').toString();
        if (!tags) {
            return false;
        }
        const currentImageTags = tags.trim().split(/\s*,\s*/);
        return currentImageTags.includes(filterQuery);
    }

    function enableFilterSelector() {
        filterSelector.prop('disabled', false);
    }
});

