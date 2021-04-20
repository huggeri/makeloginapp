"use strict";

import * as lib from './lib.js';
var storage = chrome.storage;
var new_letters = lib.letters;
var def_first_translate = true;
var one_action_only = false;
			
// добавим настройки приложния в хранилище браузера на компьютере
// если в хранилище алфавита нет, тогда добавить из библиотеки
// если нет переменной - добавить
if(storage.local.get(["letters", "first_translate", "one_action_only"], (results) => {
	if(results.letters === undefined) {
		storage.local.set({
			"letters": new_letters
		});
	}
	
	if(results.first_translate === undefined) {
		storage.local.set({
			"first_translate": def_first_translate
		});
	}
	
	if(results.one_action_only === undefined) {
		storage.local.set({
			"one_action_only": one_action_only
		});
	}
}));

// взять значения из хранилища, если есть
if(storage.local.get("letters"	/*	, "file"]	*/	, (result) => {

	if(result.letters != undefined)
		new_letters = lib.copyArray(result.letters);
	
}));

// работаем с интерфейсом, когда окно загрузилось
window.onload = function() {
// элементы фио, результат и кнопка "получить логин"
    let tr_button = document.getElementById('trans-button');
    let resultf = document.getElementById('trans-result');
    let fio = document.getElementById('user-fio');

// элементы для изменения настроек и контейнер настроек
    let setting = document.getElementById('settings-container');
    let set_button = document.getElementById('settings-button');
	
// элементы для настрой правил
	let rulebutton = document.getElementById('setrules-button');
	let rulecontainer = document.getElementById('setrules-container');
	let rule = document.getElementById('first-translation');
    let subrule = document.getElementById('first-reduction');
	let checkbox_only = document.getElementById('checkbox-only');
	let checkbox_label = document.getElementById('checkbox-label');

// элементы для настройки букв
    let letter_setting_b = document.getElementById('setvalues-button');
	let table_container = document.getElementById('table-container');

// кнопка сохранения настроек
	let save_bttn = document.getElementById('save-values');
	
// запись в глобальные переменные данных из localStorage
	if(storage.local.get(["first_translate", "one_action_only"], (result) => {
		// устанавливаем правила
		if(result.first_translate != undefined) {
			if(result.first_translate)
				rule.checked = true;
			else
				subrule.checked = true;
		}
		
		if(result.one_action_only != undefined) {
			result.one_action_only ? checkbox_only.checked = true : checkbox_only.checked = false;
			if(rule.checked)
				checkbox_label.textContent = 'Только транслитерация';
			else
				checkbox_label.textContent = 'Только сокращение';
		}
	}));

// обработка клика радиальных правил (name: radioch)
	let rads = [rule, subrule];
	rads.forEach( rad => {
		rad.addEventListener('change', function() {
			if(rule.checked)
				checkbox_label.textContent = 'Только транслитерация';
			else
				checkbox_label.textContent = 'Только сокращение';
		});
	});
	
// нажатие на кнопку "получить логин"
    tr_button.onclick = function() {
		try {
			// делаем транслитерацию и / или сокращение
			let promise = new Promise((resolve, reject) => {
				let result = '';
					let fio_v = fio.value.toLowerCase();
					if(rule.checked) {    
						let transFIO = lib.translate(fio_v, new_letters);
						!checkbox_only.checked ? result += lib.reduct(transFIO) : result += transFIO;
					}
					else
					{
						let redFIO = lib.reduct(fio_v);
						!checkbox_only.checked ? result += lib.translate(redFIO, new_letters) : result += redFIO;
					}
				resolve(result);
			});
			
			promise.then(result => {
				resultf.setAttribute('value', result);
			});
		}	
        catch(error) {
            console.log(error);
		}
    }

// открыть интерфейс задания настроек
    set_button.onclick = function() {
        if(setting.hasAttribute('style'))
            setting.removeAttribute('style');
        else
            setting.setAttribute('style', 'display: none');
    }
	
// открыть блок задания правил
    rulebutton.onclick = function() {
        if(rulecontainer.hasAttribute('style'))
            rulecontainer.removeAttribute('style');
        else
            rulecontainer.setAttribute('style', 'display: none');
    }

// открыть блок инпутов для указания букв
    letter_setting_b.onclick = function() {
        if(table_container.hasAttribute('style')) {
			table_container.innerHTML = lib.getHTMLalphabet(new_letters);
            table_container.removeAttribute('style');
		}
        else {
            table_container.setAttribute('style', 'display: none');
		}
    }

// сохранить изменения настроек	
	save_bttn.onclick = function() {
	// сохранить новые значения букв
		if(!table_container.hasAttribute('style')) {
			let letters1 = new Array();
			let lettersHtml = document.getElementsByClassName('letter-container');
			
			for(let element of lettersHtml) {
				let label = element.querySelector('label');
				let mkey = label.textContent;
				let mvalue = element.querySelector('#' + label.getAttribute('for')).value;
				letters1.push([mkey, mvalue]);
			}
			letters1.push([' ', ' ']);
			
			new_letters = lib.copyArray(letters1);
			
			storage.local.set({
				"letters": new_letters
			});
		}
	
	// сохранить новое значение порядка транслитерации и сокращения
		if(!rulecontainer.hasAttribute('style')) {
			def_first_translate = rule.checked;
			one_action_only = checkbox_only.checked;
			
			storage.local.set({
				"first_translate": def_first_translate,
				"one_action_only": one_action_only
			});
		}
	}
}