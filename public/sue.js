class Sue{
	constructor(options){
		this.$el = options.el;
		this.$data = options.data;
		//如果有根元素，区编译模板
		if(this.$el){
			// 对数据进行处理劫持改成get和set
			new Observer(this.$data);
			this.proxyData(this.$data)
			// 用数据和元素去编译
			new Compile(this.$el,this);
		}
	}

	proxyData(data){
		Object.keys(data).forEach(key=>{
			Object.defineProperty(this,key,{
				get(){
					return data[key]
				},
				set(newValue){
					data[key]=newValue
				}
			})
		})
	}
}