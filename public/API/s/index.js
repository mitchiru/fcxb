/*
var dData = function() {
    return Math.round(Math.random() * 90) + 10
};

var barChartData = {
    labels: ["dD 1", "dD 2", "dD 3", "dD 4", "dD 5", "dD 6", "dD 7", "dD 8", "dD 9", "dD 10"],
    datasets: [{
        fillColor: "rgba(0,60,100,1)",
        strokeColor: "black",
        data: [dData(), dData(), dData(), dData(), dData(), dData(), dData(), dData(), dData(), dData()]
    }]
}

var index = 11;
var ctx = document.getElementById("canvas").getContext("2d");
var barChartDemo = new Chart(ctx).Bar(barChartData, {
    responsive: true,
    barValueSpacing: 2
});
setInterval(function() {
    barChartDemo.removeData();
    barChartDemo.addData([dData()], "dD " + index);
    index++;
}, 3000);


 NEW */

var randomScalingFactor = function() {
    return Math.round(Math.random() * 100);
};
var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};
var randomColor = function(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
};


window.onload = function() {
    $.ajax({
        dataType: "json",
        url: 'http://api.fcxb.de/statistics'
    }).done(function(ret) {

        $.each(ret, function( key, value ) {

            var graph = key;
            var datadata = [];
            var databg = [];
            var datalabels = [];

            var i = 1;
            $.each( value, function( keyp, valuep ) {
                datadata.push(valuep.anzahl);
                databg.push(randomColor(0.5));
                datalabels.push(i+'. '+ valuep.user.toUpperCase());

                i ++ ;
            });

/*
            var config = {
                data: {
                    datasets: [{
                        data: datadata,
                        backgroundColor: databg,
                        label: 'My dataset' // for legend
                    }],
                    labels: datalabels
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: graph
                    },
                    scale: {
                        ticks: {
                            beginAtZero: true
                        },
                        reverse: false
                    },
                    animation: {
                        animateRotate: false,
                        animateScale: true
                    }
                }
            };

            $('body').append('<canvas id="'+graph+'"></canvas>');

            ctx = $('#'+graph);
            window.myPolarArea = Chart.PolarArea(ctx, config);

 */




            var data = {
                labels: datalabels,
                datasets: [
                    {
                        label: graph,
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(255,99,132,0.4)",
                        hoverBorderColor: "rgba(255,99,132,1)",
                        data: datadata,
                    }
                ]
            };

            var options = {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            };

            $('body').append('<canvas id="'+graph+'"></canvas>');
            ctx = $('#'+graph);

            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options
            });
        });


    });
};

$('#randomizeData').click(function() {
    $.each(config.data.datasets, function(i, piece) {
        $.each(piece.data, function(j, value) {
            config.data.datasets[i].data[j] = randomScalingFactor();
            config.data.datasets[i].backgroundColor[j] = randomColor();
        });
    });
    window.myPolarArea.update();
});

$('#addData').click(function() {
    if (config.data.datasets.length > 0) {
        config.data.labels.push('dataset #' + config.data.labels.length);

        $.each(config.data.datasets, function(i, dataset) {
            dataset.backgroundColor.push(randomColor());
            dataset.data.push(randomScalingFactor());
        });

        window.myPolarArea.update();
    }
});

$('#removeData').click(function() {
    config.data.labels.pop(); // remove the label first

    $.each(config.data.datasets, function(i, dataset) {
        dataset.backgroundColor.pop();
        dataset.data.pop();
    });

    window.myPolarArea.update();
});