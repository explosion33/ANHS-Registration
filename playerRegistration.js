//Ethan Armstrong
//w.ethan.armstrong.com@gmail.com
import wixData from "wix-data";
import wixLocation from 'wix-location';

//global variable for user information
var datas = {}

$w.onReady(function () {
	//on page load
	$w("#input3").onCustomValidation( (value, reject) => {
		//custom validation for phone number input field
		if(value.length !== 12) {
			//must be equal to 12 characters
  		}
		if(isNaN(remove_dash(value)) === true) {
			//must be a numbeer
			reject("must be a valid phone number");
		}
		

	});

});

export function submitToCollection(collection, data) {
	//submit new data to collection
	wixData.insert(collection, data)
		.then((res) => {
			//success
			$w('#Success').show();
			$w('#Error1').hide();
			$w('#Error2').hide();

			wixLocation.to("/redirect1");
		})
		.catch((err) =>{
			//err
			$w('#Success').hide();
			$w('#Error1').hide();
			$w('#Error2').show();
			console.log(err)
		});
}

export function updtaeMember(collection, data) {
	//uodates a member in databse
	wixData.update(collection, data)
		.then((res) => {
			//success
			console.log('updated')
			$w('#Success').show();
			$w('#Error1').hide();
			$w('#Error2').hide();
		})
		.catch((err) =>{
			//errr
			$w('#Success').hide();
			$w('#Error1').hide();
			$w('#Error2').show();
			console.log(err)
		});
}

export function button1_click(event) {
	//called on submit button click
	
	//gets all data from boxes and stores as variables
	let last = $w('#input1').value;
	let first = $w('#input2').value;
	let phone = $w('#input3').value;
	let email = $w('#input4').value;
	//let number = $w('#input5').value;
	let year = $w('#input6').value;
	let level = $w('#dropdown1').value;
	let confirm = $w("#radio1").value;
	
	//turn strings to ints
	year = parseInt(year);

	datas = {
					'firstName': first,
					'lastName': last,
					'phoneNumber': phone,
					'email': email,
					'graduationYear': year,
					'teamLevel': level,
					'confirm': confirm,
				}

	let v = $w('#input1').validity;
	console.log(v)

	//validity check for all 'input' boxes
	for (var i=0; i<4; i++) {
		var k = i +1
		if ($w('#' + "input" + k.toString()).validity.valid === false) {
			//if an input is invalid return null
			$w('#Success').hide();
			$w('#Error1').show();
			$w('#Error2').hide();
			return null
		}
	}
	
	var name = first + last;
	name = name.toLowerCase();

	wixData.query("Memberships")
	//checks for duplicate members
		.limit(1000)
		.find()
		.then((res) => {
			//after query
			var members = res.items;
			var len = res.length;
			var identical = null;

			//checks through query for matching names
			for (var j = 0; j < len; j++) {
				let member = members[j];
				let memberName = member.firstName + member.lastName;

				memberName = memberName.toLowerCase();

				if (memberName === name) {
					//if member exists stop searching
					console.log(name + 'esists');
					identical = member._id;
					break;
				}
			}

			//if there is no existing user
			if (identical === null) {
				//adds new user to collection
				submitToCollection("Memberships", datas)

			} else {
				// if member exisist enable prompt box to update member and disable input fields
				datas['_id'] = identical;
				$w('#promptBox').show()
				console.log('prompt box')
				$w('#input1').disable()
				$w('#input2').disable()
				$w('#input3').disable()
				$w('#input4').disable()
				$w('#radio1').disable()
				$w('#input6').disable()
				$w('#dropdown1').disable()
				$w('#button1').disable()
			}
			
		})
		.catch((err) =>{
			//error querying the database
			$w('#Success').hide();
			$w('#Error1').hide();
			$w('#Error2').show();
			console.log(err)
		});
}

export function Update_click(event) {
	//disables the 'would you like to update' box and re-enables all input fields
	//updates the current members information
	$w('#promptBox').hide()
	$w('#input1').enable()
	$w('#input2').enable()
	$w('#input3').enable()
	$w('#input4').enable()
	$w('#radio1').enable()
	$w('#input6').enable()
	$w('#dropdown1').enable()
	$w('#button1').enable()

	updtaeMember("Memberships", datas)
}

export function Cancel_click(event) {
	//disables the 'would you like to update' box and re-enables all input fields
	$w('#promptBox').hide()
	$w('#input1').enable()
	$w('#input2').enable()
	$w('#input3').enable()
	$w('#input4').enable()
	$w('#radio1').enable()
	$w('#input6').enable()
	$w('#dropdown1').enable()
	$w('#button1').enable()
}

export function phone_keyPress(event) {
	//gets called when a key is entered into the 'phone number' input box
	//adds dashes into the phone number
	let press = event.key;
	let str = $w('#input3').value;

	//makes sure the key being pressed is a number
	if ('1234567890'.includes(press)) {
		str += press;
	}

	let num = remove_dash(str)

	//adds a hyphen if the number has a length of 3 or 6
	if (num.length === 3 && press !== 'Backspace'){
		str += '-';
		$w('#input3').value = str;
	}
	if (num.length === 6 && press !== 'Backspace'){
		str += '-';
		$w('#input3').value = str;
		
	}
	
}

export function remove_dash(string) {
	//removes all -'s from a string
	let num = '';
	for (var i = 0; i < string.length; i++) {
  		let x = string.charAt(i);
		if (x !== '-') {
			num += x;
		}
	}
	return num;
}
