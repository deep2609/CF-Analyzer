

window.onload = function () {
    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }
    // document.getElementById('here').innerHTML = data.userName;
    const userName = data.userName;
    let url = "https://codeforces.com/api/user.info?handles="+userName;
    fetch(url).then(function(response){
         if (response.status !== 200) {
              console.warn('Looks like there was a problem. Status Code: ' + response.status);
              return;
         }
         response.json().then(function(res){
             console.log(res);
         });
    });



}
