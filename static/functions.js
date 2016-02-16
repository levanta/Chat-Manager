var Notify = {},
    iteration = 0;

function sendNoficiation(name, message, tag, ico) {
    Notification.requestPermission();
    var theme = name;
    if (tag != "") var tag = tag;
    if (message != "") var body = message;
    if (ico != "") var icon = ico;

    if(tag, body, icon) {
        var params = {
            body : (body) ? body : "",
            tag : (tag) ? tag : "",
            icon : (icon) ? icon : ""
        };
    };
    Notify["notification" + iteration] = (params) ? new Notification(theme, params) : new Notification(theme);
    setTimeout(Notify["notification" + iteration].close.bind(Notify["notification" + iteration]), 2000);
    iteration++;
    delete tag, body, icon, params;
};

$(document).ready(function() {
    if (!window.console) window.console = {};
    if (!window.console.log) window.console.log = function() {};

    $('body').delegate("#messageform", "submit", function() {
        newMessage($(this));
        return false;
    })
    $('body').delegate("#messageform", "keypress", function(e) {
        if (e.keyCode == 13) {
            newMessage($(this));
            return false;
        }
    });
    $("#message").select();
    updater.start();
});

function newMessage(form) {
    var message = form.formToDict();
    updater.socket.send(JSON.stringify(message));
    form.find("input[type=text]").val("").select();
}

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {}
    for (var i = 0; i < fields.length; i++) {
        json[fields[i].name] = fields[i].value;
    }
    if (json.next) delete json.next;
    return json;
};
function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/chatsocket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
            updater.showMessage(JSON.parse(event.data));
        }
    },

    showMessage: function(message) {
        var existing = $("#m" + message.id);
        if (existing.length > 0) return;
        var node = $(message.html);
        node.hide();
        var messageid = node.attr('data-messageid'),
            userid = getCookie('usr_id'),
            username = node.attr('data-name');

        messageid == userid ? node.find('.pic').addClass('myphoto') : node.find('.pic').addClass('photo')
        var txt, txt = node.find('.txt').text();
        $('.smiles span').each(function(){
            var code = $(this).attr('data-smile'),
                ico = $(this).find('img').attr('src');
            var re = new RegExp(code, 'g');
            txt = txt.replace(re, '<img src='+ico+'>')
        })
        node.find(".txt").html(txt)
        $("#inbox").append(node);
        node.show();
        $("#body").mCustomScrollbar("scrollTo","bottom")
        if(messageid != userid)   
            sendNoficiation(username, node.find(".txt").text(), messageid, node.find('.pic img').attr('src'));



    }
};

//navigation
$(function(){
    var i = 0;
    $('.menu').click(function(){
        var w_w = $(window).width()>480 ? 300 : $(window).width()-60;
        $('.userInfo').width(w_w)
        if(i==0){
            $('.userInfo').animate({left: 0 }, { duration: 300, queue: false })
            $('#body, header, #input').animate({left: w_w }, { duration: 300, queue: false });
            i++
        }else{
            $('.userInfo').animate({left: '-100%'}, { duration: 300, queue: false })
            $('#body, header, #input').animate({left: 0 }, {duration: 300, queue: false});
            i--
        }
    })
});

$(function(){
    $('.message').each(function(){
        var messageid = $(this).attr('data-messageid'),
            userid = getCookie('usr_id');
        messageid == userid ? $(this).find('.pic').addClass('myphoto') : $(this).find('.pic').addClass('photo')
        $(this).show();
    })
})

$(function(){
    $.ajax({
        url:'/getsmiles',
        success:function(data){
            $('.smiles').html(data);
            $('.smile').show();
        }
     })
    $('.smile').click(function(){
        $('.smiles').toggle();
    })
    $('body').delegate('.smiles span', 'click', function(){
        $('#message').val($('#message').val() + $(this).attr('data-smile')).focus();
        $('.smiles').hide();

    })
})

//resize window
$(function(){
    $(window).resize(function(){
        $('.userInfo').css({left: '-100%', width:0})
        $('#body, header, #input').css({left: 0 })
        $("#body").mCustomScrollbar("scrollTo","bottom")
    })
})

// ready
$(function(){
    $("#body, .userInfo").mCustomScrollbar({
        scrollInertia:300,
        autoDraggerLength:false
    });
    $("#body").mCustomScrollbar("scrollTo","bottom")
})