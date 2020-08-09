$(function() {
    tick();
    setInterval(tick, 100);
});

var launchTime = moment([2020, 6, 30, 11, 50]);
var arrivalTime = moment([2021, 1, 18, 9]);
var tcms = [
    {
        'id': 'tcm1',
        'description': 'Fine-tune the flight path',
        'time': moment([2020, 7, 14]),
    },
    {
        'id': 'tcm2',
        'description': 'Fine-tune the flight path',
        'time': moment([2020, 8, 28]),
    },
    {
        'id': 'tcm3',
        'description': 'Confirm speed and direction',
        'time': moment([2020, 11, 20]),
    },
    {
        'id': 'tcm4',
        'description': 'Refine flight path',
        'time': moment([2021, 1, 10]),
    },
    {
        'id': 'tcm5',
        'description': 'Refine flight path',
        'time': moment([2021, 1, 16]),
    },
    {
        'id': 'tcm5x',
        'description': 'Backup maneuver, if needed',
        'time': moment([2021, 1, 17]),
    },
    {
        'id': 'tcm6',
        'description': 'Contingency maneuver, if needed',
        'time': moment([2021, 1, 18]),
    }
];


// Good for testing:
// var launchTime = moment().subtract(2, 'seconds');
// var arrivalTime = moment().add(90, 'seconds');
// var tcmCount = 0;
// for (let tcm of tcms) {
//     tcmCount++;
//     tcm.time = arrivalTime.clone().subtract(90 - (tcmCount * 10), 'seconds');
// }
 
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

    var totalDurationString = '<h2>Total duration</h2><p>' + durationToString(totalDuration) + '</p>';
    var remainingDurationString = '<h2>Arriving on Mars</h2><p>' + durationToString(remainingDuration) + '</p>';
    var elapsedDurationString = '<h2>Time since launch</h2><p>' + durationToString(elapsedDuration) + '</p>';

    $('#total').html(totalDurationString);
    $('#remaining').html(remainingDurationString);
    $('#elapsed').html(elapsedDurationString);

    var highlightTcm = false;

    if (currentTime.format('s') <= 12) {
        $('#total').hide();
        $('#remaining').hide();
        $('#tcm').hide()
        $('#elapsed').show();
    } else if (currentTime.format('s') <= 24) {
        $('#total').hide();
        $('#remaining').show();
        $('#tcm').hide()
        $('#elapsed').hide();
    } else if (currentTime.format('s') <= 36) {
        highlightTcm = true;
        $('#total').hide();
        $('#remaining').hide();
        $('#tcm').show()
        $('#elapsed').hide();
    } else {
        $('#total').show();
        $('#remaining').hide();
        $('#tcm').hide()
        $('#elapsed').hide();
    }

    var totalTimestamp = arrivalTime.unix() - launchTime.unix();
    var nowFromLaunchTimestamp = currentTime.unix() - launchTime.unix();

    var nextTcm = '';
    for (let tcm of tcms) {
        $('#' + tcm.id).css({'opacity': 0.25, 'height': parseInt($('#earth').css('width')) / 20, 'width': parseInt($('#earth').css('width')) / 20 });
        var tcmPercentage = ((tcm.time.unix() - launchTime.unix()) * 100)/totalTimestamp;
        $('#' + tcm.id).css(
            'left', 
            Math.ceil(
                (
                    (
                        flightWidth
                    ) / 100
                ) * tcmPercentage
            ) + parseInt($('#rocket').css('width'))
        );
        if (tcm.time <= currentTime) {
            $('#' + tcm.id).hide();
        } else {
            if (nextTcm === '') {

                nextTcm = '<h2>Next maneuver</h2><p>' + tcm.description + ' in ' + durationToString(moment.duration(tcm.time.diff(currentTime))) + '</p>';
                $('#tcm').html(nextTcm);
                if (highlightTcm) {
                    $('#' + tcm.id).css({'opacity': 1, 'height': parseInt($('#earth').css('width')) / 15, 'width': parseInt($('#earth').css('width')) / 15 });
                }
            }
        }

        if (nextTcm === ''){
            $('#tcm').html('<h2>Next maneuver</h2><p>Entry, Descent, and Landing</p>');
        }
    }



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
