//todoManager
module.exports = (function(){

    const APP = document.querySelector(".todo-app");
    if(!APP) { alert("Error! App not found."); return; };
    const APP_BODY = APP.querySelector(".todo-body");
    const APP_FOOTER = APP.querySelector(".footer");
    const APP_DETAILS = APP.querySelector(".todo-details");

    let currentItem;
    let detailsPopupActive = true;
    
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
     * @param {String} details.endday Ending day(Day/Month/Year) of this item
     * @param {String} details.endtime Ending time(Hour:Minute) of this item(only available if 'endday' is specified)
     * @
     */
    function addItem(text = "", details = []){
        let item = "";
        item = templates.todoItemStart + text + templates.todoItemStartCloseTags;
        if(details && details.endday){
            item += templates.todoItemTimeStart;
            item += details.endday;
            if(details.endtime){
                item += ", " + details.endtime;
            }
            item += templates.todoItemTimeCloseTags;
        }
        item += templates.todoItemCloseTags;
        
        item = helper.createElementFromString(item);

        APP_BODY.appendChild(item);
        let textItem = item.querySelector(".todo-item_text");
        currentItem = textItem;
        helper.setFocus(textItem, textItem.innerText.length);
    }

    function removeItemByItemText(elm){
        helper.findParentByClassName(elm, "todo-item").remove();
    }

    function newTaskHandler(){
        for(let i = 0,txts = document.querySelectorAll(".todo-item_text"); i < txts.length;i++){
            if(!txts[i].innerText){
                helper.setFocus(txts[i], txts[i].innerText.length);
                currentItem = txts[i];
                return;
            }
        };
        addItem();
    }

    // TODO: On resizing page relocate popup
    function setDetailsPopup(icon_infoElm){
        //helper.findParentByClassName(elm, "todo-item")
        APP_DETAILS.classList.add("active");
        detailsPopupActive = true;
    }

    return {
        addItem:addItem,
        init:function(){
            document.addEventListener("click", function(e){
                let elm = e.target;
                if(elm === APP_FOOTER || APP_FOOTER.contains(elm)) newTaskHandler();
                if(elm.className === "todo-item_text"){
                    if(elm !== currentItem){
                        currentItem = elm;
                    }
                }

                if(detailsPopupActive && !APP_DETAILS.contains(elm)){
                    detailsPopupActive = false;
                }
                if(elm.className === "icon-info"){
                    setDetailsPopup(elm);
                }
            });

            document.addEventListener("focusout", function(e){
                let elm = e.target;
                if(elm.className === "todo-item_text"){
                    if(currentItem && !currentItem.innerText){
                        removeItemByItemText(currentItem);
                    }
                }
            });

            $(function() {
                $("#datepicker").datepicker({
                    dateFormat:"dd/mm/yy",
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    beforeShow:function(textbox, instance){
                        
                    }
                });
            });
        }
    }

}());