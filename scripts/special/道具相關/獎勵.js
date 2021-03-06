// ?祈NPC


var status;
var sele;
var Today =new Date();

var NPC_List = [ //id, text
	["開服新手禮包",//顯示名稱
		[
		 [0, 500000, -1, false, true],
		 [4310003, 1, -1, false, true],
		 [5062000, 150, -1, false, true],
		],
		3,//type 1:帳號領取 2.只有Giftsender 3.只有領獎帳號可領取
		10,// 等級限制
		"開服新手禮包"//領獎名稱
	],
	["關鍵時刻",//顯示名稱
		[
		 [2028061, 15, -1, false, true],
		 [2028062, 5, -1, false, true],
		],
		4,//type 1:帳號領取 2.只有Giftsender 3.只有領獎帳號可領取
		10,// 等級限制
		"關鍵時刻"//領獎名稱
	],
	["新粉專分享",//顯示名稱
		[
		 [1202116, 1, -1, false, true],
		 [4021021, 1, -1, false, true],
		 [2049118, 5, -1, false, true],
		 [3700012, 1, -1, false, true],
		 [5062002, 300, -1, false, true],
		],
		2,//type 1:帳號領取 2.只有Giftsender 3.只有領獎帳號可領取
		10,// 等級限制
		"新粉專分享"//領獎名稱
	],
	["問卷調查",//顯示名稱
		[
		 [3700244, 1, -1, false, true],
		 [2049120, 5, -1, false, true],
		 [5062002, 200, -1, false, true],
		],
		2,//type 1:帳號領取 2.只有Giftsender 3.只有領獎帳號可領取
		10,// 等級限制
		"問卷調查"//領獎名稱
	],
	["新分享補領便當",//顯示名稱
		[
		 [1202116, 1, -1, false, true],
		],
		2,//type 1:帳號領取 2.只有Giftsender 3.只有領獎帳號可領取
		10,// 等級限制
		"新分享補領便當"//領獎名稱
	],
	
]


function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == 0) {
		cm.dispose();
		return;
    } else if (mode == 1){
		status++;
    } else {
		status--;
    }

    switch (status) {
        case 0: 
			var vip = cm.getEventCount("領獎帳號註冊",1) > 0?"領獎帳號":"非領獎帳號";
			var Text = "歡迎加入 #b小喵谷#k 請問您有什麼需求:\r\n";
			if(cm.getEventCount("領獎帳號註冊",1) <= 0){
				Text += "#r您的帳號是 : " + vip + "\r\n#b"
			}else{
				Text += "#b您的帳號是 : " + vip + "\r\n"
			}
			
			for(var i = 0; i < NPC_List.length;i++){
				if(NPC_List[i][2] == 4){
					if(Today.getDay() < 5 && Today.getDay() > 0)
						continue;
					NPC_List[i][0] += (Today.getMonth()+1) + "/" + Today.getDate();
					NPC_List[i][4] += (Today.getMonth()+1) + "/" + Today.getDate();
				}
				Text += "#L" + i + "#" + NPC_List[i][0];
				if((i + 1) % 3 == 0)
					Text += "\r\n"
			}
			cm.sendSimple(Text);
            break;
        case 1:
			sele = selection;
			var ttext = "#r您確定要領取此禮包?\r\n";
			var eqs = NPC_List[sele][1];
			for(var i = 0; i < eqs.length;i++){
				if(eqs[i][0] == 0){
					ttext += "#b楓幣 x " + eqs[i][1] + "\r\n";
				}else if(eqs[i][0] == 2){
					ttext += "#b楓點 x " + eqs[i][1] + "\r\n";
				}else{
					ttext += "#b#v" + eqs[i][0] + "##z" + eqs[i][0] + "# x " + eqs[i][1];
					if(eqs[i][2] > 0)
						ttext += " 期限:" + eqs[i][2] + "天";
					
					ttext += "\r\n"
				}
			}
			cm.sendYesNo(ttext);
			break;
        case 2:
			switch(NPC_List[sele][2]){
				case 1:
					if ((cm.getEventCount(NPC_List[sele][4],1) == -1 || cm.getEventCount(NPC_List[sele][4],1) == 0) && cm.getPlayer().getLevel() >= NPC_List[sele][3]) {
						
						var eqs = NPC_List[sele][1];
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0 || eqs[i][0] == 2)
								continue;
							if(!cm.canHold(eqs[i][0], eqs[i][1])){
								cm.sendOk("背包空間不足");
								cm.dispose();
								return;
							}
						}
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0){
								cm.gainMeso(eqs[i][1]);
							}else if(eqs[i][0] == 2){
								cm.gainNX(2,eqs[i][1]);
							}else{
								if(!eqs[i][4])
									cm.addWithPara(eqs[i][0], eqs[i][1], eqs[i][2], eqs[i][3], false)
								else if(eqs[i][3])
									cm.addWithPara(eqs[i][0], eqs[i][2], true);
								else if(eqs[i][2] > 0)
									cm.gainItemPeriod(eqs[i][0], eqs[i][1], eqs[i][2]);
								else
									cm.gainItem(eqs[i][0], eqs[i][1]);
							}
						}
						
						
						cm.setEventCount(NPC_List[sele][4],1);
						cm.sendOk("恭喜獲得 "+ NPC_List[sele][0]);
						cm.dispose();
						return
					} else {
						cm.sendOk("已領取過獎勵或等級未達十等");
						cm.dispose();
						return;
					}
				case 2:
					if (cm.CanGetGitft(NPC_List[sele][4]) &&(cm.getEventCount(NPC_List[sele][4],1) == -1 || cm.getEventCount(NPC_List[sele][4],1) == 0) && cm.getPlayer().getLevel() >= NPC_List[sele][3]) {
						
						var eqs = NPC_List[sele][1];
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0 || eqs[i][0] == 2)
								continue;
							if(!cm.canHold(eqs[i][0], eqs[i][1])){
								cm.sendOk("背包空間不足");
								cm.dispose();
								return;
							}
						}
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0){
								cm.gainMeso(eqs[i][1]);
							}else if(eqs[i][0] == 2){
								cm.gainNX(2,eqs[i][1]);
							}else{
								if(!eqs[i][4])
									cm.addWithPara(eqs[i][0], eqs[i][1], eqs[i][2], eqs[i][3], false)
								else if(eqs[i][3])
									cm.addWithPara(eqs[i][0], eqs[i][2], true);
								else if(eqs[i][2] > 0)
									cm.gainItemPeriod(eqs[i][0], eqs[i][1], eqs[i][2]);
								else
									cm.gainItem(eqs[i][0], eqs[i][1]);
							}
						}
						
						
						cm.setEventCount(NPC_List[sele][4],1);
						cm.SentGitft(NPC_List[sele][4]);
						cm.sendOk("恭喜獲得 "+ NPC_List[sele][0]);
						cm.dispose();
						return
					} else {
						cm.sendOk("已領取過獎勵或尚未達到領取條件\r\n\r\n#r機器人每過30分鐘會審核領獎帳號\r\n#b造成不便還請見諒");
						cm.dispose();
						return;
					}
				case 3:
					if (cm.getEventCount("領獎帳號註冊",1) > 0 &&(cm.getEventCount(NPC_List[sele][4],1) == -1 || cm.getEventCount(NPC_List[sele][4],1) == 0) && cm.getPlayer().getLevel() >= NPC_List[sele][3]) {
						
						var eqs = NPC_List[sele][1];
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0 || eqs[i][0] == 2)
								continue;
							if(!cm.canHold(eqs[i][0], eqs[i][1])){
								cm.sendOk("背包空間不足");
								cm.dispose();
								return;
							}
						}
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0){
								cm.gainMeso(eqs[i][1]);
							}else if(eqs[i][0] == 2){
								cm.gainNX(2,eqs[i][1]);
							}else{
								if(!eqs[i][4])
									cm.addWithPara(eqs[i][0], eqs[i][1], eqs[i][2], eqs[i][3], false)
								else if(eqs[i][3])
									cm.addWithPara(eqs[i][0], eqs[i][2], true);
								else if(eqs[i][2] > 0)
									cm.gainItemPeriod(eqs[i][0], eqs[i][1], eqs[i][2]);
								else
									cm.gainItem(eqs[i][0], eqs[i][1]);
							}
						}
						
						
						cm.setEventCount(NPC_List[sele][4],1);
						cm.sendOk("恭喜獲得 "+ NPC_List[sele][0]);
						cm.dispose();
						return
					} else {
						cm.sendOk("已領取過獎勵或尚未達到領取條件\r\n\r\n#r必須是領獎帳號才可領取此獎勵\r\n#b造成不便還請見諒");
						cm.dispose();
						return;
					}
				case 4:
					if (cm.getEventCount("領獎帳號註冊",1) > 0 &&(cm.getEventCount(NPC_List[sele][4],1) == -1 || cm.getEventCount(NPC_List[sele][4],1) == 0) && cm.getPlayer().getLevel() >= NPC_List[sele][3]) {
						var yes = false;
						if(Today.valueOf() > new Date(Today.getFullYear(), (Today.getMonth()), Today.getDate(), 6, 0, 0).valueOf() &&
						Today.valueOf() < new Date(Today.getFullYear(), (Today.getMonth()), Today.getDate(), 6, 30, 0).valueOf())
						 yes = true;
						else if(Today.valueOf() > new Date(Today.getFullYear(), (Today.getMonth()), Today.getDate(), 12, 0, 0).valueOf() &&
						Today.valueOf() < new Date(Today.getFullYear(), (Today.getMonth()), Today.getDate(), 12, 30, 0).valueOf())
						 yes = true;
						else if(Today.valueOf() > new Date(Today.getFullYear(), (Today.getMonth()), Today.getDate(), 23, 0, 0).valueOf() &&
						Today.valueOf() < new Date(Today.getFullYear(), (Today.getMonth()), Today.getDate(), 23, 30, 0).valueOf())
						 yes = true;
						if(!yes){
							cm.sendOk("尚未到達領獎時段!~\r\n#b可領獎時段:\r\n#r06:00~06:30\r\n#r12:00~12:30\r\n#r23:00~23:30\r\n");
							cm.dispose();
							return;
						}
						var eqs = NPC_List[sele][1];
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0 || eqs[i][0] == 2)
								continue;
							if(!cm.canHold(eqs[i][0], eqs[i][1])){
								cm.sendOk("背包空間不足");
								cm.dispose();
								return;
							}
						}
						for(var i = 0; i < eqs.length;i++){
							if(eqs[i][0] == 0){
								cm.gainMeso(eqs[i][1]);
							}else if(eqs[i][0] == 2){
								cm.gainNX(2,eqs[i][1]);
							}else{
								if(!eqs[i][4])
									cm.addWithPara(eqs[i][0], eqs[i][1], eqs[i][2], eqs[i][3], false)
								else if(eqs[i][3])
									cm.addWithPara(eqs[i][0], eqs[i][2], true);
								else if(eqs[i][2] > 0)
									cm.gainItemPeriod(eqs[i][0], eqs[i][1], eqs[i][2]);
								else
									cm.gainItem(eqs[i][0], eqs[i][1]);
							}
						}
						
						cm.setEventCount(NPC_List[sele][4],1);
						cm.sendOk("恭喜獲得 "+ NPC_List[sele][0]);
						cm.dispose();
						return;
					} else {
						cm.sendOk("已領取過獎勵或尚未達到領取條件\r\n\r\n#r必須是領獎帳號才可領取此獎勵\r\n#b造成不便還請見諒");
						cm.dispose();
						return;
					}
			}
            break;
    }
}
