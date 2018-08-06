class Compile{
	constructor(el,vm){
		this.el = this.isElementNode(el)?el:document.querySelector(el)
		this.vm = vm
		if(this.el){
			let fragment = this.toFragment(this.el)
			this.compile(fragment)
			this.el.appendChild(fragment)
		}
	}
	/**编译
	 * @param  {[fragment]}
	 * @return {[type]}
	 */
	compile(fragment){
		let childNodes = fragment.childNodes;
		Array.from(childNodes).forEach(node=>{
			// console.log(node)
			if(this.isElementNode(node)){
				// 元素节点,递归深入遍历所有节点
				this.compileElement(node)
				this.compile(node)
			}else{
				// 文本节点
				this.compileText(node)	
			}
		})

	}
	/**编译文本模板
	 * @param  {node}
	 * @return {[type]}
	 */
	compileText(node){
		let expr = node.textContent;
		// console.log(text)
		let reg = /\{\{([^}]+)\}\}/g;
		if(reg.test(expr)){
			CompileUtil['text'](node,this.vm,expr);
		}
	}
	/**编译元素模板
	 * @param  {[node]}
	 * @return {[type]}
	 */
	compileElement(node){
		// 编译s-model
		// 获取节点上的s-model的属性
		let attrs = node.attributes;
		// console.log(attrs)
		Array.from(attrs).forEach(attr=>{
			// console.log(attr)
			// 判断是不是指令	
			let attrName = attr.name

			if(this.isDirective(attrName)){
				// 拿到指令后的变量
				let expr = attr.value;
				let [,type] =  attrName.split('-')
				CompileUtil[type](node,this.vm,expr)
			}
		})
	}
	/**真实dom转换成fragment
	 * @param  {[el]}
	 * @return {[type]}
	 */
	toFragment(el){
		// 获取#app里面的所有dom，存入fragment
		let fragment = document.createDocumentFragment();
		let firstChild;
		// 把真实的DOM存入fragment
		while(firstChild=el.firstChild){

			fragment.appendChild(firstChild)
		}
		return fragment
	}
	/**判断是否是元素节点
	 * @param  {[node]}
	 * @return {Boolean}
	 */
	isElementNode(node){
		return node.nodeType===1
	}
	/**判断是不是指令
	 * @param  {[name]}
	 * @return {Boolean}
	 */
	isDirective(name){
		return name.includes('s-')
	}
}
/**编译工具类
 * [CompileUtil description]
 * @type {Object}
 */
CompileUtil={
	getVal(vm,expr){
		expr = expr.split('.');
		return expr.reduce((prev,next)=>{
			return prev[next];
		},vm.$data)
	},
	setValue(vm,expr,value){
		expr = expr.split('.')
		return expr.reduce((prev,next,currentIndex)=>{
			if(currentIndex===expr.length-1){
				return prev[next]=value
			}
			return prev[next]
		},vm.$data)
	},
	exprToValue(vm,expr){
		return expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
			return this.getVal(vm,arguments[1])
		})
	},
	text(node,vm,expr){
		let updateFn = this.updater['textUpdate']
		let value = this.exprToValue(vm,expr)
		// console.log(expr)
		expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
			// console.log(arguments[1])
			new Watcher(vm,arguments[1],newValue=>{
			
				updateFn && updateFn(node, newValue);
			})
		})
		updateFn && updateFn(node,value);
	},
	model(node,vm,expr){
		let updateFn = this.updater['modelUpdate']
		new Watcher(vm,expr,newValue=>{
			updateFn && updateFn(node, newValue);
		})
		node.addEventListener('input',e=>{
			let newValue=e.target.value
			this.setValue(vm,expr,newValue)
		})
		updateFn && updateFn(node,this.getVal(vm,expr));
	},
	updater:{
		textUpdate(node,value){
			node.textContent = value
		},
		modelUpdate(node,value){
			node.value=value
		}
	}
}