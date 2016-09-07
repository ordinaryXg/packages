/**
 * Created by admin on 2016/8/29.
 */
'use strict';

// windows
let arrMain = []; // main menu OBJ
let arrty = []; // lable name
let array = []; // windows and macOS accelerator
let inputStr = []; // Input the content has been modified

// macOS
let _arrMain = []; // OBJ
let _arrty = []; // lable name
let _array = []; // macOS accelerator
let _inputStr = []; // Input the content has been modified

// other
let arrpath = []; // menu item path
let arrby = []; // menu item role
let mainMenu = ''; // main menu initial value
const macOS = ['about', 'hide', 'hideothers', 'unhide', 'startspeaking', 'stopspeaking', 'front', 'zoom', 'window', 'help', 'services'];

Editor.Panel.extend({

    style: `
        .input1{
            color: #000;
            float: right;
            width: 150px;
            border: 1px solid #fff;
            border-color:#CDC5D0;
            border-radius:6px;
            background-color: #5F6F75;
        }
        .input1:focus{
            border-color:#000;
        }
        .boom{
            height: 25px;
            width: 290px;
            padding: 3px;
            text-align:center;
            border-bottom:1px solid #000;
            background-color: #353433;
        }
        .main-windows{
            width: 310px;
            height:440px;
            padding-top: 5px;
            overflow-y:auto;
            display:block;
        }
        .main-macOS{
            width: 310px;
            height:450px;
            padding-top: 10px;
            overflow-y:auto;
            display:none;
        }
        .main-boom{
            width: 143px;
            padding: 3px;
            background-color: #65411e;
        }
        .uiInputDiv{
            float: right;
            width: auto;
            height: 20px;
        }
    `,

    template: `
    <div class="main-noe">
       <ui-button class="main-boom" id="general">
           默认控件快捷
       </ui-button>
       <ui-button class="main-boom" id="mac">
           macOS控件快捷
       </ui-button>
    </div>
    <div class="main-windows" id="windowsDiv"></div>
    <div class="main-macOS" id="macOSDiv"></div>

    <ui-button id="btn1" style="position:absolute; bottom: 0; left: 50px;" >保存 @.@</ui-button>
    <ui-button id="btn2" style="position:absolute; bottom: 0; left: 170px;" >重置 -。-</ui-button>
    `,

    $: {
        btn1: '#btn1',
        btn2: '#btn2',
        windowsDiv: '#windowsDiv',
        macOSDiv: '#macOSDiv',
        general: '#general',
        mac: '#mac'
    },

    ready() {

        // Achieve global keyboard events to capture test
        // Solution a: monitored shielding global keyboard events, with a new definition of shortcut instead of triggering these events.
        // Solution b: mark the modified plug-in, delete the plug-in, and modify accelerate properties and rebuild the plug-in.
        //
        // this.addEventListener('keyup',event =>{
        //    console.log(Editor.KeyCode(event.keyCode));
        //    let input = document.getElementsByClassName("input");
        //    for(let i= 0 ;i< input.length ;i++){
        //        if(input[i].focus == true){
        //            console.log('1111');
        //        }
        //    }
        //    if(this.abkeyCode === '') this.abkeyCode = Editor.KeyCode(event.keyCode);
        //    else this.abkeyCode = this.abkeyCode + '+' + Editor.KeyCode(event.keyCode);
        // });

        Editor.Ipc.sendToMain('ordiry-package:obtain');

        // btn1 triggering event
        this.$btn1.addEventListener('confirm', () => {

            const input_one = this.$windowsDiv.childNodes;
            const input_two = this.$macOSDiv.childNodes;

            //windows
            for (let i = 0; i < input_one.length; i++) {
                const value = input_one[i].childNodes[1].childNodes[0].value;
                inputStr.push(value);

                if (array[i] !== inputStr[i]) console.log("windows change");
            }

            //macOS
            for (let i = 0; i < input_two.length; i++) {
                const value = input_two[i].childNodes[1].childNodes[0].value;
                _inputStr.push(value);

                if (_array[i] !== _inputStr[i]) console.log("macOS change");
            }

            console.log(array, _array);
            console.log(arrty, _arrty);
            console.log(arrMain, _arrMain);
            console.log(inputStr, _inputStr);

            const index = {
                lable: 'Tester_index',
                path: '开发者/ Tester',
                enabled: true,
                accelerator: 'CmdOrCtrl+E'
            };

            // OK, let test!
            //
            // Editor.MainMenu.remove ( 'Cocos Creator/关于Cocos Creator' );
            // Editor.MainMenu.add( 'Panel',strArrMain[0]);
            //
            // The update will restart the creator?
            // Editor.MainMenu.update('开发者/Tester',index);
            //
            // Accelerator shall not modify directly.
            // Editor.MainMenu.set('Panel/Tester',index);

        });

        // btn2 triggering event
        this.$btn2.addEventListener('confirm', () => {

            let input_one = this.$windowsDiv.childNodes;
            let input_two = this.$macOSDiv.childNodes;

            for (let i = 0; i < input_one.length; i++) {
                input_one[i].childNodes[1].childNodes[0].value = array[i];
            }

            for (let i = 0; i < input_two.length; i++) {
                input_two[i].childNodes[1].childNodes[0].value = _array[i];
            }

        });


        this.$general.addEventListener('confirm', () => {

            this.$windowsDiv.style.display = 'block';
            this.$macOSDiv.style.display = 'none';
        });

        this.$mac.addEventListener('confirm', () => {

            this.$windowsDiv.style.display = 'none';
            this.$macOSDiv.style.display = 'block';
        });



    },

    messages: {
        'huoqu:atyle' (event, err) {
            // console.log(err);
            mainMenu = err;

            storeData(err);

            for (let i = 0; i < array.length; i++) {
                this.SearchOrder(arrty[i], array[i]);
            }

            for (let i = 0; i < _array.length; i++) {
                this.SearchOrder(_arrty[i], _array[i], true);
            }

            // Store the data
            function storeData(atr) {
                for (let i in atr) {
                    if (i === 'accelerator' && atr[i] !== null) {

                        if (contains(atr.role, macOS)) {
                            _array.push(atr.accelerator);
                            _arrty.push(atr.label);
                            _arrMain.push(atr);
                        } else {
                            array.push(atr.accelerator);
                            arrty.push(atr.label);
                            arrMain.push(atr);
                        }

                        arrby.push(atr.role);
                    }

                    if (typeof atr[i] === 'object' && i !== 'menu' && i !== 'items') storeData(atr[i]);
                }
            }

            // A if obj belongs to the array
            function contains(a, obj) {

                for (var i = 0; i < obj.length; i++) {
                    if (obj[i] === a) {
                        return true;
                    }
                }

                return false;
            }
        }
    },

    //
    SearchOrder(name, arr, bool) {

        // creat div
        let boom = document.createElement('div');
        boom.className = 'boom';
        if (bool) this.$macOSDiv.appendChild(boom);
        else this.$windowsDiv.appendChild(boom);

        // creat span
        let packageName = document.createElement('span');
        packageName.className = 'span1';
        boom.appendChild(packageName);
        packageName.innerHTML = name;

        //creat uiInputDiv
        let uiInputDiv = document.createElement('div');
        uiInputDiv.className = 'uiInputDiv';
        boom.appendChild(uiInputDiv);

        //
        let uiInput = document.createElement('input');
        uiInput.onkeyup = "val=val.replace(/[^\w=@&]|_/ig,'')";
        uiInput.name = 'atttry';
        uiInput.className = 'input1';
        uiInput.value = arr;
        uiInputDiv.appendChild(uiInput);

        uiInput.onfocus = function() {
            let arr = '';
            this.addEventListener('keyup', event => {

                uiInput.value = uiInput.value.replace(/[\a-\z\A-\Z\0-\9\@\.]/g, function() {
                    return ''
                });

                let arry = arr.split('+');

                if (arry.length < 4) {
                    if (arr === '') arr = Editor.KeyCode(event.keyCode);
                    else arr = arr + '+' + Editor.KeyCode(event.keyCode);
                    uiInput.value = arr;
                } else {
                    uiInput.value = arr;
                    arr = '';
                    alert(" 最多指定快捷键数量不得超过4个！");
                }

                // console.log(event.keyCode);
            });
        };
        uiInput.onblur = function() {
            // TODO any
        };

        // test
        //
        // for(let i = 0 ; i < number ; i++){
        //    let uiInput = document.createElement('ui-input');
        //    if(arr[number -i-1]==='CmdOrCtrl') uiInput.className = 'input1';
        //    else if(arr[number -i-1]==='Shift' ||arr[number -i-1]==='Alt') uiInput.className = 'input2';
        //    else uiInput.className = 'input3';
        //    uiInputDiv.appendChild(uiInput);
        //    uiInput.value = arr[number -i-1];
        //    uiInput.addEventListener('checkbox',() =>{
        //        console.log( uiInput.value);
        //    });
        //
        //    if(i !== number - 1){
        //        let uiDiv = document.createElement('div');
        //        uiDiv.style.float = 'right';
        //        uiInputDiv.appendChild(uiDiv);
        //        uiDiv.innerHTML = '+ ';
        //    }
        // }
    }
});
