// function testJS() {
//       var data = document.getElementById('name').value,
//       url = __dirname+"/public/html/data.html" + encodeURIComponent(b);
//
//   document.location.href = url;
// }


// function get(){
//   $('#userDetails').append(html);
// }



let resultButton = document.getElementById('resultButton');
resultButton.addEventListener("click",function(){
  var userName = $('#cfId').val();
  console.log(userName);
  // get();
   let urlUserData = "https://codeforces.com/api/user.info?handles="+userName;
   let urlUserContests = "https://codeforces.com/api/user.rating?handle="+userName;
   fetch(urlUserData).then(function(response){
       if(response.status!==200){
         console.warn('Looks like there was a problem. Status code: '+ response.status);
       }

       console.log(response);

       response.json().then(function(data){
           console.log(data);
           console.log(data.result[0].handle);
           let html="";
           html+="<h3>Handle : "+(data.result[0].handle)+"</h3>";
           html+="<h3>Rank : "+data.result[0].rank+"</h3>";
           $('#userDetails').append(html);
       });
   });

    fetch(urlUserContests).then(function(response){
        if(response.status!==200){
           console.warn('Looks like there was a problem. Status code: '+ response.status);
        }
        response.json().then(function(res){
          var ctx = document.getElementById('myChart');
          var chart = new Chart(ctx, {
              // The type of chart we want to create
              type: 'line',

              // The data for our dataset
              data: {
                  labels: ["January", "February", "March", "April", "May", "June", "July"],
                  datasets: [{
                      label: "My First dataset",
                      // backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgb(255, 99, 132)',
                      data: [0, 10, 5, 2, 20, 30, 45],
                  }]
              },

              // Configuration options go here
              options: {}
          });

        });
    });


   // $('#userDetails').append("<h3>HAHA</h3>");

});







var ctx = document.getElementById('myChart');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            // backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: {}
});
