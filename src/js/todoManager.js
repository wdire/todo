//todoManager
module.exports = (function(){

    const APP = document.querySelector(".todo-app");
    if(!APP) { alert("Error! App not found."); return; };
    const APP_BODY = APP.querySelector(".todo-body");
    const APP_FOOTER = APP.querySelector(".footer");
    const APP_DETAILS = APP.querySelector(".todo-details");

    const APP_DETAILS_ELMS = {
        date:document.querySelector("#datepicker"),
        hour:document.querySelector("#time_hour"),
        minute:document.querySelector("#time_minute")
    }

    let currentOpenedItem = null;
    let currentOpenedItemObject = null;
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
        todoItemCloseTags: '</div><div class="todo-item_details"><i class="icon-info"></i></div></div>'
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
        let id = details.id || helper.genId(6);
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

        if(details.endtime && helper.isDatePassed(details.endtime)){
            item.querySelector(".todo-item_time").classList.add("passed");
        }

        if(!details.init){
            allItems.push(
                {
                    id:id,
                    contentText:text,
                    completed:details.completed || false,
                    endtime:details.endtime || null
                }
            );
        }

        currentTodoInfo.items = allItems;

        APP_BODY.appendChild(item);
        let textItem = item.querySelector(".todo-item_text");
        if(details.new)
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
        addItem("", {new:true});
    }

    function dateCheckboxHandler(){
        if(this.checked){
            APP_DETAILS.querySelector(".todo-details_selectdate").classList.add("active");
            detailsDateCheckbox = true;
        }else{
            APP_DETAILS.querySelector(".todo-details_selectdate").classList.remove("active");
            detailsDateCheckbox = false;
        }
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
        let minute = String(helper.round5(defaultDate.getMinutes()));

        helper.selectInOptions(APP_DETAILS_ELMS.hour, hour);
        helper.selectInOptions(APP_DETAILS_ELMS.minute, minute);

        $(APP_DETAILS_ELMS.date).datepicker( {
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
        currentOpenedItemObject = item;

        if(item.endtime){
            let dateSplit = item.endtime.split(" ");

            APP_DETAILS_ELMS.date.value = dateSplit[0];
            APP_DETAILS_ELMS.hour.value = dateSplit[1].split(":")[0];
            APP_DETAILS_ELMS.minute.value = dateSplit[1].split(":")[1];
        }

        APP_DETAILS.querySelector(".cb-contanier input").checked = Boolean(item.endtime);
        dateCheckboxHandler.apply(APP_DETAILS.querySelector(".cb-contanier input"));
    }

    function closeDetailsPopup(){
        currentOpenedItem.classList.remove("active");
        APP_DETAILS.classList.remove("active");
        currentOpenedItem = null;
        currentOpenedItemObject = null;
        detailsPopupActive = false;
    }

    function saveAllItemsToStorage(){
        storage.setTodoInfo(allItems);
    }

    function initItems(){
        allItems = storage.getTodoInfo() || [];
        if(allItems[0] && allItems[0].id){
            allItems.forEach(e => {
                addItem(e.contentText, {
                    id:e.id || null,
                    endtime: e.endtime || null,
                    completed: e.completed || null,
                    init:true
                });
            });
        }
    }

    return {
        init:function(){

            initItems();

            document.addEventListener("click", function(e){
                let elm = e.target;
                if(elm === APP_FOOTER || APP_FOOTER.contains(elm)){
                    newTaskHandler();
                    return;
                }

                if(detailsPopupActive && !APP_DETAILS.contains(elm) && !$(APP_DETAILS_ELMS.date).datepicker( "widget" ).is(":visible")){
                    closeDetailsPopup();
                    return;
                }

                if(elm.classList.contains("icon-info")){
                    openDetailsPopup(elm);
                    return;
                }

                if(elm.id === "todo-details_done"){
                    let itemTimeElm = currentOpenedItem.querySelector(".todo-item_time");
                    if(detailsDateCheckbox){
                        let date = APP_DETAILS_ELMS.date.value;
                        let hour = APP_DETAILS_ELMS.hour.options[APP_DETAILS_ELMS.hour.options.selectedIndex].value;
                        let minute = APP_DETAILS_ELMS.minute.options[APP_DETAILS_ELMS.minute.options.selectedIndex].value;

                        let endtime = date + " " +hour + ":" + minute;
                        
                        if(itemTimeElm){
                            itemTimeElm.innerText = endtime;
                        }else{
                            let timeElm = helper.createElementFromString(templates.todoItemTimeStart + helper.formatDateYearToTwo(endtime) + templates.todoItemTimeCloseTags);
                            currentOpenedItem.querySelector(".todo-item_wrap").appendChild(timeElm);
                        }

                        if(helper.isDatePassed(endtime)){
                            currentOpenedItem.querySelector(".todo-item_time").classList.add("passed");
                        }else{
                            currentOpenedItem.querySelector(".todo-item_time").classList.remove("passed");
                        }

                        currentOpenedItemObject.endtime = endtime;
                    }else{
                        if(itemTimeElm){
                            itemTimeElm.remove();
                        }
                        currentOpenedItemObject.endtime = null;
                    }
                    closeDetailsPopup();
                    saveAllItemsToStorage();
                }
            });

            APP_DETAILS.querySelector(".cb-contanier input").addEventListener("input", function(){
                dateCheckboxHandler.apply(this);
            });

            document.addEventListener("keyup", function(e){
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

            document.addEventListener("keyup", helper.debounce(function(e){
                let elm = e.target;
                if(elm && elm.classList.contains("todo-item_text")){
                    saveAllItemsToStorage();
                    console.log("saved");
                }
            },600));

            /* if(currentFocusItem && currentFocusItem.innerText.trim().length === 0){
                removeItemByItemText(currentFocusItem);
            } */

            setUpDate();
        }
    }

}());