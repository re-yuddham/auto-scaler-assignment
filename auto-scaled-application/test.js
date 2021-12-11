var axios = require('axios');
var qs = require('qs');
var data = qs.stringify({
  'client_id': 'sb-dfb22742-dc16-46bb-8f39-ef4d3a30b81e!b000|test-clientid!b123',
  'grant_type': 'client_credentials' 
});
var config = {
  method: 'post',
  url: 'http://localhost:9000/oauth/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'Authorization': 'Basic c2ItZGZiMjI3NDItZGMxNi00NmJiLThmMzktZWY0ZDNhMzBiODFlIWIwMDB8dGVzdC1jbGllbnRpZCFiMTIzOnRoaXMtc2VjcmV0LWlzLW5vdC1zZWN1cmUtNGFiNjViZGEtNjQ4ZC00ZThlLWFjNmItYjZlNTI5MjAxMTI4'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});