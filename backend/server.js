const express = require('express')
const router = express.Router()
const app = express()
const port = 3000
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.json());


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


let channelData = [];
let vtuberData = [];
let affiliationData = [];
let subgroupData = [];




var db = new sqlite3.Database("ttt.db", (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the vtuber database.');
});



db.serialize(function() {

    channelData = [];
    db.each("SELECT * FROM Channels", function (err, row) {


        channelData.push(row);
    });

});

db.serialize(function() {

    subgroupData = [];
    db.each("SELECT * FROM Subgroup", function (err, row) {

        subgroupData.push(row);
    });

});

db.serialize(function() {

    vtuberData = [];
    db.each("SELECT * FROM VTuber", function (err, row) {

        vtuberData.push(row);
    });
});

db.serialize(function() {

    affiliationData = [];
    db.each("SELECT * FROM Affiliations", function (err, row) {

        affiliationData.push(row);
    });

});

async function getBannedIn(offset){

    return new Promise( (resolve) => {
    db.serialize(function() {
        db.all("SELECT * FROM BannedIn limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


            resolve(row);


        });
    });
    });
}

async function getChatters(offset){

    return new Promise( (resolve) => {
    db.serialize(function() {
        db.all("SELECT * FROM Chatters limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


            resolve(row);


        });
    });
    });
}

async function getSuperchatStats(offset){

    return new Promise( (resolve) => {
    db.serialize(function() {
        db.all("SELECT * FROM SuperchatStats limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


            resolve(row);


        });
    });
    });
}

async function getSuperchats(offset){

    return new Promise( (resolve) => {
    db.serialize(function() {
        db.all("SELECT * FROM Superchats limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


            resolve(row);


        });
    });
    });
}




async function getChats(offset){

    return new Promise( (resolve) => {
    db.serialize(function() {
        db.all("SELECT * FROM chats limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


            resolve(row);


        });
    });
    });
}

async function getChatStats(offset){

    return new Promise( (resolve) => {
    db.serialize(function() {
        db.all("SELECT * FROM chatStats limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


            resolve(row);


        });
    });
    });
}

async function getVideos(offset){


    return new Promise( (resolve) => {
    db.serialize(function() {
        db.all("SELECT * FROM Videos limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


            resolve(row);


        });
    });

    });
}

async function getVideoChannel(offset){


    return new Promise( (resolve) => {
        db.serialize(function() {
            db.all("SELECT * FROM VideoChannel limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {


                resolve(row);


            });
        });

    });
}


app.get('/channels', (req, res) => {
    res.send(channelData)
})

app.get('/vtubers', (req, res) => {

    res.send(vtuberData);

})

app.get('/affiliations', (req, res) => {

    res.send(affiliationData);

})

app.get('/subgroup', (req, res) => {

    res.send(subgroupData);

})

app.post('/chats', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getChats(offset).then(result => {

        res.send(result);
    })

})

app.post('/chatStats', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getChatStats(offset).then(result => {

        res.send(result);
    })

})

app.post('/videos', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getVideos(offset).then(result => {

        res.send(result);
    })

})

app.post('/superchats', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getSuperchats(offset).then(result => {

        res.send(result);
    })

})

app.post('/superchatStats', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getSuperchatStats(offset).then(result => {

        res.send(result);
    })

})

app.post('/chatters', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getChatters(offset).then(result => {

        res.send(result);
    })

})

app.post('/bannedIn', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getBannedIn(offset).then(result => {

        res.send(result);
    })

})

app.post('/videoChannel', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)
    getVideoChannel(offset).then(result => {

        res.send(result);
    })

})

let queryOneData = [];
let queryTwoData = [];
let queryThreeData = [];
let queryFourData = [];
let queryFiveData = [];
let querySevenData = [];
let queryEightData = [];
let queryNineData = [];
let queryTenData = [];

app.get('/queryOne', (req, res) => {
    res.send(queryOneData)
})

db.serialize(function() {

    queryOneData = [];
    db.each("SELECT Affiliations.organization, Sum(totalSC) AS total FROM Channels INNER JOIN SuperchatStats ON Channels.channelId = SuperchatStats.channelId INNER JOIN Affiliations ON Channels.organization = Affiliations.organization GROUP BY Channels.organization ORDER BY Sum(totalSC) DESC", function (err, row) {

        queryOneData.push(row);
    });

});

app.get('/queryTwo', (req, res) => {
    res.send(queryTwoData)
})

db.serialize(function() {

    queryTwoData = [];
    db.each("SELECT groupName, Sum(chats) as totalChats FROM Channels INNER JOIN ChatStats ON Channels.channelId = ChatStats.channelId INNER JOIN SubGroup ON Channels.subGroup = subGroup.groupName GROUP BY Channels.subGroup ORDER BY Sum(chats) DESC", function (err, row) {

        queryTwoData.push(row);
    });

});

app.get('/queryThree', (req, res) => {
    res.send(queryThreeData)
})

db.serialize(function() {

    queryThreeData = [];
    db.each("SELECT photo, name, Count(*) as bannedCount from Channels AS C INNER JOIN BannedIn ON C.channelId = BannedIn.channelId where authorChannelId in (SELECT chatterID from Chatters INNER JOIN BannedIn ON Chatters.chatterID = BannedIn.authorChannelId GROUP BY chatterID ORDER BY Count(chatterID) DESC LIMIT 1) GROUP BY C.channelID ORDER BY Count(C.channelID) DESC;", function (err, row) {

        queryThreeData.push(row);
    });

});

app.get('/queryFour', (req, res) => {
    res.send(queryFourData)
})

db.serialize(function() {

    queryThreeData = [];
    db.each("select * from Channels C WHERE NOT EXISTS (SELECT period from SuperchatStats EXCEPT select period FROM SuperchatStats R Where R.channelId = C.channelId) INTERSECT select * from Channels C WHERE NOT EXISTS (SELECT period from ChatStats INTERSECT select period from ChatStats where period IS NOT \"2021-01\" AND period IS NOT \"2021-02\" EXCEPT select period FROM ChatStats R Where R.channelId = C.channelId) order by englishName;", function (err, row) {

        queryFourData.push(row);
    });

});


app.get('/queryFive', (req, res) => {
    res.send(queryFiveData)
})

db.serialize(function() {

    queryFiveData = [];
    db.each("SELECT photo, authorChannelId, name, Count(*) as chatCount from Channels AS C INNER JOIN chats ON C.channelId = chats.channelId where authorChannelId in (SELECT chatterID from Chatters INNER JOIN chats ON Chatters.chatterID = chats.authorChannelId GROUP BY chatterID ORDER BY Count(chatterID) DESC LIMIT 5) GROUP BY authorChannelId, C.channelID ORDER BY Count(C.channelID) DESC;", function (err, row) {

        queryFiveData.push(row);
    });

});


app.post('/querySix', (req, res) => {

    let offset = req.body.pageNumber
    console.log(offset)


    getQuerySix(offset).then(result => {

        res.send(result);
    })

})

async function getQuerySix(offset){

    return new Promise( (resolve) => {
        db.serialize(function() {
            db.all("SELECT photo, authorChannelId, name, superchats.currency, amount as donationCount, scSum  from Channels AS C INNER JOIN superchats ON C.channelId = superchats.channelId INNER JOIN (Select chatterID, currency, scSum from (SELECT chatterID, currency, Sum(superChats.amount) as scSum from Chatters INNER JOIN superchats ON Chatters.chatterID = superchats.authorChannelId GROUP BY chatterID ORDER BY Sum(superChats.amount) DESC) group BY currency  ORDER BY Sum(scSum) DESC) as D ON superchats.authorChannelId = D.chatterID AND superchats.currency = D.currency ORDER BY authorChannelId DESC limit 1000 OFFSET " + 1000*(offset-1), function (err, row) {

                resolve(row);

            });
        });
    });
}

app.get('/querySeven', (req, res) => {
    res.send(querySevenData)
})

db.serialize(function() {

    querySevenData = [];
    db.each("SELECT Channels.organization, Count(Channels.organization) as InactiveCount from Channels inner join Affiliations on Channels.organization = Affiliations.organization where Channels.isInactive = \"TRUE\" GROUP BY Channels.organization order by InactiveCount", function (err, row) {

        querySevenData.push(row);
    });

});

app.get('/queryEight', (req, res) => {
    res.send(queryEightData)
})

db.serialize(function() {

    queryEightData = [];
    db.each("SELECT photo, englishName, Channels.subGroup, organization, Channels.subscriberCount, D.totalSubCount from Channels inner join (SELECT subGroup, Sum(subscriberCount) as totalSubCount from Channels where subGroup is not NULL group by subGroup order by Sum(subscriberCount) desc) as D on Channels.subGroup = D.subGroup order by D.totalSubCount desc", function (err, row) {

        queryEightData.push(row);
    });

});

app.get('/queryNine', (req, res) => {
    res.send(queryNineData)
})

db.serialize(function() {

    queryNineData = [];
    db.each("select photo, name, EnglishName, topicId, videosMade from Channels as C inner join (select channelId, topicId,VideosMade from (select channelId, topicId, Count(*) as VideosMade from Videos where topicId IS NOT NULL group by ChannelId, topicId order by topicId, Count(*) Desc) group by topicId Order by VideosMade desc) as D ON C.channelId = D.channelId Order by VideosMade desc", function (err, row) {

        queryNineData.push(row);
    });

});

app.get('/queryTen', (req, res) => {
    res.send(queryTenData)
})

db.serialize(function() {

    queryTenData = [];
    db.each("select organization, mostFrequentCurrency, orgCount as numMostFrequent from (select DISTINCT channelId, organization, mostFrequentCurrency, count(*) as orgCount from (select SuperchatStats.channelId, englishName, organization, mostFrequentCurrency, count(*) as freqCount from SuperchatStats inner join Channels on SuperchatStats.channelId = Channels.channelId group by SuperchatStats.channelId, mostFrequentCurrency order by englishName, freqCount desc) as C group by organization, mostFrequentCurrency order by organization, orgCount desc) group by organization order by organization;", function (err, row) {

        queryTenData.push(row);
    });

});

app.on('close', function () {
    db.close();

})

module.exports = app;


