/* original data */
var data = [
    [1, 2, 3],
    [true, false, null, "sheetjs"],
    ["foo", "bar", "0.3"],
    ["baz", null, "qux"]
]
var ws_name = "SheetJS";

/* require XLSX */
var XLSX = require('xlsx')

/* set up workbook objects -- some of these will not be required in the future */
var wb = {}
wb.Sheets = {};
wb.Props = {};
wb.SSF = {};
wb.SheetNames = [];

/* create worksheet: */
var ws = {}

/* the range object is used to keep track of the range of the sheet */
var range = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };

/* Iterate through each element in the structure */
for (var R = 0; R != data.length; ++R) {
    if (range.e.r < R) range.e.r = R;
    for (var C = 0; C != data[R].length; ++C) {
        if (range.e.c < C) range.e.c = C;

        /* create cell object: .v is the actual data */
        var cell = { v: data[R][C] };
        if (cell.v == null) continue;

        /* create the correct cell reference */
        var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

        /* determine the cell type */
        if (typeof cell.v === 'number') cell.t = 'n';
        else if (typeof cell.v === 'boolean') cell.t = 'b';
        else cell.t = 's';

        /* add to structure */
        ws[cell_ref] = cell;
    }
}
ws['!ref'] = XLSX.utils.encode_range(range);

/* add worksheet to workbook */
wb.SheetNames.push(ws_name);
wb.Sheets[ws_name] = ws;

/* write file */
XLSX.writeFile(wb, 'test.xlsx');