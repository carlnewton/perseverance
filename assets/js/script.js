$(function() {
    tick();
    setInterval(tick, 100);
});

var launchTime = moment([2020, 6, 30, 11, 50]);
var arrivalTime = moment([2021, 1, 18]);

// Good for testing:
// var launchTime = moment().subtract(2, 'seconds');
// var arrivalTime = moment().add(90, 'seconds');
 
window.onresize = function(event) 
{
    tick();
}

function tick()
{
    $('#rocket').css('width', parseInt($('#earth').css('width')) / 1.5);
    var flightWidth = parseInt($('#flightPath').css('width')) 
        - parseInt($('#flightPath').css('padding-left')) 
        - parseInt($('#flightPath').css('padding-right')) 
        - parseInt($('#rocket').css('width'))
    ;

    var currentTime = moment().utc();

    var totalDuration = moment.duration(arrivalTime.diff(launchTime));
    var remainingDuration = moment.duration(arrivalTime.diff(currentTime));
    var elapsedDuration = moment.duration(currentTime.diff(launchTime));
    var arrivedDuration = moment.duration(currentTime.diff(arrivalTime));

    var totalDurationString = 'Total duration: ' + durationToString(totalDuration);
    var remainingDurationString = durationToString(remainingDuration) + ' remaining';
    var elapsedDurationString = 'Launched ' + durationToString(elapsedDuration) + ' ago';

    $('#total').text(totalDurationString);
    $('#remaining').text(remainingDurationString);
    $('#elapsed').text(elapsedDurationString);

    if (currentTime.format('s') <= 20) {
        $('#total').hide();
        $('#remaining').hide();
        $('#elapsed').show();
    }  else if (currentTime.format('s') <= 40) {
        $('#total').hide();
        $('#remaining').show();
        $('#elapsed').hide();
    } else {
        $('#total').show();
        $('#remaining').hide();
        $('#elapsed').hide();
    }

    var totalTimestamp = arrivalTime.unix() - launchTime.unix();
    var nowFromLaunchTimestamp = currentTime.unix() - launchTime.unix();
    var percentageElapsed = (nowFromLaunchTimestamp*100)/totalTimestamp;

    if (percentageElapsed > 100) {
        percentageElapsed = 100;
        $('#remaining').text('Perseverance arrived ' + durationToString(arrivedDuration) + ' ago!');
        $('#rocket').css('transform', 'rotate(-90deg)');
    }
    $('#rocket').css('margin-left', Math.ceil((flightWidth/100)*percentageElapsed));
}

function durationToString(duration)
{
    var durationString = '';
    for (let increment of ['months', 'days', 'hours', 'minutes', 'seconds']) {
        if (duration._data[increment] > 0) {
            displayIncrement = increment;
            if (duration._data[increment] === 1) {
                displayIncrement = increment.slice(0, -1);
            }
            durationString += duration._data[increment] + ' ' + displayIncrement + ', '
        }
    }
    durationString = durationString.trim().slice(0, -1)

    if (durationString === '') {
        durationString = 'no time';
    }

    lastComma = durationString.lastIndexOf(',');
    if (lastComma === -1) {
        return durationString;
    }

    return durationString.substring(0, lastComma) + ' and' + durationString.substring(lastComma + 1);
}
