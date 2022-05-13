// Edge case where number of bins and contents of bins are different between
// v3 and v6
const data = d3.range(-10, 100);
const hist = d3.bin();
hist.domain([-20, 50]);
hist.thresholds([1, 10, 30]); // data below and over threshold
console.log(hist(data));

// results with incl start, excl end
[
    [-10, 1],
    [2, 10],
    [11, 30],
    [31, 100],
]

const toV3Bins = (v6Bins) => {
    
};