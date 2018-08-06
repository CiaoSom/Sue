class Watcher{
    constructor(vm,expr,cb){
        this.vm=vm
        this.expr=expr
        this.cb=cb;
        this.value = this.getValue();
    }
    getValue(){
        Dep.target = this;
        let value= this.get(this.vm,this.expr)
        Dep.target = null;
        return value
    }
    get(vm,expr){
        expr = expr.split('.');
        return expr.reduce((prev, next) => {
            return prev[next];
        }, vm.$data) 
    }
    update(){
        let newValue = this.get(this.vm, this.expr);
        let oldValue = this.value;
        if(newValue!=oldValue){
            this.cb(newValue)
        }
    }
}