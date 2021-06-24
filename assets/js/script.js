
var dayDisplay = $('#current-day');
var timeDisplay = $('#current-time');
var contentBox = $('#content-box');




function init() {
    addTime();
    renderTimeSlots(5, 17);
    colorTime();
    loadSavedData();
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
        timeSlot.addClass('time-block'); // add placeholder
        timeSlot.attr('data-time', i);
        timeRow.append(timeSlot);

        var saveBtn = $('<div>');
        saveBtn.addClass('saveBtn');
        saveBtn.attr('data-index', (i-startTime));
        timeRow.append(saveBtn);

        contentBox.append(timeRow);
    }
}


function colorTime() {
    var textBlocks = $(document).find('textarea');
    var rightNow = Number(moment().format('k'));

    for (var i = 0; i < textBlocks.length; i++){
    
        switch(true){
            case (textBlocks[i].dataset.time < rightNow):
                $(textBlocks[i]).addClass('past');
                break;
            case (textBlocks[i].dataset.time == rightNow):
                $(textBlocks[i]).addClass('present');
                break;
            case (textBlocks[i].dataset.time > rightNow):
                $(textBlocks[i]).addClass('future');
        }
    }
}



function saveEvent(element) {

    var index = element.dataset.index;
    var targetBlock = $('.time-block')[index];
    
    var saveItem = {
        [index]: $(targetBlock).val()
    }

    var storedSchedule = JSON.parse(localStorage.getItem('schedule'));

    if (storedSchedule !== null) {
        storedSchedule = Object.assign(storedSchedule, saveItem);
    } else {
        storedSchedule = saveItem;
    }
    

    localStorage.setItem('schedule', JSON.stringify(storedSchedule));

}



function loadSavedData() {

    var storedSchedule = JSON.parse(localStorage.getItem('schedule'));

    Object.entries(storedSchedule).forEach(element => {
        var targetBlock = $('.time-block')[element[0]];
        $(targetBlock).val(element[1]);
    });
}

$('#content-box').on('click', function(event){
    var element = event.target;

    if (element.matches('.saveBtn')) {
        saveEvent(element);
    }
});

init();