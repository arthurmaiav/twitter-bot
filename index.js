var twit = require(`twit`);

require("dotenv").config();

var query = {
    q: "where can I buy dogecoin?",
    result_type: "recent",
};

var replies = [
    "you can buy it at Binance \n\n" +
    "if you use my referral id (XBZT97U0) you and I will get cashback! :)",

    "at Binance, \n\n" +
    "you can use my referral id on your registration to get 10% of cashback: XBZT97U0, good luck!",

    "buy it at Binance and use my referral id to get cashback on your tradings: XBZT97U0 :D"
]


const Bot = new twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
});

var interval = 10;

function BotInit() {
    Bot.get("search/tweets", query, BotGotLatestTweet);
    function BotGotLatestTweet(error, data, response) {
        if (error || isOld(data.statuses[0].created_at)) {
            console.log("From " + data.statuses[0].user.screen_name);
        } else {
            var tweet = {
                id: data.statuses[0].id_str,
                user: data.statuses[0].user.screen_name
            };
            Reply(tweet);
        }

        function Reply(tweet) {
            var res = {
                status: getMessageReply(tweet.user),
                in_reply_to_status_id: tweet.id
            };

            Bot.post('statuses/update', res,
                function (err, data, response) {
                    if (error) {
                        console.log("Error while trying to reply: " + error);
                    } else {
                        console.log("Successfully replied.");
                    }
                }
            );
        }
    }
}

function isOld(jsonDate) {
    var dateStr = JSON.stringify(jsonDate);
    var date = new Date(dateStr);
    var d1 = new Date(), d2 = new Date(d1);

    d2.setMinutes(d1.getMinutes() - interval);

    if (date > d2) {
        console.log("Tweet is new, replying now...")
        return false
    } else {
        console.log("Tweet already replied...")
        return true;
    }
}

function getMessageReply(user) {
    var index = Math.floor(Math.random() * replies.length);

    var reply = "@" + user + " " + replies[index];

    console.log("Text chosed: " + reply);

    return reply;
}

setInterval(function () { BotInit() }, interval * 60 * 1000);