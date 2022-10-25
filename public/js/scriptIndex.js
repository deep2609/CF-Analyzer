$('.results').hide();
$('.coder-img').hide();
$('#randomQuestions').hide();
google.charts.load('current', {
  packages: ['corechart']
});
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawRatingChart);
google.charts.setOnLoadCallback(drawProblemChart);
google.charts.setOnLoadCallback(drawEfficiencyChart);


let flag=0;
let ok =0;
let leastProminent = new Map();
let topicData = new Map();
let unsolved = new Map();
let solved = new Map();
let ratingSolved = new Map();
let level = new Map();
let triesTopic = new Map();
let correctSolTopic = new Map();
let language = new Map();

let useData = [];
let userRatingData = [];
let userProblemData = [];
let efficiencyData = [];
let effData = [];

let userName="";

let widthPieChart = 0;
let heightPieChart = 0;

let widthBar = 0;
let heightBar = 0;

if($(window).width()>1200){
  widthPieChart=1060;
  heightPieChart=800;
  widthBar=1025;
  heightBar=625;
}
else if($(window).width()>1000){
  widthPieChart=860;
  heightPieChart=700;
  widthBar=825;
  heightBar=525;
}
else if($(window).width()>800){
  widthPieChart=625;
  heightPieChart=520;
  widthBar=625;
  heightBar=475;
}
else if($(window).width()>600){
  widthPieChart=380;
  heightPieChart=350;
  widthBar=445;
  heightBar=425;
}
else{
  widthPieChart=240;
  heightPieChart=270;
  widthBar=255;
  heightBar=255;

}

$(window).resize(function(){
    var w = $(window).width();
    if(flag===1){
    if (w > 1200){
      widthPieChart=1060;
      heightPieChart=800;
      widthBar=1025;
      heightBar=625;
      drawChart(useData, userName);
      drawRatingChart(userRatingData, userName);
      drawProblemChart(userProblemData, userName);
      drawEfficiencyChart(efficiencyData, userName);
    }
    else if(w>1000 && w<1200){
      widthPieChart=820;
      heightPieChart=700;
      widthBar=825;
      heightBar=525;
      drawChart(useData, userName);
      drawRatingChart(userRatingData, userName);
      drawProblemChart(userProblemData, userName);
      drawEfficiencyChart(efficiencyData, userName);
    }
    else if(w>800 && w<1000){
      widthPieChart=625;
      heightPieChart=580;
      widthBar=625;
      heightBar=475;
      drawChart(useData, userName);
      drawRatingChart(userRatingData, userName);
      drawProblemChart(userProblemData, userName);
      drawEfficiencyChart(efficiencyData, userName);
    }
    else if(w>600 && w < 800){
      widthPieChart=380;
      heightPieChart=350;
      widthBar=445;
      heightBar=425;
      drawChart(useData, userName);
      drawRatingChart(userRatingData, userName);
      drawProblemChart(userProblemData, userName);
      drawEfficiencyChart(efficiencyData, userName);
    }
    else if(w<600){
      widthPieChart=340;
      heightPieChart=270;
      widthBar=255;
      heightBar=255;
      drawChart(useData, userName);
      drawRatingChart(userRatingData, userName);
      drawProblemChart(userProblemData, userName);
      drawEfficiencyChart(efficiencyData, userName);
    }
  }

});





function randomProblemGenerator(solved, userRating) {
  
  let url = "https://codeforces.com/api/problemset.problems?";
  console.log(url);
  fetch(url).then(function(response) {
    if (response.status !== 200) {
      console.warn('Looks like there was a problem. Status code: ' + response.status);
    }
    response.json().then(function(res) {
    
      let randomQuestions = [];
      let randomWeakProblems = [];
      let len = res.result.problems.length;
      for (let i = 0; i < len; i++) {
        let contestID = (res.result.problems[i].contestId).toString() + res.result.problems[i].index;
       
        if (userRating + 300 >= res.result.problems[i].rating && userRating - 100 <= res.result.problems[i].rating && !(solved.has(contestID))) {
          let str = "https://codeforces.com/problemset/problem/" + (res.result.problems[i].contestId).toString() + "/" + res.result.problems[i].index;
        
          randomQuestions.push(str);
          for (let j = 0; j < res.result.problems[i].tags.length; j++) {
            if (leastProminent.has(res.result.problems[i].tags[j])) {
              randomWeakProblems.push(str);
              break;
            }
          }
        }
        if (i == len - 1) {
          let l = randomQuestions.length - 1;
          let num = Math.floor(Math.random() * (l - 0 + 1)) + 0;

          let index2 = randomWeakProblems.length - 1;
          let num2 = Math.floor(Math.random() * (index2 - 0 + 1)) + 0;
        
          $('#randomWeakProblemButton').wrapInner("<a href='" + randomWeakProblems[num2] + "' style='color:white;background-color: transparent;text-decoration:none;'></a>");
          $('#randomProblemButton').wrapInner("<a href='" + randomQuestions[num] + "' style='color:white;background-color: transparent;text-decoration:none;'></a>");
          console.log("I got here");
        }
      }
    });
  });
}


let resultButton = document.getElementById('resultButton');
resultButton.addEventListener("click", function() {
  userName = $('#cfId').val();
  let urlUserData = "https://codeforces.com/api/user.info?handles=" + userName;
  let urlUserContests = "https://codeforces.com/api/user.rating?handle=" + userName;
  let urlUserSubmissions = "https://codeforces.com/api/user.status?handle=" + userName + "&from=1";
  fetch(urlUserSubmissions).then(function(response) {
    if (response.status !== 200) {
      console.warn('Looks like there was a problem. Status code: ' + response.status);
      alert("The Codeforces handle doesn't exist!! Please try again!");
      throw new Error("Something went badly wrong!");
    }

    let correct = 0;
    let wrong = 0;
    let preferredLanguage = "";
    $('.results').show();
    $('.coder-img').show();
    // $('.greetings').empty();
    $('#userProfile').empty();
    $('#levels').empty();
    $('#unsolvedProblems').empty();
    $('#randomQuestions').show();
    $('#strongBody').empty();
    $('#weakBody').empty();


    document.getElementsByClassName('greetingsTitle')[0].innerHTML = ("Hello " + userName);





    topicData.clear();
    unsolved.clear();
    solved.clear();
    ratingSolved.clear();
    level.clear();
    triesTopic.clear();
    correctSolTopic.clear();
    language.clear();
    leastProminent.clear();

    response.json().then(function(res) {
      let len = res.result.length;
      // console.log(len);
      len--;
      for (let i = len; i >= 0; i--) {
        // console.log(typeof(res.result[i].contestId));
        if (res.result[i].problem.problemsetName === "acmsguru") continue;
        if (language.has(res.result[i].programmingLanguage)) {
          language.set(res.result[i].programmingLanguage, language.get(res.result[i].programmingLanguage) + 1);
        } else language.set(res.result[i].programmingLanguage, 1);
        for (let j = 0; j < res.result[i].problem.tags.length; j++) {
          let topic = res.result[i].problem.tags[j];
          if (triesTopic.has(topic)) {
            triesTopic.set(topic, triesTopic.get(topic) + 1);
          } else {
            triesTopic.set(topic, 1);
          }
        }

        let contestID = (res.result[i].contestId).toString() + res.result[i].problem.index;
        // console.log(contestID);
        let ok = 0;
        if (res.result[i].verdict === "OK") {
          ok = 1;
          correct++;
          for (let j = 0; j < res.result[i].problem.tags.length; j++) {
            let topic = res.result[i].problem.tags[j];
            if (correctSolTopic.has(topic)) {
              correctSolTopic.set(topic, correctSolTopic.get(topic) + 1);
            } else {
              correctSolTopic.set(topic, 1);
            }
          }
        } else wrong++;
        if (ok === 1) {
          if (unsolved.has(contestID)) {
            unsolved.delete(contestID);
            solved.set(contestID, 1);
            let problemRating = res.result[i].problem.rating;
            if (ratingSolved.has(problemRating)) {
              ratingSolved.set(problemRating, ratingSolved.get(problemRating) + 1);
            } else {
              ratingSolved.set(problemRating, 1);
            }

          } else {
            if (!(solved.has(contestID))) {
              solved.set(contestID, 1);
              // console.log(solved.get(contestID));
              let index = res.result[i].problem.index;
              let problemRating = res.result[i].problem.rating;

              if (level.has(index)) {
                level.set(index, level.get(index) + 1);
              } else {
                level.set(index, 1);
              }
              // console.log(index);
              // console.log(level.get(index));

              if (ratingSolved.has(problemRating)) {
                ratingSolved.set(problemRating, ratingSolved.get(problemRating) + 1);
              } else {
                ratingSolved.set(problemRating, 1);
              }


              for (let j = 0; j < res.result[i].problem.tags.length; j++) {
                let topic = res.result[i].problem.tags[j];
                if (topicData.has(topic)) {
                  topicData.set(topic, topicData.get(topic) + 1);
                } else {
                  topicData.set(topic, 1);
                }
              }
            }
          }
        } else {
          if (solved.has(contestID)) {

          } else {
            if (!unsolved.has(contestID)) {
              unsolved.set(contestID, 1);
            }
          }
        }

        if (i === 0) {
          // console.log(topicData.size);


          useData=[];
          userRatingData=[];
          userProblemData=[];
          efficiencyData=[];
          effData=[];

          let nax = 0;
          for (let [key, value] of language) {
            if (nax < value) {
              nax = value;
              preferredLanguage = key;
            }
          }

          userProblemData.push(['Problem level', 'Number of solves']);
          for (let [key, value] of topicData) {
            useData.push([key + ": " + value, value]);

          }

          useData.sort(function(x, y) {
            if (x[1] == y[1]) return 0;
            return (x[1] > y[1]) ? -1 : 1;
          });

          for (let [key, value] of triesTopic) {
            let done = 0;
            if (correctSolTopic.has(key)) done = correctSolTopic.get(key);
            let eff = done / value;
            eff *= 100;
            eff = Math.round((eff + Number.EPSILON) * 100) / 100;
            efficiencyData.push([key + ": " + eff + "%", eff]);
            if (value >= 5) effData.push([key, eff]);
          }

          efficiencyData.sort(function(x, y) {
            if (x[1] == y[1]) return 0;
            return (x[1] > y[1]) ? -1 : 1;
          });

          effData.sort(function(x, y) {
            if (x[1] == y[1]) return 0;
            return (x[1] > y[1] ? -1 : 1);
          });

          userRatingData.push(['Difficulty Rating', 'Number of solves']);
          for (let [key, value] of ratingSolved) {
            userRatingData.push([key, value]);
            // console.log(key+"- > "+value);

          }
          for (let i = 65; i < 73; i++) {
            let str1 = String.fromCharCode(i);
            if (level.has(str1)) {
              userProblemData.push([str1, level.get(str1)]);
            } else {
              userProblemData.push([str1, 0]);
            }
          }


          for (let i = effData.length - 1; i >= Math.max(0, effData.length - 12); i--) {
            if (effData[i][0] === "*special") continue;
            leastProminent.set(effData[i][0], 1);

          }


          drawChart(useData, userName);
          drawRatingChart(userRatingData, userName);
          drawProblemChart(userProblemData, userName);
          drawEfficiencyChart(efficiencyData, userName);
          flag=1;




          let xhtml = "";
          let ll = effData.length;
          // console.log(typeof(ll));
          for (let i = 0; i < Math.min(7, ll - 1); i++) {
            xhtml += "<tr><td>" + effData[i][0] + "</td>";
            xhtml += "<td>" + effData[i][1] + "%</td>";
            xhtml += "</tr>";

          }
          $('#strongBody').append(xhtml);
          xhtml = "";

          for (let i = ll - 1; i >= Math.max(0, ll - 7); i--) {
            xhtml += "<tr><td>" + effData[i][0] + "</td>";
            xhtml += "<td>" + effData[i][1] + "%</td>";
            xhtml += "</tr>";

          }
          $('#weakBody').append(xhtml);



        }


      }


      fetch(urlUserData).then(function(response) {
        if (response.status !== 200) {
          console.warn('Looks like there was a problem. Status code: ' + response.status);
        }

        // console.log(response);

        response.json().then(function(data) {
          console.log(data);
          console.log(data.result[0].handle);


          let html = "";

          html += "<div class='col-6'>";
          if (data.result[0].rank == undefined) {
            html += "<h1>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'newbie') {
            html += "<h1 style='color:gray;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'pupil') {
            html += "<h1 style='color:green;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'specialist') {
            html += "<h1 style='color:#03a89e;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'expert') {
            html += "<h1 style='color:blue;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'candidate master') {
            html += "<h1 style='color:#a0a;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'master') {
            html += "<h1 style='color:#ff8c00;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'international master') {
            html += "<h1 style='color:#ff8c00;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'grandmaster') {
            html += "<h1 style='color:red;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'international grandmaster') {
            html += "<h1 style='color:red;'>" + data.result[0].handle + "</h1>";
          }
          if (data.result[0].rank === 'legendary grandmaster') {
            html += "<h1 style='color:red;'>" + data.result[0].handle + "</h1>";
          }
          // html+="<h3>"+data.result[0].handle+"</h3>";
          if (data.result[0].rank == undefined) {
            html += "<h3>unrated</h3>";
          }
          if (data.result[0].rank === 'newbie') {
            html += "<h3 style='color:gray;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'pupil') {
            html += "<h3 style='color:green;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'specialist') {
            html += "<h3 style='color:#03a89e;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'expert') {
            html += "<h3 style='color:blue;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'candidate master') {
            html += "<h3 style='color:#a0a;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'master') {
            html += "<h3 style='color:#ff8c00;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'international master') {
            html += "<h3 style='color:#ff8c00;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'grandmaster') {
            html += "<h3 style='color:red;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'international grandmaster') {
            html += "<h3 style='color:red;'>" + data.result[0].rank + "</h3>";
          }
          if (data.result[0].rank === 'legendary grandmaster') {
            html += "<h3 style='color:red;'>" + data.result[0].rank + "</h3>";
          }



          if (data.result[0].rank == undefined) {
            html += "<h3><img src='https://wp-asset.groww.in/wp-content/uploads/2019/03/18122322/stock-market.jpg' style='height:30px; width:30px;'> Current rating : 0</h3>";
            html += "<h3><img src='https://wp-asset.groww.in/wp-content/uploads/2019/03/18122322/stock-market.jpg' style='height:30px; width:30px;'> Max rating : 0 ( unrated) </h3>";
          } else {
            html += "<h3><img src='https://wp-asset.groww.in/wp-content/uploads/2019/03/18122322/stock-market.jpg' style='height:30px; width:30px;'> Current rating : " + data.result[0].rating + "</h3>";
            html += "<h3><img src='https://wp-asset.groww.in/wp-content/uploads/2019/03/18122322/stock-market.jpg' style='height:30px; width:30px;'> Max rating : " + data.result[0].maxRating + " (" + data.result[0].maxRank + ")</h3>";
          }
          html += "<h3> Friends : " + data.result[0].friendOfCount + "</h3>";
          html += "<h3> Problems solved : " + solved.size + "</h3>";
          let eff = correct / (correct + wrong);
          eff *= 100;
          eff = Math.round((eff + Number.EPSILON) * 100) / 100;
          html += "<h3> Efficiency : " + eff + "% </h3>";
          html += "<h3> Preferred Language : " + preferredLanguage + " </h3>";
          html += "</div>";
          html += "<div class='col-6'>";
          if (data.result[0].titlePhoto === "https://userpic.codeforces.org/no-title.jpg") {
            html += "<img class='profilePic' src='https://st3.depositphotos.com/7662228/14389/v/1600/depositphotos_143890825-stock-illustration-programmer-coder-in-the-workplace.jpg' >";
          } else {
            html += "<img class='profilePic' src='" + data.result[0].titlePhoto + "'>";
          }

          html += "</div>";

          $('#userProfile').append(html);

          html = "";
          html += "<h2>Unsolved Problems</h2><br>";
          html += "<p>";
          let cnt = 0;
          for (let [key, value] of unsolved) {
            let l = key.length;
            let task = "https://codeforces.com/problemset/problem/" + key.slice(0, l - 1) + "/" + key.slice(l - 1, l);
            html += "<a href='" + task + "'>" + key + "</a>     ";
            cnt++;
            if (cnt % 15 === 0) html += "<br>";
          }
          html += "</p>";
          $('#unsolvedProblems').append(html);

          let userRating = 1400;
          if (data.result[0].rank !== undefined) userRating = data.result[0].rating;
          console.log(leastProminent);
          randomProblemGenerator(solved, userRating);

        });
      });




    });
    // console.log(level.size);
  });


});



function drawChart(useData, userName) {
  // Define the chart to be drawn.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Element');
  data.addColumn('number', 'Percentage');
  data.addRows(useData);
  var options = {
    backgroundColor: '#CAF7E3',
    'title': 'Tags of ' + userName,
    'width': widthPieChart,
    'height': heightPieChart,
    pieHole: 0.4

  };
  // Instantiate and draw the chart.
  var chart = new google.visualization.PieChart(document.getElementById('myPieChart'));
  chart.draw(data, options);
}

function drawRatingChart(userRatingData, userName) {
  var data = google.visualization.arrayToDataTable(userRatingData);
  var view = new google.visualization.DataView(data);
  // view.setColumns([0, 1,
  //                  { calc: "stringify",
  //                    sourceColumn: 1,
  //                    type: "string",
  //                    role: "annotation" },
  //                  2]);

  var options = {
    title: "Problems solved by " + userName,
    width: widthBar,
    height: heightBar,
    backgroundColor: '#CAF7E3',
    bar: {
      groupWidth: "95%"
    },
    legend: {
      position: "right"
    },
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("userRatingChart"));
  chart.draw(data, options);
}

function drawProblemChart(userProblemData, userName) {
  var data = google.visualization.arrayToDataTable(userProblemData);
  var view = new google.visualization.DataView(data);
  // view.setColumns([0, 1,
  //                  { calc: "stringify",
  //                    sourceColumn: 1,
  //                    type: "string",
  //                    role: "annotation" },
  //                  2]);

  var options = {
    title: "Levels of Problems solved by " + userName,
    width: widthBar,
    height: heightBar,
    backgroundColor: '#CAF7E3',
    bars: "vertical",
    bar: {
      groupWidth: "95%",

    },
    legend: {
      position: "right"
    },
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("userProblemChart"));
  chart.draw(data, options);
}



function drawEfficiencyChart(useData, userName) {
  // Define the chart to be drawn.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Element');
  data.addColumn('number', 'Number');
  data.addRows(useData);
  var options = {
    backgroundColor: '#CAF7E3',
    'title': 'Efficiency of ' + userName,
    'width': widthPieChart,
    'height': heightPieChart,
    pieHole: 0.4,
  };
  // Instantiate and draw the chart.
  var chart = new google.visualization.PieChart(document.getElementById('efficiencyChart'));
  chart.draw(data, options);
}

console.log(widthPieChart);
console.log(heightPieChart);
