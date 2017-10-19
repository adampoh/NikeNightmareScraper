var Nightmare = require('nightmare');

var nightmare = Nightmare({
    show: true,
    fullscreen: true,
    executionTimeout: 60000,
    gotoTimeout: 30000,
    waitTimeout: 60000 // in ms
});

var setItemNum = 0;

// function* increaseNum(resData) {
//     var index = 0;
//     while (index < resData)
//         yield index++;
// };

nightmare
    .goto('https://www.nike.net')
    // .type('form[action*="/search"] [name=p]', 'github nightmare')
    // .click('form[action*="/search"] [type=submit]')
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
    .evaluate(() => {
        var t = document.getElementsByClassName('colorways-list-items fc')[0];
        // t.getElementsByTagName('li')[6].click();
        return t.getElementsByTagName('li').length;

        // Array.from(t.getElementsByTagName('li')).forEach((element) => {
        //     element.click();
        // });
        // for (var i = 0; i < t.getElementsByTagName('li').length; i++) {
        //     t.getElementsByTagName('li')[i].click();
        //     nightmare
        //         .wait('.editable-grid ng-isolate-scope')
        //         .evaluate(() => {
        //             return document.getElementsByClassName('pd-styleColorCode ng-binding')[0].innerText;
        //         })
        //         .then((result) => {
        //             return result;
        //             // continue;
        //         })
        // }
    })
    .then(function(result) {
        // return nightmare
        //     .click('.colorways-list-items.fc li:nth-child(3)')

        console.log(result);
        var iterator = increaseNum(result);
        for (var i = 1; i <= result; i++) {
            console.log(iterator.next());
            // nightmare
            //     .click('.colorways-list-items.fc li:nth-child(' + i + ')')
            //     .wait(3000)
            //     .then(() => {
            //         iterator.next();
            //     })

            // .evaluate(() => {
            //     iterator.next();
            // })
        }
    })
    .catch(function(error) {
        console.error('Search failed:', error);
    });