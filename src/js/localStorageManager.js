//localStorageManager
module.exports = (function(){

    var storage = window.localStorage;
    var USERINFO_KEY = "tdo_";

    function setTodoInfo(value){
        storage.setItem(USERINFO_KEY, JSON.stringify(value));
    }

    function getTodoInfo(){
        return storage.getItem(USERINFO_KEY) ? JSON.parse(storage.getItem(USERINFO_KEY)) : null;
    }

    return{
        setTodoInfo: setTodoInfo,
        getTodoInfo: getTodoInfo
    }

}());