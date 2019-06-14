//Ethan Armstrong
//w.ethan.armstrong@gmail.com

import wixData from "wix-data";
import wixLocation from 'wix-location';

//global variable for player info
var datas = {}

$w.onReady(function () {
	//called on page load
	//all three functions are custom validations for the phone number input pages
	$w("#input3").onCustomValidation( (value, reject) => {
		if(value.length !== 12) {
    		reject("must be a valid phone number");
  		}
		let val = remove_dash(value)
		if(isNaN(val) === true) {
			reject("must be a valid phone number");
		}
	});
	$w("#input6").onCustomValidation( (value, reject) => {
		if(value.length !== 12 && value.length > 0) {
    		reject("must be a valid phone number");
  		}
		let val = remove_dash(value)
		if(isNaN(val) === true) {
			reject("must be a valid phone number");
		}
	});
	$w("#input7").onCustomValidation( (value, reject) => {
		if(value.length !== 12 && value.length > 0) {
    		reject("must be a valid phone number");
  		}
		let val = remove_dash(value)
		if(isNaN(val) === true) {
			reject("must be a valid phone number");
		}
	});
});

export function submitToCollection(collection, data) {
	wixData.insert(collection, data)
		.then((res) => {
			console.log('inserted')
			$w('#Success').show();
			$w('#Error1').hide();
			$w('#Error2').hide();
			$w('#Error3').hide();
			console.log('Redirecting...');
			wixLocation.to("/redirect2");
		})
		.catch((err) =>{
			$w('#Success').hide();
			$w('#Error1').hide();
			$w('#Error2').show();
			$w('#Error3').hide();
			console.log(err)
		});
}

export function updtaeMember(collection, data) {
	wixData.update(collection, data)
		.then((res) => {
			$w('#Success').show();
			$w('#Error1').hide();
			$w('#Error2').hide();
			$w('#Error3').hide();
		})
		.catch((err) =>{
			$w('#Success').hide();
			$w('#Error1').hide();
			$w('#Error2').show();
			$w('#Error3').hide();
			console.log(err)
		});
}

export function button1_click_1(event) {
	let last = $w('#input1').value;
	let first = $w('#input2').value;
	let phone = $w('#input3').value;
	let email = $w('#input4').value;
	let playerLast = $w('#input5').value;
	let phone2 = $w('#input6').value;
	let phone3 = $w('#input7').value;
	let ad1 = $w("#input8").value;
	let ad2 = $w("#input9").value;
	let ad3 = $w("#input10").value;
	let address = ad1 + ", " + ad2 + ", " + ad3;
	let radio = $w('#radio1').value;
	datas = {
					'firstName': first,
					'lastName': last,
					'phoneNumber': phone,
					'otherPhone': phone2,
					'otherPhone2': phone3,
					'email': email,
					'address': address,
					'consent': radio,
			}
	AddParent(playerLast);
	console.log('after finding player:')
	console.log(datas)
	for (var i=0; i<9; i++) {
		if (i !== 7 && i !== 6) {
			var k = i +1
			if ($w('#' + "input" + k.toString()).validity.valid === false) {
				$w('#Success').hide();
				$w('#Error1').show();
				$w('#Error2').hide();
				$w('#Error3').hide();
				return null
			}
		}
	}
	
	var name = first + last;
	name = name.toLowerCase();
	wixData.query("Parents")
		.limit(1000)
		.find()
		.then((res) => {
			var members = res.items;
			var len = res.length;
			var identical = null;
			for (var j = 0; j < len; j++) {
				let member = members[j];
				let memberName = member.firstName + member.lastName;
				memberName = memberName.toLowerCase();
				if (memberName === name) {
					//console.log(name + 'esists');
					identical = member._id;
					break;
				}
			}
			if (identical === null) {
				console.log('new user');
				console.log(datas)
				submitToCollection("Parents", datas)
				/*$w('#input1').value = null;
				$w('#input2').value = null;
				$w('#input3').value = null;
				$w('#input4').value = null;
				$w('#input5').value = null;
				$w('#input6').value = null;
				$w('#input7').value = null;
				$w('#input8').value = null;
				$w('#input9').value = null;
				$w('#input10').value = null;*/
			} else {
				datas['_id'] = identical;
				$w('#promptBox').show()
				$w('#input1').disable()
				$w('#input2').disable()
				$w('#input3').disable()
				$w('#input4').disable()
				$w('#input5').disable()
				$w('#input6').disable()
				$w('#input7').disable()
				$w('#button1').disable()
				$w('#input8').disable()
				$w('#input9').disable()
				$w('#input10').disable()
			}
		})
		.catch((err) =>{
			$w('#Success').hide();
			$w('#Error1').hide();
			$w('#Error2').show();
			$w('#Error3').hide();
			console.log(err)
		});
}

export function Update_click(event) {
	$w('#promptBox').hide()
	$w('#input1').enable()
	$w('#input2').enable()
	$w('#input3').enable()
	$w('#input4').enable()
	$w('#input5').enable()
	$w('#input6').enable()
	$w('#input7').enable()
	$w('#input8').enable()
	$w('#input9').enable()
	$w('#input10').enable()
	$w('#button1').enable()
	updtaeMember("Parents", datas)
}

export function Cancel_click(event) {
	$w('#promptBox').hide()
	$w('#input1').enable()
	$w('#input2').enable()
	$w('#input3').enable()
	$w('#input4').enable()
	$w('#input5').enable()
	$w('#input6').enable()
	$w('#input7').enable()
	$w('#input8').enable()
	$w('#input9').enable()
	$w('#input10').enable()
	$w('#button1').enable()
}

export function AddParent(lastname) {
	wixData.query('Memberships')
		.limit(1000)
		.find()
		.then((res) => {
			let members = res.items
			console.log('query results:');
			console.log(res)
			let IDS = '';
			for (var key in members){
				let member = members[key];
				console.log('player last name:');
				console.log(member['lastName']);
				console.log('parent added player last name:');
				console.log(lastname);
				if (member['lastName'].toLowerCase() === lastname.toLowerCase()) {
					IDS += member['_id'];
					IDS += ','
				}
			}
			if (IDS.length === 0) {
				$w('#Success').hide();
				$w('#Error1').hide();
				$w('#Error2').hide();
				$w('#Error3').show();
				console.log('id not found')
				datas = null
			} else {
				IDS = IDS.splice(0,-1);
				console.log('id found, datas:');
				datas['playerId'] = IDS;
				
				console.log(datas);
			}
		})
		.catch((err) =>{
			console.log(err)
		});
}

export function phone_keyPress(event) {
	let press = event.key;
	let str = $w('#input3').value;
	if ('1234567890'.includes(press)) {
		str += press;
	}
	let num = remove_dash(str)
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
	let num = '';
	for (var i = 0; i < string.length; i++) {
  		let x = string.charAt(i);
		if (x !== '-') {
			num += x;
		}
	}
	return num;
}

export function input6_keyPress(event) {
	let press = event.key;
	let str = $w('#input6').value;
	if ('1234567890'.includes(press)) {
		str += press;
	}
	let num = remove_dash(str)
	if (num.length === 3 && press !== 'Backspace'){
		str += '-';
		$w('#input6').value = str;
	}
	if (num.length === 6 && press !== 'Backspace'){
		str += '-';
		$w('#input6').value = str;
	} 
}

export function input7_keyPress(event) {
	let press = event.key;
	let str = $w('#input7').value;
	if ('1234567890'.includes(press)) {
		str += press;
	}
	let num = remove_dash(str)
	if (num.length === 3 && press !== 'Backspace'){
		str += '-';
		$w('#input7').value = str;
	}
	if (num.length === 6 && press !== 'Backspace'){
		str += '-';
		$w('#input7').value = str;
	} 
}
