var status = -1;

function start() {
	if (cm.getPlayer().getMapId() == 262031300) {
		cm.sendYesNo("您確定要出去了嗎?");
		status = 1;
		return;
	}
		if (cm.getPlayer().getLevel() < 120) {
			cm.sendOk("您需要到達120 等才可挑戰 Hilla.");
			cm.dispose();
			return;
		}
    var em = cm.getEventManager("HillaBattle");

    if (em == null) {
	cm.sendOk("活動腳本尚未啟用,請聯絡GM.");
	cm.dispose();
	return;
    }
    var eim_status = em.getProperty("state");
	    var marr = cm.getQuestRecord(160110);
	    var data = marr.getCustomData();
	    if (data == null) {
		marr.setCustomData("0");
	        data = "0";
	    }
	    var time = parseInt(data);
	if (eim_status == null || eim_status.equals("0")) {
    var squadAvailability = cm.getSquadAvailability("Hilla");
    if (squadAvailability == -1) {
	status = 0;
	    if (time + (1 * 3600000) >= cm.getCurrentTime() && !cm.getPlayer().isGM()) {
		cm.sendOk("您已經挑戰過 Hilla in the past 1 hours. 剩餘時間: " + cm.getReadableMillis(cm.getCurrentTime(), time + (24 * 3600000)));
		cm.dispose();
		return;
	    }
	cm.sendYesNo("您想要成為遠征隊隊長嗎?");

    } else if (squadAvailability == 1) {
	    if (time + (1 * 3600000) >= cm.getCurrentTime() && !cm.getPlayer().isGM()) {
		cm.sendOk("您已經挑戰過 Hilla in the past 1 hours. 剩餘時間: " + cm.getReadableMillis(cm.getCurrentTime(), time + (24 * 3600000)));
		cm.dispose();
		return;
	    }
	// -1 = Cancelled, 0 = not, 1 = true
	var type = cm.isSquadLeader("Hilla");
	if (type == -1) {
	    cm.sendOk("遠征戰鬥已經開始");
	    cm.dispose();
	} else if (type == 0) {
	    var memberType = cm.isSquadMember("Hilla");
	    if (memberType == 2) {
		cm.sendOk("您從遠征隊被剔除.");
		cm.dispose();
	    } else if (memberType == 1) {
		status = 5;
		cm.sendSimple("您想要做什麼? \r\n#b#L0#加入遠征隊#l \r\n#b#L1#離開遠征隊#l \r\n#b#L2#查看遠征隊員#l");
	    } else if (memberType == -1) {
		cm.sendOk("遠征戰鬥已經開始");
		cm.dispose();
	    } else {
		status = 5;
		cm.sendSimple("您想要做什麼? \r\n#b#L0#加入遠征隊#l \r\n#b#L1#離開遠征隊#l \r\n#b#L2#查看遠征隊員#l");
	    }
	} else { // Is leader
	    status = 10;
	    cm.sendSimple("您想要做什麼, 遠征隊隊長? \r\n#b#L0#查看隊員列表#l \r\n#b#L1#從遠征隊剔除#l \r\n#b#L2#從封鎖名單中刪除#l \r\n#r#L3#進入地圖#l");
	// TODO viewing!
	}
	    } else {
			var eim = cm.getDisconnected("HillaBattle");
			if (eim == null) {
				var squd = cm.getSquad("Hilla");
				if (squd != null) {
	    if (time + (1 * 3600000) >= cm.getCurrentTime() && !cm.getPlayer().isGM()) {
		cm.sendOk("您已經挑戰過 Hilla in the past 1 hours. 剩餘時間: " + cm.getReadableMillis(cm.getCurrentTime(), time + (24 * 3600000)));
		cm.dispose();
		return;
	    }
					cm.sendYesNo("遠征隊對戰已經開始.\r\n" + squd.getNextPlayer());
					status = 3;
				} else {
					cm.sendOk("遠征隊對戰已經開始.");
					cm.safeDispose();
				}
			} else {
				cm.sendYesNo("歐,您回來了!您要繼續遠征隊對戰嗎?");
				status = 2;
			}
	    }
	} else {
			var eim = cm.getDisconnected("HillaBattle");
			if (eim == null) {
				var squd = cm.getSquad("Hilla");
				if (squd != null) {
	    if (time + (1 * 3600000) >= cm.getCurrentTime() && !cm.getPlayer().isGM()) {
		cm.sendOk("您已經挑戰過 Hilla in the past 1 hours. 剩餘時間: " + cm.getReadableMillis(cm.getCurrentTime(), time + (24 * 3600000)));
		cm.dispose();
		return;
	    }
					cm.sendYesNo("遠征隊對戰已經開始.\r\n" + squd.getNextPlayer());
					status = 3;
				} else {
					cm.sendOk("遠征隊對戰已經開始.");
					cm.safeDispose();
				}
			} else {
				cm.sendYesNo("歐,您回來了!您要繼續遠征隊對戰嗎?");
				status = 2;
			}
	}
}

function action(mode, type, selection) {
    switch (status) {
	case 0:
	    if (mode == 1) {
			if (cm.registerSquad("Hilla", 5, " 您已經成為了遠征隊隊長. 請在時間內請隊員加入.")) {
				cm.sendOk("您已經成為了遠征隊隊長. 您有五分鐘集結時間, 請在時間內請隊員加入.");
			} else {
				cm.sendOk("發生錯誤.");
			}
	    }
	    cm.dispose();
	    break;
	case 1:
	    if (mode == 1) {
		cm.warp(262010000, 0);
	    }
	    cm.dispose();
	    break;
	case 2:
		if (!cm.reAdd("HillaBattle", "Hilla")) {
			cm.sendOk("錯誤.請在試一次.");
		}
		cm.safeDispose();
		break;
	case 3:
		if (mode == 1) {
			var squd = cm.getSquad("Hilla");
			if (squd != null && !squd.getAllNextPlayer().contains(cm.getPlayer().getName())) {
				squd.setNextPlayer(cm.getPlayer().getName());
				cm.sendOk("您獲得了保留位置.");
			}
		}
		cm.dispose();
		break;
	case 5:
	    if (selection == 0) { // join
		var ba = cm.addMember("Hilla", true);
		if (ba == 2) {
		    cm.sendOk("遠征隊目前額滿,請稍後再試.");
		} else if (ba == 1) {
		    cm.sendOk("您成功加入遠征隊");
		} else {
		    cm.sendOk("您已經是遠征隊的一員.");
		}
	    } else if (selection == 1) {// withdraw
		var baa = cm.addMember("Hilla", false);
		if (baa == 1) {
		    cm.sendOk("你離開了遠征隊.");
		} else {
		    cm.sendOk("你並非遠征隊的一員.");
		}
	    } else if (selection == 2) {
		if (!cm.getSquadList("Hilla", 0)) {
		    cm.sendOk("發生未知錯誤.");
		}
	    }
	    cm.dispose();
	    break;
	case 10:
	    if (mode == 1) {
		if (selection == 0) {
		    if (!cm.getSquadList("Hilla", 0)) {
			cm.sendOk("發生未知錯誤.");
		    }
		    cm.dispose();
		} else if (selection == 1) {
		    status = 11;
		    if (!cm.getSquadList("Hilla", 1)) {
			cm.sendOk("發生未知錯誤.");
			cm.dispose();
		    }
		} else if (selection == 2) {
		    status = 12;
		    if (!cm.getSquadList("Hilla", 2)) {
			cm.sendOk("發生未知錯誤.");
			cm.dispose();
		    }
		} else if (selection == 3) { // get insode
		    if (cm.getSquad("Hilla") != null) {
			var dd = cm.getEventManager("HillaBattle");
			dd.startInstance(cm.getSquad("Hilla"), cm.getMap(), 160110);
		    } else {
			cm.sendOk("發生未知錯誤.");
		    }
		    cm.dispose();
		}
	    } else {
		cm.dispose();
	    }
	    break;
	case 11:
	    cm.banMember("Hilla", selection);
	    cm.dispose();
	    break;
	case 12:
	    if (selection != -1) {
		cm.acceptMember("Hilla", selection);
	    }
	    cm.dispose();
	    break;
    }
}