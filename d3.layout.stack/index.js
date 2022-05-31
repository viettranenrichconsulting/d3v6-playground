const data = [
  {
    "name": "apples",
    "values": [
      { "x": 0, "y": 3840 },
      { "x": 1, "y": 1600 },
      { "x": 2, "y": 640 },
      { "x": 3, "y": 320 },
    ]
  },
  {
    "name": "bananas",
    "values": [
      { "x": 0, "y": 1920 },
      { "x": 1, "y": 1440 },
      { "x": 2, "y": 960 },
      { "x": 3, "y": 480 },
    ],
  },
  {
    "name": "cherries",
    "values": [
      { "x": 0, "y": 960 },
      { "x": 1, "y": 960 },
      { "x": 2, "y": 640 },
      { "x": 3, "y": 640 },
    ],
  },
  {
    "name": "dates",
    "values": [
      { "x": 0, "y": 400 },
      { "x": 1, "y": 400 },
      { "x": 2, "y": 400 },
      { "x": 3, "y": 400 },
    ],
  }
];


/**
 * A helper to transform object grouped data for d3v3 stack to a tabular format for d3v6 stack.
 * @param {any[]} data 
 * @param {(d: any) => string} getKey
 * @param {(d: any) => any} getValues
 * @param {(v: any) => number} getY
 * @returns {[[number, number][][], string[]]}
 */
const v3StackDataToV6StackData = (
  data,
  getKey,
  getValues = d => d.values,
  // get the y coordinate or thickness of the value
  getY = v => v.y,
) => {
  const tabularData = [];
  // # of keys = # of layers
  const keys = data.map(getKey);
  // The number of values, every series must have the same number of values
  const valuesLength = Math.min(...data.map(getValues).map(values => values.length))
  for (const i of d3.range(0, valuesLength, 1)) {
    const tabularDatum = {};
    for (let k = 0; k < keys.length; ++k) {
      const key = keys[k]
      const datum = data[k];
      const values = getValues(datum);
      const val = values[i];
      tabularDatum[key] = getY(val);
    }
    tabularData.push(tabularDatum);
  }
  return [tabularData, keys];
};



const [
  tabData,
  tabKeys,
] = v3StackDataToV6StackData(
  data,
  d => d.name,
  d => d.values,
  v => v.y,
);

// need to transform to get here
// tabular format
const transformedData = [
  {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
  {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
  {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
  {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400}
];

// stack result
// [
//   [[   0, 3840], [   0, 1600], [   0,  640], [   0,  320]], // apples
//   [[3840, 5760], [1600, 3040], [ 640, 1600], [ 320,  800]], // bananas
//   [[5760, 6720], [3040, 4000], [1600, 2240], [ 800, 1440]], // cherries
//   [[6720, 7120], [4000, 4400], [2240, 2640], [1440, 1840]], // dates
// ]

/**
 * Mutates the d3v3 stack data using the d3v6 stack output like d3v3 stack.
 * @param {any[]} v3Data
 * @param {[number, number][][]} stacked
 */
const v3StackDataMutate = (
  stacked,
  v3Data,
  getKey,
  getValues = d => d.values,
  out = (v, y0, y) => {
    v.y0= y0;
    v.y = y;
  },
) => {
  const keys = v3Data.map(getKey)
  for (let k = 0; k < keys.length; ++k) {
    const v3Datum = v3Data[k];
    const v3Values = getValues(v3Datum);
    const stackedValues = stacked[k];
    for (let v = 0; v < v3Values.length; ++v) {
      const v3Value = v3Values[v];
      const [y0, y1] = stackedValues[v];
      const y = y1 - y0;
      out(v3Value, y0, y);
    }
  }
};

const stack = d3.stack()
    .keys(tabKeys)
    .order(d3.stackOrderNone);

const stackedData = stack(tabData);
console.log(stackedData);
// v3StackDataMutate(
//   stackedData,
//   data,
//   d => d.name,
//   d => d.values,
// );

// generate object grouped format from stacked
// mutate the original
// console.log(data);