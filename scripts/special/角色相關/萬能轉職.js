
importPackage(Packages.client);
var status = 0;

var jobs1 = [
"劍士","法師","弓箭手","盜賊","盜賊(影武者)","海盜","砲手(重砲指揮官)",
"精靈遊俠","貴族(皇家騎士團)","傳說(狂狼勇士)","龍魔導士","市民(末日反抗軍)","惡魔殺手"];

var jobs = [
["#r劍士",[1302000]],["#r法師",[1362000]],["#r弓箭手",[1452000]],["#r盜賊",[1332000,1472000]],["盜賊(影武者)",[1332000,1342000]],["#r海盜",[1482000,1492000]],["砲手(重砲指揮官)",[1532000]],
["精靈遊俠",[1522000,1352000]],["#r貴族(皇家騎士團)",[1362000]],["傳說(狂狼勇士)",[1442000]],["龍魔導士",[1372000]],["#r市民(末日反抗軍)",[1482000,1492000]],["惡魔殺手",[1322000]],

["#b(貴族)聖魂劍士",[1302000]],["#b(貴族)烈焰巫師",[1372005]],["#b(貴族)破風使者",[1452000]],["#b(貴族)暗夜行者",[1332000,1472000]],["#b(貴族)閃雷悍將",[1482000]],
["#g(市民)煉獄巫師",[1382000]],["#g(市民)狂豹獵人",[1462000]],["#g(市民)機甲戰神",[1492000]]
]

/*
var jobid = [
100,200,300,400,430,500,530,
2300,1000,2000,2001,3000,3001
];*/

var jobid = [
100,200,300,400,434,500,532,
2312,1000,2112,2218,3000,3112,

1112,1212,1312,1412,1512,
3212,3312,3512
];

function start() {
    status = -1;
    action(1, 0, 0);
}

var Message = [
["轉職", 1]
];

function action(mode, type, selection) {
    if (status >= 0 && mode == 0) {
	cm.dispose();
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;

	//cm.getPlayer().maxSingleSkill(1,1004);
	switch (status) {
        case 0:
			var text = "", L = Message;
			for (var i in L)
				text += "#L" + i + "#" + L[i][0] + "\r\n"
			cm.sendNext(text);
            break;
        case 1:
			cm.dispose();
			if (Message[selection][1] == 1)
				cm.openNpc(9900007, "角色相關/changeJob");
            break;
        case 2:
        case 3:
            cm.dispose();
            break;
    }
	//cm.openNpc(9900007, "changeJob");
    /*if (status == 0) {
		var text = "";
		for (var et in jobs) {
			text += "#L" + et + "#" + jobs[et][0] + "#k\r\n";
		}
		cm.sendNext(text);
	} else if (status == 1) {
		var item = jobs[selection][1];
		for (var i in item) {
			var items = item[i]
			if (!cm.haveItem(items))
			cm.gainItem(items, 1);
		}
		var job = jobid[selection];
		cm.changeJob(job);
		cm.getPlayer().maxSkillsByJob();
		cm.getPlayer().dropMessage("當前職業技能已全滿");
		cm.dispose();
	}*/
	//cm.gainItem(5000001, 1);
	//cm.warp(910000000);
}