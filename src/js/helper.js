//helper
module.exports = (function(){

    return {
        createElementFromString: function(html){
            let div = document.createElement("div");
            div.innerHTML = html.trim();
            return div.firstChild;
        },
        setFocus:function(elm, point){
            let range = document.createRange();
            let sel = window.getSelection();
            range.setStart(elm, point);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            elm.focus();
        },
        findParentByClassName:function(elm, searchClassName, checkCount = 5){
            let parent = elm.parentNode;
            for(let i = checkCount; i > 0;i--){
                if(parent.className === searchClassName){
                    return parent;
                }
                parent = parent.parentNode;
            }
            return false;
        }
    }   

}());