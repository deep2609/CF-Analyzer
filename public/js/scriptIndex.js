
$('.results').hide();
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawRatingChart);
google.charts.setOnLoadCallback(drawProblemChart);
// let handleColors = new Map();
// handle.set('legendary grandmaster','red');
// handle.set('international grandmaster','red');
// handle.set('grandmaster','red');
// handle.set('international master','#ff8c00');
// handle.set('master','#ff8c00');
// handle.set('candidate master','#a0a');
// handle.set('expert','blue');
// handle.set('specialist','#03a89e');
// handle.set('pupil','green');
// handle.set('newbie','gray');

let resultButton = document.getElementById('resultButton');
resultButton.addEventListener("click",function(){
  $('.results').show();
  $('#userProfile').empty();
  $('#levels').empty();
  var userName = $('#cfId').val();
  console.log(userName);
  // get();
   let urlUserData = "https://codeforces.com/api/user.info?handles="+userName;
   let urlUserContests = "https://codeforces.com/api/user.rating?handle="+userName;
   let urlUserSubmissions = "https://codeforces.com/api/user.status?handle="+userName+"&from=1";

   let topicData = new Map();
   let unsolved = new Map();
   let solved = new Map();
   let ratingSolved = new Map();
   let level = new Map();

   fetch(urlUserSubmissions).then(function(response){
      if(response.status!==200){
         console.warn('Looks like there was a problem. Status code: '+ response.status);
      }

      response.json().then(function(res){
          let len = res.result.length;
          console.log(len);
          len--;
          for(let i=len;i>=0;i--){
            // console.log(typeof(res.result[i].contestId));
            if(res.result[i].problem.problemsetName==="acmsguru")continue;
             let contestID = (res.result[i].contestId).toString() + res.result[i].problem.index;
             console.log(contestID);
             let ok = 0;
             if(res.result[i].verdict==="OK")ok=1;
             if(ok===1){
               if(unsolved.has(contestID)){
                 unsolved.delete(contestID);
                 solved.set(contestID,1);
                 let problemRating = res.result[i].problem.rating;
                 if(ratingSolved.has(problemRating)){
                   ratingSolved.set(problemRating,ratingSolved.get(problemRating)+1);
                 }
                 else{
                   ratingSolved.set(problemRating,1);
                 }

               }else{
                  if(!(solved.has(contestID))){
                    solved.set(contestID,1);
                    console.log(solved.get(contestID));
                    let index = res.result[i].problem.index;
                    let problemRating = res.result[i].problem.rating;

                    if(level.has(index)){
                      level.set(index,level.get(index)+1);
                    }else{
                      level.set(index,1);
                    }
                    console.log(index);
                    console.log(level.get(index));

                    if(ratingSolved.has(problemRating)){
                      ratingSolved.set(problemRating,ratingSolved.get(problemRating)+1);
                    }
                    else{
                      ratingSolved.set(problemRating,1);
                    }


                    for(let j=0;j<res.result[i].problem.tags.length;j++){
                      let topic = res.result[i].problem.tags[j];
                       if(topicData.has(topic)){
                          topicData.set(topic,topicData.get(topic)+1);
                       }else{
                         topicData.set(topic,1);
                       }
                    }
                  }
               }
             }
             else{
               if(solved.has(contestID)){

               }
               else{
                 if(!unsolved.has(contestID)){
                   unsolved.set(contestID,1);
                 }
               }
             }

             if(i===0){
               console.log(topicData.size);
               let useData=[];
               let userRatingData=[];
               let userProblemData=[];
               userProblemData.push(['Problem level','Number of solves']);
               for(let [key,value] of topicData){
                  useData.push([key+": "+value,value]);
                  // console.log(key+"- > "+value);
                }

                 userRatingData.push(['Difficulty Rating','Number of solves']);
                for(let [key,value] of ratingSolved){
                   userRatingData.push([key,value]);
                   console.log(key+"- > "+value);

                }

                for(let [key,value] of level){
                   userProblemData.push([key,value]);
                   console.log(key+"- > "+value);

                }

               console.log(useData);
               drawChart(useData,userName);
               drawRatingChart(userRatingData,userName);
               drawProblemChart(userProblemData,userName);
             }


          }
          // console.log(level.size);
          // console.log("Solved : "+solved.size);
          // let html="";
          // for(let j=0;j<9;j++){
          //   let i=String.fromCharCode(65+j);
          //   if(level.has(i)){
          //      html+="<h3>"+i+" : "+level.get(i).toString()+"</h3>";
          //   }else{
          //      html+="<h3>"+i+" :  0</h3>";
          //   }
          // }
          // $('#levels').append(html);





          fetch(urlUserData).then(function(response){
              if(response.status!==200){
                console.warn('Looks like there was a problem. Status code: '+ response.status);
              }

              console.log(response);

              response.json().then(function(data){
                  console.log(data);
                  console.log(data.result[0].handle);
                  // let html="";
                  // html+="<h3>Handle : "+(data.result[0].handle)+"</h3>";
                  // html+="<h3>Rank : "+data.result[0].rank+"</h3>";
                  // $('#userDetails').append(html);

                  let html="";

                  html+="<div class='col-6'>";
                  if(data.result[0].rank==undefined){
                    html+="<h1>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='newbie'){
                    html+="<h1 style='color:gray;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='pupil'){
                    html+="<h1 style='color:green;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='specialist'){
                    html+="<h1 style='color:#03a89e;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='expert'){
                    html+="<h1 style='color:blue;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='candidate master'){
                    html+="<h1 style='color:#a0a;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='master'){
                    html+="<h1 style='color:#ff8c00;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='international master'){
                    html+="<h1 style='color:#ff8c00;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='grandmaster'){
                    html+="<h1 style='color:red;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='international grandmaster'){
                    html+="<h1 style='color:red;'>"+data.result[0].handle+"</h1>";
                  }
                  if(data.result[0].rank==='legendary grandmaster'){
                    html+="<h1 style='color:red;'>"+data.result[0].handle+"</h1>";
                  }
                  // html+="<h3>"+data.result[0].handle+"</h3>";
                  if(data.result[0].rank==undefined){
                    html+="<h2>unrated</h2>";
                  }
                  if(data.result[0].rank==='newbie'){
                    html+="<h2 style='color:gray;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='pupil'){
                    html+="<h2 style='color:green;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='specialist'){
                    html+="<h2 style='color:#03a89e;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='expert'){
                    html+="<h2 style='color:blue;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='candidate master'){
                    html+="<h2 style='color:#a0a;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='master'){
                    html+="<h2 style='color:#ff8c00;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='international master'){
                    html+="<h2 style='color:#ff8c00;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='grandmaster'){
                    html+="<h2 style='color:red;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='international grandmaster'){
                    html+="<h2 style='color:red;'>"+data.result[0].rank+"</h2>";
                  }
                  if(data.result[0].rank==='legendary grandmaster'){
                    html+="<h2 style='color:red;'>"+data.result[0].rank+"</h2>";
                  }


                  // html+="<h3 style='color:'"+">"+data.result[0].rank+"</h3>";
                  if(data.result[0].rank==undefined){
                    html+="<h3><img src='https://wp-asset.groww.in/wp-content/uploads/2019/03/18122322/stock-market.jpg' style='height:30px; width:30px;'> Current rating : 0</h3>";
                    html+="<h3><img src='https://lh3.googleusercontent.com/proxy/DBAMtja6A5NAc41aJSVKMbbH93GwzUUoeKDuZyJBx7H8lARwaGOJwV6mRPphTdmQojJ2n25_Z69gtcw7ipTGuXtuRARaVRkqd20fHIJS1-xHYHBRxAVX0MgEdmm3iQ' style='height:30px; width:30px;'> Max rating : 0 ( unrated) </h3>";
                  }
                  else{
                    html+="<h3><img src='https://wp-asset.groww.in/wp-content/uploads/2019/03/18122322/stock-market.jpg' style='height:30px; width:30px;'> Current rating : "+data.result[0].rating+"</h3>";
                    html+="<h3><img src='https://lh3.googleusercontent.com/proxy/DBAMtja6A5NAc41aJSVKMbbH93GwzUUoeKDuZyJBx7H8lARwaGOJwV6mRPphTdmQojJ2n25_Z69gtcw7ipTGuXtuRARaVRkqd20fHIJS1-xHYHBRxAVX0MgEdmm3iQ' style='height:30px; width:30px;'> Max rating : "+data.result[0].maxRating+" ("+data.result[0].maxRank+")</h3>";
                  }
                  html+="<h3> Problems solved : "+solved.size+"</h3>";
                  html+="</div>";
                  html+="<div class='col-6'>";
                  if(data.result[0].titlePhoto==="https://userpic.codeforces.org/no-title.jpg"){
                    html+="<img src='https://miro.medium.com/max/719/1*TMAo0Qpl4j9TaE3sDyBTLg.jpeg' style='border: 5px solid #21094E; width:300px;height:350px;'>";
                  }
                  else{
                    html+="<img src='"+data.result[0].titlePhoto+"' style='border: 5px solid #21094E; width:300px;height:350px;'>";
                  }

                  html+="</div>";

                  $('#userProfile').append(html);



              });
          });




      });
      // console.log(level.size);
   });


    fetch(urlUserContests).then(function(response){
        if(response.status!==200){
           console.warn('Looks like there was a problem. Status code: '+ response.status);
        }
        response.json().then(function(res){

        });
    });


    // console.log(level.size);
    // let html="";
    // for(let j=0;j<26;j++){
    //   let i=String.fromCharCode(65+j);
    //   if(level.has(i)){
    //      html+="<h3>"+i+" : "+level.get(i).toString()+"</h3>";
    //   }else{
    //      html+="<h3>"+i+" :  0</h3>";
    //   }
    // }
    // $('#levels').append(html);


   // $('#userDetails').append("<h3>HAHA</h3>");

});







// var ctx = document.getElementById('myChart');
// var chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'line',
//
//     // The data for our dataset
//     data: {
//         labels: ["January", "February", "March", "April", "May", "June", "July"],
//         datasets: [{
//             label: "My First dataset",
//             // backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45],
//         }]
//     },
//
//     // Configuration options go here
//     options: {}
// });

function drawChart(useData,userName) {
      // Define the chart to be drawn.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Element');
      data.addColumn('number', 'Percentage');
      data.addRows(useData);
      var options = {
        'title': 'Tags of '+userName,
        'width': 1100,
        'height':800
      };
      // Instantiate and draw the chart.
      var chart = new google.visualization.PieChart(document.getElementById('myPieChart'));
      chart.draw(data, options);
}

function drawRatingChart(userRatingData,userName){
  var data = google.visualization.arrayToDataTable(userRatingData);
  var view = new google.visualization.DataView(data);
      // view.setColumns([0, 1,
      //                  { calc: "stringify",
      //                    sourceColumn: 1,
      //                    type: "string",
      //                    role: "annotation" },
      //                  2]);

      var options = {
        title: "Problems solved by "+userName,
        width: 800,
        height: 800,
        bar: {groupWidth: "95%"},
        legend: { position: "right" },
      };
      var chart = new google.visualization.BarChart(document.getElementById("userRatingChart"));
      chart.draw(data, options);
}

function drawProblemChart(userProblemData,userName){
  var data = google.visualization.arrayToDataTable(userProblemData);
  var view = new google.visualization.DataView(data);
      // view.setColumns([0, 1,
      //                  { calc: "stringify",
      //                    sourceColumn: 1,
      //                    type: "string",
      //                    role: "annotation" },
      //                  2]);

      var options = {
        title: "Problems solved by "+userName,
        width: 800,
        height: 800,
        bar: {groupWidth: "95%"},
        legend: { position: "right" },
      };
      var chart = new google.visualization.BarChart(document.getElementById("userProblemChart"));
      chart.draw(data, options);
}
