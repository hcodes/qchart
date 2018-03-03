var q = new QChart('#qchart', {
    scale: 1
});

q.setData({
    series: [
        {
            data: window.series1.prices
        }
    ]
});
