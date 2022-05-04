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
let equation, equationTaskPerformer, transformHelper, x, i;

equationGetter.addEventListener("click", () => {
  equationGetter.style.color = "black";
  errorPrinter.innerHTML = ""
  solutionPrinter.innerHTML = ""
  HSPrinter.innerHTML = ''
});

instructionTitle.addEventListener("click", () => {
  instructions.style.display = "block";
});

crossInst.addEventListener("click", () => {
  instructions.style.display = "none";
});

equationBtn.addEventListener("click", () => {
  equation = equationGetter.value;
  errorPrinter.innerHTML = "";
  equation.trim();
  // transformHelper = varValue.innerHTML;
  // x = parseInt(transformHelper);
  // console.log(typeof x, x);
  checkFunction();
});

const checkFunction = () => {
  if(equation === ""){
    equationGetter.style.color = "red";
    errorPrinter.innerHTML = "Enter the equation.";
  }else if(equation.includes("=") === false){
    equationGetter.style.color = "red";
    errorPrinter.innerHTML = "Enter the equal to(=) sign.";
  }else{
    debugger;
    const hasTwo = varSpecifier();
    if(hasTwo === 1){
      return;
    }
    operatorRep();
    let LHS='', RHS='';
    let splittedEq = equation.split(" ");
    for(i=0; splittedEq[i] !== "="; i++){
      LHS += splittedEq[i]+" ";
    }
    for(i+=1; splittedEq[i]!==undefined; i++){
      RHS += splittedEq[i]+" ";
    }
    LHS = LHS.trim(); RHS = RHS.trim()
    if(varValue.value === ""){
      errorPrinter.innerHTML = "Enter the value of the variable.";
      return;
    }
    if(LHS === ""){
      errorPrinter.innerHTML = "Enter LHS."
      return;
    }else if(RHS === ""){
      errorPrinter.innerHTML = "Enter RHS."
      return;
    }
    verify(LHS, RHS)
  }
}


const varSpecifier = () => {
  const alphabets = /[a-z]/i;
  let variable = equation.search(alphabets)
  equation = equation.replaceAll(equation[variable], varValue.value)
  if(equation.search(alphabets) !== -1){
    errorPrinter.innerHTML = "The equation must contain a single variable."
    return 1;
  }
  return 0;
}

const operatorRep = () => {
  equation = equation.replaceAll("^", "**");
}

function solve(expression){
  debugger;
  let val, isContinued;
  expression = expression.replaceAll("(", "").replaceAll(")", "");
  let termsOperators = expression.split(" ");
  if(termsOperators.length > 1){
    for(let p = 2; p < operationArr.length;){
      if(isContinued === true){
        p++;
        isContinued = false;
      }
      let termsOperators = expression.split(" ");;
      if(termsOperators.indexOf(operationArr[p]) === -1){
        isContinued = true;
        continue;
      }
      let operator = operationArr[p];
      if(termsOperators[termsOperators.indexOf(operator)-1] !== undefined){
        let prevNum = parseInt(termsOperators[termsOperators.indexOf(operator)-1]);
        let nextNum = parseInt(termsOperators[termsOperators.indexOf(operator)+1])
        if(operator === "**"){
          val = prevNum ** nextNum
        }else if(operator === "/"){
          val = prevNum / nextNum
        }else if(operator === "*"){
          val = prevNum * nextNum
        }else if(operator === "+"){
          val = prevNum + nextNum
        }else if(operator === "-"){
          val = prevNum - nextNum
        }
        let prevVal = termsOperators[termsOperators.indexOf(operator)-1]+" "+operator+" "+termsOperators[termsOperators.indexOf(operator)+1];
        expression = expression.replace(prevVal, val);
      }
    }
  }
  
  return expression
}

function DRY(HS){
  debugger;
  let grpSlice;
  let hasGrouped = false
  for(let j; !hasGrouped === true;){
    let brackets = {
      j: HS.indexOf(")"),
      k: HS.lastIndexOf("(", j)
    }
    let powIndex = HS.indexOf("**");
    let divIndex = HS.indexOf("/");
    let mulIndex = HS.indexOf("*");
    let addIndex = HS.indexOf("+");
    let subIndex = HS.indexOf("-");
    if(brackets.j !== -1 && brackets.k !== -1){
      grpSlice = solve(HS.slice(brackets.k, brackets.j+1))
      HS = HS.replace(HS.slice(brackets.k, brackets.j+1), grpSlice)
    }else if(powIndex !== -1){
      grpSlice = solve(HS.slice(HS.slice(0, powIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(powIndex+2).indexOf(" ") === -1 ? HS.length : HS.length));
      HS = HS.replace(HS.slice(HS.slice(0, powIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(powIndex+2).indexOf(" ") === -1 ? HS.length : HS.length), grpSlice);
    }else if(divIndex !== -1){
      grpSlice = solve(HS.slice(HS.slice(0, divIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(divIndex+2).indexOf(" ") === -1 ? HS.length : HS.length));
      HS = HS.replace(HS.slice(HS.slice(0, divIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(divIndex+2).indexOf(" ") === -1 ? HS.length : HS.length), grpSlice);
    }else if(mulIndex !== -1){
      grpSlice = solve(HS.slice(HS.slice(0, mulIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(mulIndex+2).indexOf(" ") === -1 ? HS.length : HS.length));
      HS = HS.replace(HS.slice(HS.slice(0, mulIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(powIndex+2).indexOf(" ") === -1 ? HS.length : HS.length), grpSlice);
    }else if(addIndex !== -1){
      grpSlice = solve(HS.slice(HS.slice(0, addIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(divIndex+2).indexOf(" ") === -1 ? HS.length : HS.length));
      HS = HS.replace(HS.slice(HS.slice(0, addIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(powIndex+2).indexOf(" ") === -1 ? HS.length : HS.length), grpSlice);
    }else if(subIndex !== -1){
      grpSlice = solve(HS.slice(HS.slice(0, subIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(divIndex+2).indexOf(" ") === -1 ? HS.length : HS.length));
      HS = HS.replace(HS.slice(HS.slice(0, subIndex-1).lastIndexOf(" ") === -1 ? 0 : 0, HS.slice(powIndex+2).indexOf(" ") === -1 ? HS.length : HS.length), grpSlice);
    }
    if(HS.trim().indexOf(" ") === -1){
      break;
    }
  }
  return HS
}

const verify = (LHS, RHS) => {
  LHS = DRY(LHS)
  RHS = DRY(RHS)
  if(LHS === RHS){
    solutionPrinter.style.color = "green";
    solutionPrinter.innerHTML = "Your answer is correct.";
  }else{
    solutionPrinter.style.color = "red";
    solutionPrinter.innerHTML = "Your answer is wrong.";
  };
  HSPrinter.innerHTML = `LHS = ${LHS} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; RHS = ${RHS}`;
};