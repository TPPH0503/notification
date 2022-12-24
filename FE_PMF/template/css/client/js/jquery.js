jQuery(function($) {
    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function() {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
        $(".page-wrapper").addClass("toggled");
    });
});
$("#search").focus(function() {
    $(".card").show(200);
    $("#custom-search-form .input-group").css('border', '2px solid white');
});
$("#search").blur(function() {
    $(".card").hide(200);
    $("#custom-search-form .input-group").css('border', '1px solid rgb(197, 197, 197)');
});
$("#infomation").click(function() {
    $("#info").toggle();
});


function mouseOver(x) {

    $(x).parent().parent().css({
        'border': '1px solid rgba(230, 229, 229, 0.988)'
    })
}

function mouseOut(x) {
    $(x).parent().parent().css({
        'border': 'none'
    })
}

function changeOutput() {
    document.getElementById('new-task').placeholder = "What's the next thing on your plate?";
}

function changeInput() {
    document.getElementById('new-task').placeholder = "Click here to add a task...";
}


function checkNameColumne(x) {
    if (x.value == "") {
        x.value = "Untitled section";
    }
}
$(function() {
    $('#myTab li:last-child a').tab('show')
})


function openPage(evt, namePage) {
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(namePage).style.display = "block";
}


//Header on top
window.onscroll = function() { myFunction() };

var navbar = document.getElementById("navbar");
var search = document.querySelectorAll(".in-search");
var sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset > sticky) {
        navbar.classList.add("sticky");
        search.forEach(e => {
            e.classList.add("searchSticky");
        });
    } else {
        navbar.classList.remove("sticky");
        search.forEach(e => {
            e.classList.remove("searchSticky");
        });
    }
}
//End header on top