var status = -1;

function action(mode, type, selection) {
    if (cm.getPlayer().getLevel() != 1 || cm.getPlayer().getMapId() != 10000) {
	cm.dispose();
	return;
    }
    if (mode == 1) {
	status++;
    } else {
	if (status == 0) {
	    cm.dispose();
	}
	status--;
    }
    if (status == 0) {
		cm.sendSimple("#b#L3#去維多利亞#l\r\n#L4#待在楓之島#l");
    } else if (status == 1) {
	if (selection == 3) {
	    cm.warp(104000000);
	}
	cm.dispose();
    }
}