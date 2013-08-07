/// <reference path='jquery.js' />
/// <reference path='jquerymobile.js' />


$(document).ready(function () {

    /* Caching Start */
    //offlinecaching();
    callPopUp();
    function offlinecaching() {

    }
    /* Caching End */

    /* Popup Start */

    $('.ui-page').click(function (event) {
        var caller = event.target.id;
        var pop = $('.ui-page-active #popup');
        //alert(caller);

        if (caller != 'popup') {
            pop.fadeOut('fast');
        }
    });

    /* Popup End */
    var isPreview  = $('body').attr('an-design');

    if(isPreview == null || isPreview == undefined)
        isPreview = false;
    
    if (isPreview)
    {
        //Wire up page loading errors to the send error callback
        $('document').on('pagechangefailed', function (event, data) {
            //Check if we have a parent with the function we need
            if (parent.SendErrorEmail)
            {
                var msg = "JQuery Mobile error loading page:\n" + JSON.stringify(data.toPage) + "\n"
                msg += "Current page: " + window.location.href + "\n";
                msg += "APPID: " + parent.GetAppId() + '\n';
                msg += "APPCODE: " + parent.GetAppCode() + '\n';
                msg += "USER TYPE: " + parent.sType;
                parent.SendErrorEmail(msg)
            }
        });
    }
    
    an_bindInputFocus()
    ConsumeRss(isPreview);
    mapInit();
    galleryInit();
    calendarInit();
    ChickletAnimation();
});

$(function () {

    $('div[data-role="page"]').live('pageshow', function (event, ui) {
        if(ui.nextPage != null && ui.nextPage != undefined && ui.nextPage != '' && ui.nextPage != 'undefined' && ui.nextPage.attr('id').indexOf('prevPage') == -1)
        {
            console.log('pageshow: ' + ui.nextPage + ' : ' + ui.prevPage);
        }
        an_bindInputFocus();
    ConsumeRss(false);
        mapInit();
        galleryInit();
        calendarInit();
        ChickletAnimation();

    });

    $('.btnEmailSender').live('click', function () {
        //ClassNames got backward, so I switched the variables for now
        var t = $(this).closest('div[an-ctrl=true]');
        var senderName = t.find('.fromInfo').val();
        var fromInfo = t.find('.toInfo').val();
        var toInfo = t.find('.hdnToEmail').val();
        var subjectInfo = t.find('.subjectInfo').val();
        var bodyInfo = t.find('.bodyInfo').val();
        var url = 'http://www.appnotch.com/web/callback/EmailSubmit.aspx';
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(toInfo) && reg.test(fromInfo)) {
            $.mobile.showPageLoadingMsg();

            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'Text',
                data: {
                    'name': senderName,
                    'fromInfo': fromInfo,
                    'toInfo': toInfo,
                    'subjectInfo': subjectInfo,
                    'bodyInfo': bodyInfo,
                },
                success: function (msg) {

                    if (msg == 'success')
                    {
                        $('.email-sender .status').removeClass('error');
                        $('.email-sender .status').addClass('success');
                        $('.email-sender .status').html('You have successfully sent an email.');
                        $('.btnEmailSender').attr('disabled', true);
                    } else
                    {
                        $('.email-sender .status').removeClass('success');
                        $('.email-sender .status').addClass('error');
                        $('.email-sender .status').html('An error occurred: ' + msg);                    
                    }
                    
                    $('.email-sender .status').fadeOut(3000);
                    $.mobile.hidePageLoadingMsg();
                },
                error: function (jqXHR) {
                    $('.email-sender .status').removeClass('success');
                    $('.email-sender .status').addClass('error');
                    $('.email-sender .status').html('An server error occurred. Please contact support if the problem persists.');
                    $('.email-sender .status').fadeOut(3000);

                    $.mobile.hidePageLoadingMsg();
                }
            });
        }
        else {
            $.mobile.hidePageLoadingMsg();
            $('.email-sender .status').addClass('error');
            $('.email-sender .status').html('Please enter a valid email address.');
            
            $('.email-sender .status').stop().fadeIn(1000, function(){            
                $('.email-sender .status').fadeOut(3000);
            });
        }

    });

    ChickletAnimation();
});

$('.ui-clickable').live('click', function (event, ui) {

    var params = $(this).attr('target').split(';');
    var defValue = params[0];
    var clckValue = params[1];

    change(this, defValue, clckValue);

});

$('div').live('pageshow', function (event, ui) {
    CheckPopupSizeAndLoc();
    changeFormSubmit(this);
});

$('div').live('pagehide', function (event, ui) {
    var isNative = $('body').attr('an-convtype');
    if(isNative == 'xml')
    {
        document.location = 'native://seclabs.com/pageLoad/' + event.delegateTarget.baseURI;
    }
});

$(window).resize(function () {
    CheckPopupSizeAndLoc();
    changeGridViews();
});

function an_bindInputFocus()
{
    $('input[type=date]').focus(function (event) {
        if (event.target.type == 'text' && $('body').attr('an-convtype') == 'xml')
        {
            document.location = 'native://seclabs.com/datepicker/';
        }
    });
    $('input[type=time]').focus(function (event) {
        if (event.target.type == 'text' && $('body').attr('an-convtype') == 'xml')
        {
            document.location = 'native://seclabs.com/timepicker/';
        }
    });
}

function ChickletAnimation()
{

    $('.an-chick').hover(function () {
        $(this).find('img').stop().fadeTo('fast', 0.3);
    }, function () {
        $(this).find('img').stop().fadeTo('fast', 1.0);
    });

    $('.an-chick').click(function () {
        $(this).find('img').stop().fadeTo('fast', 2.0);
    }, function () {
        $(this).find('img').stop().fadeTo('fast', 1.0);
    });

    $('.an-chick').taphold(function (a) {
        $(this).find('img').stop().fadeTo('fast', 0.3);
    }).live('vmouseup', function (a) {
        $(this).find('img').stop().fadeTo('fast', 1.0);
    });

    $('[an-data-role=chicklet] a').tap(function (a) {
        $(this).find('img').stop().fadeTo('fast', 0.3);
    });

}

function changeGridViews() {

    if ($('.hdnAutoWrap').val() != undefined && $('.hdnAutoWrap').val() != null) {
        var orientation = window.orientation;
        var autoWrap = $('.hdnAutoWrap').val().toLowerCase();
        var width = $(window).width();
        var height = $(window).height();

        if (orientation == 0) {
            //alert(orientation);
            $('.grid-item').each(function () {
                $(this).removeClass('grid-width_importants_4');
            });
        }
        else if (orientation == 90) {
            view = 'Landscape CounterClockwise';

            if (autoWrap == true) {
                $('.grid-item').each(function () {
                    if ((this).hasClass('grid-width_importants_4') == false) {
                        $(this).addClass('grid-width_importants_4');
                    }
                });
            }
        }
        else if (orientation == -90) {
            view = 'Landscape Clockwise';

            if (autoWrap == true) {
                $('.grid-item').each(function () {
                    if ((this).hasClass('grid-width_importants_4') == false) {
                        $(this).addClass('grid-width_importants_4');
                    }
                });
            }
        }
        else {
            //alert('x');
            view = ' View Orientation is not supported';
            orientation = ' View Orientation is not supported';
        }


        if (autoWrap == true) {
            if (width > height) {
                $('.grid-item').each(function () {
                    if ((this).hasClass('grid-width_importants_4') == false) {
                        $(this).addClass('grid-width_importants_4');
                    }
                });
            }
            else {
                $('.grid-item').each(function () {
                    $(this).removeClass('grid-width_importants_4');
                });
            }
        }
    }
}

function callPopUp() {
    var isEnabled = $('.ui-page-active #hdnPopupEnabled').val();
    if (isEnabled == 'true') {
        var pop = $('.ui-page-active .popup');
        $('.ui-page-active #popup').show();
        $('.ui-page-active #popup').addClass('visible');
    }

}

function change(obj, def, clck) {

    $(obj).css(def)
    $(obj).mouseup(function () {
        $(obj).css(clck)
    });
}

function CheckPopupSizeAndLoc() {
    var platform = navigator.platform;

    var pop = $('.ui-page-active #popup');
    var width = $(window).width();
    var height = $(window).height();

    if (platform == 'iPad') {
        pop.addClass('BigScreenText');
    }

    pop.width(width / 2);
    pop.height(height / 2);
}

/* Static Map
--------------------------------------------------*/
function mapStaticInit() {
    var lat;
    var lng;
    var geocoder = new google.maps.Geocoder();
    var sUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=';
    address = $('.FromAddress').text();

    var loc = address = address.toString().replace(/ /g, '+');

    geocoder.geocode({ 'address': address }, function (result, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = result[0].geometry.location.lat().toString();
            lng = result[0].geometry.location.lng().toString();

            sUrl += loc;
            sUrl += '&zoom=18&size=800x800&maptype=roadmap&markers=color:red%7C' + lat + ',' + lng + '&sensor=false';
            //alert(sUrl);
            $('.static-map').attr('src', sUrl);
        }
        else {
            //alert('error: ' + status);
        }
    });
    
    $(geocoder).remove();
}

/* Google Map Code
--------------------------------------------------*/

function mapInit() {
    $('.map-dynamic').each(function () {
        var lat;
        var lng;
        var geocoder = new google.maps.Geocoder();
        address = $(this).find(".dynamic-FromAddress").text();
        canvas = $(this);

        geocoder.geocode({ 'address': address }, function (result, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = result[0].geometry.location.lat().toString();
                lng = result[0].geometry.location.lng().toString();
                
                DrawMap(canvas, lat, lng);
            }
        });

        $(geocoder).remove();
    });
}

function DrawMap(canvas,lat, lng) {
    var loc;

    var myGmaps = $.extend(google.maps, {});
    directionDisplay = new google.maps.DirectionsRenderer();
    loc = new google.maps.LatLng(lat, lng);

    var myOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: loc
    };

    var canv = $(canvas).find('.canvas').attr('id');
    map = new myGmaps.Map($('#' + canv)[0], myOptions);
    var marker = new google.maps.Marker({
        position: loc,
        title: address,
        map: map
    });

    directionDisplay.setMap(map);
}

function mapGetDirection() {
    //Values are backward from the actual page so end is from and start is to...
    var end = $('.dynamic-FromAddress').text();
    var start = $('.dynamic-ToAddress').val();

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    
    var directionsService = new google.maps.DirectionsService();

    directionsService.route(request, function (result, status) {
        if (status == 'OK')
            directionDisplay.setDirections(result);
        else
            alert('There was a problem getting directions');
    });
}

/* RSS Code
--------------------------------------------------*/

function ConsumeRss(isDesign) {

    $('[an-data-role=rss]').each(function () {
        var ele = this;
        var callBack = '/web/callback/RssConsumer.aspx?sUrl=';
        var rssUrl = $(this).find('[type=hidden]').val();
        var count = $(this).find('[type=hidden]').attr('maxItem');
        rssUrl = rssUrl.replace('&', '|');
        $.ajax({
            url: callBack + rssUrl,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                GenerateRssView(ele, result, parseInt(count) + 1, isDesign);
            },
            error: function (result) {
                if (result.status == 200 && result.statusText == 'parseerror' || result.responseText == 'True') {
                    GenerateRssView(ele, result, parseInt(count) + 1, isDesign);
                }
            }
        });

    });

}

function GenerateRssView(ele, result, maxItem, isDesign) {
    var ulView = $(ele).find('ul');
    var itemNum = $(ele).find('input[type=hidden]').attr('itemNumber');
    var display = $(ele).find('input[type=hidden]').attr('display');
    var iCount = 0;

    if(display == null || display == undefined)
        display = '0';

    $(ulView).html('');
    for (p in result) {
        if (iCount != maxItem) {
            if (result[p] != null && result[p] != undefined) {
                if (iCount == 0) {
                    var headLi = $('<li/>').attr('data-role', 'list-divider')
                                       .html(result[p].Title);
                    $(ulView).append(headLi);
                }
                else {
                    var aLink = null;
                    
                    switch(display)
                    {
                        case '0':{
                            aLink = RssViewFlat(result[p], isDesign);
                            break; 
                        } 
                        case '1':{
                            aLink = RssViewSmallImage(result[p], isDesign);
                            break; 
                        }
                        case '2':{
                            aLink = RssViewBigImage(result[p], isDesign);
                            break; 
                        }    
                    }


                    var rssLi = $('<li>').append(aLink);
                    $(ulView).append(rssLi);
                }
                ++iCount;
            }
        }
        else {
            break;
        }
    }

    $(ulView).listview('refresh');
}

function RssViewFlat(result, isDesign)
{

    var aLink = $('<a/>');
        aLink = aLink.html(result.Title);

    if(isDesign == false) {
        aLink = aLink.attr('href', result.Link);
    }

    return aLink;
}

function RssViewSmallImage(result, isDesign)
{
    var img = $(result.Image).addClass('ui-li-icon');
    var aLink = $('<a/>');
    
    aLink.append(img);   
    aLink.append(result.Title);

    if(isDesign == false) {
        aLink.attr('href', result.Link)
    }

    return aLink;
}

function RssViewBigImage(result, isDesign)
{
    var appCode = parent.$('#hdnAppCode').val();
    if(appCode == '' || appCode == undefined || appCode == null)
        appCode = '0';

    var desc = result.Description;
   
    if(desc.length > 20)
        desc = desc.substring(0, 50) + '...';

    var imgTag = result.Image;
    if(imgTag == '')
        imgTag = '<img src="/apps/' + appCode +'/image/Question_Gray_80x80.png"/>';

    var img = $(imgTag);
    var span = $('<span/>').html(result.Title).attr('style', 'margin-bottom: 10px; display: block; padding: 5px 0px;overflow: hidden; text-overflow: ellipsis !important;');
    var p = $('<p/>').html(desc).attr('style', 'margin-top: 5px;');
    var aLink = $('<a/>');   

    aLink.append(img);
    aLink.append(span); 
    aLink.append(p);    

    if(isDesign == false) {
        aLink.attr('href', result.Link)
    }

    return aLink;
}

/* Gallery Code
--------------------------------------------------*/
function galleryInit(){
    var inPreview = parent.$('body').hasClass('design');

    if(!inPreview)
    {
        $('div[an-data-role=gallery]').each(function(){
        
            if($(this).find('ul li a[href]').length > 0)
            {
                $(this).find('ul li a[href]').photoSwipe({ enableMouseWheel: false , enableKeyboard: false });
            }
        });
    }
}

function galleryDestroy(){
    $('div[an-data-role=gallery]').each(function(){
        if($(this).find('ul li a[href]').length > 0)
        {
            $(this).find('ul li a[href]').detach();
        }
    });
}

//--------------Calendar-------------------------
function calendarInit(){
    $('div[an-data-role="calendar"]').each(function () {
        var $this = $(this);
        var eData = $this.attr('an-cal-src') || []; //Show no events if attribute not present
        
        $this.fullCalendar('destroy'); //Ensure there is no previous calendar data to prevent showing it twice...
        $this.fullCalendar({
            events: eData,
            dayClick:dayClicked,
            unselect:calUnselect});
    });
}

function dayClicked(date, allday, jsEvent, view) {
    
    $('.ui-loader').fadeIn('fast');
    $.mobile.loading( 'show', {
                                text: 'Loading Events',
                                textVisible: true,
                                theme: 'a',
                                textonly: false,
                                html: ''
                                } );

    var cal = $(this).parents('div.fc[an-data-role="calendar"]')
    if (cal.length < 1) {
        console.error('Could not get associated calendar');
        return;
    } else if (cal.length > 1) {
        console.warn('More than one calendar parent was found... using first (closest parent)')
        cal = cal.first();
    }

    var endDate = new Date(date);
    endDate.setDate(date.getDate() + 1);
    
    cal.fullCalendar('select', date, date, true); //Unselects and selects the date chosen

    var events = cal.fullCalendar('clientEvents',
    function (eventObj) {
        if (eventObj.start >= endDate)
            return false;
        if (eventObj.end < date)
            return false;
        return true;
    });

    var dvEvent = cal.find("div.an-cal-eventItems");
    if (dvEvent.length != 1)
        return; //No div available for us to put the event info in

    dvEvent.html("");

    var results = "";
                
    results += '<br/><ul id="ulInfo" data-role="listview" data-inset="true" ><li data-role="list-divider">Events Details for ';
    results += date.toLocaleDateString() + '</li>';

    for (e in events) {
        results += '<li>';
        results += '<h2>' + events[e].title + '</h2>';
        results += '<p><b>When: </b>' + $.fullCalendar.formatDate(events[e].start, "MM/dd/yyyy") + ' to ';
        results +=  $.fullCalendar.formatDate(events[e].end, "MM/dd/yyyy") + '</p>';
        results += '</li>';
    }
    results += '</ul>';

    dvEvent.append(results);
    $('#ulInfo').listview({ create: function(){  

        $("html, body").animate({ scrollTop: $('#ulInfo').offset().top }, 1000);

        $('.ui-loader').fadeOut(2000, function(){
            $.mobile.loading('hide');
        });
    }});
}

function calUnselect(view, jsEvent) {
    //Clear out the event items
    var cal = $(this.element).parents('div.fc[an-data-role="calendar"]')
    if (cal.length < 1) {
        console.error('Could not get associated calendar');
        return;
    } else if (cal.length > 1) {
        console.warn('More than one calendar parent was found... using first (closest parent)')
        cal = cal.first();
    }

    var dvEvent = cal.find("div.an-cal-eventItems");
    if (dvEvent.length != 1)
        return;
    dvEvent.html("");
}

function changeFormSubmit(e)
{
    var formSubProc = false;
    $(e).find('[data-role=content] form').bind('submit', function(){
        
        if(formSubProc)
            return false;

        formSubProc = true;

        var formUrl = $(this).attr('action');
        var formMethod = $(this).attr('method');
        var formData = $(this).serialize();
        var typeMsg = 'submit';        
        var formMsgSuccess = "Successfully submitted your request.";

        if(formMethod.toLowerCase() == 'get')
        {
            formMsgSuccess = "Successfully received your request.";
        }

        if(formUrl && formSubProc)
        {
            $.mobile.showPageLoadingMsg(); 
        
            $.ajax({
                url : formUrl,
                type: formMethod,
                data: formData,
            success: function(msg){
                if (msg == 'success')
                {
                    CreatePopup(e, 'Success', formMsgSuccess);
                }
                else
                {
                    CreatePopup(e, 'Error', msg);
                }
                    $('#popupMenu').popup(); 
                    $('#popupMenu').popup('open');
                
                    $('#popupMenu').fadeOut(5000, function(){
                        $(this).remove();
                    });
                    $.mobile.hidePageLoadingMsg(); 
                    formSubProc = false;
                },
            error: function(jqXHR){    
                CreatePopup(e, 'Failed', 'There was an error submitting your request. Try again or contact support.');
                    $('#popupMenu').popup(); 
                    $('#popupMenu').popup('open');

                    $('#popupMenu').fadeOut(5000, function(){
                        $(this).remove();
                    });

                    $.mobile.hidePageLoadingMsg(); 
                    formSubProc = false;
                }
            });
        }

        return false;
    });

}

function CreatePopup(e,title,msg)
{   

    $('#popupMenu').remove();
    var Popup =   '<div data-role="popup" id="popupMenu" data-theme="a"> '
                + '<div data-role="popup" data-theme="a" class="ui-corner-all">'                
                + '<div style="padding:10px 20px;">'
                + '<h3>' + title + '</h3>'
                + '<span>' + msg + '</span>'
                + '</div>'
                + '</div>'
                + '</div>';
    $(e).append(Popup);
}

//Set currently focused input to have the specified value (usually called from the native application)
function an_updateFocusInput(inStr)
{
    var elem = document.activeElement;
    if (!elem.type)
    {
        console.error('updateFocusInput called but document.activeElement has no type attribute and likely not an input element');
        return; 
    }
    
    elem.value = inStr;
    elem.blur();
}