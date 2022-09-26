const equationGetter = document.getElementById("EquationTaker");
const equationBtn = document.getElementById("verifyBtn");
const errorPrinter = document.getElementById("ErrorPrinter");
const crossInst = document.getElementById("cross");
const instructions = document.getElementById("userManualMaterial");
const instructionTitle = document.getElementById("userManual");
const solutionPrinter = document.getElementById("SolutionPrinter");
const varValue = document.getElementById("varValTaker");
const HSPrinter = document.getElementById('HSPrinter');
const operationArr = ['(', ')', '**', '/', '*', '+', '-'];
let equation;

equationGetter.addEventListener("click", e => equationGetter.style.color = "black");

instructionTitle.addEventListener("click", e => instructions.style.display = "block");

crossInst.addEventListener("click", e => instructions.style.display = "none");

equationBtn.addEventListener("click", e => {
  equation = equationGetter.value.trim();
  errorPrinter.innerHTML = "";
  checkFunction();
});

function count(str, subStr){
  let count=0;
  for(let index; true;){
    index = str.indexOf(subStr)
    str = str.replace(subStr, '');
    if(index === -1) break;
    count++;
  }
  return count
}

const whiteSpaceInserter = (equation) => {
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for(let o = 2; o < operationArr.length-1; o++){
    equation = equation.replaceAll(operationArr[o], ` ${operationArr[o]} `);
  }
  if(equation.indexOf('-') !== -1){
    const minusCount = count(equation, '-');
    let prevIndex = equation.length;
    for(let p = 0; p < minusCount; p++){
      if(numbers.includes(equation[equation.indexOf('-')-1])){
        equation = equation.slice(0, equation.lastIndexOf('-', prevIndex))+' - '+equation.slice(equation.lastIndexOf('-', prevIndex)+1, equation.length);
      }
      prevIndex = equation.lastIndexOf('-', prevIndex)-1;
    }
  }
  return equation
}

const checkFunction = () => {
  if(!equation){
    equationGetter.style.color = "red";
    errorPrinter.innerHTML = "Enter the equation.";
  }else if(!equation.includes("=")){
    equationGetter.style.color = "red";
    errorPrinter.innerHTML = "Enter the equal to(=) sign.";
  }else{
    equation = equation.replaceAll(equation[equation.search(/[a-z]/i)], varValue.value)
    if(equation.search(/[a-z]/i) !== -1){
      errorPrinter.innerHTML = "The equation must contain a single variable.";
      return;
    }

    equation = equation.replaceAll("^", "**");
    equation = whiteSpaceInserter(equation)
    let LHS='', RHS='';
    LHS = equation.slice(0, equation.indexOf('='))
    RHS = equation.slice(equation.indexOf('=')+1, equation.length)
    if(!varValue.value){
      errorPrinter.innerHTML = "Enter the value of the variable.";
      return;
    }
    if(!LHS){
      errorPrinter.innerHTML = "Enter LHS."
      return;
    }else if(!RHS){
      errorPrinter.innerHTML = "Enter RHS."
      return;
    }
    verify(LHS, RHS)
  }
}

function solve(expression){
  let val, isContinued;
  expression = expression.replaceAll("(", "").replaceAll(")", "");
  if(expression.split(" ").length > 1){
    for(let p = 2; p < operationArr.length;){
      if(isContinued === true){
        p++;
        isContinued = false;
      }
      const termsOperators = expression.split(" ");;
      if(termsOperators.indexOf(operationArr[p]) === -1){
        isContinued = true;
        continue;
      }
      const operator = operationArr[p];
      if(termsOperators[termsOperators.indexOf(operator)-1] !== undefined){
        const prevNum = Number(termsOperators[termsOperators.indexOf(operator)-1]);
        const nextNum = Number(termsOperators[termsOperators.indexOf(operator)+1])

        if(operator === "**") val = prevNum ** nextNum
        else if(operator === "/") val = prevNum / nextNum
        else if(operator === "*") val = prevNum * nextNum
        else if(operator === "+") val = prevNum + nextNum
        else if(operator === "-") val = prevNum - nextNum

        let prevVal = `${termsOperators[termsOperators.indexOf(operator) - 1]} ${operator} ${termsOperators[termsOperators.indexOf(operator) + 1]}`;
        expression = expression.replace(prevVal, val);
      }
    }
  }
  
  return expression
}

function DRY(HS){
  let grpSlice;
  let hasGrouped = false;
  for(;!hasGrouped;){
    const brackets = {
      j: HS.indexOf(")"),
      k: HS.lastIndexOf("(", HS.indexOf(')'))
    }
    const powIndex = HS.indexOf("**");
    const divIndex = HS.indexOf("/");
    const mulIndex = HS.indexOf("*");
    const addIndex = HS.indexOf("+");
    const subIndex = HS.indexOf("-");
    if(brackets.j !== -1 && brackets.k !== -1){
      grpSlice = solve(HS.slice(brackets.k, brackets.j+1))
      HS = HS.replace(HS.slice(brackets.k, brackets.j+1), grpSlice)
    }else if(powIndex+1 || divIndex+1 || mulIndex+1 || addIndex+1 || subIndex+1){
      grpSlice = solve(HS.slice(0, HS.length));
      HS = HS.replace(HS.slice(0, HS.length), grpSlice);
    }
    if(HS.trim().indexOf(" ") === -1) break;
  }
  return HS
}

const verify = (LHS, RHS) => {
  LHS = DRY(LHS)
  RHS = DRY(RHS)
  if(Number(LHS) === Number(RHS)){
    solutionPrinter.style.color = "green";
    solutionPrinter.innerHTML = "Your answer is correct.";
  }else{
    solutionPrinter.style.color = "red";
    solutionPrinter.innerHTML = "Your answer is wrong.";
  };
  HSPrinter.innerHTML = `LHS = ${LHS} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; RHS = ${RHS}`;
};