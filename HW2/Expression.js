var tok    
var tokens 
let space = ' '
var count = -1;
function match(k) {
    if (tok.kind == k) 
        tok = tokens.pop();
    else expected(k);
}
function expected(s) {
    error(s+" expected -- "+tok+" found");
}
function error(s) {
    throw ("At index "+tok.index+": "+s);
}
function showError(elt) {
    
        elt.selectionStart = tok.index;
        elt.selectionEnd = tok.index + tok.length;
        elt.focus();     
}

class MathFunctionConstant {
    constructor(f, num) {
        this.f = f;
        this.num = num;}
    fValue() { 	return Math[this.f](this.num);	}
    toTree(val) { return space.repeat(val) + this.f + " " + this.num+'\n'; }
    toPostfix() { return this.f + " " + this.num+' '; }
    toString() { return this.f + "(" + this.num.toString() + ")"; }
}

class Constant {
   constructor(num) { this.num = num; }
   fValue() { return this.num; }
   toTree(val) { return space.repeat(val) + this.num+'\n'; }
   toPostfix() { return this.num+' '; }
   toString() { return this.num.toString(); }
}

class Binary {
   constructor(left, oper, right) {
      this.left = left; this.oper = oper; this.right = right;
   }
   fValue() {
      switch (this.oper) {
      case PLUS:  return this.left.fValue()+this.right.fValue();
      case MINUS: return this.left.fValue()-this.right.fValue();
      case STAR:  return this.left.fValue()*this.right.fValue();
      case MOD:   return this.left.fValue()%this.right.fValue();
      case SLASH: 
         let v = this.right.fValue();
         if (v == 0) 
            throw ("Division by zero");
         return this.left.fValue()/v;
      default: return NaN;
      }
   }
   toTree() {
   
      return  space.repeat(++count)+this.oper+'\n'+this.left.toTree(count)+this.right.toTree(count--)
   }
   toPostfix() {
      return this.left.toPostfix()+this.right.toPostfix()+this.oper+' '
   }
   toString() {
      return '('+this.left + this.oper + this.right+')'
   }
}

function binary(e) {
    let op = tok.kind; match(op);
    return new Binary(e, op, term());
}
function expression() {
    let e = (tok.kind == MINUS)?
      binary(new Constant(0)) : term();
    while (tok.kind == PLUS || tok.kind == MINUS) 
      e = binary(e);
    return e;
}
function term() {
    let e = factor();
    while (tok.kind == STAR || tok.kind == SLASH || tok.kind == POWER|| tok.kind== MOD) {
        let op = tok.kind; match(op);
        e = new Binary(e, op, factor());
    }
    return e;
}

function factor() {
    let b = tok.value;
    switch (tok.kind)  {
    case NUMBER:
      let c = tok.val;
      match(NUMBER);
      return new Constant(c);
    case LEFT:
      match(LEFT); 
      let e = expression();
      match(RIGHT); return e;
    case IDENT:
        let s = tok.val;
        match(IDENT);
        match(LEFT);
        let Value = MathFunction(s, expression());
        match(RIGHT); 
        return new MathFunctionConstant(s, Value[1]);  

    default: expected("Factor");
    }
    

    return null;
}
function MathFunction(operator, right) {
    let MathFunctions = Object.getOwnPropertyNames(Math)
    let Func = MathFunctions.filter(k => Math[k].length == 1 && k == operator)// gelen cos ya de sin math object equal midir diye bakiyor
    if (Func != null)
     {
        return [Math[Func[0]](this.right), right];
    }
    return -1;    
}

