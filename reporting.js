//Ethan Armstrong
//w.ethan.armstrong.com@gmail.com
import wixData from "wix-data";

$w.onReady(function () {
	$w("#html1").onMessage( (event) => {
    //console.log(`Message received by page code: ${event.data}`);
  } );

});

export function seach(event) {
  let filter2 = $w('#filter2').value;
  //check wheather filtering parent player or both
  console.log(filter2);
  $w('#output').value = 'loading...';
  if (filter2 === 'Both'){
    both()
  }
  else if (filter2 === 'M'){
    p('Memberships')
  }
  else {
    fparent()
  }
}

function both () {
	// filters both parents and players
	let filter = $w('#filter').value;
  console.log(filter);

	let collection = "Memberships";
  let collection2 = "Parents";
  if (filter !== 'None'){
    wixData.query(collection)
      .eq("teamLevel", filter)
      .limit(1000)
      .find()
      .then( (players) => {
        console.log(players);
        wixData.query(collection2)
          .limit(1000)
          .find()
          .then( (parents) => {
            players = players.items
            parents = parents.items
            console.log(players)
            var out = [];
            
            for(var key in players){
              let player = players[key]
              out.push(player)
              for (key in parents) {
                let parent = parents[key]

                let str = parent.playerId;
                let ids = []
                let id = ''

                for (var i = 0; i < str.length; i++) {
                  let k = str.charAt(i);
                    if (k !== ',' && k !== ' '){
                      id += k;
                    }
                    else if (k === ','){
                      ids.push(id);
                      id = '';
                    }
                  }
                ids.push(id);
                console.log('ids')
                console.log(ids);
                for (i = 0; i < ids.length; i++){
                  let parentplayerId = ids[i]
                  if (player._id === parentplayerId) {
                    out.push(parent);
                  }
                }
              }
            }
            
            out = ConvertToCSV(JSON.stringify(out))
            console.log(out);
            $w("#output").value = out;




      })
        .catch( (err) => {
        console.log(err);
        });



      })
      .catch( (err) => {
        console.log(err);
      } );
  }
  else {
    wixData.query(collection)
      .limit(1000)
      .find()
      .then( (players) => {
        wixData.query(collection2)
          .limit(1000)
          .find()
          .then( (parents) => {
            players = players.items
            parents = parents.items
            //console.log(players)
            var out = [];
            
            for(var key in players){
              let player = players[key]
              out.push(player)
              for (key in parents) {
                let parent = parents[key]
                if (player._id === parent.playerId) {
                  out.push(parent);
                }
                else {
                  //console.log(player._id)
                }
              }
            }

            out = ConvertToCSV(JSON.stringify(out))
            //console.log(out);
            $w("#output").value = out;




      })
        .catch( (err) => {
        console.log(err);
        });



      })
      .catch( (err) => {
        console.log(err);
      } );
    
  }
}

function p (collection) {
  let filter = $w('#filter').value;

  if (filter === 'None'){
    wixData.query(collection)
      .limit(1000)
      .find()
      .then( (results) => {
        let out = results.items;
       out = ConvertToCSV(JSON.stringify(out))
            //console.log(out);
            $w("#output").value = out;
      } )
      .catch( (err) => {
        console.log(err);
      } );
  }
  else {
    //console.log(filter)
    wixData.query(collection)
      .eq("teamLevel", filter)
      .limit(1000)
      .find()
      .then( (results) => {
        let out = results.items
        out = ConvertToCSV(JSON.stringify(out))
        //console.log(out);
        $w("#output").value = out;
      } )
      .catch( (err) => {
        console.log(err);
        //console.log('err')
      } );
  }
}

function fparent () {
  //console.log('parent')
  let filter = $w('#filter').value;

	let collection = "Memberships";
  let collection2 = "Parents";

  //all parents
  if (filter === 'None'){
    wixData.query(collection2)
        .limit(1000)
        .find()
        .then( (parents) => {
          wixData.query(collection)
            .limit(1000)
            .find()
            .then( (players) => {
              players = players.items
              parents = parents.items
              //console.log(players)
              var out = [];
              
              for(var key in parents){
                let parent = parents[key]
                let str = parent.playerId;
                let ids = []
                let id = ''
                
                console.log(parent);
                console.log(str)
                if (str === undefined){
                  str = '';
                  parent.playerId = '';
                }
                parent.player = '';
                for (var i = 0; i < str.length; i++) {
                  let k = str.charAt(i);
                  if (k !== ',' && k !== ' '){
                    id += k;
                  }
                  else if (k === ','){
                    ids.push(id);
                    id = '';
                  }
                }

                if (id.length > 0){
                  ids.push(id)
                }
                while (parent.playerId.includes(',')){
                  let x = parent.playerId;
                  x = x.replace(',', "\\");
                  parent.playerId = x;
                }
                for (i = 0; i < ids.length; i++){
                  let playerParentId = ids[i];
                  //console.log(playerParentId);
                  //console.log('players: ');
                  //console.log(players)
                  for (key in players) {
                    let player = players[key]
                    if (player._id === playerParentId) {
                      let name = player.firstName + ' ' + player.lastName
                      //console.log(name);
                      parent.player += name;
                      parent.player += ',';
                    }

                  }
                  //parent.player = parent.player.slice(0, -1);
                  //parent.player = parent.player.slice(0, -1);
                  
                }
                
                out.push(parent);
              }

              out = ConvertToCSV(JSON.stringify(out))
              $w("#output").value = out;




            })

          .catch( (err) => {
            console.log(err);
          });
        })
    .catch( (err) => {
          console.log(err);
    });
  }
  
  //only parents with a certain class of player
  else{
    //query parent collection
    wixData.query(collection2)
        .limit(1000)
        .find()
        .then( (parents) => {
          //query players
          wixData.query(collection)
            .limit(1000)
            .find()
            .then( (players) => {
              //all parents and all player (need to change)
              players = players.items
              parents = parents.items

              //list that will eventually contain all the modified and formatted parents
              var out = [];
              
              //for each parent
              for(var key in parents){
                let parent = parents[key]
                let str = parent.playerId;
                let ids = []
                let id = ''
                
                //make sure parent has a player
                if (str === undefined){
                  str = '';
                  parent.playerId = '';
                }

                //initialize the parent, player name variable
                parent.player = '';
                //parse the parents player id to seperate parents with multiple player ids
                for (var i = 0; i < str.length; i++) {
                  let k = str.charAt(i);
                  if (k !== ',' && k !== ' '){
                    id += k;
                  }
                  else if (k === ','){
                    ids.push(id);
                    id = '';
                  }
                }

                //if there is an id add it to the ids list
                if (id.length > 0){
                  ids.push(id)
                }
                
                //replace the commas in the parents player id list with //'s for CSV formatting
                while (parent.playerId.includes(',')){
                  let x = parent.playerId;
                  x = x.replace(',', "\\");
                  parent.playerId = x;
                }
                //for each id in ids (which is the list of all the players id's attatched to he parent)
                for (i = 0; i < ids.length; i++){
                  let playerParentId = ids[i];

                  //for each player in all queried players
                  for (key in players) {
                    let player = players[key]

                    //if players id is euqal to the parents registered player id
                    if (player._id === playerParentId) {
                      let name = player.firstName + ' ' + player.lastName
                      
                      //set the parents player name equal to the names of the players associated with the id's
                      parent.player += name;
                      parent.player += ',';
                    }

                  }
                  
                }
                
                out.push(parent);
              }

              /*
              //
              //
              // ADD SORT FUNCTION FOR SPECIFIC LEVEL OF PLAYER HERE
              //
              //
              */

              out = ConvertToCSV(JSON.stringify(out))
              $w("#output").value = out;




            })

          .catch( (err) => {
            console.log(err);
          });
        })
    .catch( (err) => {
          console.log(err);
    });
    
  }
  


function ConvertToCSV(objArray) {
  //console.log('function');
  let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let json1 = array[0]

  let x = Object.keys(json1);

  for (var per in array){
	  let person = array[per];
	  var count = Object.keys(person).length;
	  if (count !== x.length){
		  break;
	  }
  }
  per = Object.keys(array[per]);
  //console.log(x,per)
  
  x = arrayUnique(x.concat(per));
  //console.log(x)

  delete x[x.indexOf("_updatedDate")];
  delete x[x.indexOf("_createdDate")];
  delete x[x.indexOf("_owner")];
  delete x[x.indexOf("title")];
  //console.log(x);
  
  var str = ''
  for (var i in x){
    let key = x[i];
    //console.log(key);
    str += key;
    str += ',';
  }
  str = str.slice(0, -1);
  str += '\n';

  for (i in array) {
    let json = array[i];
    for (var k in x){
      let key = x[k];

      if (key === 'address' && json[key] !== undefined){
        var bean = json[key];
       for (var lett in bean){
         bean = bean.replace(',', '-')
         //console.log(bean)
       }
       str += bean;

      }
      
      else if (json[key] !== undefined){
        str += json[key]
      }

      else{
        str += ''
      }
      str += ','

    }
    str = str.slice(0, -1);
    str += '\n';
  }
  return str
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

export function button2_click(event) {
  // send message to the HTML Component
  let data = $w('#output').value
  $w("#html1").postMessage(data);
}
