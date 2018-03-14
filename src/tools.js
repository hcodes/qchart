export function getMinMax(arr, from, to) {
    let min, max;
    min = max = arr[from][1];

    for (let i = from; i < to; i++) {
        min = Math.min(min, arr[i][1]);
        max = Math.max(max, arr[i][1]);
    }

    return { min, max };
}

export function getMinMaxForSomeSeries(series, from, to) {
    const firstMinMax = getMinMax(series[0].data, from, to);
    let
        min = firstMinMax.min,
        max = firstMinMax.max;

    if (series.length > 1) {
        for (let i = 0; i < series.length; i++) {
            let minMax = getMinMax(series[i].data, from, to);
            min = Math.min(minMax.min, min);
            max = Math.max(minMax.max, max);
        }
    }

    return { min, max };
}

export function inRange(x11, x12, x21, x22) {
    return (x11 > x21 && x11 < x22) || (x12 > x21 && x12 < x22);
}
