var pow = Math.pow;
var sqrt = Math.sqrt;
var abs = Math.abs;
var floor = Math.floor;

function orgRound(value, base) {
    return Math.round(value * (1/base)) / (1/base);
}

function powAddList(base,count = -1){
	var list = [];
	var fn = function(num,count,history = [],old = floor(sqrt(num))){
		if(!num) {
			return list.push(history);
		}
		if(!count) return;
		for(var i = old;i > 0;i--){
			var p = i * i;
			if(num < p)continue;
			fn(num - p,count-1,[...history,i],i);
		}
	}
	fn(base,count)
	return list;
}

function nearlyEq(a,b){
	var fix = 0.01
	return orgRound(a,fix) === orgRound(b,fix)
}

function calcABCPower(ABCSize,functionNum,targetABCSize,count = 1){
	var ABCBase = pow(ABCSize,2) * functionNum;
	var targetABCBase = pow(targetABCSize,2);
	var ret = [];
	for(var fnNum = functionNum;count;fnNum++){
		if(ABCBase / fnNum > targetABCBase) continue;
		for(var addABCSize = 0;(ABCBase + addABCSize)/fnNum - 1 < targetABCBase * fnNum;addABCSize++){
			if(nearlyEq((ABCBase + addABCSize)/fnNum,targetABCBase)){
				ret.push({fnNum:fnNum - functionNum,addABCSize,ABCList:powAddList(addABCSize,fnNum - functionNum)});
				count--;
				break;
			}
		}
	}
	return ret;
}

function GenerateABCCode(data){
	var str = "";
	var sizeList = data.ABCList[0];
	for(var i = 0; i < data.fnNum; i++){
		str += `fn${i}(int a){\n`
		if(sizeList[i]){
			for(var k = 0;k < sizeList[i]; k++){
				str += `a=1;`
			}
		}
		str += `\n}\n`;
	}
	return str;
}

document.getElementById('calc').addEventListener('click',()=>{
	const nowABC    = Number(document.getElementById('nowABC').value);
	const fnNum     = Number(document.getElementById('fnNum').value)
	const targetABC = Number(document.getElementById('targetABC').value);

	const $addFunc  = document.getElementById('addFunc');
	const $addABC   = document.getElementById('addABC');
	const $code		= document.getElementById('code')

	var data = calcABCPower(nowABC,fnNum,targetABC,1)[0];
	var code = GenerateABCCode(data);

	$addFunc.innerText = data.fnNum;
	$addABC.innerText  = data.addABCSize
	$code.innerText	   = code;
})