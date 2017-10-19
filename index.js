var Nightmare = require('nightmare'),
    vo = require('vo');
var nightmare = Nightmare({
    show: true,
    fullscreen: true,
    executionTimeout: 60000,
    gotoTimeout: 30000,
    waitTimeout: 60000
});

var run = function*() {
    var urls = ['http://www.yahoo.com', 'http://example.com', 'http://w3c.org', 'http://www.yahoo.com', 'http://example.com', 'http://w3c.org', 'http://www.yahoo.com', 'http://example.com', 'http://w3c.org'];
    var resultLists = [];
    var fieldName = ['SKU', 'Product Name', 'Color', 'Size', 'Quantity', 'Lg Image URL', 'Sm Image 1', 'Sm Image 2'];
    resultLists.push(fieldName);
    var SKUList = [];
    var productNameList = [];
    var colorList = [];
    var imageUrlList = [];

    var colorNum = 0;
    yield nightmare
        .goto('https://www.nike.net')
        .wait('#net-login-form')
        .type('form[action="login"] [name=username]', 'upworktesting113@gmail.com')
        .type('form[action="login"] [name=password]', 'Upworktest2017#')
        .click('form[action="login"] [type=submit]')
        //end login
        //click atOnce
        .wait('.prtl-clickable')
        .click('a[class="prtl-clickable"]')
        .wait('#PRTL_LNK_ATON')
        .click('#PRTL_LNK_ATON')
        //In Atonce page
        .wait('.tab.tab-1.ng-binding')
        .click('.tab.tab-1.ng-binding')
        .wait('.tab.tab-0.ng-binding')
        .click('.tab.tab-0.ng-binding')
        .wait('.product-grid-item-wrapper.ng-scope.gridout')
        .evaluate(() => {
            var t = document.getElementsByClassName('product-grid-item-wrapper ng-scope gridout')[0]
            t.getElementsByTagName('div')[0].click();
        })
        .wait('ul[class="colorways-list-items fc"] [class="ng-scope fl"]')
        .wait('.editable-grid.ng-isolate-scope')
        .evaluate(() => {
            var t = document.getElementsByClassName('colorways-list-items fc')[0];
        })
        .wait(1000);

    colorNum = yield nightmare
        .evaluate(() => {
            var t = document.getElementsByClassName('colorways-list-items fc')[0];
            return t.getElementsByTagName('li').length;
        });

    for (var i = 0; i < colorNum; i++) {
        yield nightmare
            .evaluate((i) => {
                var t = document.getElementsByClassName('colorways-list-items fc')[0];
                t.getElementsByTagName('li')[i].click();
            }, i)
            .wait('.editable-grid.ng-isolate-scope')
            .wait('.main-product-image')
            .wait('.grid-info')
            .wait('.editable-grid-table')
            // .wait('.editable-grid-row ng-scope')
            // .wait('.grid-cell.ng-scope.cell-header')
            .wait(2000);
        var sku = yield nightmare
            .evaluate(() => {
                return document.getElementsByClassName('pd-styleColorCode ng-binding')[0].innerText;
            });
        var productName = yield nightmare
            .evaluate(() => {
                return document.getElementsByClassName('pd-name ng-binding')[0].innerText;
            });
        var color = yield nightmare
            .evaluate(() => {
                return document.getElementsByClassName('pd-color ng-binding')[1].innerText;
            });
        var imageUrl = yield nightmare
            .evaluate(() => {
                return document.getElementsByClassName('ui-520-520-img ng-scope')[0].src;
            });

        var priceTableJson = yield nightmare
            .evaluate(() => {
                var tmpResList = [];
                var tmpPriceList = [];
                var tmpFieldList = [];

                var t = document.getElementsByClassName('editable-grid-table')[1];

                var fieldNameDom = t.getElementsByClassName('editable-grid-row ng-scope')[0];
                var priceValueDom = t.getElementsByClassName('editable-grid-row ng-scope')[1];

                var fieldNameDomList = fieldNameDom.getElementsByClassName('grid-cell ng-scope cell-header');
                var priceValueDomList = priceValueDom.getElementsByTagName('div');

                for (var k = 0; k < fieldNameDomList.length; k++) {
                    // fieldNameDomList[0].innerText;
                    if (priceValueDomList[k].className.indexOf('-available') > 0) {
                        if ((priceValueDomList[k].innerText != undefined) && (fieldNameDomList[k].innerText != undefined)) {
                            tmpPriceList.push(priceValueDomList[k].innerText);
                            tmpFieldList.push(fieldNameDomList[k].innerText);
                        }
                    }
                }
                tmpResList.push(tmpPriceList);
                tmpResList.push(tmpFieldList);
                return tmpResList;
            });



        for (var j = 0; j < priceTableJson[0].length; j++) {
            var tmpList = [];
            tmpList.push(sku);
            tmpList.push(productName);
            tmpList.push(color);
            tmpList.push(priceTableJson[1][j]);
            tmpList.push(priceTableJson[0][j]);
            tmpList.push(imageUrl);
            resultLists.push(tmpList);
        }
        // tmpList.push(sku);
        // tmpList.push(productName);
        // tmpList.push(color);
        // tmpList.push(priceTableJson[1][0]);
        // tmpList.push(priceTableJson[0][0]);
        // tmpList.push(imageUrl);
        // resultLists.push(tmpList);
    }

    var data = resultLists;

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
    return data;
}

vo(run)(function(err, titles) {
    console.dir(titles);
});