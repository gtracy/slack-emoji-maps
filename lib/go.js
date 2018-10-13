'use strict';
var fs = require('fs');
var parse = require('csv-parse');
var _ = require('underscore');
var async = require('async');
const Maps = require('./maps')


function mapit(user, emoji_list) {

    try {
        let map = new Maps()
        return map.png(user, emoji_list)
    } catch (error) {
        throw new Error("failed to create map for "+user)
    }

}

// emoji_list = {
//   greg : [],
//   david : []
// }
var emoji_list = {};

var inputFile='./reactions_by_user.csv';
fs.createReadStream(inputFile)
    .pipe(parse({delimeter:',',from:2})) // skip the first (header) line
    .on('data', function(line) {
        let user = line[0]
        if( emoji_list[user] ) {
            // this assumes a sorted list of emoji reactions 
            // (there is no sorting in the below algo)
            //
            if( emoji_list[user].length < 36 ) {
                emoji_list[user].push(line[1])
            }
        } else {
            emoji_list[user] = [line[1]]
        }
    })
    .on('end',function() {
        let user_list = _.keys(emoji_list)
        user_list.forEach(function(user) {
            console.log(user)
            try {
                mapit(user, emoji_list[user])
                // hack-a-lackin... slow shit down because puppeteer doesn't like
                // to do too much work at once.
                setTimeout(function(){},1000)
            } catch (error) {
                console.dir('Error processing user')
            }
        });
    });

