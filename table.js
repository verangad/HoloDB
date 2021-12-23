// specify the columns
let channels = [];
let gridHeight = 0;
let channelSelect = false;
let selected = 'channels';
let listSelected = 'Channels-select';
let pageNumber = 1;


document.getElementById('Channels-select').style.color = "yellow";
axios.get('http://localhost:3000/channels').then((response) => {

    console.log(response.data)
    channels = response.data;
    gridOptions.api.setRowData(channels);
    gridOptions.columnApi.autoSizeColumns(channelDefs)
});
/*
function rowPick(){
    const selectedRows = gridOptions.api.getSelectedRows();
    console.log(selectedRows);
    if(selected === 'channels' && infoState && !channelSelect){

        document.getElementById('myGrid').style.height = "calc(100% - 180px)";
        document.getElementById('channel-info').style.height = "90px";
        document.getElementById('channel-info').style.display = "block";
        document.getElementById('ch-im').src = selectedRows[0].photo;
        document.getElementById('ba-im').src = selectedRows[0].banner;
    }
    else{

        if(!infoState) {
            document.getElementById('myGrid').style.height = "calc(100% - 30px)";
            document.getElementById('channel-info').style.height = "0px";
            document.getElementById('channel-info').style.display = "none";
        }
        else{
            document.getElementById('myGrid').style.height = "calc(100% - 90px)";
            document.getElementById('channel-info').style.height = "0px";
            document.getElementById('channel-info').style.display = "none";
        }
        channelSelect = false;
    }
}
*/
function downloadCSV(){
    let outputContent = "data:text/csv;charset=utf-8";
    console.log("HI")
    let headers = Object.keys(channels[0]);
    let row = headers.join(",");
    outputContent += row + "\r\n";
    channels.forEach(function(inObject){
        let inArray = Object.values(inObject);
        let row = inArray.join(",");
        outputContent += row + "\r\n";

    });

    var encodedUri = encodeURI(outputContent);
    var download = document.createElement("a");
    download.setAttribute("href", encodedUri);
    download.setAttribute("download", selected + pageNumber + ".csv");
    document.body.appendChild(download);

    download.click();

}

let infoState = false;
function toggleInfo(){
    if(!infoState){

        document.getElementById('myGrid').style.height = "calc(100% - 90px)";
        gridHeight = "calc(100% - 90px)"
        document.getElementById('extra-info').style.height = "60px";
        document.getElementById('extra-info').style.display = "block";
        pickInfo();
        infoState = true;
    }
    else {
        document.getElementById('myGrid').style.height = "calc(100% - 30px)";
        gridHeight = "calc(100% - 30px)"
        document.getElementById('extra-info').style.height = "0px";
        document.getElementById('extra-info').style.display = "none";
        infoState = false;
        //rowPick();
    }

}

function pickInfo(){
    let query = "";
    if(selected === 'channels'){
        query = "<span style=\"color: yellow\">Viewing Table: Channels</span><br><br>Query: SELECT * FROM Channels"

    }
    if(selected === 'chats'){
        query = "<span style=\"color: yellow\">Viewing Table: Chats</span><br><br>Query: SELECT * FROM Chats"

    }
    if(selected === 'superchats'){
        query = "<span style=\"color: yellow\">Viewing Table: Superchats</span><br><br>Query: SELECT * FROM Superchats"

    }
    if(selected === 'superchatstats'){
        query = "<span style=\"color: yellow\">Viewing Table: SuperchatStats</span><br><br>Query: SELECT * FROM SuperchatStats"

    }
    if(selected === 'chatstats'){
        query = "<span style=\"color: yellow\">Viewing Table: ChatStats</span><br><br>Query: SELECT * FROM ChatStats"

    }
    if(selected === 'chatters'){
        query = "<span style=\"color: yellow\">Viewing Table: Chatters</span><br><br>Query: SELECT * FROM Chatters"

    }
    if(selected === 'bannedin'){
        query = "<span style=\"color: yellow\">Viewing Table: BannedIn</span><br><br>Query: SELECT * FROM BannedIn"

    }
    if(selected === 'videos'){
        query = "<span style=\"color: yellow\">Viewing Table: Videos</span><br><br>Query: SELECT * FROM Videos"

    }
    if(selected === 'affiliations'){
        query = "<span style=\"color: yellow\">Viewing Table: Affiliations</span><br><br>Query: SELECT * FROM Affiliations"

    }
    if(selected === 'vtubers'){
        query = "<span style=\"color: yellow\">Viewing Table: Vtubers</span><br><br>Query: SELECT * FROM Vtubers"

    }
    if(selected === 'subgroups'){
        query = "<span style=\"color: yellow\">Viewing Table: Subgroup</span><br><br>Query: SELECT * FROM Subgroup"

    }
    if(selected === 'videochannel'){
        query = "<span style=\"color: yellow\">Viewing Table: VideoChannel</span><br><br>Query: SELECT * FROM VideoChannel"

    }

    if(selected === 'queryOne'){
        query = "<span style=\"color: yellow\">Viewing Table: Find the list of highest income affiliations and how much from highest to lowest</span><br><br>Query: SELECT Affiliations.organization, Sum(totalSC) AS total FROM Channels INNER JOIN SuperchatStats ON Channels.channelId = SuperchatStats.channelId INNER JOIN Affiliations ON Channels.organization = Affiliations.organization GROUP BY Channels.organization ORDER BY Sum(totalSC) DESC;";

    }
    if(selected === 'queryTwo'){
        query = "<span style=\"color: yellow\">Viewing Table: Find the list of highest most chatted Vtuber subgroups from highest to lowest</span><br><br>Query: SELECT groupName, Sum(chats) AS totalChats FROM Channels INNER JOIN ChatStats ON Channels.channelId = ChatStats.channelId INNER JOIN SubGroup ON Channels.subGroup = subGroup.groupName GROUP BY Channels.subGroup ORDER BY Sum(chats) DESC;";

    }
    if(selected === 'queryThree'){
        query = "<span style=\"color: yellow\">Viewing Table: Find the Chatter banned in the most videos and list how many videos they have been banned in per Channel</span><br><br>Query: SELECT name, Count(*) AS bannedCount FROM Channels AS C INNER JOIN BannedIn ON C.channelId = BannedIn.channelId WHERE authorChannelId IN(SELECT chatterID FROM Chatters INNER JOIN BannedIn ON Chatters.chatterID = BannedIn.authorChannelId GROUP BY chatterID ORDER BY Count(chatterID) DESC LIMIT 1) GROUP BY C.channelID ORDER BY Count(C.channelID) DESC;";

    }
    if(selected === 'queryFour'){
        query = "<span style=\"color: yellow\">Viewing Table: Find all Channels who have received both Chats and Superchats for every month (March to October 2021)</span><br><br>Query: SELECT * FROM Channels C WHERE NOT EXISTS (SELECT period FROM SuperchatStats EXCEPT SELECT period FROM SuperchatStats R WHERE R.channelId = C.channelId) INTERSECT SELECT * FROM Channels C WHERE NOT EXISTS (SELECT period FROM ChatStats INTERSECT SELECT period FROM ChatStats WHERE period IS NOT \"2021-01\" AND period IS NOT \"2021-02\" EXCEPT SELECT period FROM ChatStats R WHERE R.channelId = C.channelId) ORDER BY englishName;";

    }
    if(selected === 'queryFive'){
        query = "<span style=\"color: yellow\">Viewing Table: Find the top 5 Chatters who chatted in the most videos and list how many times they chatted in each Channel</span><br><br>Query: SELECT authorChannelId, name, Count(*) AS chatCount from Channels AS C INNER JOIN chats ON C.channelId = chats.channelId WHERE authorChannelId IN (SELECT chatterID FROM Chatters INNER JOIN chats ON Chatters.chatterID = chats.authorChannelId GROUP BY chatterID ORDER BY Count(chatterID) DESC LIMIT 5) GROUP BY authorChannelId, C.channelID ORDER BY Count(C.channelID) DESC;";

    }
    if(selected === 'querySix'){
        query = "<span style=\"color: yellow\">Viewing Table: Find the Chatters who donated the highest amount in each currency and list the how much they have donated in each Channel</span><br><br>Query: SELECT authorChannelId, name, superchats.currency, amount AS donationCount, scSum FROM Channels AS C INNER JOIN superchats ON C.channelId = superchats.channelId INNER JOIN (SELECT chatterID, currency, scSum FROM (SELECT chatterID, currency, Sum(superChats.amount) AS scSum FROM Chatters INNER JOIN superchats ON Chatters.chatterID = superchats.authorChannelId GROUP BY chatterID ORDER BY Sum(superChats.amount) DESC) GROUP BY currency ORDER BY Sum(scSum) DESC) AS D ON superchats.authorChannelId = D.chatterID AND superchats.currency = D.currency ORDER BY authorChannelId DESC;";

    }
    if(selected === 'querySeven'){
        query = "<span style=\"color: yellow\">Viewing Table: Group and count all inactive Vtubers by Affiliation and order by ascending count</span><br><br>Query: SELECT Channels.organization, Count(Channels.organization) AS InactiveCount FROM Channels INNER JOIN Affiliations ON Channels.organization = Affiliations.organization WHERE Channels.isInactive = \"TRUE\" GROUP BY Channels.organization ORDER BY InactiveCount;";

    }
    if(selected === 'queryEight'){
        query = "<span style=\"color: yellow\">Viewing Table: Find all members of every subgroup, group by subgroup and order by subscriber count descending</span><br><br>Query: SELECT englishName, Channels.subGroup, organization, Channels.subscriberCount, D.totalSubCount FROM Channels INNER JOIN (SELECT subGroup, Sum(subscriberCount) AS totalSubCount FROM Channels WHERE subGroup IS NOT NULL GROUP BY subGroup ORDER BY Sum(subscriberCount) DESC) AS D ON Channels.subGroup = D.subGroup ORDER BY D.totalSubCount DESC;";

    }
    if(selected === 'queryNine'){
        query = "<span style=\"color: yellow\">Viewing Table: Find the Vtubers that made the most videos for each video topic</span><br><br>Query: SELECT name, EnglishName, topicId, videosMade FROM Channels AS C INNER JOIN (SELECT channelId, topicId,VideosMade FROM (SELECT channelId, topicId, Count(*) AS VideosMade FROM Videos WHERE topicId IS NOT NULL GROUP BY ChannelId, topicId ORDER BY topicId, Count(*) DESC) GROUP BY topicId ORDER BY VideosMade DESC) AS D ON C.channelId = D.channelId ORDER BY VideosMade DESC;";

    }
    if(selected === 'queryTen'){
        query = "<span style=\"color: yellow\">Viewing Table: Find the most frequent donated currency for each Affiliation</span><br><br>Query: SELECT organization, mostFrequentCurrency, orgCount AS numMostFrequent FROM (SELECT DISTINCT channelId, organization, mostFrequentCurrency, Count(*) AS orgCount FROM (SELECT SuperchatStats.channelId, englishName, organization, mostFrequentCurrency, Count(*) AS freqCount FROM SuperchatStats INNER JOIN Channels ON SuperchatStats.channelId = Channels.channelId GROUP BY SuperchatStats.channelId, mostFrequentCurrency ORDER BY englishName, freqCount DESC) AS C GROUP BY organization, mostFrequentCurrency ORDER BY organization, orgCount DESC) GROUP BY organization ORDER BY organization;\n"

    }


    document.getElementById('query-info').innerHTML = query;
}





function changePage(direction) {
    if(direction === 'rr'){
        if(selected === 'videos'){
            pageNumber = (311068 - (311068 % 1000) + 1000) / 1000;
            listSelected = 'Videos-select';
        }
        if(selected === 'chats'){
            pageNumber = (3181425 - (3181425 % 1000) + 1000) / 1000;
            listSelected = 'Chats-select';
        }
        if(selected === 'superchats'){
            pageNumber = (335531 - (335531 % 1000) + 1000) / 1000;
            listSelected = 'Superchats-select';
        }
        if(selected === 'superchatstats'){
            pageNumber = (4037 - (4037 % 1000) + 1000) / 1000;
            listSelected = 'SuperchatStats-select';
        }
        if(selected === 'chatstats'){
            pageNumber = (4854 - (4854 % 1000) + 1000) / 1000;
            listSelected = 'ChatStats-select';
        }
        if(selected === 'chatters'){
            pageNumber = (478116 - (478116 % 1000) + 1000) / 1000;
            listSelected = 'Chatters-select';
        }
        if(selected === 'bannedin'){
            pageNumber = (284165 - (284165 % 1000) + 1000) / 1000;
            listSelected = 'BannedIn-select';
        }
        if(selected === 'querysix'){
            pageNumber = (1166 - (1166 % 1000) + 1000) / 1000;
            listSelected = 'query-six-select';
        }
        if(selected === 'videochannel'){
            pageNumber = (311068 - (311068 % 1000) + 1000) / 1000;

            listSelected = 'VideoChannel-select';
        }

    }
    if(direction === 'r') {
        if(selected === 'videos'){
            if(pageNumber < (311068 - (311068 % 1000) + 1000) / 1000){
                pageNumber++;
            }

            listSelected = 'Videos-select';
        }
        if(selected === 'chats'){
            if(pageNumber < (3181425 - (3181425 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'Chats-select';
        }
        if(selected === 'superchats'){
            if(pageNumber < (335531 - (335531 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'Superchats-select';
        }
        if(selected === 'superchatstats'){
            if(pageNumber < (4037 - (4037 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'SuperchatStats-select';
        }
        if(selected === 'chatstats'){
            if(pageNumber < (4854 - (4854 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'ChatStats-select';
        }
        if(selected === 'chatters'){
            if(pageNumber < (478116 - (478116 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'Chatters-select';
        }
        if(selected === 'bannedin'){
            if(pageNumber < (284165 - (284165 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'BannedIn-select';
        }
        if(selected === 'querysix'){
            if(pageNumber < (1166 - (1166 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'query-six-select';
        }
        if(selected === 'videochannel'){
            if(pageNumber < (311068 - (311068 % 1000) + 1000) / 1000){
                pageNumber++;
            }
            listSelected = 'VideoChannel-select';
        }
    }
    if(direction === 'll'){
        if(selected === 'videos'){
            pageNumber = 1;
            listSelected = 'Videos-select';
        }
        if(selected === 'chats'){
            pageNumber = 1;
            listSelected = 'Chats-select';
        }
        if(selected === 'superchats'){
            pageNumber = 1;
            listSelected = 'Superchats-select';
        }
        if(selected === 'superchatstats'){
            pageNumber = 1;
            listSelected = 'SuperchatStats-select';
        }
        if(selected === 'chatstats'){
            pageNumber = 1;
            listSelected = 'ChatStats-select';
        }
        if(selected === 'chatters'){
            pageNumber = 1;
            listSelected = 'Chatters-select';
        }
        if(selected === 'bannedin'){
            pageNumber = 1;
            listSelected = 'BannedIn-select';
        }
        if(selected === 'querysix'){
            pageNumber = 1;
            listSelected = 'query-six-select';
        }
        if(selected === 'videochannel'){
            pageNumber = 1;
            listSelected = 'VideoChannel-select';
        }
    }
    if(direction === 'l') {
        if(selected === 'videos'){
            if(pageNumber > 1){
                pageNumber--;
            }

            listSelected = 'Videos-select';
        }
        if(selected === 'chats'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'Chats-select';
        }
        if(selected === 'superchats'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'Superchats-select';
        }
        if(selected === 'superchatstats'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'SuperchatStats-select';
        }
        if(selected === 'chatstats'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'ChatStats-select';
        }
        if(selected === 'chatters'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'Chatters-select';
        }
        if(selected === 'bannedin'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'BannedIn-select';
        }
        if(selected === 'querySix'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'query-six-select';
        }
        if(selected === 'videochannel'){
            if(pageNumber > 1){
                pageNumber--;
            }
            listSelected = 'VideoChannel-select';
        }


    }
    if(selected === 'videos' || selected === 'chats' || selected === 'superchats' || selected === 'superchatstats' || selected === 'chatstats' || selected === 'chatters' || selected === 'bannedin' || selected === 'querysix' || selected === 'videochannel') {
        changeData(selected, listSelected, pageNumber);

    }
}


function changeData(tableName, listSelect, pNum) {
    if(pNum == null){
        pNum = 1;

    }
    pageNumber = pNum;

    let fullList = document.getElementsByClassName('list-select');
    for(let i = 0; i < fullList.length; i++){

        fullList[i].style.color = "white";

    }
    document.getElementById(listSelect).style.color = "yellow";


    if (tableName === 'channels') {


        axios.get('http://localhost:3000/channels').then((response) => {

            channels = response.data;
            gridOptions.api.setColumnDefs(channelDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(channelDefs)
            console.log("UPDATED")
        });
        selected = 'channels';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 953 of 953";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'chats'){

        console.log(tableName)
        axios.post('http://localhost:3000/chats', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            gridOptions.api.setColumnDefs(chatDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(chatDefs)
            console.log("UPDATED2")
        });
        selected = 'chats';

        if(1000*(pageNumber) < 3181425){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 3181425";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 3181425 of 3181425";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((3181425 - (3181425 % 1000) + 1000) / 1000);

    }
    else if(tableName === 'vtubers'){
        console.log(tableName)
        axios.get('http://localhost:3000/vtubers').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(vtuberDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(vtuberDefs)
            console.log("UPDATED3")
        });
        selected = 'vtubers';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 938 of 938";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'affiliations'){
        console.log(tableName)
        axios.get('http://localhost:3000/affiliations').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(affiliationDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(affiliationDefs)
            console.log("UPDATED4")
        });
        selected = 'affiliations';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 48 of 48";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'subgroups'){
        console.log(tableName)
        axios.get('http://localhost:3000/subgroup').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(subgroupDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(subgroupDefs)
            console.log("UPDATED5")
        });
        selected = 'subgroups';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 43 of 43";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'videos'){
        console.log(tableName)
        axios.post('http://localhost:3000/videos', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(videoDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(videoDefs)
            console.log("UPDATED6")
        });

        selected = 'videos';

        if(1000*(pageNumber) < 311068){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 311068";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 311068 of 311068";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((311068 - (311068 % 1000) + 1000) / 1000);

    }
    else if(tableName === 'superchats'){
        console.log(tableName)
        axios.post('http://localhost:3000/superchats', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(superchatDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(superchatDefs)
            console.log("UPDATED6")
        });
        selected = 'superchats';
        if(1000*(pageNumber) < 335531){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 335531";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 335531 of 335531";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((335531 - (335531 % 1000) + 1000) / 1000);
    }
    else if(tableName === 'superchatstats'){
        console.log(tableName)
        axios.post('http://localhost:3000/superchatStats', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(superchatStatDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(superchatStatDefs)
            console.log("UPDATED6")
        });
        selected = 'superchatstats';
        if(1000*(pageNumber) < 4037){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 4037";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 4037 of 4037";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((4037 - (4037 % 1000) + 1000) / 1000);
    }
    else if(tableName === 'chatstats'){
        console.log(tableName)
        axios.post('http://localhost:3000/chatStats', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(chatStatDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(chatStatDefs)
            console.log("UPDATED6")
        });
        selected = 'chatstats';
        if(1000*(pageNumber) < 4854){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 4854";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 4854 of 4854";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((4854 - (4854 % 1000) + 1000) / 1000);
    }
    else if(tableName === 'chatters'){
        console.log(tableName)
        axios.post('http://localhost:3000/chatters', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(chatterDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(chatterDefs)
            console.log("UPDATED6")
        });
        selected = 'chatters';
        if(1000*(pageNumber) < 478116){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 478116";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 478116 of 478116";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((478116 - (478116 % 1000) + 1000) / 1000);
    }
    else if(tableName === 'bannedin'){
        console.log(tableName)
        axios.post('http://localhost:3000/bannedIn', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(bannedInDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(bannedInDefs)
            console.log("UPDATED6")
        });
        selected = 'bannedin';
        if(1000*(pageNumber) < 284165){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 284165";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 284165 of 284165";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((284165 - (284165 % 1000) + 1000) / 1000);
    }
    else if(tableName === 'videochannel'){
        console.log(tableName)
        axios.post('http://localhost:3000/videoChannel', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(videoChannelDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(videoChannelDefs)
            console.log("UPDATED6")
        });
        selected = 'videochannel';
        if(1000*(pageNumber) < 311068){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 311068";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 311068 of 311068";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((311068 - (311068 % 1000) + 1000) / 1000);
    }


    else if(tableName === 'queryone'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryOne').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryOneDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryOneDefs)
            console.log("UPDATED5")
        });
        selected = 'queryOne';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 44 of 44";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'querytwo'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryTwo').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryTwoDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryTwoDefs)
            console.log("UPDATED5")
        });
        selected = 'queryTwo';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 41 of 41";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'querythree'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryThree').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryThreeDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryThreeDefs)
            console.log("UPDATED5")
        });
        selected = 'queryThree';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 143 of 143";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'queryfour'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryFour').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryFourDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryFourDefs);
            console.log("UPDATED5")
        });
        selected = 'queryFour';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 271 of 271";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }

    else if(tableName === 'queryfive'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryFive').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryFiveDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryFiveDefs)
            console.log("UPDATED5")
        });
        selected = 'queryFive';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 29 of 29";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'querysix'){
        console.log(tableName)
        axios.post('http://localhost:3000/querySix', {pageNumber: pNum, limit: 1000}).then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(querySixDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(querySixDefs)
            console.log("UPDATED5")
        });
        selected = 'querySix';
        if(1000*(pageNumber) < 1166){
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to " + (1000*(pageNumber)) +  " of 1166";
        }
        else{
            document.getElementById('checkpage').innerHTML = "Currently loaded: " + (1000*(pageNumber - 1) + 1) + " to 1166 of 1166";
        }
        document.getElementById('page-num').innerHTML = "Page " + pageNumber + " of " + ((1166 - (1166 % 1000) + 1000) / 1000);
    }

    else if(tableName === 'queryseven'){
        console.log(tableName)
        axios.get('http://localhost:3000/querySeven').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(querySevenDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(querySevenDefs)
            console.log("UPDATED5")
        });
        selected = 'querySeven';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 15 of 15";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }

    else if(tableName === 'queryeight'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryEight').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryEightDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryEightDefs)
            console.log("UPDATED5")
        });
        selected = 'queryEight';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 305 of 305";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }

    else if(tableName === 'querynine'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryNine').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryNineDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryNineDefs)
            console.log("UPDATED5")
        });
        selected = 'queryNine';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 229 of 229";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    else if(tableName === 'queryten'){
        console.log(tableName)
        axios.get('http://localhost:3000/queryTen').then((response) => {
            channels = response.data;
            console.log(response)
            gridOptions.api.setColumnDefs(queryTenDefs);
            gridOptions.api.setRowData(response.data);
            gridOptions.columnApi.autoSizeColumns(queryTenDefs)
            console.log("UPDATED5")
        });
        selected = 'queryTen';
        document.getElementById('checkpage').innerHTML = "Currently loaded: 1 to 44 of 44";
        document.getElementById('page-num').innerHTML = "Page 1 of 1";
    }
    pickInfo();

    if(tableName === "channels"){
        channelSelect = true;
    }
    //rowPick();

}


const chatDefs = [
    { field: "chatId", cellRenderer: 'agGroupCellRenderer'},
    { field: "videoId" },
    { field: "authorChannelId" },
    { field: "timestamp" },
    { field: "isMember" },
    { field: "channelId" },
    { field: "bodyLength" }

];

const channelDefs = [
    { field: "photo", cellRenderer: 'photoRenderer', width: 80 },
    { field: "channelID", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "name", width: 200, sortable: true},
    { field: "englishName", width: 200, sortable: true},
    { field: "isInactive", width: 200, sortable: true },
    { field: "startDate", width: 200 },
    { field: "subscriberCount", width: 200, sortable: true },
    { field: "viewCount", width: 200, sortable: true },
    { field: "videoCount", width: 200, sortable: true },
    { field: "clipCount", width: 200, sortable: true },
    { field: "organization", width: 200, sortable: true },
    { field: "subGroup", width: 200, sortable: true },
    { field: "photo", width: 200 },
    { field: "banner", width: 200 }
];





const rowData = [


];

const videoChannelDefs = [

    { field: "videoID", cellRenderer: 'agGroupCellRenderer', width: 200, flex: 1},
    { field: "channelID", width: 200, flex: 1 },


];


const vtuberDefs = [

    { field: "englishName", cellRenderer: 'agGroupCellRenderer', width: 200, flex: 1, sortable: true},
    { field: "twitterName", width: 200, flex: 1, sortable: true },


];

const affiliationDefs = [

    { field: "organization", cellRenderer: 'agGroupCellRenderer', width: 200, flex: 1, sortable: true},
    { field: "ParentCompany", width: 200, flex: 1, sortable: true },
    { field: "numTalents", width: 200, flex: 1, sortable: true },
    { field: "Location", width: 200, flex: 1, sortable: true }

];


const chatStatDefs = [

    { field: "channelId", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "period", width: 200 },
    { field: "chats", width: 200, sortable: true },
    { field: "memberChats", width: 200, sortable: true },
    { field: "uniqueChatters", width: 200, sortable: true },
    { field: "uniqueMembers", width: 200, sortable: true },
    { field: "bannedChatters", width: 200, sortable: true },
    { field: "deletedChats", width: 200, sortable: true }

];


const subgroupDefs = [

    { field: "groupName", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "parentGroup", width: 200, sortable: true },
    { field: " numMembers", width: 200, sortable: true }

];

const videoDefs = [

    { field: "id", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "title", width: 200, sortable: true },
    { field: "topicId", width: 200, sortable: true },
    { field: "channelId", width: 200, sortable: true },
    { field: "publishedAt", width: 200 },
    { field: "duration", width: 200, sortable: true },
    { field: "status", width: 200, sortable: true },
    { field: "liveViewers", width: 200, sortable: true },
    { field: "songCount", width: 200, sortable: true }

];

const superchatDefs = [

    { field: "superchatId", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "timestamp", width: 200 },
    { field: "amount", width: 200, sortable: true },
    { field: "currency", width: 200, sortable: true },
    { field: "significance", width: 200 },
    { field: "authorChannelId", width: 200 },
    { field: "videoId", width: 200 },
    { field: "channelId", width: 200 },
    { field: "bodyLength", width: 200, sortable: true }

];

const superchatStatDefs = [

    { field: "channelId", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "period", width: 200 },
    { field: "uniqueSuperChatters", width: 200, sortable: true },
    { field: "totalSC", width: 200, sortable: true },
    { field: "averageSC", width: 200, sortable: true },
    { field: "totalMessageLength", width: 200, sortable: true },
    { field: "averageMessageLength", width: 200, sortable: true },
    { field: "mostFrequentCurrency", width: 200, sortable: true },
    { field: "mostFrequentColor", width: 200, sortable: true },
    { field: "superChats", width: 200, sortable: true }

];

const chatterDefs = [

    { field: "chatterID", cellRenderer: 'agGroupCellRenderer', width: 200}

];

const bannedInDefs = [

    { field: "timestamp", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "authorChannelID", width: 200 },
    { field: "videoID", width: 200 },
    { field: "channelID", width: 200 }

];

const queryOneDefs = [

    { field: "organization", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "total", width: 200, sortable: true }

];

const queryTwoDefs = [

    { field: "groupName", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "totalChats", width: 200, sortable: true }

];

const queryThreeDefs = [

    { field: "photo", cellRenderer: 'photoRenderer', width: 80},
    { field: "name", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "bannedCount", width: 200, sortable: true }

];

const queryFourDefs = [
    { field: "photo", cellRenderer: 'photoRenderer', width: 80 },
    { field: "channelID", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "name", width: 200, sortable: true },
    { field: "englishName", width: 200, sortable: true },
    { field: "isInactive", width: 200 },
    { field: "startDate", width: 200 },
    { field: "subscriberCount", width: 200, sortable: true },
    { field: "viewCount", width: 200, sortable: true },
    { field: "videoCount", width: 200, sortable: true },
    { field: "clipCount", width: 200, sortable: true },
    { field: "organization", width: 200, sortable: true },
    { field: "subGroup", width: 200, sortable: true },
    { field: "photo", width: 200 },
    { field: "banner", width: 200 }
];

const queryFiveDefs = [

    { field: "photo", cellRenderer: 'photoRenderer', width: 80},
    { field: "name", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "authorChannelId", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "chatCount", width: 200, sortable: true }

];

const querySixDefs = [

    { field: "photo", cellRenderer: 'photoRenderer', width: 80},
    { field: "name", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "authorChannelId", cellRenderer: 'agGroupCellRenderer', width: 200},
    { field: "currency", width: 200, sortable: true},
    { field: "donationCount", width: 200, sortable: true },
    { field: "scSum", width: 200, sortable: true }

];

const querySevenDefs = [

    { field: "organization", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "InactiveCount", width: 200, sortable: true},


];

const queryEightDefs = [

    { field: "photo", cellRenderer: 'photoRenderer', width: 80},
    { field: "englishName", width: 200, sortable: true},
    { field: "subGroup", width: 200, sortable: true },
    { field: "organization", width: 200, sortable: true },
    { field: "subscriberCount", width: 200, sortable: true },
    { field: "totalSubCount", width: 200, sortable: true }

];

const queryNineDefs = [

    { field: "photo", cellRenderer: 'photoRenderer', width: 80},
    { field: "name", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "englishName", width: 200, sortable: true},
    { field: "topicId", width: 200, sortable: true },
    { field: "VideosMade", width: 200, sortable: true },


];

const queryTenDefs = [

    { field: "organization", cellRenderer: 'agGroupCellRenderer', width: 200, sortable: true},
    { field: "mostFrequentCurrency", width: 200, sortable: true},
    { field: "numMostFrequent", width: 200, sortable: true }

];



// let the grid know which columns and what data to use
const gridOptions = {


    columnDefs: channelDefs,
    rowData: rowData,
    pagination: true,
    columnHoverHighlight: true,
    rowSelection: 'single',
    components: {
        photoRenderer: photoRenderer,
    },
    defaultColDef: {

        resizable: true
    },
    //onSelectionChanged: rowPick,

};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

});