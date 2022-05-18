(function ($) {
    jQuery('input[type=text], input[type=email], textarea').addClass('form-control');
    jQuery('label').addClass('your-name');
    jQuery('#Form_Form').submit(function (e) {
        jQuery('input[type=text], input[type=email], textarea').addClass('form-control');
        jQuery('label').addClass('your-name');
        const recaptchaVal = grecaptcha.getResponse()
        var form = jQuery(this);
        var formAction = form.prop('action');
        var formMethod = form.prop('method');
        var encType = form.prop('enctype');
        var formData = new FormData(this);
        formData.append("CV", $('input[type=file]')[0].files[0]);

        if (!recaptchaVal) {
            e.preventDefault();
            alert('Please tick the ReCaptcha checkbox');
            return false;
        } else {
            jQuery("#loading").css("display", "");
        }
        e.preventDefault();
        jQuery.ajax({
            error: function (xhr, textStatus, errorThrown) {
                alert("An error has occurred while sending email.");
            },
            success: function (data) {
                jQuery("#loading").css("display", "none");
                if (data.toString().includes('<form id="Form_Form"')) {
                    // failed form - re-render
                    jQuery('#Form_Form').html(data);
                    mark_red_require();
                    jQuery('label').addClass('your-name');
                    jQuery('#recaptcha').html('');

                    // Bugfix: Remove the old image selector
                    jQuery('body > div:last').remove();

                    // Force re-render captcha iframe
                    grecaptcha.render('recaptcha', {sitekey: '6Lesu9MZAAAAAIOmR_yNFlE7EoEuEV-lDkkKTVS3'});
                } else {
                    alert(data);
                    location = window.location;
                }
            },
            beforeSend: function () {
                if (form.prop('isSending')) {
                    return false;
                }
                form.prop('isSending', true);
            },
            complete: function () {
                form.prop('isSending', false)
            },
            dataType: 'text',
            type: formMethod,
            url: formAction,
            encType: encType,
            contentType: false,
            processData: false,
            data: formData,
            cache: false
        });
        e.preventDefault();
        return false;
    });
})(jQuery);

// Ensure that ReCaptcha Image Selector fits inside screen
// Temp solution - subject to changes
function applyNowRecaptchaReady() {
    const pictureNodeChangesObserver = new MutationObserver(observePictureNodeStyleChange);
    const bodyChangesObserver = new MutationObserver(observeNodesAddedToBody);
    let cachedPosition = null;

    bodyChangesObserver.observe(document.body, {childList: true});

    /**
     * @param {MutationRecord[]} changes Changes observed in picture selector node
     */
    function observePictureNodeStyleChange(changes) {
        const pictureNode = changes[0].target
        const pictureNodeTopPx = parseFloat(pictureNode.style.top);
        const bodyTopPx = parseFloat(document.body.style.top);
        const newPictureNodeTopPx = cachedPosition ? cachedPosition :
            pictureNodeTopPx - bodyTopPx;
        if (pictureNodeTopPx === newPictureNodeTopPx) {
            return;
        }

        if (bodyTopPx < 0 && pictureNodeTopPx > 0) {
            pictureNode.style.top = newPictureNodeTopPx + 'px';
            cachedPosition = newPictureNodeTopPx;
        } else if (pictureNodeTopPx < 0) {
            cachedPosition = null;
        }
    }

    /**
     * @param {MutationRecord[]} changes Changes observed in body
     */
    function observeNodesAddedToBody(changes) {
        changes.forEach(function (change) {
            console.table(change.addedNodes);
            if (change.addedNodes.length === 1) {
                const pictureNode = change.addedNodes.item(0);
                if (pictureNode.previousSibling.id !== 'media-query-trigger') {
                    return;
                }
                pictureNodeChangesObserver.observe(pictureNode, {
                    attributes: true,
                    attributeFilter: ['style']
                });
            } else if (change.removedNodes.length > 0) {
                // allow garbage collection of the removed picture selector element
                pictureNodeChangesObserver.disconnect();
            }
        })
    }
}
