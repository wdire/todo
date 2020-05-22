//todoManager
module.exports = (function(){

    const APP = document.querySelector(".todo-app");
    if(!APP) { alert("Error! App not found."); return; };
    const APP_BODY = APP.querySelector(".todo-body");
    const APP_FOOTER = APP.querySelector(".footer");
    const APP_DETAILS = APP.querySelector(".todo-details");

    const APP_DATETIME_ELMS = {
        date:document.querySelector("#datepicker"),
        hour:document.querySelector("#time_hour"),
        minute:document.querySelector("#time_minute")
    }

    let currentOpenedItem = null;
    let detailsPopupActive = false;
    let detailsDateCheckbox = false;

    let allItems = [];

    let currentTodoInfo = {
        items:[]
    };

    const storage = require("./localStorageManager");

    require("webpack-jquery-ui/css");
    require("webpack-jquery-ui/datepicker");

    let templates = {
        todoItemStart: '<div class="todo-item"><label class="todo-item_left"><input type="checkbox"><div class="todo-item_left_checkbox"></div></label><div class="todo-item_body"><div class="todo-item_wrap"><div class="todo-item_text" spellcheck="false" contenteditable="true">',
        todoItemStartCloseTags:'</div>',
        todoItemTimeStart: '<div class="todo-item_time">',
        todoItemTimeCloseTags: '</div>',
        todoItemCloseTags: '</div><div class="todo-item_details"><i class="icon-info"></i></div></div></div>'
    }

    const helper = require("./helper");

    /*
    ------ MAKE YOUR OWN ITEM BURGER ------
               _____________
           _.-", ,' .', ,' .',' .'' "-._    
         . , .  ,  . ` .  . `  . `, .` , .    
        .`______________________________'.   

        - templates.todoItemStart        + 
        - (Your todo item text here)     +
        - todoItemStartCloseTags         +
        - [if time is specified
            todoItemTimeStart                +
            (Your todo item time here)  +
            todoItemTimeCloseTags       ]
        - todoItemCloseTags
         `_______________________________'

        And finally EAT IT!
    */

    /**
     * @param {String} text Text of todo item
     * @param {Array} details Array contains details
     * @param {String} details.endtime Ending time(Day/Month/Year Hour:Minute) of this item, default null
     * @param {Boolean} details.completed Completed true or false, default false
     */
    function addItem(text = "", details = []){
        let id = helper.genId(6);
        let item = "";

        item = templates.todoItemStart + text + templates.todoItemStartCloseTags;
        if(details && details.endtime){
            item += templates.todoItemTimeStart;
            item += details.endtime;
            item += templates.todoItemTimeCloseTags;
        }
        item += templates.todoItemCloseTags;
        
        item = helper.createElementFromString(item);

        item.setAttribute("data-id",id);
        
        allItems.push(
            {
                id:id,
                contentText:text,
                completed:details.completed || false,
                endTime:details.endtime || null
            }
        );

        currentTodoInfo.items = allItems;

        APP_BODY.appendChild(item);
        let textItem = item.querySelector(".todo-item_text");
        helper.setFocus(textItem, textItem.innerText.length);
    }

    function removeItemByItemText(elm){
        let item = helper.findParentByClassName(elm, "todo-item");
        let k = findInAllItems(item.getAttribute("data-id"));
        let index = allItems.indexOf(k);
        console.log(index);
        if(index < 0){
            alert("Error");
            console.log("Error");
            return;
        }
        allItems.splice(index, 1);
        helper.findParentByClassName(elm, "todo-item").remove();
    }

    function newTaskHandler(){
        for(let txts = document.querySelectorAll(".todo-item_text"),i = txts.length - 1; i >= 0;i--){
            if(!txts[i].innerText){
                helper.setFocus(txts[i], txts[i].innerText.length);
                return;
            }
        };
        addItem();
    }

    function findInAllItems(searchId){
        for(let i = 0; i < allItems.length;i++){
            let item = allItems[i];
            if(item && item.id && item.id === searchId){
                return item;
            }
        }
        return false;
    }

    function setUpDate(){
        let defaultDate = new Date();
        let timeAfterNow = 1000 * 60 * 60 * 2;
        defaultDate.setTime(defaultDate.getTime() + timeAfterNow);

        let hour = String(defaultDate.getHours());
        hour = hour.length === 1 ? "0" + hour : hour;
        let minute = String(helper.round5(defaultDate.getMinutes()));
        minute = minute.length === 1 ? "0" + minute : minute;

        helper.selectInOptions(APP_DATETIME_ELMS.hour, hour);
        helper.selectInOptions(APP_DATETIME_ELMS.minute, minute);

        $(APP_DATETIME_ELMS.date).datepicker( {
            dateFormat:"dd/mm/yy",
            showOtherMonths: true,
            selectOtherMonths: true,
            showButtonPanel: true
        }).datepicker("setDate", defaultDate);
    }

    function openDetailsPopup(icon_infoElm){
        let find = helper.findParentByClassName(icon_infoElm, "todo-item");
        if(!find) return;
        find.classList.add("active");
        APP_DETAILS.classList.remove("death");
        APP_DETAILS.classList.add("active");
        currentOpenedItem = find;
        detailsPopupActive = true;

        let item = findInAllItems(find.getAttribute("data-id"));
        APP_DETAILS.querySelector(".todo-details_selectdate").checked = Boolean(item.endDate);
    }

    function closeDetailsPopup(){
        currentOpenedItem.classList.remove("active");
        APP_DETAILS.classList.remove("active");
        currentOpenedItem = null;
        detailsPopupActive = false;
    }

    return {
        init:function(){
            document.addEventListener("click", function(e){
                let elm = e.target;
                if(elm === APP_FOOTER || APP_FOOTER.contains(elm)){
                    newTaskHandler();
                    return;
                }

                if(detailsPopupActive && !APP_DETAILS.contains(elm) && !$(APP_DATETIME_ELMS.date).datepicker( "widget" ).is(":visible")){
                    closeDetailsPopup();
                    return;
                }

                if(elm.classList.contains("icon-info")){
                    openDetailsPopup(elm);
                    return;
                }

                if(elm.id === "todo-details_done"){
                    if(detailsDateCheckbox){
                        let date = APP_DATETIME_ELMS.date.value;
                        let hour = APP_DATETIME_ELMS.hour.options[APP_DATETIME_ELMS.hour.options.selectedIndex].value;
                        let minute = APP_DATETIME_ELMS.minute.options[APP_DATETIME_ELMS.minute.options.selectedIndex].value;

                        let endTime = date + " " +hour + ":" + minute;
                        console.log(endTime);
                    }
                }
            });

            APP_DETAILS.querySelector(".cb-contanier input").addEventListener("change", function(){
                if(this.checked){
                    APP_DETAILS.querySelector(".todo-details_selectdate").classList.add("active");
                    detailsDateCheckbox = true;
                }else{
                    APP_DETAILS.querySelector(".todo-details_selectdate").classList.remove("active");
                    detailsDateCheckbox = false;
                }
            });

            document.addEventListener("keydown", function(e){
                let elm = e.target;
                if(elm && elm.classList.contains("todo-item_text")){
                    if(e.keyCode === 8 && elm.innerText.length === 0){
                        removeItemByItemText(elm);
                        return;
                    }
                    let item = helper.findParentByClassName(elm, "todo-item");
                    findInAllItems(item.getAttribute("data-id")).contentText = elm.innerText;
                }
            });

            setInterval(function(){
                console.log(allItems);
            },10 * 1000);

            /* if(currentFocusItem && currentFocusItem.innerText.trim().length === 0){
                removeItemByItemText(currentFocusItem);
            } */

            setUpDate();
        }
    }

}());