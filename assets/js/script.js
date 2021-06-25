// WORK DAY SCHEDULER by Robert Perez //

var dayDisplay = $('#current-day');
var timeDisplay = $('#current-time');
var contentBox = $('#content-box');

// default time for 9:00am to 5:00pm //
var startTime = 9;
var endTime = 17;

function init() {
    addTime();
    renderTimeSlots(startTime, endTime);
    colorTime();
    loadSavedData();
    var myModal = new bootstrap.Modal($('#instructions'));
    myModal.toggle();
}
init();


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
        errorMsg.text("Whoops! Make sure your 'END TIME' is LATER THAN your 'START TIME'...");
        contentBox.append(errorMsg);
        return;
    }

    for (var i = startTime; i <= endTime; i++ ){
        var timeRow = $('<li>');
        timeRow.addClass('row');

        var hourBox = $('<div>');
        hourBox.addClass('hour');
        if (i == 0){
            hourBox.text("12:00 AM");
        } else if (i < 12) {
            hourBox.text(i + ":00 AM");
        } else if (i == 12) {
            hourBox.text(i + ':00 PM');  
        } else if (i == 24) {
            hourBox.text('12:00 AM');  
        } else if (i > 12) {
            hourBox.text((i - 12) + ':00 PM');
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

//  time from moment.js in 24-hr format and compared in the switch block  //
//  to each text-area's unique data attribute. Lines 92 & 93 added as a    //
//  workaround so midnight is colored correctly whether at top or bottom  // 
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
    if (rightNow == 24 && textBlocks[0].dataset.time == 0) {
        $(textBlocks[0]).addClass('present');
    }
}


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

//  using jQueryUI to make the list of time-slots sortable, however, the default    //
//  functionality shifts all the list items between the old and new locations       //
//  after an element is moved. The following ~60 lines take care of reorganizing    //
//  the shifted elements to give the overall effect of the moved element switching  //
//  places with the target element, while preserving the correct order of time      //
//  among the '.hour' elements.
$('#content-box').sortable({
    start: function(event, ui) {
        // creates a temporary attribute on the element with the old index //
        $(event.target).attr('data-previndex', ui.item.index());

        // creates a list of all the text-area contents before any elements have moved,  //
        // intentionally scoped 'startOrder' globally to access it in the function below //
        startOrder = [];
        var startList = $('.time-block');
        startList.each(function() {
            startOrder.push($(this).val());
        });
    },
    update: function(event, ui) {
        // gets the new and old index then removes the temporary attribute //
        var newIndex = ui.item.index();
        var oldIndex = $(event.target).attr('data-previndex');
        $(event.target).removeAttr('data-previndex');
        
        // resets all the time indicators to their correct order
        var hourList = $('.hour');
        var counter = startTime;
        hourList.each(function() {
            if (counter == 0){
                $(this).text("12:00 AM")
            } else if (counter < 12) {
                $(this).text(counter + ":00 AM");
            } else if (counter == 12) {
                $(this).text(counter + ':00 PM');
            } else if (counter == 24) {
                $(this).text('12:00 AM');
            } else if (counter > 12) {
                $(this).text((counter - 12) + ':00 PM');
            }
            counter++;
        });

        // reassigns the values of the two swapped elements, and by doing   //
        // this in the 'startOrder' array declared above the order original //
        // order of the list is preserved except for the targeted elements  //
        var firstValue = startOrder[oldIndex];
        var secondValue = startOrder[newIndex];
        startOrder[newIndex] = firstValue;
        startOrder[oldIndex] = secondValue;


        // reassigns values to text-areas and removes their classes (which   //
        // determine their time-based color coding), then adds updated class //
        var counter = startTime;
        var endList = $('.time-block');
        for (var i = 0; i < endList.length; i++) {
            $(endList[i]).val(startOrder[i]);
            endList[i].dataset.time = counter;
            $(endList[i]).removeClass();
            $(endList[i]).addClass('time-block');
            counter++;
        }
        colorTime();

        // reassigns indices to the save buttons so they correspond with the //
        // correct text-areas, and runs saveEvent() for each to record the  //
        // results of the swapped elements  //
        var counter = startTime;
        var saveList = $('.saveBtn');
        saveList.each(function() {
            this.dataset.index = counter;
            saveEvent(this);
            counter++;
        });
    }
});


$('#content-box').on('click', function(event){
    var element = event.target;

    if (element.matches('.saveBtn')) {
        saveEvent(element);
    }
});


// these conditionals are used to essentially convert the 12-hour AM/PM format //
// of the 'Set Workday Hours' controls into a 24-hour format for rendering   //
$('#set-workday').on('submit',function(event){
    event.preventDefault();

    if ($('#start-ap').is(':checked') && (Number($('#start-time').val()) == 12)) {
        startTime = 12;
    } else if  ($('#start-ap').is(':checked')) {
        startTime = (Number($('#start-time').val()) + 12);
    } else if (!$('#start-ap').is(':checked') && (Number($('#start-time').val()) == 12)) {
        startTime = 0;  
    } else {
        startTime = Number($('#start-time').val());
    }

    if ($('#end-ap').is(':checked') && (Number($('#end-time').val()) == 12)) {
        endTime = 12;
    } else if  ($('#end-ap').is(':checked')) {
        endTime = (Number($('#end-time').val()) + 12);
    } else if (!$('#end-ap').is(':checked') && (Number($('#end-time').val()) == 12)) {
        endTime = 24;  
    } else {
        endTime = Number($('#end-time').val());
    }
 
    contentBox.empty();

    renderTimeSlots(startTime, endTime);
    colorTime();
    loadSavedData();
    document.getElementById('current-day').click();
});