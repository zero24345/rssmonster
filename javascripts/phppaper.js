//TODO: read window.location.hash and if set reload section with post parameters

$(document).ready(function() {

//remove scrollbar
$('feedbar').css({'overflow-y':'hidden'});

//loadscrollPagination function to load items when scrolling. Remember to use: $(window).off("scroll");
function loadscrollPagination(category,feed) {
  setTimeout(function() {

    $('#content').scrollPagination({
                nop     : 10, // The number of posts per scroll to be loaded
                offset  : 0, // Initial offset, begins at 0 in this case
                error   : 'No More Posts!', // When the user reaches the end this is the message that is
                delay   : 500, // When you scroll down the posts will load after a delayed amount of time.
                scroll  : true, // The main bit, if set to false posts will not load as the user scrolls.
                category: category, // Catch category from menu
                feed    : feed // Catch feedname from menu
    });
  }, 100);
}

//get hashtag value from url
var request = window.location.hash;
request = request.slice( 1 );
console.log("hashtag value from url:" + request);

function getFirstPart(str) {
    return str.split('=')[0];
}

function getSecondPart(str) {
    return str.split('=')[1];
}

hashtype = getFirstPart(request);
hashvalue = getSecondPart(request);

if (typeof hashvalue === "undefined") {
  console.log("hashvalue is undefined");
  //hashvalue = "";
}

console.log(hashtype);
console.log(hashvalue);


//set cookie for view, if not set
if ($.cookie('view') == 'undefined') {
  console.log("cookie undefined, set cookie");
  $.cookie('view', 'detailed', { expires: 14 });
} else {
  console.log("cookie found with current view type: " + $.cookie('view'));
}

//get viewtype from cookie
var viewtype = $.cookie('view');
console.log("current view type = " + viewtype);

//load list view is cookie is set to list view
if (viewtype == 'list') {

 //TODO: scrollpagination is still active when switching to list view
 console.log("first load, load view list items for: " + request);
 $('section').load(viewtype + '-view.php?' + request);
} else {
 console.log("first load, load detailed list items for: " + request);
 var encoded = encodeURIComponent(request);
 viewtype="detailed";
 $('section #content').remove();
 $('section').append('<div id="content"></div>');
 $(window).off("scroll");
 loadscrollPagination('','');
}

//remember windows location hash (obsolete)
$('div.main a').each(function() {
    this.href = this.href + window.location.hash;
});

//Drop down menu items from feedbar
jQuery("div.menu-sub").hide();
  jQuery("div.menu-heading").click(function()
  {

    $('feedbar').css({'overflow-y':'hidden'});
    var category = $(this).find("div.title").text();
    console.log("Clicked on category: " + category);
    console.log("viewtype = " + viewtype);
    var encoded_category = encodeURIComponent(category);

    if (viewtype == 'detailed') {

      $('section #content').remove();
      $('section').append('<div id="content"></div>');
      $(window).off("scroll");
      loadscrollPagination(encoded_category,'');

    } else {
      $(window).off("scroll");
      $('section').load('list-view.php?category=' + encoded_category);
    }

    window.location.hash = '#category=' + encoded_category;

    hashtype = "category";
    hashvalue = encoded_category;

    jQuery(this).next("div.menu-sub").slideToggle(200);

    if ( $(this).hasClass("clicked") ) {
      $(this).removeClass("clicked");
      $(this).css( "background-color", "" );
      $(this).css( "color", "" );
      $(this).find('div.pointer').css( "background-image", 'url("images/fd/selector-right-arrow.png")' );
    } else {
      $(this).addClass("clicked");
      //$(this).css( "background-color", "rgba( 0,0,0,0.04 )" );
      $(this).css( "background-color", "#0088cc" );
      $(this).css( "color", "#ffffff" );
      $(this).find('div.pointer').css( "background-image", 'url("images/fd/selector-down-arrow.png")' );
    }
});


//Selection and load sub menu items from feedbar
jQuery("div.menu-sub-item").click(function() {
  var feed = $(this).find("span.title").text();
  console.log("Clicked on feed: " + feed);
  var encoded_feed = encodeURIComponent(feed);
  window.location.hash = '#feed=' + encoded_feed;

  hashtype = "feed";
  hashvalue = encoded_feed;

  //only one menu-sub-item can be active
  $("div.feedbar").find("div.menu-sub-item").css('background-color', '');
  $(this).css( "background-color", "#dceaf4" );

  if (viewtype == 'detailed') {

    $('section #content').remove();
    $('section').append('<div id="content"></div>');
    $(window).off("scroll");
    loadscrollPagination('',encoded_feed);

  } else {
    $(window).off("scroll");
    $('section').load('list-view.php?feed=' + encoded_feed);
  }

});

//Selection and load sub menu items from feedbar
jQuery("div.opml").click(function() {
  $('section').load('opml.php');
});

//List view button
jQuery("div.list").click(function() {
  console.log("switched to list view");
  $.cookie('view', 'list', { expires: 14 });
  viewtype="list";

  //console.log("request=" + request);
  //$('section').load('list-view.php?' + request);
  $(window).off("scroll");
  $('section').load('list-view.php?' + hashtype + "=" + hashvalue);

});

//Detailed view button
jQuery("div.detailed").click(function() {

  //set cookie and variable to detailed view
  console.log("switched to detailed view");
  $.cookie('view', 'detailed', { expires: 14 });
  viewtype="detailed";

  //remove existing content and add empty again
  $('section').empty();
  $('section #content').remove();
  $('section').append('<div id="content"></div>');

  //disable existing scroll and load loadscrollPagination
  $(window).off("scroll");

  console.log("switched to detailed view with hashtype: " + hashtype + " and hashvalue: " + hashvalue );

  if (hashtype == 'category') {
   loadscrollPagination(hashvalue,'');
  } else if (hashtype == 'feed') {
   loadscrollPagination('',hashvalue);
  } else if (typeof hashvalue === "undefined") {
   loadscrollPagination('','');
  }
});

//event when marking item as starred
$("body").on("click", "img.item-star.unstar", function(event){
    var id = $(this).attr('id');
    console.log('starred item: ' + $(this).attr('id'));
    $.ajax(
     {
       type: "POST",
       url: "json.php",
       data: JSON.stringify({ "jsonrpc": "2.0", "update": "star-mark", "value": id }),
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       async: false,
       success: function(json) {
        result = json;
       },
       failure: function(errMsg) {}
     }
    );

    $(this).attr('src', 'images/star_selected.png');
    $(this).removeClass("unstar");
    $(this).addClass("star");

});

//event when unstaring item
$("body").on("click", "img.item-star.star", function(event){
    var id = $(this).attr('id');
    console.log('unstarred item: ' + $(this).attr('id'));
    $.ajax(
     {
       type: "POST",
       url: "json.php",
       data: JSON.stringify({ "jsonrpc": "2.0", "update": "star-unmark", "value": id }),
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       async: false,
       success: function(json) {
        result = json;
       },
       failure: function(errMsg) {}
     }
    );

    $(this).attr('src', 'images/star_unselected.png');
    $(this).removeClass("star");
    $(this).addClass("unstar");

});


});


//infinite.js script is used to call the myHandler function

//create pool for article id's, this to avoid that an article is marked as read twice or more
var pool = new Array();

//create event handler
function myHandler(e) {
    var id = $(this).attr('id');

    //the article id is not in the array
    if(jQuery.inArray(id,pool) == -1) {

      //debug message to console
      console.log($(this).attr('id') + ': ' + e.type);

      //push article id to array
      pool.push(id);

      //mark item as read with json call
      $.ajax(
       {
        type: "POST",
        url: "json.php",
        data: JSON.stringify({ "jsonrpc": "2.0","update": "read-status", "value": id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){},
        failure: function(errMsg) {}
       }
     );
  };
}

