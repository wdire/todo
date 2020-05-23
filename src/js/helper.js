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
        },
        /**
            @param {String} time Day/Month/Year example input: 01/01/2020 19:30
            @return {String} example output: 01/01/20 19:30
        */
        formatDateYearToTwo:function(time){
            time = time.split(" ");
            time[0] = time[0].split("/");
            time[0][time[0].length - 1] = time[0][time[0].length - 1].slice(-2);
            time[0] = time[0].join("/");
            return time.join(" ");
        },
        /**
         * 
         * @param {String} date Date to be checked (this will be dirrectly written in Date class)
         * @return {Boolean} True on given date is in the past, false on future
         */
        isDatePassed:function(date){
            let split = date.split(" ");
            let day = split[0].split("/");
            let hourMinute = split[1].split(":");
            let possiblePastDate = new Date(day[2], day[1]-1, day[0], hourMinute[0], hourMinute[1],0,0);
            return possiblePastDate.getTime() < new Date().getTime();
        }
    }   

}());