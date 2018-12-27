(function(){
    
    // Inicia o firebase Firebase
    var config = {
        apiKey: "AIzaSyDAn5ejMx-B2IG1ZJtf_gBosHdPaGJtF8w",
        authDomain: "myhome-2d29a.firebaseapp.com",
        databaseURL: "https://myhome-2d29a.firebaseio.com",
        projectId: "myhome-2d29a",
        storageBucket: "myhome-2d29a.appspot.com",
        messagingSenderId: "839135220951"
      };
    firebase.initializeApp(config);
  
    var db = firebase.database();
  
    // Cria os listeners dos dados no firebase
    var tempRef = db.ref('temperature');
    var umidRef = db.ref('humidity');
    var presenceRef = db.ref('presence');
    var lampRefQuarto = db.ref('lampQuarto');
    var lampRefSala = db.ref('lampSala');
    var musicRef = db.ref('music');
  
  
    // Registra as funções que atualizam os gráficos e dados atuais da telemetria
    tempRef.on('value', onNewData('currentTemp', 'tempLineChart' , 'Temperatura', 'C°'));
    umidRef.on('value', onNewData('currentUmid', 'umidLineChart' , 'Umidade', '%'));
  
  
    // Registrar função ao alterar valor de presença
    presenceRef.on('value', function(snapshot){
      var value = snapshot.val();
      var el = document.getElementById('currentPresence')
      if(value){
        el.classList.add('green-text');
      }else{
        el.classList.remove('green-text');
      }
    });

     // Registrar função ao alterar valor da lampada quarto
     var currentLampValueQuarto = false;
     lampRefQuarto.on('value', function(snapshot){
       var value = snapshot.val();
       var el = document.getElementById('currentLampQuarto')
       if(value){
         el.classList.add('amber-text');
       }else{
         el.classList.remove('amber-text');
       }
       currentLampValueQuarto = !!value;
     });
  
    // Registrar função ao alterar valor da lampada sala
    var currentLampValueSala = false;
    lampRefSala.on('value', function(snapshot){
      var value = snapshot.val();
      var el = document.getElementById('currentLampSala')
      if(value){
        el.classList.add('amber-text');
      }else{
        el.classList.remove('amber-text');
      }
      currentLampValueSala = !!value;
    });


    // Registrar função ao alterar valor do botão da musica
    var currentMusicValue = false;
    musicRef.on('value', function(snapshot){
      var value = snapshot.val();
      var el = document.getElementById('currentMusic')
      if(value){
        el.classList.add('amber-text');
        el.innerHTML = 'pause_circle_filled';
        setTimeout(function(){musicRef.set(false);}, 1000);
      }else{
        el.classList.remove('amber-text');
        el.innerHTML = 'play_circle_filled';
      }
      currentMusicValue = !!value;
    });

      
    // Registrar função de click no botão de lampada
    var btnLampQuarto = document.getElementById('btn-lampQuarto');
    btnLampQuarto.addEventListener('click', function(evt){
      lampRefQuarto.set(!currentLampValueQuarto);
    });

    // Registrar função de click no botão de lampada
    var btnLampSala = document.getElementById('btn-lampSala');
    btnLampSala.addEventListener('click', function(evt){
      lampRefSala.set(!currentLampValueSala);
    });

     // Registrar função de click no botão de musica
     var btnMusic = document.getElementById('btn-music');
     btnMusic.addEventListener('click', function(evt){
       musicRef.set(!currentMusicValue);
     });
  
  })();
  
  
  // Retorna uma função que de acordo com as mudanças dos dados
  // Atualiza o valor atual do elemento, com a metrica passada (currentValueEl e metric)
  // e monta o gráfico com os dados e descrição do tipo de dados (chartEl, label)
  function onNewData(currentValueEl, chartEl, label, metric){
    return function(snapshot){
      var readings = snapshot.val();
      if(readings){
          var currentValue;
          var data = [];
          for(var key in readings){
            currentValue = readings[key]
            data.push(currentValue);
          }
  
          document.getElementById(currentValueEl).innerText = currentValue + ' ' + metric;
          buildLineChart(chartEl, label, data);
      }
    }
  }
  
  // Constroi um gráfico de linha no elemento (el) com a descrição (label) e os
  // dados passados (data)
  function buildLineChart(el, label, data){
    var elNode = document.getElementById(el);
    new Chart(elNode, {
      type: 'line',
      data: {
          labels: new Array(data.length).fill(""),
          datasets: [{
              label: label,
              data: data,
              borderWidth: 1,
              fill: false,
              spanGaps: false,
              lineTension: 0.1,
              backgroundColor: "#F9A825",
              borderColor: "#F9A825"
          }]
      }
    });
  }