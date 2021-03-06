var tt = ""; 
var month = 3;
// 每個阶段禮包所需的贊助数
var condition = [1, 2, 3, 4, 5, 6];
// 禮包内容
var reward = [
			// 禮包1 10000
			Array(1, 1082392, 1), // 最強公會

			// 禮包2 30000
			Array(2, 1082392, 1), // 最強公會

			// 禮包3 50000
			Array(3, 1082393, 1), // 金牌

			// 禮包4 75000
			Array(4, 1082393, 1), // 金牌

			// 禮包5 100000
			Array(5, 1082394, 1), // 金牌
			
			// 禮包6 130000
			Array(6, 1082394, 1), // 金牌
		];




var getMonthWeek = function(a, b, c)
{
/*  
a = d = 当前日期  
b = 6 - w = 当前周的还有几天过完(不算今天)  
a + b 的和在除以7 就是当天是当前月份的第几周  
*/
        var date = new Date(a, parseInt(b) - 1, c),
            w = date.getDay(),
            d = date.getDate();
        return Math.ceil((d + 6 - w) / 7);
};
var today = new Date(); //获取当前时间 
var y;
var m;
var d;

var sel;
var status = -1;
var text;
var ljname;
var curlevel = -1;
function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
	y = today.getFullYear();
	m = today.getMonth() + 1;
	d = today.getDate();
    if (status == 0 && mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 10000) {
        var revenue = cm.getTotalDonate();
        text = "\t\t\t" + tt + " #r累積贊助禮包中心#k#n " + tt + "\r\n\r\n";
        text += "#d當前累積贊助數量： #r" + revenue.formatMoney(0, "") + " #d贊助點#k\r\n";



        for (var i = 1; i <= condition.length; i++) {
            if (cm.getEventCount("累積贊助禮包" + i, 1) == 1) {
                text += "#b#L" + i + "#" + tt + " [#r已完成#d]累積贊助福利 #r\t\t\t" + condition[i - 1] + "#l\r\n";
                curlevel = curlevel == -1 ? i : curlevel;
            } else {
                text += "#b#L" + i + "#" + tt + " [未完成]累積贊助福利 #r\t\t\t" + condition[i - 1] + "#l\r\n";
            }
        }
        text += "#k";
        cm.sendSimple(text);
    } else if (status == 0) {
		selection = cm.getDojoRankLastMonth();
		if(selection > 11)
			selection = 11;
        sel = selection;
		can_choose = 0;
		var ss = '';
        if(i != 11)
			text = "\t\t\t#b #fEffect/CharacterEff/1112904/0/0# 排名第 " + sel + " 獎勵 #fEffect/CharacterEff/1112904/0/0##k#n\r\n\r\n";
		else
			text = "\t\t\t#b #fEffect/CharacterEff/1112904/0/0# 排名第 11 名以上 獎勵 #fEffect/CharacterEff/1112904/0/0##k#n\r\n\r\n";
        for (var i = 0; i < reward.length; i++) {
            if (reward[i][0] == selection) {
				if(reward[i][3] != null && reward[i][3] == -1){
					can_choose += 1;
					text += "\t#L"+ i +"##k#i" + reward[i][1] + "# #z" + reward[i][1] + "##r[" + reward[i][2] + "個]#l\r\n";
                }else{
					ss += "\t\t\t#k#i" + reward[i][1] + "# #z" + reward[i][1] + "##r[" + reward[i][2] + "個]";
					if(reward[i][3] != null && reward[i][3] > 0){
						ss += ' \r\n\t\t\t#b全能力增加 ' + reward[i][3] + '點 - 時效 30 天\r\n'
					}else if(reward[i][1] == 1142544){
						ss +='\r\n\t\t\t  全能力增加 60 且 增加強力潛能\r\n\r\n';
					}else{
						ss +='\r\n';
					}
				}
            }
        }
		if(can_choose > 0){
			text += "\r\n\t\t\t\t#b- 以上道具可選一個 -#k#n\r\n";
		}
		text += ss;
        cm.sendYesNo(text);
    } else if (status == 1) {
        if (cm.getEventCount(cm.getDojoRankEventName(), 1) == 1) {
            cm.sendOk("#r\r\n\r\n\t\t這個禮包您已經領取過了");
            cm.dispose();
            return;
        }
		
		if(cm.getEventCount("領獎帳號註冊",1) <= 0){
			cm.sendOk("#r\r\n\r\n\t\t只有領獎帳號才能領取");
            cm.dispose();
            return;
		}

        var rewardlist = [];
        for (var i = 0; i < reward.length; i++) {
            if (reward[i][0] == sel) {
                if (reward[i][3] == null)
                    reward[i][3] = 0;
				else if(reward[i][3] == -1 && i != selection){
					continue;
				}
                rewardlist.push([reward[i][1], reward[i][2], reward[i][3]]);
            }
        }
        if (!cm.canHoldSlots(rewardlist.length)) {
            cm.sendOk("背包空間不足，請卻保背包每個欄位有至少 " + rewardlist.length + " 格空間");
            cm.dispose();
            return;
        }
        for (var i = 0; i < rewardlist.length; i++) {
           cm.gainItemPeriod(rewardlist[i][0], rewardlist[i][1], 7);
        }
        cm.setEventCount(cm.getDojoRankEventName(), 1);
        cm.playerMessage(1, "領取成功");
        cm.dispose();
    }
}

Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "　";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
            negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};