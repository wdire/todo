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
        findParentByClassName:function(elm, searchClassName, checkCount = 6){
            if(!elm || !elm.parentNode || !elm.parentNode.parentNode){
                console.log(elm);
                return false;
            }

            let parent = elm.parentNode;
            for(let i = checkCount; i > 0;i--){
                if(parent.classList.contains(searchClassName)){
                    return parent;
                }
                
                parent = parent.parentNode;
            }
            return false;
        },
        selectInOptions:function(selectElm, select){
            [...selectElm.options].forEach((e,i)=>{
                if(e.value === select){
                    selectElm.selectedIndex = i;
                    return true;
                }
            });
            return false;
        },
        round5:function(x)
        {
            return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
        },
        genId:function(len, chars = "abcdefghjkmnopqrstwxyzABCDEFGHJKMNOPQRSTWXYZ0123456789") {
            let id = "";
            while (len--) {
                id += chars[Math.random() * chars.length | 0];
            }
            return id;  
        },
        debounce:function(func, delay) { 
            let debounceTimer;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(context, args), delay);
            }
        }
    }   

}());