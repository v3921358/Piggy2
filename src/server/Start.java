package server;

import client.inventory.MapleInventoryIdentifier;
import client.messages.CommandProcessor;
import client.skill.SkillFactory;
import constants.ServerConfig;
import constants.ServerConstants;
import constants.WorldConstants;
import database.DatabaseConnection;
import handling.MapleServerHandler;
import handling.RecvPacketOpcode;
import handling.SendPacketOpcode;
import handling.cashshop.CashShopServer;
import handling.channel.MapleGuildRanking;
import handling.clientmsg.ClientServer;
import handling.login.LoginInformationProvider;
import handling.login.LoginServer;
import handling.world.World;
import handling.world.family.MapleFamily;
import handling.world.guild.MapleGuild;
import server.HttpServer.HttpHandler;
import server.HttpServer.HttpServer;
import server.Timer.*;
import server.cashshop.CashItemFactory;
import server.life.MapleLifeFactory;
import server.life.MapleMonsterInformationProvider;
import server.life.MobSkillFactory;
import server.life.PlayerNPC;
import server.maps.MapleMapFactory;
import server.quest.MapleQuest;
import server.status.MapleBuffStatus;
import server.worldevents.MapleOxQuizFactory;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.concurrent.atomic.AtomicInteger;

public class Start {

    public static final Start instance = new Start();
    public static long startTime = System.currentTimeMillis();

    public static void main(final String args[]) throws InterruptedException {
        instance.run();
    }

    private void resetAllLoginState() {
        try (PreparedStatement ps = DatabaseConnection.getConnection().prepareStatement("UPDATE accounts SET loggedin = 0")) {
            ps.executeUpdate();
        } catch (SQLException ex) {
            throw new RuntimeException("【錯誤】 請確認資料庫是否正確連接");
        }
    }

    private void initTimers() {
        WorldTimer.getInstance().start();
        PokeTimer.getInstance().start();
        EtcTimer.getInstance().start();
        MapTimer.getInstance().start();
        EventTimer.getInstance().start();
        BuffTimer.getInstance().start();
        PingTimer.getInstance().start();
        CloneTimer.getInstance().start();
    }

    private void LoadProperties(){
        ServerProperties.load();
        ServerConstants.SERVER_IP = ServerConfig.WORLD_INTERFACE;
        ServerConstants.DEBUG = ServerConfig.DEBUG_MODE;
        ServerConstants.ADMIN_ONLY = ServerConfig.WORLD_ONLYADMIN;
        LoginServer.PORT = ServerConfig.LOGIN_PORT;
        CashShopServer.PORT = ServerConfig.CASH_PORT;
    }

    public void run() throws InterruptedException {
        LoadProperties();
        // 開始
        System.out.println("正在載入 " + ServerConstants.SERVER_NAME);
        System.out.println("主機位置: " + ServerConstants.SERVER_IP + ":" + LoginServer.PORT);
        System.out.println("客戶端版本: " + ServerConstants.MAPLE_VERSION + "." + ServerConstants.MAPLE_PATCH);

        SendPacketOpcode.reloadValues();
        RecvPacketOpcode.reloadValues();
        MapleBuffStatus.reloadValues();
        CommandProcessor.Initiate();
        this.resetAllLoginState();
        // Worlds
        WorldConstants.init();
        World.init();
        // Timers
        this.initTimers();
        // WorldConfig Handler
        MapleServerHandler.initiate();

        // Information
        MapleItemInformationProvider.getInstance().runEtc();
        MapleMonsterInformationProvider.getInstance().load();
        MapleItemInformationProvider.getInstance().runItems();

        // Servers
        LoginServer.initiate();
        CashShopServer.initiate();
        ClientServer.initiate();
        try {
            new HttpServer(80).start();
        } catch (Exception e) {
            e.printStackTrace();
        }


        // Every other instance cache :)
        SkillFactory.load();
        LoginInformationProvider.getInstance();
        MapleGuildRanking.getInstance().load();
        MapleGuild.loadAll();
        MapleFamily.loadAll();
        MapleLifeFactory.loadQuestCounts();
        MapleQuest.InitQuests();
        RandomRewards.Load();
        MapleOxQuizFactory.getInstance();
        MapleCarnivalFactory.getInstance();
        //CharacterCardFactory.getInstance().initialize();
        MobSkillFactory.getInstance();
        SpeedRunner.loadSpeedRuns();
        MapleInventoryIdentifier.getInstance();
        MapleMapFactory.loadCustomLife();
        CashItemFactory.getInstance().initialize();
        PlayerNPC.LoadAll();// touch - so we see database problems early...
        MapleMonsterInformationProvider.getInstance().addExtra();
        RankingWorker.run();

        LoginServer.setOn();
        ClientServer.setOpen();
        //World.startAddGift();
        System.out.printf("Server is Opened - %ds \r\n", (System.currentTimeMillis() - startTime) / 1000);
    }
}
