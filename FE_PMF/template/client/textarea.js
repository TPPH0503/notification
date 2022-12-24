//Text Area
function autosize(element) {
    element.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    // el.style.cssText = '-moz-box-sizing:content-box';
    element.style.cssText = 'height:' + element.scrollHeight + 'px;overflow-y: auto;';
}

function defaultHeight(element) {
    if (element.value == "") {
        element.style.cssText = 'height:30px;  padding-left:10px';
    }
}