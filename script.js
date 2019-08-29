console.clear();
/**
 * ボタンオブジェクト
 * @const btns
 */
const btns = document.getElementById("btn");
/**
 * 計算結果表示領域
 * @const primaryDisplay
 */
const primaryDisplay = document.getElementById("display");
/**
 * 計算過程表示領域
 * @const secondaryDisplay
 */
const secondaryDisplay = document.getElementById("secondary-display");
/**
 * 数式
 * @type {string}
 */
let currentString = '';
/**
 * 入力された数字・記号の一時保管
 * @type {string}
 */
let resultString = '';
/**
 * 入力される自然数の制御用（１０個以下）
 * @type {number}
 */
let num_formula = 0;
/**
 * "0"の入力制御
 * @type {boolean}
 */
let zero_flg = false;

/**
 * 計算結果画面出力
 */
const primaryRender = (value) => {
  /**
   * @param {value} value - 計算結果に出力する値
   */
  primaryDisplay.innerText = value;
}

/**
 * 計算式画面出力
 */
const secondaryRender = (value) => {
  /**
   * @param {value} value - 計算結果に出力する値
   */
  secondaryDisplay.innerText = value;
}

//画面の初期表示
secondaryRender('0');
primaryRender('0');

/**
 * ボタンクリックイベント
 * 入力されたボタンの値によって各種評価／処理を行う
 */
const evaluate = (e) => {

    // 表示幅調整
    AdjustScrollbar();

    // クリックされたボタンの値を取得
    let value = e.target.innerText;

    ////////// 数値
    if (value >= '0' && value <= '9') {
        let len = currentString.length;
        if(len == 0 && value ==0) {
            resultString = "";
        }
        else{
            // 0の連続入力はスキップ
            if (zero_flg == false && currentString[len - 1] == '0'){
                currentString = currentString.substring(0, len-1);
            }
            else{
                // 入力された値を入力済み値と結合し電卓上に表示
                currentString = currentString.concat(value);
                resultString = resultString.concat(value);
                secondaryRender(currentString);
                primaryRender(resultString);
                zero_flg = true;
            }
        }
    ////////// 演算子
    } else if (isOp(value)) { 
        // 演算子が最初に入力された場合はスキップ
        if (currentString.length == 0 && (value == '/' || value == '*'|| value == '+'|| value == '-'));
        else {
        // 入力できる自然数の制限（10個以下）
        if (num_formula == 9);
        else{
            resultString = "";
            primaryRender(value);
            let len = currentString.length;
            let lastOp = isOp(currentString[len - 1]);
            if (lastOp) {
                // 数字入力前に再度記号が入力された場合演算子を置き換える
                currentString = currentString.substr(0, len - 1) + value;
                console.log(currentString);
                secondaryRender(currentString);
            } else {
                // 入力された値を入力済み値と結合し電卓上に表示
                currentString = currentString.concat(value);
                secondaryRender(currentString);
                num_formula = num_formula + 1;
                zero_flg = false;
            }
        }
    }
    ////////// "="（計算実行ボタン）
    } else if (value == '=') {
        // 入力がない場合はスキップ
        if (currentString.length == 0);
        // 計算結果取得後、使用した各変数の初期と結果画面への表示
        else {
            let result = calc(currentString);
            ShowValues(result);
        }
    ////////// "C"(Clearボタン)
    } else if (value == 'C') { 
        ShowValues(0);
    }

    // 表示幅調整
    AdjustScrollbar();
}

/**
 * 表示幅調整
 */
const AdjustScrollbar = () => {
    let width = primaryDisplay.scrollWidth;
    if(width > 310) {
        primaryDisplay.style.overflowX = 'scroll';
    }
    else{
        primaryDisplay.style.overflowX = 'hidden';
    }
}

/**
 * 変数の初期化
 */
const ShowValues = (value) => {
    resultString = '';
    currentString = '';
    num_formula = 0;
    zero_flg = false;
    secondaryRender('0');
    primaryRender(value);
}

/**
 * 入力された数式の最後の文字が演算子の場合"true"を返す
 */
const isOp = (value) => {
    return (/\+|\-|\*|\//).test(value);
}

/**
 * 演算処理
 */
const calc = (currentString) => {
    let s = currentString;
    let len = s.length;
    let str = s.substring(len - 1);
    if (s.indexOf('/0') != -1) {
        res = "0の除算はできません";
        return res;
    }
    if (str=='+' || str=='-' || str=='*' || str=='/') {
        s=s.substring(0,len-1);
    }
    let infix   = split_formula(s);
    let postfix = get_postfix(infix);
    let res = calcPostfix(postfix);
    return res;
}

/**
 * 数式を演算子とオペランドに分割し配列に中置記法で格納
 */
const split_formula = (s) => {
        let a = new Array();
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

/**
 * 中置記法を後置記法に変換する
 * @example 
 * 入力：1 + 2 * 3 - 4 / 5
 * 出力：1 2 3 * + 4 5 / -
 */
const get_postfix = (infix) => {
    let postfix = new Array();
    expression(infix, postfix);
    return postfix;
}

/**
 * 掛け算割り算の並べ替え
 */
const term = (infix, postfix) => {
    // 数字を"postfix"に代入
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

/**
 * 足し算引き算の並べ替え
 */
const expression = (infix, postfix) => {
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

/**
 * 後置記法に置き換えた数式を計算する
 */
const calcPostfix = (postfix) => {
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

//すべてのボタンにクリックイベントを追加
for (let elem of btns.children) {
    elem.addEventListener('click', evaluate);
}
