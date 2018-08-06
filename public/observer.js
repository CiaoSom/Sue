class Observer{
    constructor(data){
       
        this.init(data)
    }

    init(data){
        if(!data||typeof data !== 'object'){
            return ;
        }
        // 拿到data的key和value
        Object.keys(data).forEach(key=>{
            this.observer(data,key,data[key])
            this.init(data[key])
        })
    }

    observer(obj,key,value){
        const _this= this;
        let dep = new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                Dep.target&&dep.addSub(Dep.target)
                return value
            },
            set(newValue){     
                if(newValue!=value){
                    _this.init(newValue)
                    value=newValue
                    dep.notify();
                }
            }
        })
    }
}

class Dep{
    constructor(){
        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>{
            watcher.update()
        })
    }
}