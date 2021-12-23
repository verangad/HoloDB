//var axios = require('axios');


axios.post( 'http://localhost:3000/chats', {pageNumber: 2, limit: 1000}).then( response => {

        console.log(response)
});


axios.get('http://localhost:3000/channels').then((response) => {

    console.log(response.data);
});





