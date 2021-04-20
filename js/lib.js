"use strict";
// буквы и перевод
export const letters = new Array(
    ['а', 'a'],
    ['б', 'b'],
    ['в', 'v'],
    ['г', 'g'],
    ['д', 'd'],
    ['е', 'e'],
    ['ё', 'yo'],
    ['ж', 'zh'],
    ['з', 'z'],
    ['и', 'i'],
    ['й', 'j'],
    ['к', 'k'],
    ['л', 'l'],
    ['м', 'm'],
    ['н', 'n'],
    ['о', 'o'],
    ['п', 'p'],
    ['р', 'r'],
    ['с', 's'],
    ['т', 't'],
    ['у', 'u'],
    ['ф', 'f'],
    ['х', 'h'],
    ['ц', 'c'],
    ['ч', 'ch'],
    ['ш', 'sh'],
    ['щ', 'shch'],
    ['ь', ''],
    ['ы', 'y'],
    ['ъ', ''],
    ['э', 'e'],
    ['ю', 'yu'],
    ['я', 'ya'],
    ['.', '.'],
    ['-', '-'],
    [' ', ' ']
);

// функция get для массива, по аналогии с Map.get
function get(arr, key) {
	let result = '';
	arr.forEach( element => {
		if(element[0] == key)
			result = element[1];
	});
	return result;
}

// функция транслитерации строки
export function translate(str, letters) {
    let result = '';

    for(let i = 0; i < str.length; i++) {
        result += get(letters, str[i]);
    }
    return result;
}

// функция сокращения строки
export function reduct(str) {
    let sub = str.split(' ');

    let result = (sub[1][0] + '.') + (sub[2] ? sub[2][0] + ['.'] : ['']) + sub[0];
    return result;
}

// получить строку с html кодом для отобажения алфавита
export function getHTMLalphabet(letters) {
	let subarr = new Array();
	
	letters.forEach((element, index) => {
		if(element[0] != ' ') {
			let a = index;
			let b = element[0];
			let c = element[1];
			const htmlstring = `<div class="letter-container"><label for="letter${a}" class="letter-label">${b}</label><input class="letter-input" type="text" id="letter${a}" value="${c}"></div>`;
			let htmlrealstring = '';
			htmlrealstring += htmlstring;
			subarr.push(htmlrealstring);
		}
	});

	return subarr.join('');
}

// скопировать массив, в т.ч. если он состоит из других массивов 
export function copyArray(fromArr) {
	let toArr = new Array();
	fromArr.forEach( elem => {
		if(Array.isArray(elem)) {			
			let subarr = copyArray(elem);
			toArr.push(subarr);
		}
		else {
			toArr.push(elem);
		}
	});
	return toArr;
}