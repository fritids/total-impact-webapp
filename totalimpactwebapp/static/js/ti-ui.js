$.ajaxSetup ({
    cache: false
});
$.support.cors = true; // makes IE8 and IE9 support CORS
if (!window.console) {
    console = {log: function() {}};
}
var tiLinkColor = "#FF4E00"
var ajaxLoadImg = "<img class='loading' src='../static/img/ajax-loader.gif' alt='loading...' />";


changeControlGroupState = function(elem, newClassName){
    var states = ["inactive", "ready", "working", "success", "failure"]
    var controlGroup$
    if ($(elem).hasClass("control-group")) {
        controlGroup$ = $(elem)
    }
    else {
        controlGroup$ = $(elem).parents(".control-group")
    }
    controlGroup$
        .removeClass(states.join(" "))
        .addClass(newClassName)
}

// shim Object.create for inheritance.
// from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create#Polyfill
if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}


function homePageInit() {
    $('.carousel').carousel()
    $('.carousel').carousel("cycle")
}

function aboutPageInit() {
    if (location.href.indexOf("#contact") > 0) {
        $("#contact h3").css("color", tiLinkColor)
            .siblings("p").css({backgroundColor: "#ff834c"})
            .animate({backgroundColor: "#ffffff"}, 1000)
    }
}
function decorativeJavascriptInit() {
    // js for docs etc, not running the actual webapp

    // table of contents
    if ($("#toc")[0]) {
        $('#toc').tocBuilder({type: 'headings', startLevel: 3, endLevel: 3, insertBackLinks: 0});
    }

    homePageInit()
    aboutPageInit()

    // let people link straight to the item-help modal
    if(window.location.href.indexOf('#context') != -1) {
        $('#context').modal('show');
    }


    prettyPrint()
}






$(document).ready(function(){

    decorativeJavascriptInit()

    // if the user's on IE, tell 'em we're broken for them
    if ($.browser.msie) {
        $(".ie").show()
        $("#report-meta, #report-button, #metrics").hide()

        if (location.href.indexOf("api-docs") < 0) { // api-docs may work fine on IE
            return false
        }
    }

    $.cookie.defaults = {path: "/", raw: 1}

    var userController = new UserController();
    userController.init()

    collViews = new CollViews()
    coll = new Coll(collViews)
    collController = new CollController(coll, collViews);

    itemController = new ItemController($)

    // report pages
    if (typeof reportIdNamespace == "undefined"){
        // nothing
    }
    else if (reportIdNamespace == "impactstory_collection_id") {
        collController.collReportPageInit()
    }
    else { // looks to be an item report page
        itemController.itemReportPageInit()
    }

    var aliasListInputs = new AliasListInputs()
    aliasListInputs.init()




});
