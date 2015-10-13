/**
 * Created by gxa on 2015/10/9.
 */
window.onload = function(){
    var oMenuPage = document.getElementById("menuPage");
    var oStartBtn = document.getElementById("startBtn");

    var oMainPage = document.getElementById("mainPage");

    var oScoreZone = document.getElementById("scoreZone");
    var oScoresVal = document.getElementById("scoresVal");
    var oPlayerVal = document.getElementById("playerVal");
    var oBossVal = document.getElementById("bossVal");

    var oSuspeZone = document.getElementById("suspendZone");
    var oContinBtn = document.getElementById("continuBtn");
    var oRestarBtn = document.getElementById("restartBtn");

    var oEndZone = document.getElementById("endZone");
    var oEndScores = document.getElementById("endScores");
    var oEndBtn = document.getElementById("endBtn");


    //Player
    var playerPlane = new PlayerPlane(600, 620);
    var oPlayerNode = document.getElementById("playerNode");
    //Boss
    var bossFoe = new BossFoePlane();
    var oBossNode = document.getElementById("bossNode");
    var bossFlag = true;
    var backgroundPosX = 0;
    var scores = 0;

    /*
     * setInterval return ID
     * */
    var bglID;          //背景图片滚动
    var minFoeID;       //创建小型敌机
    var midFoeID;       //创建中型敌机
    var maxFoeID;       //创建大型敌机
    var foeRunID;       //敌机群位移运行
    var createPAmmoID;  //创建玩家子弹
    var runPAmmoID;     //玩家子弹运行
    var collHandleID;   //碰撞处理

    var bossAmmoID;     //boss子弹创建
    var bossAmmoRunID;  //boss子弹运行
    var bossCollID;     //boss子弹碰撞处理
    var bossMoveID;     //boss位移运动

    var foePlanes = new Array();
    var playerAmmos = new Array();
    var bossAmmos = new Array();

    /*-------------------原型构造函数的创建-------------------*/

    //Plane
    function Plane(x, y, sizeX, sizeY, score, blood, speed, attck, imgSrc, imgBoom, dieTime){
        this.posX = x;          /* X坐标 */
        this.posY = y;          /* Y坐标 */
        this.sizeX = sizeX;     /* 机身宽 */
        this.sizeY = sizeY;     /* 机身高 */
        this.score = score;     /* 分值 */
        this.blood = blood;     /* 血量 */
        this.speed = speed;     /* 速度 */
        this.attack = attck;    /* 伤害 */
        this.imgSrc = imgSrc;   /* 原图 */
        this.imgBoom = imgBoom; /* 击中图 */
        /* 是否击毁 */
        this.planeGoDie = false;
        /* 击毁延时 */
        this.planeDieTime = dieTime;
        /* 飞机节点 */
        this.planeNode = null;

        this.movePlane = function(){
            this.planeNode.style.left = (this.planeNode.offsetLeft-this.speed) + "px";
        }

        this.init = function(){
            this.planeNode  = document.createElement("img");
            this.planeNode.style.left = this.posX +"px";
            this.planeNode.style.top = this.posY +"px";
            this.planeNode.src = this.imgSrc;
            oMainPage.appendChild(this.planeNode);
        }
        this.init();
    }
    //Ammo
    function Ammo(x, y, sizeX, sizeY, speed, attck, imgSrc){
        this.posX = x;          /* X坐标 */
        this.posY = y;          /* Y坐标 */
        this.sizeX = sizeX;     /* 子弹宽 */
        this.sizeY = sizeY;     /* 子弹宽 */
        this.speed = speed;     /* 速度 */
        this.attack = attck;    /* 伤害 */
        /* 子弹节点 */
        this.ammoNode = null;

        this.moveAmmo = function(){
            this.ammoNode.style.left = (this.ammoNode.offsetLeft+this.speed) + "px";
        }
        this.moveForward = function(){
            this.ammoNode.style.left = (this.ammoNode.offsetLeft-10) + "px";
        }

        this.init = function(){
            this.ammoNode  = document.createElement("img");
            this.ammoNode.style.left = this.posX +"px";
            this.ammoNode.style.top = this.posY +"px";
            this.ammoNode.src = imgSrc;
            oMainPage.appendChild(this.ammoNode);
        }
        this.init();
    }

    //PlayerPlane
    function PlayerPlane(x, y){
        var imgSrc = "./resource/nccShip.png";
        var imgBoo = "./resource/midBoom.jpg";
        var blood = 500;
        var attck = 500;
        var speed = 0;
        var score = 0;
        var sizeX = 157;
        var sizeY = 76;
        var dieTime = 660;
        Plane.call(this, x, y, sizeX, sizeY, score, blood, speed, attck, imgSrc, imgBoo, dieTime);
        this.planeNode.setAttribute("id", "playerNode");
    }

    function randomVal(min, max){
        return Math.floor(min+Math.random()*(max-min));
    }

    function MinFoePlane(){
        var imgSrc = "./resource/minFoe.png";
        var imgBoo = "./resource/minBoom.jpg";
        var blood = 1;
        var attck = 20;
        var speed = 8;
        var score = 200;
        var sizeX = 50;
        var sizeY = 37;
        var dieTime = 30;
        Plane.call(this, 1349+50, randomVal(100, 520), sizeX, sizeY, score, blood, speed, attck, imgSrc, imgBoo, dieTime);
    }

    function MidFoePlane(){
        var imgSrc = "./resource/midFoe.png";
        var imgBoo = "./resource/midBoom.jpg";
        var blood = 10;
        var attck = 40;
        var speed = 6;
        var score = 1000;
        var sizeX = 150;
        var sizeY = 71;
        var dieTime = 35;
        Plane.call(this, 1349+50, randomVal(100, 520), sizeX, sizeY, score, blood, speed, attck, imgSrc, imgBoo, dieTime);
    }

    function MaxFoePlane(){
        var imgSrc = "./resource/maxFoe.png";
        var imgBoo = "./resource/maxBoom.jpg";
        var blood = 15;
        var attck = 60;
        var speed = 4;
        var score = 5000;
        var sizeX = 220;
        var sizeY = 104;
        var dieTime = 40;
        Plane.call(this, 1349+150, randomVal(100, 520), sizeX, sizeY, score, blood, speed, attck, imgSrc, imgBoo, dieTime);
    }

    function BossFoePlane(){
        var imgSrc = "./resource/boss.png";
        var imgBoo = "./resource/bossBoom.jpg";
        var blood = 10000;
        var attck = 10000;
        var speed = 1;
        var score = 10000;
        var sizeX = 105;
        var sizeY = 160;
        var dieTime = 100;
        Plane.call(this, 1349+150, randomVal(100, 490), sizeX, sizeY, score, blood, speed, attck, imgSrc, imgBoo, dieTime);
        this.planeNode.setAttribute("id", "bossNode");
    }
    //PlayerPlaneAmmo
    function PPlaneAmmo(x, y){
        if(scores<80000){
            Ammo.call(this, x, y, 14, 8, 20, 1, "./resource/minBullet.png");
        }
        else if(scores>=80000 && scores<160000){
            Ammo.call(this, x, y, 20, 10, 20, 5, "./resource/midBullet.png");
        }
        else{
            Ammo.call(this, x, y, 48, 14, 20, 10, "./resource/maxBullet.png");
        }
    }
    //BossPlaneAmmo
    function FPlaneAmmo(x, y){
        var imgSrc = "./resource/bossBullet.png";
        var sizeX = 8;
        var sizeY = 20;
        var speed = 1;
        var attck = 10;
        Ammo.call(this, x, y, sizeX, sizeY, speed, attck, imgSrc);
    }

    /*---------------------------------------*/


    /*
     * 背景循环滚动
     * */
    function backgroundLoop(){
        //每20毫秒位移0.5像素
        oMainPage.style.backgroundPositionX = backgroundPosX + "px";
        backgroundPosX -= 0.5;
        if(backgroundPosX == -335){
            backgroundPosX = 0;
        }
    }

    /*
     * Boss处理方法
     * */
    function bossFoePlaneHandle(){
        if(scores > 240000){
            if(bossFlag){
                foePlanes.push(bossFoe);
                clearInterval(minFoeID);
                clearInterval(midFoeID);
                clearInterval(maxFoeID);
                bossAmmoID = setInterval(createBossAmmo, 150);
                bossAmmoRunID = setInterval(bossAmmosMove, 30);
                bossCollID = setInterval(bossCollisionHandle, 20);
                bossMoveID = setInterval(bossMoveHandle, 100);

                bossFlag = false;
            }
            //记录boss血量
            oBossVal.innerHTML = bossFoe.blood;
            if(bossFoe.blood < 0){
                oBossVal.innerHTML = 0;
            }
            if(bossFoe.planeGoDie){
                clearInterval(bossAmmoID);            //停止子弹的创建
                clearInterval(bossMoveID);            //停止boss的位移
            }
        }
    }

    /*
     * Boss运行轨迹处理
     * */
    var lock = false;
    function bossMoveHandle(){
        if(lock){   //Boss下移
            bossFoe.planeNode.style.top = (bossFoe.planeNode.offsetTop+5) + "px";
            if(650 <= bossFoe.planeNode.offsetTop+bossFoe.sizeY){
                lock = false;
            }
        }
        else{       //Boss上移
            bossFoe.planeNode.style.top = (bossFoe.planeNode.offsetTop-5) + "px";
            if(0 >= bossFoe.planeNode.offsetTop){
                lock = true;
            }
        }
        //从最左侧回置到最右侧
        if(0 > bossFoe.planeNode.offsetLeft){
            bossFoe.planeNode.style.left = (1349+105) +"px";
        }
    }
    /*
     * Boss子弹的创建
     * */
    function createBossAmmo(){
        var x = oBossNode.offsetLeft;
        var y = oBossNode.offsetTop+(bossFoe.sizeY/2)-5;
        bossAmmos.push(new FPlaneAmmo(x, y));
    }
    /*
     * Boss子弹移动与消除
     * */
    function bossAmmosMove(){
        for(var i=0; i<bossAmmos.length; i++){
            if((bossAmmos[i].ammoNode.offsetLeft <= 0)
                ||
                (bossAmmos[i].ammoNode.offsetTop <= 0)
                ||
                (bossAmmos[i].ammoNode.offsetTop >= 650)
            ){
                oMainPage.removeChild(bossAmmos[i].ammoNode);
                bossAmmos.splice(i, 1);
            }
            else{
                bossAmmos[i].moveForward();
            }
        }
    }
    /*
     *Boss子弹与玩家的碰撞
     * */
    function bossCollisionHandle(){
        for(var i=0;i<bossAmmos.length;i++) {
            if (
                (bossAmmos[i].ammoNode.offsetLeft
                <= playerPlane.planeNode.offsetLeft + playerPlane.sizeX)
                &&
                (bossAmmos[i].ammoNode.offsetLeft + bossAmmos[i].sizeX
                >= playerPlane.planeNode.offsetLeft)
            ){
                if (
                    (playerPlane.planeNode.offsetTop
                    <= bossAmmos[i].ammoNode.offsetTop + bossAmmos[i].sizeY)
                    &&
                    (playerPlane.planeNode.offsetTop + playerPlane.sizeY
                    >= bossAmmos[i].ammoNode.offsetTop)
                ) {

                    if(0 < playerPlane.blood){
                        playerPlane.blood -= bossAmmos[i].attack;
                        oPlayerVal.innerHTML = playerPlane.blood;
                        if(playerPlane.blood < 0){
                            oPlayerVal.innerHTML = 0;
                        }
                        bossAmmos[i].attack = 0;

                        oMainPage.removeChild(bossAmmos[i].ammoNode);
                        bossAmmos.splice(i, 1);
                        break;
                    }
                    else{
                        playerPlane.planeGoDie = true;
                        playerPlane.planeNode.src = playerPlane.imgBoom;
                        oScoreZone.style.display = "none";
                        oEndScores.innerHTML = scores;
                        oEndZone.style.display = "block";
                        oMainPage.removeEventListener("mousemove", playPlaneMove, false);
                        clearInterval(bglID);
                        clearInterval(minFoeID);
                        clearInterval(midFoeID);
                        clearInterval(maxFoeID);
                        clearInterval(createPAmmoID);
                        clearInterval(collHandleID);
                        clearInterval(bossAmmoID);
                        clearInterval(bossCollID);
                        oMainPage.removeEventListener("mousemove", playPlaneMove, false);
                        if (collFlag) {
                            setTimeout(function() {
                                oMainPage.removeChild(oPlayerNode);
                            }, 1000);
                            collFlag = false;
                        }
                    }
                }
            }
        }
    }

    function createMinFoePlane(){
        foePlanes.push(new MinFoePlane());
    }

    function createMidFoePlane(){
        foePlanes.push(new MidFoePlane());
    }

    function createMaxFoePlane(){
        foePlanes.push(new MaxFoePlane());
    }

    /*
     * 敌机群的位移与消除
     * */
    function foePlanesRun(){
        for(var i=0; i<foePlanes.length; i++){
            //确认已被击毁
            if(foePlanes[i].planeGoDie){
                foePlanes[i].planeDieTime--;
                if(0 == foePlanes[i].planeDieTime){
                    oMainPage.removeChild(foePlanes[i].planeNode);
                    foePlanes.splice(i, 1);
                }
            }
            //确认超出边界
            else if(foePlanes[i].planeNode.offsetLeft < 0){
                if(i != foePlanes.length-1){
                    oMainPage.removeChild(foePlanes[i].planeNode);
                    foePlanes.splice(i, 1);
                }
            }
            //正常范围移动
            else{
                foePlanes[i].movePlane();
            }
        }
    }

    function createPlayerAmmo(){
        var x = oPlayerNode.offsetLeft+playerPlane.sizeX;
        var y = oPlayerNode.offsetTop+(playerPlane.sizeY/2)-5;
        playerAmmos.push(new PPlaneAmmo(x, y-10));
        playerAmmos.push(new PPlaneAmmo(x, y+10));
    }

    function playerAmmosRun(){
        for(var i=0; i<playerAmmos.length; i++){
            if(playerAmmos[i].ammoNode.offsetLeft > 1349){
                oMainPage.removeChild(playerAmmos[i].ammoNode);
                playerAmmos.splice(i, 1);
            }
            else{
                playerAmmos[i].moveAmmo();
            }
        }
    }
    /*
    * 碰撞事件
    * */
    var collFlag = true;
    function collisionHandle(){
        for(var i=0; i<playerAmmos.length; i++){
            for(var j=0; j<foePlanes.length; j++){
                //敌机与玩家的碰撞
                if(
                    (playerPlane.planeNode.offsetLeft
                    <= foePlanes[j].planeNode.offsetLeft+foePlanes[j].sizeX)
                    &&
                    (playerPlane.planeNode.offsetLeft+playerPlane.sizeX
                    >= foePlanes[j].planeNode.offsetLeft)
                ){
                    if(
                        (playerPlane.planeNode.offsetTop
                        <= foePlanes[j].planeNode.offsetTop+foePlanes[j].sizeY)
                        &&
                        (playerPlane.planeNode.offsetTop+playerPlane.sizeY
                        >= foePlanes[j].planeNode.offsetTop)
                    ){
                        if(0 < playerPlane.blood){
                            playerPlane.blood -= foePlanes[j].attack;
                            oPlayerVal.innerHTML = playerPlane.blood;
                            if(playerPlane.blood < 0){
                                oPlayerVal.innerHTML = 0;
                            }
                            foePlanes[j].attack = 0;

                            foePlanes[j].planeGoDie = true;
                            foePlanes[j].planeNode.src = foePlanes[j].imgBoom;
                            scores += foePlanes[j].score;
                            oScoresVal.innerHTML = scores;
                            foePlanes[j].score = 0;

                        }
                        else{
                            playerPlane.planeGoDie = true;
                            playerPlane.planeNode.src = playerPlane.imgBoom;
                            oScoreZone.style.display = "none";
                            oEndScores.innerHTML = scores;
                            oEndZone.style.display = "block";
                            oMainPage.removeEventListener("mousemove", playPlaneMove, false);
                            clearInterval(bglID);
                            clearInterval(minFoeID);
                            clearInterval(midFoeID);
                            clearInterval(maxFoeID);
                            clearInterval(createPAmmoID);
                            oMainPage.removeEventListener("mousemove", playPlaneMove, false);
                            if(collFlag){   //防止多次删除玩家节点
                                setTimeout(function(){
                                    oMainPage.removeChild(oPlayerNode);
                                }, 1000);
                                collFlag = false;
                            }
                        }

                    }
                }

                //玩家子弹与敌机碰撞
                if(
                    (playerAmmos[i].ammoNode.offsetLeft
                    <= foePlanes[j].planeNode.offsetLeft+foePlanes[j].sizeX)
                    &&
                    (playerAmmos[i].ammoNode.offsetLeft+playerAmmos[i].sizeX
                    >= foePlanes[j].planeNode.offsetLeft)
                ){
                    if(
                        (playerAmmos[i].ammoNode.offsetTop
                        <= foePlanes[j].planeNode.offsetTop+foePlanes[j].sizeY)
                        &&
                        (playerAmmos[i].ammoNode.offsetTop+playerAmmos[i].sizeY
                        >= foePlanes[j].planeNode.offsetTop)
                    ){
                        foePlanes[j].blood = foePlanes[j].blood-playerAmmos[i].attack;
                        if(0 > foePlanes[j].blood){
                            foePlanes[j].planeGoDie = true;
                            foePlanes[j].planeNode.src = foePlanes[j].imgBoom;
                            scores += foePlanes[j].score;
                            oScoresVal.innerHTML = scores;
                        }
                        oMainPage.removeChild(playerAmmos[i].ammoNode);
                        playerAmmos.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    function playPlaneMove(){
        var oEvent = window.event||arguments[0];
        var winPosX = oEvent.clientX;
        var winPosY = oEvent.clientY;
        oPlayerNode.style.left = (winPosX - playerPlane.sizeX/2) +"px";
        oPlayerNode.style.top = (winPosY - playerPlane.sizeY/2) +"px";
    }

    function backMenuPage(){
        location.reload(true);
    }
    oEndBtn.addEventListener("click", backMenuPage, false);
    oRestarBtn.addEventListener("click", backMenuPage, false);

    function continueGame(){
        oSuspeZone.style.display = "none";
        oMainPage.addEventListener("mousemove", playPlaneMove, false);

        if(240000 < scores){
            bossAmmoID = setInterval(createBossAmmo, 150);
            bossAmmoRunID = setInterval(bossAmmosMove, 30);
            bossCollID = setInterval(bossCollisionHandle, 20);
            bossMoveID = setInterval(bossMoveHandle, 100);

            bglID = setInterval(backgroundLoop, 20);
            foeRunID = setInterval(foePlanesRun, 20);
            createPAmmoID = setInterval(createPlayerAmmo, 50);
            runPAmmoID = setInterval(playerAmmosRun, 20);
            collHandleID = setInterval(collisionHandle, 20);
        }else{
            bglID = setInterval(backgroundLoop, 20);
            minFoeID = setInterval(createMinFoePlane, 400);
            midFoeID = setInterval(createMidFoePlane, 2000);
            maxFoeID = setInterval(createMaxFoePlane, 8000);
            foeRunID = setInterval(foePlanesRun, 20);
            createPAmmoID = setInterval(createPlayerAmmo, 50);
            runPAmmoID = setInterval(playerAmmosRun, 20);
            collHandleID = setInterval(collisionHandle, 20);
        }

    }
    oContinBtn.addEventListener("click", continueGame, false);

    function suspendGame(){
        oSuspeZone.style.display = "block";
        oMainPage.removeEventListener("mousemove", playPlaneMove, false);

        if(240000 < scores){
            clearInterval(bossAmmoID);
            clearInterval(bossAmmoRunID);
            clearInterval(bossCollID);
            clearInterval(bossMoveID);

            clearInterval(bglID);
            clearInterval(foeRunID);
            clearInterval(createPAmmoID);
            clearInterval(runPAmmoID);
            clearInterval(collHandleID);
        }else{
            clearInterval(bglID);
            clearInterval(minFoeID);
            clearInterval(midFoeID);
            clearInterval(maxFoeID);
            clearInterval(foeRunID);
            clearInterval(createPAmmoID);
            clearInterval(runPAmmoID);
            clearInterval(collHandleID);
        }
    }
    playerPlane.planeNode.addEventListener("click", suspendGame, false);

    function startGame(){
        oMenuPage.style.display = "none";
        oMainPage.style.display = "block";
        oScoreZone.style.display = "block";
        oPlayerVal.innerHTML = 500;
        oBossVal.innerHTML = 10000;

        oMainPage.addEventListener("mousemove", playPlaneMove, false);

        bglID = setInterval(backgroundLoop, 20);

        minFoeID = setInterval(createMinFoePlane, 400);
        midFoeID = setInterval(createMidFoePlane, 2000);
        maxFoeID = setInterval(createMaxFoePlane, 8000);
        foeRunID = setInterval(foePlanesRun, 20);

        createPAmmoID = setInterval(createPlayerAmmo, 50);
        runPAmmoID = setInterval(playerAmmosRun, 20);

        collHandleID = setInterval(collisionHandle, 20);

        setInterval(bossFoePlaneHandle, 100);
    }
    oStartBtn.addEventListener("click", startGame, false);


    /*---------------------------------------*/
};
