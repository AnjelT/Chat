const moment = require("moment") //for to show houre and minuts

function formatMessage(username,text){
    return{
        username,
        text,
        time: moment().format("h:mm a")
    }
}

module.exports = formatMessage;