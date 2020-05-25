var openApps = new Array();
var mouseLocation = new Array(0, 0);
var backgroundCount = 9;
// icons
function addIcon(action) {
    switch (action) {
        case "folder":
            newFolder();
    }
}
var newFolder = function () {
    var temps = generateRandomString(8);
    var iconContainer = document.createElement("div");
    iconContainer.id = temps;
    iconContainer.className = "desktop__item";
    iconContainer.ondblclick = function () { startProgram("", 'http://localhost:8080/?dir=Home'); };
    $("#desktopBG").append(iconContainer);
    var iconPicture = document.createElement("img");
    iconPicture.className = "desktop_icons";
    iconPicture.src = "./NeonX/icons/folder.png";
    $("#" + temps).append(iconPicture);
    var iconText = document.createElement("input");
    iconText.className = "waitingInput";
    iconText.value = "untitled";
    $("#" + temps).append(iconText);
    initializeDesktop();
};
// apps
// start program parsing
function startProgram(app, uri) {
    if (uri != "" && uri != null)
        newWindow(uri, uri); // navigate to website
    if (app != "" && app != null)
        newWindow("./applications/" + app + "/index.html", app);
}
// CREATE CONTAINER
function newWindow(appLink, appName) {
    var programName = generateRandomString(8);
    var appContainer = document.createElement("app");
    appContainer.id = programName;
    appContainer.className = "programWindow";
    appContainer.draggable = "false";
    appContainer.ondblclick = function () { fullscreenProgram(programName); };
    appContainer.onmousedown = function (event) { taskkill(event, programName, true); };
    $("#desktopBG").append(appContainer);
    openApps.push(programName);
    $(".programWindow").draggable();
    // menubar
    var closeBTN = document.createElement("button");
    closeBTN.className = "menubar";
    closeBTN.innerText = "X";
    closeBTN.onclick = function () { taskkill(3, programName, false); };
    $("#" + programName).append(closeBTN);
    var maxBTN = document.createElement("button");
    maxBTN.className = "menubar";
    maxBTN.innerText = "🗖";
    maxBTN.onclick = function () { fullscreenProgram(programName, false); };
    $("#" + programName).append(maxBTN);
    var minBTN = document.createElement("button");
    minBTN.className = "menubar";
    minBTN.innerText = "_";
    minBTN.style.top = "-2px";
    minBTN.onclick = function () { minimise(programName); };
    $("#" + programName).append(minBTN);
    var containerTitle = document.createElement("span");
    containerTitle.className = "containerTitle";
    containerTitle.innerText = appName;
    minBTN.style.top = "-2px";
    $("#" + programName).append(containerTitle);
    //vf = viewerframe
    var vf = document.createElement("iframe");
    vf.src = appLink;
    //vf.scrolling = "no";
    vf.className = "viewFrame";
    $("#" + programName).append(vf);
    // add taskbar object
    var taskbarobjID = generateRandomString(8);
    var taskbarobj = document.createElement("p");
    taskbarobj.id = taskbarobjID;
    taskbarobj.className = "taskbarItem";
    taskbarobj.style.left = (openApps.length * 221) - 220 + "px";
    taskbarobj.setAttribute('app', programName);
    $("#appsTray").append(taskbarobj);
    if (!appName.includes("/")) {
        taskbarobj.insertAdjacentHTML('afterbegin', "<img class='appTrayIcon' src='./applications/" + appName + "/favicon.png'>" + appName);
    }
    else { // google and file explorer need to be hardcoded (i hate this)
        switch (appName) {
            case "https://www.bing.com":
                taskbarobj.insertAdjacentHTML('afterbegin', "<img class='appTrayIcon' src='./NeonX/icons/google.png'>Web Browser");
                break;
            default:
                taskbarobj.insertAdjacentHTML('afterbegin', "<img class='appTrayIcon' src='./applications/" + appName + "/favicon.png'>" + appName);
        }
    }
    // taskbar initilization
    $('.taskbarItem').mousedown(function (event) {
        if (event.which == 1) {
            bringtoFront($(this).attr("app"));
        }
        else if (event.which == 3) {
            taskkill(3, $(this).attr("app"), false);
        }
    });
    bringtoFront(programName);
}
var removeProgram = function (app) {
    // remove closing app from app list
    for (var i = 0; i < openApps.length; i++) {
        if (openApps[i] === app) {
            openApps.splice(i, 1);
        }
    }
};
function taskkill(e, app, click) {
    // move to front
    bringtoFront(app);
    if (click == true) {
        var closeApp = false;
        var rightclick;
        if (!e_1)
            var e_1 = window.event;
        if (e_1.which)
            rightclick = (e_1.which == 3);
        else if (e_1.button)
            rightclick = (e_1.button == 2);
        if (rightclick == true) {
            closeApp = true;
        }
    }
    else {
        closeApp = true;
    }
    if (closeApp == true) {
        $("#" + app).remove(); // frontend
        removeProgram(app); // backend
        $('p[app="' + app + '"]').remove(); // taskbar
    }
}
function bringtoFront(app) {
    for (var i = 0; i < openApps.length; i++) {
        if (openApps[i] != app) {
            document.getElementById(openApps[i]).style.zIndex -= 1;
        }
        else {
            document.getElementById(openApps[i]).style.zIndex = 128;
        }
    }
    $("#" + app).css("display", "inline");
}
function minimise(app) {
    $("#" + app).css("display", "none");
}
function fullscreenProgram(app) {
    if ($("#" + app).width() == $(window).width()) {
        document.getElementById(app).style.top = "100px";
        document.getElementById(app).style.left = "150px";
        document.getElementById(app).style.opacity = "0.95";
        $("#" + app).height($(window).height() * 0.6);
        $("#" + app).width($(window).width() * 0.45);
        console.log("Windowed " + app);
    }
    else {
        document.getElementById(app).style.top = "0px";
        document.getElementById(app).style.left = "0px";
        document.getElementById(app).style.opacity = "1";
        $("#" + app).height($(window).height() - 48);
        $("#" + app).width($(window).width());
        console.log("Maximise " + app);
    }
}
var showDesktop = function () {
    $("#all-apps").hide();
    for (var i = 0; i < openApps.length; i++) {
        minimise(openApps[i]);
    }
};
function desktopContextMenu(x, y, toggle) {
    if (toggle == true) {
        if ($("#desktopContextMenu").css("display") == "block") {
            $("#desktopContextMenu").css("display", "none");
        }
        else {
            $("#desktopContextMenu").css("left", x);
            $("#desktopContextMenu").css("top", y - 20);
            $("#desktopContextMenu").css("display", "block");
        }
    }
    else {
        $("#desktopContextMenu").css("display", "none");
    }
}
function editDesktop(enabled) {
    var p = $(".desktop__item");
    if (enabled == true) {
        p.css("background-color", "rgba(120, 144, 156, 0.8)");
        p.css("border-style", "dotted");
    }
    else if (enabled == false) {
        p.css("background-color", "");
        p.css("border-style", "none");
    }
    else {
        // for toggle use no paramiters
        if (p.css("background-color") == "rgba(120, 144, 156, 0.8)") {
            p.css("background-color", "");
            p.css("border-style", "none");
        }
        else {
            p.css("background-color", "rgba(120, 144, 156, 0.8)");
            p.css("border-style", "dotted");
        }
    }
}
function addApp(file) {
    desktopContextMenu(null, null, false); //toggle context menu
    var reader = new FileReader();
    reader.onload = function (e) {
        if (file[0].name == "package.app") {
            // correct file type
            var appName_1 = e.target.result;
            console.log("Installing, " + appName_1);
            var temps = generateRandomString(8);
            var iconContainer = document.createElement("div");
            iconContainer.id = temps;
            iconContainer.className = "desktop__item";
            iconContainer.ondblclick = function () { startProgram(appName_1, ''); };
            $("#desktopBG").append(iconContainer);
            var drawIcon = document.createElement("div");
            drawIcon.id = temps;
            drawIcon.className = "draw__item";
            drawIcon.onclick = function () { startProgram(appName_1, ''); };
            $("#all-apps").append(drawIcon);
            var iconPicture = document.createElement("img");
            iconPicture.className = "desktop_icons";
            iconPicture.src = "./applications/" + appName_1 + "/favicon.png";
            $("#" + temps).append(iconPicture);
            var iconText = document.createElement("text");
            iconText.innerText = appName_1;
            $("#" + temps).append(iconText);
            initializeDesktop();
        }
        else {
            console.log("Failed to load, " + text.name);
        }
    };
    reader.readAsText(file[0]);
}
var initializeDesktop = function () {
    // desktop icons
    var p = $(".desktop__item").draggable();
    $(".desktop__item").mousedown(function (eventObject) { editDesktop(true); });
    $(".desktop__item").mouseup(function (eventObject) { editDesktop(false); });
    // taskbar initilization
    $(".taskbarItem").click(function (e) {
        bringtoFront($(this).attr("app"));
    });
    // all apps grid
    $('#all-apps').hide();
    // icon renaming
    $('.waitingInput').bind("enterKey", function (e) {
        this.replaceWith(this.value);
        this.ondblclick = function () { startProgram("", 'http://localhost:8080/?dir=Home/Documents/' + this.value); };
    });
    $('.waitingInput').keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
    console.log("Desktop Refreshed!");
};
$(document).ready(function () { initializeDesktop(); });
// sub FUNCTIONS
var generateRandomString = function (length) {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var text = "";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    desktopContextMenu(event.clientX, event.clientY, true);
});
