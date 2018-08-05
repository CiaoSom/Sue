class Sue{
	constructor(options){
		this.$el = options.el;
		this.$data = options.data;
		//如果有根元素，区编译模板
		if(this.$el){
			// 用数据和元素去编译
			new Compile(this.$el,this);
		}
	}
}