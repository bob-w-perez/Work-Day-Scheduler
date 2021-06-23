
var dayDisplay = $('#current-day');
var timeDisplay = $('#current-time');
var contentBox = $('#content-box');




function init() {
    addTime();
    renderTimeSlots(9, 19)
}


function addTime() {
    dayDisplay.text(moment().format('dddd, MMMM Do, YYYY'));
    setInterval(function() {
        timeDisplay.text(moment().format('h:mm:ss a'));
    }, 1000);

}

function renderTimeSlots(startTime, endTime) {

    for (var i = startTime; i <= endTime; i++ ){
        var timeRow = $('<div>');
        timeRow.addClass('row');

        var hourBox = $('<div>');
        hourBox.addClass('hour');
        if (i < 12) {
            hourBox.text(i + ":00 AM");
        } else if (i > 12) {
            hourBox.text((i - 12) + ':00 PM');
        } else {
            hourBox.text(i + ':00 PM');
        }
        timeRow.append(hourBox);

        var timeSlot = $('<textarea>');
        timeSlot.addClass('time-block');
        // timeSlot.attr('contenteditable', 'true');
        timeSlot.text('TEST');  ///*********************** */
        timeRow.append(timeSlot);

        var saveBtn = $('<div>');
        saveBtn.addClass('saveBtn');
        saveBtn.text('S'); ///***************************** */
        timeRow.append(saveBtn);

        contentBox.append(timeRow);
        console.log(timeRow)

    }

}


function colorTime() {


}


function addText() {


}


function saveEvent() {


}


function loadSavedData() {


}


init();