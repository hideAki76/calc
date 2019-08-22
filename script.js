console.clear();
const btns = document.getElementById("btn");
const primaryDisplay = document.getElementById("display");
const secondaryDisplay = document.getElementById("secondary-display");
let currentString = '';		//数式
let resultString = '';		//入力された数字・記号の一時保管
let num_formula = 0;			//入力される自然数の制御用（１０個以下）
let zero_flg = false;			//"0"の入力制御
//let lastOperator = false;

//画面出力用の関数の作成
const primaryRender = (value) => {
  primaryDisplay.innerText = value;
}

const secondaryRender = (value) => {
  secondaryDisplay.innerText = value;
}

//画面の初期表示
secondaryRender('0');
primaryRender('0');

const evaluate = (e) => {
  let width = secondaryDisplay.scrollWidth;
  if(width > 310){
    secondaryDisplay.style.overflowX = 'scroll';
    secondaryDisplay.scrollLeft = width;
  }
  else{
    secondaryDisplay.style.overflowX = 'hidden';
  }
  
	//入力されたボタンの値を"value"に代入
  let value = e.target.innerText;
	
	//数値が入力されたときに実行
  if (value >= '0' && value <= '9') {
    let len = currentString.length;
    let lastOp = isOp(currentString[len - 1]);
    /*if (lastOperator) {
    	if (value == '0' && zero_flg == false);
    	else{
		    currentString = currentString.concat(value);
		    resultString = "".concat(value);
		    secondaryRender(currentString);
		    primaryRender(resultString);
		    lastOperator = false;
    		zero_flg = true;
    	}
    } else {*/
  	if (value == '0' && zero_flg == false){
  		if (currentString[len - 1] == '0'){
	  		currentString = currentString.substring(0,len-1);
  		}
  		currentString = currentString.concat(value);
      resultString = "".concat(value);
      secondaryRender(currentString);
      primaryRender(resultString);
  	}else {
  		if (currentString[len - 1] == '0' && zero_flg == false){
  			currentString = currentString.substring(0,len-1);
  			resultString = ""
  		}
  		//"value"の値をを各変数の値と結合し電卓上に表示
      currentString = currentString.concat(value);
      resultString = resultString.concat(value);
      secondaryRender(currentString);
      primaryRender(resultString);
  		zero_flg = true;
    	}
    //}
	
  //演算子が入力されたときに実行
  } else if (isOp(value)) {
  	//演算子が最初に入力された場合は実行しない
    if (currentString.length == 0 && (value == '/' || value == '*'|| value == '+'|| value == '-'));
    else {
    	//入力できる自然数の制限（10個以下）
    	if (num_formula == 9);
    	else{
    		
	      resultString = "";
	      primaryRender(value);
	      //lastOperator = true;
	      let len = currentString.length;
	      let lastOp = isOp(currentString[len - 1]);
	      if (lastOp) {
	      	//数字入力前に再度記号が入力された場合演算子を置き換える
	        currentString = currentString.substr(0, len - 1) + value;
	        console.log(currentString);
	        secondaryRender(currentString);
	      } else {
	      	//"value"の値をを変数と結合し電卓上に表示
	        currentString = currentString.concat(value);
	        secondaryRender(currentString);
	      	num_formula = num_formula + 1;
	      	zero_flg = false;
	      }
    	}
    }
  
  //"="が押されたとき
  } else if (value == '=') {
    secondaryDisplay.style.overflowX = 'hidden';
    //電卓の入力がない場合はスキップ
    if (currentString.length == 0);
  	//計算結果取得後、使用した各変数の初期と結果画面への表示
    else {
    	let result = calc(currentString);
      resultString = '';
      currentString = '';
    	num_formula = 0;
    	zero_flg = false;
      secondaryRender('0');
      primaryRender(result);
    }
  
  //"C"が押されたとき
  //各変数の初期化
  } else if (value == 'C') {
    currentString = '';
    resultString = '';
  	num_formula = 0;
  	zero_flg = false;
    secondaryRender('0');
    primaryRender('0');
  }
		//スクロールバーの表示/非表示切り替え
    let width1 = primaryDisplay.scrollWidth;
    if(width1 > 310) {
      primaryDisplay.style.overflowX = 'scroll';
    }
    else{
      primaryDisplay.style.overflowX = 'hidden';
    }
}


//すべてのボタンにクリックイベントを追加
for (let elem of btns.children) {
  elem.addEventListener('click', evaluate);
}

//入力された数式の最後の文字が演算子の場合"true"を返す
function isOp(value) {
  return (/\+|\-|\*|\//).test(value);
}

//演算処理
function calc(currentString) {
	var s = currentString;
	var len = s.length;
	var str = s.substring(len - 1);
	if (s.indexOf('/0') != -1) {
		res = "0の除算はできません";
		return res;
	}
	if (str=='+' || str=='-' || str=='*' || str=='/') {
	    s=s.substring(0,len-1);
	}
	var infix   = split_formula(s);
	var postfix = get_postfix(infix);
	var res = calcPostfix(postfix);
	return res;
}

//数式を演算子とオペランドに分割する
//配列に中置記法で格納
function split_formula(s) {
	    var a = new Array();
	    s = s + " "; var literal = "";
		//数式の最後（空白）までループ
	    for (i = 0; i < s.length; i++) {
	        var c = s.charAt(i);
	    	//"c"の値が演算子だった場合、配列"a"に演算子と数字を代入する。
	        if ('+-*/ '.indexOf(c) != -1) {
	        	if (literal != '') a.push(literal)
	        	if (c != ' ') a.push(c)
	            literal = ''; 
	        } else {
	        	//数字を代入
	            literal = literal + c;
	        }
	    }
    	return a;
}

//中置記法を後置記法に変換する
//(例）入力：1 + 2 * 3 - 4 / 5
//     出力：1 2 3 * + 4 5 / -
function get_postfix(infix) {
	var postfix = new Array();
	expression(infix, postfix);
	return postfix;
}

//掛け算割り算の並び替え
function term(infix, postfix) {
	//数字を"postfix"に代入
	postfix.push(infix.shift());
	while (1) {
	    var c = infix[0];
		//"c"に代入されている値が"*"か"/"の時
	    if (c == '*' || c == '/') {
	    	//"c"に代入した"infix"の値の削除;数値を代入;演算子を代入;
	        infix.shift(); postfix.push(infix.shift()); postfix.push(c);
	    } else {
	        break;
	    }
	}
}

	
//足し算引き算の並び替え
function expression(infix, postfix) {
	term(infix, postfix);
	while (1) {
	    var c = infix[0];
		//"c"に代入されている値が"+"か"-"の時
	    if (c == '+' || c == '-') {
	    	//"c"に代入した"infix"の値の削除;関数"term"呼び出し;演算子を代入;
	    	//次の演算子が"*"、"/"の場合そちらが優先して並び替えられる。
	        infix.shift(); term(infix, postfix); postfix.push(c);
	    } else {
	        break;
	    }
	}
}

//後置記法に置き換えた数式を計算する
function calcPostfix(postfix) {
	var stack = new Array();
	for (i = 0; i < postfix.length; i++) {
			//"postfix"の要素の0番目から順に数字をスタックする
			//演算子を取得したら計算実行
	    var c = postfix[i];
	    switch (c) {
	        case '+': stack.push(  stack.pop() + stack.pop()); break;
	        case '-': stack.push( -stack.pop() + stack.pop()); break;
	        case '*': stack.push(  stack.pop() * stack.pop()); break;
	        case '/': stack.push(1/stack.pop() * stack.pop()); break;
	    	//数字を数値に変換して代入
	        default:  stack.push(parseInt(c));
	    }
	}
	//計算結果を返す
	return stack[0];
}
