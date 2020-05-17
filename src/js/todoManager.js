//todoManager
module.exports = (function(){

    let APP = document.querySelector(".todo-app") || alert("Error! App not found.");
    let APP_BODY = APP.querySelector(".todo-body");

    let templates = {
        todoItemStart: '<div class="todo-item"><label class="todo-item_left"><input type="checkbox"><div class="todo-item_left_checkbox"></div></label><div class="todo-item_body"><div class="todo-item_wrap"><div class="todo-item_text" spellcheck="false" contenteditable="true">',
        todoItemStartCloseTags:'</div>',
        todoItemTimeStart: '<div class="todo-item_time">',
        todoItemTimeCloseTags: '</div>',
        todoItemCloseTags: '</div><div class="todo-item_details"><i class="icon-info"></i></div></div></div>'
    }

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
     */
    function addItem(text = "", details = []){
        let item = "";
        item += templates.todoItemStart;
        item += text;
        item += templates.todoItemStartCloseTags
        if(details && details.endday){
            item += templates.todoItemTimeStart;
            item += deatails.endday;
            if(details.endtime){
                item += ", " + details.endtime;
            }
            item += templates.todoItemTimeCloseTags;
        }
        item += templates.todoItemCloseTags;

        APP_BODY.innerHTML += item;
    }

    return {
        addItem:addItem
    }

}());