
var dayDisplay = $('#current-day');
var timeDisplay = $('#current-time');
var contentBox = $('#content-box');


function init() {
    addTime();
    renderTimeSlots(9, 17);
    colorTime();
    loadSavedData();
}


function addTime() {
    dayDisplay.text(moment().format('dddd, MMMM Do, YYYY'));
    timeDisplay.text(moment().format('h:mm:ss a'));
    setInterval(function() {
        timeDisplay.text(moment().format('h:mm:ss a'));
    }, 1000);

}

function renderTimeSlots(startTime, endTime) {
    if (startTime > endTime) {
        var errorMsg = $('<h3>');
        errorMsg.addClass('error-msg');
        errorMsg.text("Whoops! Make sure your 'End Time' is later than your 'Start Time'...");
        contentBox.append(errorMsg);
        return;
    }

    for (var i = startTime; i <= endTime; i++ ){
        var timeRow = $('<li>');
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
        timeSlot.attr('data-time', i);
        timeRow.append(timeSlot);

        var saveBtn = $('<div>');
        saveBtn.addClass('saveBtn');
        saveBtn.attr('data-index', (i));
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

// $('#content-box').sortable({
//     start: function(e, ui) {
//         // creates a temporary attribute on the element with the old index
//         $(this).attr('data-previndex', ui.item.index());
//     },
//     update: function(e, ui) {
//         // gets the new and old index then removes the temporary attribute
//         var newIndex = ui.item.index();
//         var oldIndex = $(this).attr('data-previndex');
//         $(this).removeAttr('data-previndex');
//         console.log(newIndex)
//         console.log(oldIndex)
//     }
// });


function saveEvent(element) {

    var index = element.dataset.index;
    var blockList = $('.time-block');
    
    for (var i = 0; i < blockList.length; i++) {
            if (blockList[i].dataset.time == index){
                var saveItem = {
                    [index]: $(blockList[i]).val()
                };
            }
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
    var blockList = $('.time-block');

    if (storedSchedule) {
        Object.entries(storedSchedule).forEach(element => {
            for (var i = 0; i < blockList.length; i++) {

                if (element[0] == blockList[i].dataset.time) {
                    $(blockList[i]).val(element[1]);
                }
            }
        });
    }
}



$('#content-box').on('click', function(event){
    var element = event.target;

    if (element.matches('.saveBtn')) {
        saveEvent(element);
    }
});

$('#set-workday').on('submit',function(event){
    event.preventDefault();

    if ($('#start-ap').is(':checked') && (Number($('#start-time').val()) == 12)) {
        var startTime = 12;
    } else if  ($('#start-ap').is(':checked')) {
        var startTime = (Number($('#start-time').val()) + 12);
    } else if (!$('#start-ap').is(':checked') && (Number($('#start-time').val()) == 12)) {
        var startTime = 0;  
    } else {
        var startTime = Number($('#start-time').val());
    }

    if ($('#end-ap').is(':checked') && (Number($('#end-time').val()) == 12)) {
        var endTime = 12;
    } else if  ($('#end-ap').is(':checked')) {
        var endTime = (Number($('#end-time').val()) + 12);
    } else if (!$('#end-ap').is(':checked') && (Number($('#end-time').val()) == 12)) {
        var endTime = 24;  
    } else {
        var endTime = Number($('#end-time').val());
    }
 
    contentBox.empty();

    renderTimeSlots(startTime, endTime);
    colorTime();
    loadSavedData();
    document.getElementById('current-day').click();
});

init();