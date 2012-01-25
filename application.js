
// keytool -genkey -v -keystore com.appsmade4u.mobileagconnect -alias mobileagconnect -keyalg RSA -keysize 2048 -validity 10000
// http://maps.googleapis.com/maps/api/geocode/json?address=Tecumseh,+NE&sensor=false
// https://maps.googleapis.com/maps/api/geocode/xml?latlng=40.37850050,-96.17565929999999&sensor=false
// 38.635962,-099.932676
// http://maps.googleapis.com/maps/api/geocode/xml?latlng=38.635962,-099.932676&sensor=false

    function getGeoZip(urlLat,urlLng)
    {
      var userLINK = 'urlLat='+urlLat+'&urlLng='+urlLng;
      xmlhttp=new XMLHttpRequest();
      xmlhttp.open("POST","http://hfpintranet.heroku.com/servGPS",false);
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send(userLINK);
      var respText = xmlhttp.responseText.split("\n");
      for( var i = 0; i < respText.length; i++ )
      {
        if( respText[i].indexOf('postal_code') != -1 )
        {
          var res = respText[i-1].replace('<short_name>','').replace(/^\s+|\s+$/g, '').replace('</short_name>','');
        }
        if( respText[i].indexOf('<location_type>APPROXIMATE</location_type>') != -1 )
        {
          var lat = respText[i-3].replace('<lat>','').replace(/^\s+|\s+$/g, '').replace('</lat>','');
          var lng = respText[i-2].replace('<lng>','').replace(/^\s+|\s+$/g, '').replace('</lng>','');
        }
      }   
      return( res );
    }
    
    function initGrainDisplay()
    {
      if( window.navigator.onLine )
      {
        var arrInp = initGrain();
        window.localStorage.setItem('grainStore',arrInp);
        var arrResults = arrInp.split('^');
        document.getElementById('grainError').innerHTML = '';
        document.getElementById('gRefresh').style.display = 'inline';
      }else{
        document.getElementById('grainError').innerHTML = 'Offline - Using Stored Data';
        document.getElementById('gRefresh').style.display = 'none';
        arrInp = window.localStorage.getItem('grainStore');
        var arrResults = arrInp.split('^');
      }
      var eHTML = new Array();
      for( var i = 0; i < arrResults.length; i++ )
      {
        var rec = arrResults[i].split('|');
        if(rec[4].length == 8)
        {
          rec[4]='CLSD';
          var timeof = '<h4>Grain markets are closed</h4>';
        }else{
          var timeof = '<h4>Grain markets<br />as of ' + rec[4] + ' CST</h4>';
        }
        eHTML.push('<div class="ui-block-a" width="120px">'+rec[0].replace('Wheat','Wht')+'</div>');
        eHTML.push('<div class="ui-block-b" width="60px" align="right">'+rec[1]+'</div>');
        eHTML.push('<div class="ui-block-c" width="60px" align="right">'+rec[2]+'</div>');
        eHTML.push('<div class="ui-block-d" width="60px" align="right">'+rec[3]+'</div>');
      }
      document.getElementById('grain_timeof').innerHTML = timeof;
      document.getElementById('grainText').innerHTML = eHTML.join("\n");
    }

    function initLivestockDisplay()
    {
      if( window.navigator.onLine )
      {
        var arrInp = initLivestock();
        window.localStorage.setItem('livestockStore',arrInp);
        var arrResults = arrInp.split('^');
        document.getElementById('livestockError').innerHTML = '';
        document.getElementById('lRefresh').style.display = 'inline';
      }else{
        document.getElementById('livestockError').innerHTML = 'Offline - Using Stored Data';
        document.getElementById('lRefresh').style.display = 'none';
        arrInp = window.localStorage.getItem('livestockStore');
        var arrResults = arrInp.split('^');
      }
      var eHTML = new Array();
      for( var i = 0; i < arrResults.length; i++ )
      {
        var rec = arrResults[i].split('|');
        if(rec[4].length == 8)
        {
          rec[4]='CLSD';
          var timeof = '<h4>Livestock markets are closed</h4>';
        }else{
          var timeof = '<h4>Livestock markets<br />as of ' + rec[4] + ' CST</h4>';
        }
        eHTML.push('<div class="ui-block-a" width="34%">'+rec[0].replace('Feeder','Fdr')+'</div>');
        eHTML.push('<div class="ui-block-b" width="22%" align="right">'+rec[1]+'</div>');
        eHTML.push('<div class="ui-block-c" width="22%" align="right">'+rec[2]+'</div>');
        eHTML.push('<div class="ui-block-d" width="22%" align="right">'+rec[3]+'</div>');
      }
      document.getElementById('livestock_timeof').innerHTML = timeof;
      document.getElementById('livestockText').innerHTML = eHTML.join("\n");
    }

    function initGrain()
    {
      var url = new Array();
      url[0] = 'Corn|ZC|http://www.barchart.com/commodityfutures/Corn_Futures/ZC?search=ZC*|3';
      url[1] = 'HRW Wheat|KE|http://www.barchart.com/commodityfutures/KCBT_Wheat_Futures/KE?search=KE*|3';
      url[2] = 'Soybeans|ZS|http://www.barchart.com/commodityfutures/Soybeans_Futures/ZS?search=ZS*|3';
//    url[3] = 'Oats|ZO|http://www.barchart.com/commodityfutures/Oats_Futures/ZO?search=ZO*|3';
      
      var arrHTML = new Array();
      for( var i = 0; i < url.length; i++ )
      {
        retValues = callQuotes(url[i]).split('^');
        mastURL = url[i].split('|');
        mastLength = mastURL[3];
        var retLength = retValues.length;
        if( mastLength == 1 )
        {
          arrHTML.push(retValues[0]);
        }
        if( mastLength == 2 )
        {
          arrHTML.push(retValues[0]);
          arrHTML.push(retValues[retLength-1]);
        }
        if( mastLength == 3 )
        {
          arrHTML.push(retValues[0]);
          arrHTML.push(retValues[retLength-2]);
          arrHTML.push(retValues[retLength-1]);
        }
      }
    
      return arrHTML.join("^");
    }

    function initLivestock()
    {
      var url = new Array();
      url[0] = 'Live Cattle|LE|http://www.barchart.com/commodityfutures/Live_Cattle_Futures/LE?search=LE*|3';
      url[1] = 'Feeder Cattle|GF|http://www.barchart.com/commodityfutures/Feeder_Cattle_Futures/GF?search=GF*|3';
      url[2] = 'Lean Hogs|HE|http://www.barchart.com/commodityfutures/Lean_Hogs_Futures/HE?search=HE*|3';  
//    url[3] = 'CME Milk|DL|http://www.barchart.com/commodityfutures/Class_III_Milk_Futures/DL?search=DL*|1';
    
      var arrHTML = new Array();
      for( var i = 0; i < url.length; i++ )
      {
        retValues = callQuotes(url[i]).split('^');
        mastURL = url[i].split('|');
        mastLength = mastURL[3];
        var retLength = retValues.length;
        if( mastLength == 1 )
        {
          arrHTML.push(retValues[0]);
        }
        if( mastLength == 2 )
        {
          arrHTML.push(retValues[0]);
          arrHTML.push(retValues[retLength-1]);
        }
        if( mastLength == 3 )
        {
          arrHTML.push(retValues[0]);
          arrHTML.push(retValues[retLength-2]);
          arrHTML.push(retValues[retLength-1]);
        }
      }
    
      return arrHTML.join("^");
    
    }

      function callQuotes(url)
      {
      var ctrlString = url.split('|');
      var url = ctrlString[2];
      var userLINK = 'urlCalled='+url;
      var tDay = new Date();
      var tYear = tDay.getFullYear();
      var thisYear = String(parseInt(tYear) - 2000 );
      var nextYear = String( (parseInt(tYear) + 1 ) - 2000 );
      xmlhttp=new XMLHttpRequest();
      xmlhttp.open("POST","http://hfpintranet.heroku.com/servCall",false);
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send(userLINK);
      var respText = xmlhttp.responseText.split("\n");
      var outHTML = new Array();
      for( var i = 0; i< respText.length; i++ )
      {
        if( respText[i].indexOf('<tr id="dt1_'+ctrlString[1]) != -1 && ( respText[i].indexOf(thisYear) != -1 || respText[i].indexOf(nextYear) != -1 ) )
        {
          var quote_tmp = respText[i+1].replace('</td>','').replace('</a>','').replace('</span>','').split('>')[3];
          var quote = quote_tmp.replace("'",'').replace(')','').split('(')[1];
          var last = respText[i+2].replace('</td>','').replace('</a>','').replace('</span>','').split('>')[1];
          var change = respText[i+3].replace('</td>','').replace('</a>','').replace('</span>','').split('>')[2];
          var curr_date = respText[i+9].replace('</td>','').replace('</a>','').replace('</span>','').split('>')[1];
          if( outHTML.length < 3)
          {
            outHTML.push(ctrlString[0] + '|' + quote + '|' + last + '|' + change + '|' + curr_date );
          }else{
            i = 99999;
          }
        }
      }
      return outHTML.join('^');
    }


    function initGdocsNews()
    {
//    var url = 'https://spreadsheets.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0Am9r9QdhGdrkdEFsQUxSMGFYQ0lvS1poX2k1T0tubEE&output=txt';
      if( !window.navigator.onLine )
      {
        dataBack = window.localStorage.getItem('gdocsNews');
        document.getElementById('newsError').innerHTML = 'Offline - Using stored data';
      }else{
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","http://hfpintranet.heroku.com/gdocs",false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send();
        var dataBack = xmlhttp.responseText;
        window.localStorage.setItem('gdocsNews',dataBack);
        document.getElementById('newsError').innerHTML = '';
      }
      var resText = new Array();
      var myArr = dataBack.split("\n");
      var lastRec = myArr.length - 1;
      for( var i = lastRec; i > 0 ; i--)
      {
        var myRec = myArr[i].split("\t");
        if( myRec[1] == 'News' )
        {
          resText.push('<div data-role="collapsible" data-collapsed="true">');
          resText.push('<h3>'+myRec[2]+'&nbsp;&nbsp;'+myRec[3]+'</h3>');
          resText.push('<p align="left">'+myRec[4]+'</p>');
          resText.push('</div>');
        }
      }
      document.getElementById('newsResp').innerHTML = resText.join("\n");
    }
    
    function initGdocsYields()
    {
//    var url = 'https://spreadsheets.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0Am9r9QdhGdrkdEFsQUxSMGFYQ0lvS1poX2k1T0tubEE&output=txt';
      if( NETWORK_STATE == '0' )
      {
        dataBack = window.localStorage.getItem('gdocsYields');
        document.getElementById('yieldsError').innerHTML = 'Offline - Using stored data';
      }else{
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","http://hfpintranet.heroku.com/gdocs",false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send();
        var dataBack = xmlhttp.responseText;
        window.localStorage.setItem('gdocsYields',dataBack);
        document.getElementById('yieldsError').innerHTML = '';
      }
      var resText = new Array();
      var myArr = dataBack.split("\n");
      var lastRec = myArr.length - 1;
      for( var i = lastRec; i > 0 ; i--)
      {
        var myRec = myArr[i].split("\t");
        if( myRec[1] == 'Yields' )
        {
          resText.push('<div data-role="collapsible" data-collapsed="true">');
          resText.push('<h3>'+myRec[2]+'&nbsp;&nbsp;'+myRec[3]+'</h3>');
          resText.push('<p align="left">'+myRec[4]+'</p>');
          resText.push('</div>');
        }
      }
      document.getElementById('yieldsResp').innerHTML = resText.join("\n");
    }
    
    function newZip()
    {
      var inZip = document.getElementById('inZip').value;
      if(inZip.length == 5)
      {
        window.localStorage.setItem('wthrzip',inZip);
        document.getElementById('inZip').value = '';
        initWthr();
      }
    }
        
    function initWthr()
    {
      if( !window.localStorage.getItem('wthrzip') )
      {
        var useZip = '68508';
        window.localStorage.setItem('wthrzip',useZip);
      }else{
         var useZip = window.localStorage.getItem('wthrzip');
      }
      if( window.navigator.onLine )
      {
        var url = 'http://www.google.com/ig/api?weather='+useZip+'&hl=en_US';
        var userLINK = 'urlCalled='+url;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","http://hfpintranet.heroku.com/servCall",false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send(userLINK);
        var respText = xmlhttp.responseText;
        window.localStorage.setItem('wthrdata',respText);
        document.getElementById('wthrError').innerHTML = '';
        document.getElementById('wthrSrch').style.display = 'inline';
        document.getElementById('gpsShow').style.display = 'inline';
      }else{
        respText = window.localStorage.getItem('wthrdata');
        document.getElementById('wthrError').innerHTML = 'Offline - Using stored data';
        document.getElementById('wthrSrch').style.display = 'none';
        document.getElementById('gpsShow').style.display = 'none';
      }
      var retArray = respText.split('>');
      document.getElementById('city').innerHTML = retArray[4].split('"')[1];
      document.getElementById('zip').innerHTML = retArray[5].split('"')[1];
      var today_date = retArray[8].split('"')[1].split('-');
      var today_name = retArray[21].split('"')[1];
      document.getElementById('today_is').innerHTML = today_name+' - '+today_date[1]+'/'+today_date[2]+'/'+today_date[0]; 
      document.getElementById('condition').innerHTML = retArray[13].split('"')[1];
      document.getElementById('temp_f').innerHTML = retArray[14].split('"')[1] + '&nbsp;degrees';
      document.getElementById('humidity').innerHTML = retArray[16].split('"')[1].replace('Humidity: ','');
      document.getElementById('curr_icon').src = 'http://www.google.com' + retArray[17].split('"')[1];
      document.getElementById('wind_cond').innerHTML = retArray[18].split('"')[1].replace('Wind: ','');
      document.getElementById('today_low').innerHTML = retArray[22].split('"')[1];
      document.getElementById('today_high').innerHTML = retArray[23].split('"')[1];
      document.getElementById('today_cond').innerHTML = retArray[25].split('"')[1];
      document.getElementById('tomorrow_name').innerHTML = retArray[28].split('"')[1];
      document.getElementById('tomorrow_low').innerHTML = retArray[29].split('"')[1];
      document.getElementById('tomorrow_high').innerHTML = retArray[30].split('"')[1];
      document.getElementById('tomorrow_icon').src = 'http://www.google.com' + retArray[31].split('"')[1];
      document.getElementById('tomorrow_cond').innerHTML = retArray[32].split('"')[1].replace('Thunderstorm','TStorm').replace(' ','<br />');
      document.getElementById('next_name').innerHTML = retArray[35].split('"')[1];
      document.getElementById('next_low').innerHTML = retArray[36].split('"')[1];
      document.getElementById('next_high').innerHTML = retArray[37].split('"')[1];
      document.getElementById('next_icon').src = 'http://www.google.com' + retArray[38].split('"')[1];
      document.getElementById('next_cond').innerHTML = retArray[39].split('"')[1].replace('Thunderstorm','TStorm').replace(' ','<br />');
      document.getElementById('after_name').innerHTML = retArray[42].split('"')[1];
      document.getElementById('after_low').innerHTML = retArray[43].split('"')[1];
      document.getElementById('after_high').innerHTML = retArray[44].split('"')[1];
      document.getElementById('after_icon').src = 'http://www.google.com' + retArray[45].split('"')[1];
      document.getElementById('after_cond').innerHTML = retArray[46].split('"')[1].replace('Thunderstorm','TStorm').replace(' ','<br />');
    }

    