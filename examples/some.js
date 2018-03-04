var q = new QChart('#qchart', {
    scale: 1,
    middleLineColor: '#333',
    dateFormater: function(timestamp) {
        var date = new Date(timestamp);

        return [
            date.getDate(),
            {
                0: 'января',
                1: 'февраля',
                2: 'марта',
                3: 'апреля',
                4: 'мая',
                5: 'июня',
                6: 'июля',
                7: 'августа',
                8: 'сентября',
                9: 'октября',
                10: 'ноября',
                11: 'декабря'
            }[date.getMonth()],
            date.getFullYear(),
            ' г., ' + [
                'пн',
                'вт',
                'ср',
                'чт',
                'пт',
                'сб',
                'вс'
            ][date.getDay()]
        ].join(' ');
    },
    valueFormater: function(val) {
        return (val.toFixed(2) + ' $').replace(/\./, ',');
    }
});

q.setData({
    series: [
        {
            data: window.series1.prices.map(function(item) {
                return item;
            })
        },
        {
            data: window.series1.prices.map(function(item) {
                return [item[0], item[1] + 5];
            })
        },
        {
            data: window.series1.prices.map(function(item) {
                return [item[0], item[1] + 10];
            })
        }
    ]
});
