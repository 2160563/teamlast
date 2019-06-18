<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>TeamPalak</title>
      <title>TeamPalak</title>
    <script>
    if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service worker registered.', reg);
        });
  });
}
        </script>
<meta name="description" content="Teampalak">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- styles -->
  <link href="assets/css/bootstrap.css" rel="stylesheet">
  <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
  <link href="assets/css/docs.css" rel="stylesheet">
  <link href="assets/css/prettyPhoto.css" rel="stylesheet">
  <link href="assets/js/google-code-prettify/prettify.css" rel="stylesheet">
  <link href="assets/css/nivo-slider.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300|Open+Sans:400,300,300italic,400italic" rel="stylesheet">
  <link href="assets/css/style.css" rel="stylesheet">
  <link href="assets/color/success.css" rel="stylesheet">

  <!-- fav and touch icons -->
  <link rel="shortcut icon" href="assets/img/roundlogo.png">
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/ico/apple-touch-icon-144-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/ico/apple-touch-icon-114-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/ico/apple-touch-icon-72-precomposed.png">
  <link rel="apple-touch-icon-precomposed" href="assets/ico/apple-touch-icon-57-precomposed.png">

  <!-- ======================================================= 
    Theme Name: Scaffold
    Theme URL: https://bootstrapmade.com/scaffold-bootstrap-metro-style-template/
    Author: BootstrapMade.com
    Author URL: https://bootstrapmade.com
  ======================================================= -->
</head>

<body>

  <header>
    <!-- Navbar
    ================================================== -->
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <!-- logo -->
          <a class="brand logo" href="/">
            <img src="assets/img/logo.png" alt="" />
          </a>
          <!-- end logo -->

          <!-- top menu -->
          <div>
              <nav>
                <ul class="nav topnav">
                  <li class="dropdown success">
                    <a href="/client"><i class="icon-home icon-white"></i> Home</a>
                  </li>
                  <li class="dropdown primary">
                
                      <a href="/registered_tournaments"><i class="icon-bullhorn icon-white"></i> Registered Tournaments</a>
    
                    </li>
          
          <li class="dropdown warning ">
                    <a href="/login_Tournaments"><i class="icon-bullhorn icon-white"></i> Tournaments</a>
                 
                  </li>
           
        <li class="dropdown success active">
                    <a href="/results"><i class="icon-leaf icon-white"></i> Result</a>
             </li>
                                   <li class="dropdown warning">
                    <a href="/history"><i class="icon-bullhorn icon-white"></i> History</a>
                  </li>
              <li class="dropdown info">
                    <a href="#"><i class="icon-list icon-white"></i>My Account</a>
                    <ul class="dropdown-menu">
                      <li><a href="/userProfile">View Account</a></li>
                      <li><a href="/editProfile">Edit Account</a></li>
                      <li><a href="/logout">Sign Out</a></li>
                    </ul>
                  </li>
         
                </ul>
              </nav>
            </div>
          <!-- end menu -->
        </div>
      </div>
    </div>
  </header>

   <section id="subintro">
    <div class="jumbotron subhead" id="overview">
      <div class="container">
        <div class="row">
          <div class="span8">
      <h1 id="tr">Tournament Results</h1>
            <p>See the top players for each tournament</p>
          </div>
          <div class="span4">
            <div class="input-append">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container">
    <%console.log("data is = "+data.length)%>
    <% for(var gamectr = 0; gamectr < 10; gamectr++){ %>
      <% if(data[gamectr].length > 0 && data1.length > 0){ %>
      <% 
      var pIGN = data1[0].InGameName;
      var sumctr = data[gamectr].findIndex(obj => obj.pName==pIGN);
    %>
      <div id="Sample">
        <%if (data[gamectr][sumctr].win=="true"){ %>
          <table style="background-color: #A3CFEC" class="table table-hover">
              <thead class="black white-text">
                  <th>Victory</th>
          <% }else{ %>
          <table style="background-color: #E2B6B3" class="table table-hover">
              <thead class="black white-text">
                  <th>Defeat</th>
          <% } %>

              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              
              <tr>
              <th scope="col">Summoner Name </th>
              <th scope="col">Items</th>
              <th scope="col">CS</th>
              <th scope="col">Gold Earned</th>
              <th scope="col">KDA</th>
              <th scope="col">Damage</th>
              </tr>
              <!-- <% var sumctr = 0;%>   -->
                <% 
                  var pIGN = data1[0].InGameName;
                  var sumctr = data[gamectr].findIndex(obj => obj.pName==pIGN);
                %>
                      <td>
                          <table name = "sum<%= sumctr%>" >
                              <tr>
                                <td id = "cpp<%= sumctr%>" name = "cpp<%= sumctr%>" rowspan="2">
                                    <%if (data[gamectr][sumctr].champIcon != undefined){%>
                                      <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].champIcon,'binary').toString('base64')%>" alt="">
                                        <%}else{%>
                                        <img src="images/logo.png" alt="" width="65" height="65">
                                  <%}%>
                                </td>
                                <td id = "ss1p<%= sumctr%>" name = "ss1p<%= sumctr%>"  > 
                                    <%if (data[gamectr][sumctr].spellIconA!= undefined){%>
                                      <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].spellIconA,'binary').toString('base64')%>" alt="">
                                        <%}else{%>
                                        <img src="images/logo.png" alt="" width="65" height="65">
                                  <%}%>
                                </td>
                              </tr>
                              <tr>
                                <td id = "ss2p<%= sumctr%>" name = "ss2p<%= sumctr%>"  >
                                    <%if (data[gamectr][sumctr].spellIconB!= undefined){%>
                                      <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].spellIconB,'binary').toString('base64')%>" alt="">
                                        <%}else{%>
                                        <img src="images/logo.png" alt="" width="65" height="65">
                                  <%}%>
                                </td>
                              </tr>
                              <tr>
                                <td id = "snp<%= sumctr%>" name = "snp<%= sumctr%>"  ><%= data[gamectr][sumctr].pName%></td>
                              </tr>
                            </table>
                      </td>
                      <td>
                          <table name = "items">
                          <tr>
                            <td id = "i1p<%= sumctr%>" name = "i1p<%= sumctr%>"  >
                                <%if (data[gamectr][sumctr].itemIconQ!= undefined){%>
                                  <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconQ,'binary').toString('base64')%>" alt="">
                                    <%}else{%>
                                    <img src="images/icon.png" alt="" width="65" height="65">
                              <%}%>
                            </td>
                            <td id = "i2p<%= sumctr%>" name = "i2p<%= sumctr%>"  >
                                <%if (data[gamectr][sumctr].itemIconW!= undefined){%>
                                  <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconW,'binary').toString('base64')%>" alt="">
                                    <%}else{%>
                                    <img src="images/icon.png" alt="" width="65" height="65">
                              <%}%>
                            </td>
                            <td id = "i3p<%= sumctr%>" name = "i3p<%= sumctr%>"  >
                                <%if (data[gamectr][sumctr].itemIconE!= undefined){%>
                                  <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconE,'binary').toString('base64')%>" alt="">
                                    <%}else{%>
                                    <img src="images/icon.png" alt="" width="65" height="65">
                              <%}%>
                            </td>
                            <td id = "i7p<%= sumctr%>" name = "i7p<%= sumctr%>"  >
                                <%if (data[gamectr][sumctr].itemIconU!= undefined){%>
                                  <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconU,'binary').toString('base64')%>" alt="">
                                    <%}else{%>
                                    <img src="images/icon.png" alt="" width="65" height="65">
                              <%}%>
                            </td>        
                          </tr>
                          <tr>
                            <td id = "i4p<%= sumctr%>" name = "i4p<%= sumctr%>"  >
                                <%if (data[gamectr][sumctr].itemIconR!= undefined){%>
                                  <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconR,'binary').toString('base64')%>" alt="">
                                    <%}else{%>
                                    <img src="images/icon.png" alt="" width="65" height="65">
                              <%}%>
                            </td>
                            <td id = "i5p<%= sumctr%>" name = "i5p<%= sumctr%>"  >
                                <%if (data[gamectr][sumctr].itemIconT!= undefined){%>
                                  <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconT,'binary').toString('base64')%>" alt="">
                                    <%}else{%>
                                    <img src="images/icon.png" alt="" width="65" height="65">
                              <%}%>
                            </td>
                            <td id = "i6p<%= sumctr%>" name = "i6p<%= sumctr%>"  >
                                <%if (data[gamectr][sumctr].itemIconY!= undefined){%>
                                  <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconY,'binary').toString('base64')%>" alt="">
                                    <%}else{%>
                                    <img src="images/icon.png" alt="" width="65" height="65">
                              <%}%>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td id = "csp<%= sumctr%>" name = "csp<%= sumctr%>" ><%= data[gamectr][sumctr].CreepScore%></td>
                      <td id = "gp<%= sumctr%>" name = "gp<%= sumctr%>" ><%= data[gamectr][sumctr].goldearned%></td>
                      <td id = "kdap<%= sumctr%>" name = "kdap<%= sumctr%>" ><%= data[gamectr][sumctr].KDA%></td>
                      <td id = "dp<%= sumctr%>" name = "dp<%= sumctr%>" ><%= data[gamectr][sumctr].Damage%></td>
                      <td colspan="3">
                          <button class="btn btn-primary" data-toggle="collapse" data-target=".result<%= gamectr%>"
                            aria-expanded="false" aria-controls="collapseExample">
                            Collapse me
                          </button>

                      </td>
                </tr>
              </thead>
            </table>
      </div>


      <div class="result<%= gamectr%> collapse">
        <div class="table-responsive table-hover">
          <table style="background-color: #A3CFEC" class="table table-hover">
           <thead class="black white-text">
            <th>Victory</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            
            <tr>
            <th scope="col">Summoner Name </th>
            <th scope="col">Items</th>
            <th scope="col">CS</th>
            <th scope="col">Gold Earned</th>
            <th scope="col">KDA</th>
            <th scope="col">Damage</th>
            </tr>
            <!-- <% var sumctr = 0;%>   -->
            <% for(var sumctr = 0; sumctr < 5; sumctr++){ %>
              <% var pIGN = data1[0].InGameName %>
              <% if(sumctr == data[gamectr].findIndex(obj => obj.pName==pIGN)){%>
              <tr style="background-color: #C6DBE9">
              <%}else{%>
              <tr>
              <%}%>
                <td>
                    <table name = "sum<%= sumctr%>" >
                        <tr>
                          <td id = "cpp<%= sumctr%>" name = "cpp<%= sumctr%>"   rowspan="2">
                              <%if (data[gamectr][sumctr].champIcon != undefined){%>
                                <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].champIcon,'binary').toString('base64')%>" alt="">
                                  <%}else{%>
                                  <img src="images/logo.png" alt="" width="65" height="65">
                             <%}%>
                          </td>
                          <td id = "ss1p<%= sumctr%>" name = "ss1p<%= sumctr%>"  > 
                              <%if (data[gamectr][sumctr].spellIconA!= undefined){%>
                                <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].spellIconA,'binary').toString('base64')%>" alt="">
                                  <%}else{%>
                                  <img src="images/logo.png" alt="" width="65" height="65">
                             <%}%>
                          </td>
                        </tr>
                        <tr>
                          <td id = "ss2p<%= sumctr%>" name = "ss2p<%= sumctr%>"  >
                              <%if (data[gamectr][sumctr].spellIconB!= undefined){%>
                                <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].spellIconB,'binary').toString('base64')%>" alt="">
                                  <%}else{%>
                                  <img src="images/logo.png" alt="" width="65" height="65">
                             <%}%>
                          </td>
                        </tr>
                        <tr>
                          <td id = "snp<%= sumctr%>" name = "snp<%= sumctr%>"  ><%= data[gamectr][sumctr].pName%></td>
                        </tr>
                      </table>
                </td>
                <td>
                    <table name = "items">
                    <tr>
                      <td id = "i1p<%= sumctr%>" name = "i1p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconQ!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconQ,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i2p<%= sumctr%>" name = "i2p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconW!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconW,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i3p<%= sumctr%>" name = "i3p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconE!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconE,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i7p<%= sumctr%>" name = "i7p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconU!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconU,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>        
                    </tr>
                    <tr>
                      <td id = "i4p<%= sumctr%>" name = "i4p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconR!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconR,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i5p<%= sumctr%>" name = "i5p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconT!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconT,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i6p<%= sumctr%>" name = "i6p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconY!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconY,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                    </tr>
                  </table>
                </td>
                <td id = "csp<%= sumctr%>" name = "csp<%= sumctr%>" ><%= data[gamectr][sumctr].CreepScore%></td>
                <td id = "gp<%= sumctr%>" name = "gp<%= sumctr%>" ><%= data[gamectr][sumctr].goldearned%></td>
                <td id = "kdap<%= sumctr%>" name = "kdap<%= sumctr%>" ><%= data[gamectr][sumctr].KDA%></td>
                <td id = "dp<%= sumctr%>" name = "dp<%= sumctr%>" ><%= data[gamectr][sumctr].Damage%></td>
              <% } %>
              </tr>
            </thead>
          </table>
          <table class="table table-hover">

            <tr>
              <td><h1>VS</h1></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
          <table  style="background-color: #E9E0E0" class="table table-hover">
           <thead class="black white-text">

            <tr>
               <th>Defeat</th>
               <th></th>
               <th></th>
               <th></th>
               <th></th>
               <th></th>
               <th></th>

            <tr>
            <th scope="col">Summoner Name </th>
            <th scope="col">Items</th>
            <th scope="col">CS</th>
            <th scope="col">Gold Earned</th>
            <th scope="col">KDA</th>
            <th scope="col">Damage</th>
            </tr>
            <!-- <% var sumctr = 0;%>   -->
            <% for(var sumctr = 5; sumctr < 10; sumctr++){ %>
              <% var pIGN = data1[0].InGameName %>
              <% if(sumctr == data[gamectr].findIndex(obj => obj.pName==pIGN)){%>
              <tr style="background-color: #E1D1D0">
              <%}else{%>
              <tr>
              <%}%>
                <td>
                    <table name = "sum<%= sumctr%>">
                        <tr>
                          <td id =  "cpp<%= sumctr%>" name =  "cpp<%= sumctr%>"   rowspan="2">
                              <%if (data[gamectr][sumctr].champIcon!= undefined){%>
                                <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].champIcon,'binary').toString('base64')%>" alt="">
                                  <%}else{%>
                                  <img src="images/icon.png" alt="" width="65" height="65">
                             <%}%>
                          </td>
                          <td id = "ss1p<%= sumctr%>" name = "ss1p<%= sumctr%>"  >
                              <%if (data[gamectr][sumctr].spellIconA!= undefined){%>
                                <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].spellIconA,'binary').toString('base64')%>" alt="">
                                  <%}else{%>
                                  <img src="images/icon.png" alt="" width="65" height="65">
                             <%}%>
                          </td>
                        </tr>
                        <tr>
                          <td id = "ss2p<%= sumctr%>" name = "ss2p<%= sumctr%>"  >
                              <%if (data[gamectr][sumctr].spellIconB!= undefined){%>
                                <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].spellIconB,'binary').toString('base64')%>" alt="">
                                  <%}else{%>
                                  <img src="images/icon.png" alt="" width="65" height="65">
                             <%}%>
                          </td>
                        </tr>
                        <tr>
                          <td id = "snp<%= sumctr%>" name = "snp<%= sumctr%>"  ><%= data[gamectr][sumctr].pName%></td>
                        </tr>
                      </table>
                </td>
                <td>
                    <table name = "items">
                    <tr>
                      <td id = "i1p<%= sumctr%>" name = "i1p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconQ!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconQ,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i2p<%= sumctr%>" name = "i2p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconW!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconW,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i3p<%= sumctr%>" name = "i3p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconE!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconE,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i7p<%= sumctr%>" name = "i7p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconU!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconU,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>        
                    </tr>
                    <tr>
                      <td id = "i4p<%= sumctr%>" name = "i4p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconR!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconR,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i5p<%= sumctr%>" name = "i5p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconT!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconT,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                      <td id = "i6p<%= sumctr%>" name = "i6p<%= sumctr%>"  >
                          <%if (data[gamectr][sumctr].itemIconY!= undefined){%>
                            <img src="data:img/png; base64, <%=new Buffer(data[gamectr][sumctr].itemIconY,'binary').toString('base64')%>" alt="">
                              <%}else{%>
                              <img src="images/icon.png" alt="" width="65" height="65">
                         <%}%>
                      </td>
                    </tr>
                  </table>
                </td>
                <td id = "csp<%= sumctr%>" name = "csp<%= sumctr%>" ><%= data[gamectr][sumctr].CreepScore%></td>
                <td id = "gp<%= sumctr%>" name = "gp<%= sumctr%>" ><%= data[gamectr][sumctr].goldearned%></td>
                <td id = "kdap<%= sumctr%>" name = "kdap<%= sumctr%>" ><%= data[gamectr][sumctr].KDA%></td>
                <td id = "dp<%= sumctr%>" name = "dp<%= sumctr%>" ><%= data[gamectr][sumctr].Damage%></td>
              <% } %>
              </tr>
            </tr>
           </thead>
          </table>
        </div>
      </div>
        <%}else if (data[0].length == 0){%>
          <h3>You haven't played</h3>
        <% break; }else{ break;%>
          <h3> You have no other games</h3>
        <%}%>
      <%}%> 
      <!-- for loop end -->
  </div>

  <!-- Footer
 ================================================== -->
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="span4">
          <div class="widget">
            <h4>About us</h4>
            <address>
          <strong>Team Palak</strong><br>
          113 M.Roxas Street Brgy. Tabora<br>
          Baguio City, Philippines<br>
          <abbr title="Phone">Phone:</abbr> (074) 620-3935
          </address>

            <address>
          <strong>Contact us</strong><br>
          <a href="mailto:#">TeamPalak.ph@gmail.com</a>
          </address>
          </div>
        </div>
       
        <div class="span4">
          <div class="widget">
            <h4>What is Team Palak?</h4></h4>
            <form class="form-horizontal" action="#" method="post">
              <fieldset>
                <p>
                  Team Palak is an e-game tournament maker that caters to gamers who would want to
          join in tournaments. Team Palak provides gamers with more accesibility  to information
          regarding e-Sports tournaments.
                </p>

              </fieldset>
            </form>
            <ul class="social_small">
              <li class="facebook first"><a href="https://www.facebook.com/TeamPalak.ph/" title="Facebook">Facebook</a></li>
              <li class="twitt"><a href="https://twitter.com/TeamPalakPH" title="Twitter">Twitter</a></li>
       
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="verybottom">
      <div class="container">
        <div class="row">
          <div class="span6">
            <p>&copy; Team Palak - All right reserved</p>
          </div>
          <div class="span6">
            <div class="pull-right">
              <div class="credits">
                <!--
                  All the links in the footer should remain intact.
                  You can delete the links only if you purchased the pro version.
                  Licensing information: https://bootstrapmade.com/license/
                  Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=Scaffold
                -->
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </footer>

  <script src="assets/js/jquery-1.8.2.min.js"></script>
  <script src="assets/js/jquery.easing.1.3.js"></script>
  <script src="assets/js/google-code-prettify/prettify.js"></script>
  <script src="assets/js/modernizr.js"></script>
  <script src="assets/js/bootstrap.js"></script>
  <script src="assets/js/jquery.elastislide.js"></script>
  <script src="assets/js/jquery.flexslider.js"></script>
  <script src="assets/js/jquery.prettyPhoto.js"></script>
  <script src="assets/js/application.js"></script>
  <script src="assets/js/nivo/jquery.nivo.slider.js"></script>
  <script src="assets/js/nivo/setting.js"></script>
  <script src="assets/js/hover/jquery-hover-effect.js"></script>
  <script src="assets/js/hover/setting.js"></script>

  <!-- Template Custom JavaScript File -->
  <script src="assets/js/custom.js"></script>

</body>

</html>
