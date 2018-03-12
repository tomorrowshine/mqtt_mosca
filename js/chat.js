var queryStrings=function() {//get url querystring
	        var params=document.location.search,reg=/(?:^\?|&)(.*?)=(.*?)(?=&|$)/g,temp,args={};
	        while((temp=reg.exec(params))!=null) args[temp[1]]=decodeURIComponent(temp[2]);
	        return args;
	    };
	    
!(function(){
	
	var clientMap={};
	var currentuser=null;//当前聊天对象
	
	function getClient(sessionId){
		var client  = mqtt.connect('mqtt://10.252.143.203',{port:3000})

		client.on('connect', function () {
		   console.log('>>> chat application connected '+sessionId);
		   client.subscribe(sessionId);
		   showMsg(sessionId);
		})
		
		client.on('message', function (topic, message) {
			var msg = JSON.parse(message.toString());
//			console.log(topic,msg)
			
			var info=sessionStorage.getItem(topic);
			info=info?JSON.parse(info):[];
			info.push(msg);
			sessionStorage.setItem(topic,JSON.stringify(info));
			
			showMsg(topic);
			
			document.getElementsByTagName("select")[0].innerHTML=initInput(topic,msg.userId);
		});
		clientMap[sessionId]=client;
	}
	
	function showMsg(sessionId){
		var msg=sessionStorage.getItem(sessionId);
		if(msg){
			msg = JSON.parse(msg);
			var msgList="";
			for(var i=0;i<msg.length;i++){
				msgList+='<p>用户'+msg[i].userId+"说：<h5>"+msg[i].msg.content+"</h5>   "+msg[i].msg.time+'</p><hr/>';
			}
			document.getElementById("msgList").innerHTML=msgList;
		}
	}
	
	function sendMsg(sessionId){
		var content=document.getElementsByTagName("textarea")[0].value;
		if(content){
			clientMap[sessionId].publish(currentuser+"",JSON.stringify({userId:sessionId,msg:{content:content,time:new Date()}}));
		}
	}
	function changeUser(e){
		currentuser=e.options[e.options.selectedIndex].value;
	}

	function initInput(sessionId,userId){
		currentuser=userId;
		var select='<select onchange="javascript:changeUser(this)">';
		for(var i=0;i<5;i++){
			if(userId==i){
				select+='<option value="'+i+'" selected = "selected">用户'+i+'</option>';
			}else{
				select+='<option value="'+i+'">用户'+i+'</option>';
			}

		}
		select+='</selcet>';
		return '当前聊天对象:'+select+'<br/><textarea rows="6" cols="50"></textarea><input onclick="javascript:sendMsg('+sessionId+')" type="button" value="发送">';
	}
	
	function initUserList(){
		var list="打开下面的链接即创建一个用户，开启聊天<br/>";
		var args=queryStrings();
		if(args.sessionId){
			getClient(args.sessionId);
			list=initInput(args.sessionId,0);
		}else{
			for(var i=0;i<5;i++){
				list+='<a href="?sessionId='+i+'">用户'+i+'</a></br>';
			}
		}
		return list;
	}
	
	this.changeUser=changeUser;
	this.sendMsg=sendMsg;
	this.initUserList=initUserList;
	
})();







