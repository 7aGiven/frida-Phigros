function callback(base) {
    let addr
    let func
    // 转为函数地址
    addr=base.add("0x2773b54")
    // 获取函数入口
    func =  new NativePointer(addr.toString())

    console.log('[+] hook '+func.toString())

    // 函数hook钩子附加
	Interceptor.attach(func, {
		onLeave(reval) {
			//console.log(reval)
			//console.log(reval.readByteArray(64))
			let s = reval.add("0x10").readPointer().add("0x14").readUtf16String()
			console.log(s)
			reval = reval.add("0x30").readPointer().add("0x20")
			let array = [reval.readFloat(), reval.add("0x4").readFloat(), reval.add("0x8").readFloat()]
			let f = reval.add("0xc").readFloat()
			if (f != 0) {
				array[3] = f
			}
			console.log(array)
			send({id:s,difficulty:array})
            //console.log("method Leave GetSongInformation")
        }
    })

}

// 程序入口
let interval = setInterval(()=>{
    // 获取模块
	let addr = Module.findBaseAddress('libil2cpp.so');
	if (addr) {
		clearInterval(interval)
		console.log(addr)
		callback(addr)
	}
},0)
