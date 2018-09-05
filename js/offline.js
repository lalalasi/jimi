var userSampleOfflineId = GetQueryString("reportId");
window.onload = function (ev) {
    if(!userSampleOfflineId){
        alert("参数错误，请联系管理员");
        return;
    }
    getReportInfo(userSampleOfflineId);
}

function getReportInfo(userSampleOfflineId) {
    var params = {
        "method": "getDetectItemList",
        "userid": "",
        "token": "",
        "params": {
            "userSampleOfflineId": userSampleOfflineId
        }
    };

    userSampleHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            erroMsg(re.status.message);
            return;
        }
        //绑定参数
        replaceReortInfo(re.result);
    });
}

function replaceReortInfo(data){
    //封面
    $("#userName").html(data.name);//姓名
    $("#sampleCode").html(data.sampleCode);//样本编号
    $("#createTime").html(data.createTime);//创建时间

    //总揽
    data.itemList.forEach(function(item){
        var tr = $("<tr>");
        tr.append($("<td>").text(item.name));
        if(item.itemResult=='高'){
            tr.append($("<td>").append('<span class="red"></span>','<span class="red"></span>'));
            tr.append($("<td>").append('<span class="gao">高</span>'));
        }else if(item.itemResult=='中'){
            tr.append($("<td>").append('<span class="orange"></span>','<span class="orange"></span>'));
            tr.append($("<td>").append('<span class="zhong">中</span>'));
        }else if(item.itemResult=='低'){
            tr.append($("<td>").append('<span class="green"></span>','<span class="green"></span>'));
            tr.append($("<td>").append('<span class="di">低</span>'));
        } else {
            tr.append($("<td>").text(""));
            tr.append($("<td>").text(""));
        }

        $("#outline").append(tr);
    });

    //检测结果项
    data.itemList.forEach(function(item){
        var section = $("<div>").addClass("section top item");
        section.append($("<div>").addClass("f24").append($("<div>").text("• "+item.name),"<div>• 基因检测结果</div>"))
        section.append($("<div>").addClass("clearfix").append($("<div>").addClass("result").append($("<span>").addClass("name").text(item.name),$("<div>").addClass("text f24").text(item.itemResult))));

        var img;
        if(item.itemResult=='高'){
            img = "images/echarts4.png";
        }else if(item.itemResult=='中'){
            img = "images/echarts3.png";
        }else if(item.itemResult=='低'){
            img = "images/echarts2.png";
        } else {
            img = "images/echarts1.png";
        }
        var echarts = $("<div>").addClass("echarts").append($("<img>").attr("src",img),$("<img>").addClass("hr").attr("src","images/line1.png"));
        var genelist = $("<div>").addClass("list").append($("<div>").addClass("title").text("基因检测列表"));
        var table = $('<table cellpadding="0" cellspacing="0" border="0">');
        table.append($("<tr>").append($("<td>").css("width","180px").text("基因"),$("<td>").css("width","166px").text("位点"),$("<td>").css("width","110px").text("检测结果")));
        item.pointResultList.forEach(function (value) {
            table.append($("<tr>").append($("<td>").text(value.geneName),$("<td>").text(value.name),$("<td>").text(value.detectionResult)));
        });
        genelist.append(table)
        section.append($("<div>").addClass("row clearfix").append(echarts,genelist));

        var conten = $('<div class="conten clearfix">');
        for (var i=0;i<suggestList.length;i++){
            if(suggestList[i].name == item.name){
                if(suggestList[i].desc){
                    conten.append($("<div>").addClass("left").append($("<img>").attr("src",suggestList[i].img),$("<div>").html(suggestList[i].desc),$("<img>").addClass("hr").attr("src","images/line2.png")));
                } else {
                    conten.append($("<div>").addClass("left").append($("<img>").attr("src",suggestList[i].img),$("<img>").addClass("hr").attr("src","images/line2.png")));
                }
                conten.append($("<div>").addClass("right").html(suggestList[i].html));
            }
        }
        section.append($("<div>").addClass("summary").append('<div class="title f24">• 项目简介</div>',conten));

        $("#forlist").append(section);
    });
}

/** 请求 **/
function userSampleHttp(data, callback) {
    var url_userSample = url + "/userSampleOfflineServer!request.action";
    httpRequest(url_userSample, data, callback);
}


var suggestList=[
    {
        name:"皮肤抗皱能力",
        img:"images/summary1.png",
        html:"<p>胶原蛋白是皮肤重要的支撑组织，占人体总蛋白含量的三分之一以上，而皮肤中的胶原蛋白则高达80%以上。这些结构蛋白质不仅为其周围的细胞提供了营养代谢的场所，同时也与其周围细胞的形态有关。基质金属蛋白酶1（MMP1）基因与胶原蛋白的代谢息息相关，MMP1 属于MMP 家族中的胶原酶类，其基因的功能主要为降解真皮中的胶原蛋白及弹性蛋白，调节促血管新生因子以及产生内源型的血管新生抑制因子，通过溶解周边的基质来促进血管再生。</p><p>研究表明，当体内MMP1 基因过度表达时, 则会导致胶原蛋白降解酶的大量分泌，降解胶原蛋白，真皮层结构由于胶原蛋白的分解，而遭到破坏。真皮层结构的改变是皮肤出现皱纹、下垂的主要原因，老化皮肤的真皮厚度变薄，密度降低。</p><p>胶原蛋白降解酶的活性取决于MMP1 基因的表达，基因多态性则会导致不同人的基 因表达程度有所差异，因此胶原蛋白的流失风险不同。</p>"
    },
    {
        name:"皮肤再生细胞修复能力",
        img:"images/summary3.png",
        html:"<p>科学依据<br/>皮肤作为人体最大最外部的器官极易遭受创伤。各种急、慢性创伤千百年来一直困扰着人们。皮肤损伤修复的过程可分为：炎症、增生和重建三个阶段。这三个阶段是连续和相互重叠的过程，往往因损伤的部位、性质、范围以及是否伴有感染而有所不同。</p><p>炎症期是损伤修复的初始阶段，其特点是血液来源的细胞积聚在损伤部位、并释放一系列的细胞因子(cytokine)与介质(mediator)参与修复。</p><p>损伤修复的增生期包括一系列的上皮新生、血管形成、纤维组织形成等。</p><p>修复的重建期，也是损伤修复的最后一个阶段，包括一系列的细胞外基质蛋白的沉积和之后的一系列重新分布与调整。<br/>研究表明XRCC1基因编码X 射线修复交叉互补蛋白1（XRCC1），XRCC1 对DNA 损伤能起到有效的修复作用。XRCC1 为重要的DNA损伤修复基因，与皮肤再生能力相关。</p>"
    },
    {
        name: "皮肤排毒能力",
        img: "images/summary2.png",
        html: "<p>该基因编码金属硫蛋白1A，其属于金属硫蛋白家族，是富含半胱氨酸、金属结合的低分子蛋白。该类蛋白参与自由基的清除，和铅、镉、砷、汞等重金属的解毒。该基因多态性影响皮肤铅敏感性和抗氧化能力。</p><p>皮肤中毒会出现过敏，湿疹，皮炎和痤疮等问题。皮肤的天然防御功能受损是造成毒素堆积的最主要原因，皮肤排毒和保持健康的最好方法就是要保护好皮肤的屏障功能，平时涂抹一些具有屏障修护作用的婵医皮肤屏障乳液，可以有效提升皮肤的免疫力，让肌肤变得坚韧。另外，具有排毒功效的食物有绿豆、黄瓜、蜂蜜、柠檬、绿茶、海带等。</p><p>该基因编码金属硫蛋白1A，其属于金属硫蛋白家族，是富含半胱氨酸、金属结合的低分子蛋白。该类蛋白参与自由基的清除，和铅、镉、砷、汞等重金属的解毒。该基因多态性影响皮肤铅敏感性和抗氧化能力。</p><p>皮肤中毒会出现过敏，湿疹，皮炎和痤疮等问题。皮肤的天然防御功能受损是造成毒素堆积的最主要原因，皮肤排毒和保持健康的最好方法就是要保护好皮肤的屏障功能，平时涂抹一些具有屏障修护作用的婵医皮肤屏障乳液，可以有效提升皮肤的免疫力，让肌肤变得坚韧。另外，具有排毒功效的食物有绿豆、黄瓜、蜂蜜、柠檬、绿茶、海带等。</p>"
    },
    {
        name: "皮肤保湿能力",
        img: "images/summary10.png",
        html: "<p>水通道蛋白3（AQP3）基因是第1 个被发现的水通道蛋白基因，AQP3 基因定位于第9 号染色体(9p13)上，其介导的水和甘油的运输在皮肤表皮水合作用中扮演重要角色。</p><p>在皮肤中，AQP3 的表达有一定的空间层次，主要表达于表皮基底层，而棘细胞层、颗粒层、到角质层则逐渐消失。这种空间分布与皮肤的含水量分布一致，即基底层和基底层上部的水含量约75%，而角质层仅约10～15%。</p><p>研究表明，AQP3在基底膜一带的高表达，可以促使水、甘油及尿素的转运，使得基底层的细胞间液更接近于中性的平衡状态；而越接近角质层，AQP3 的表达也越减少，水分丢失的也越严重。</p><p>此外，角质层中的甘油含量直接或间接影响着皮肤保湿功能， AQP3担负着甘油来源的重任，它不仅能将循环中的内源性甘油、皮脂腺中的甘油三脂带入表皮，还进一步参与表皮细胞的甘油代谢。AQP3 基因变异可引起皮肤干燥、水合作用降低等。</p>"
    }
    ,
    {
        name: "皮肤抗氧化能力",
        img: "images/summary11.png",
        html: "<p>抵抗皮肤的老化，其实就是一个抗氧化的过程。氧化过程中的过剩产物自由基就是我们身体变老的始作俑者。自由基是具有未成对电子的分子，它从另一个分子中“偷取”电子让自身得以稳定，而另一个分子则变成了自由基，周而复始，形成恶性循环。这个过程也被称为氧化应激反应，即机体的氧化，它与皮肤老化相关。抗氧化便是清除过剩自由基的重要过程，保护我们的机体，阻止氧化应激反应发生。</p><p>1968 年，美国杜克大学校园内一个简单的酶动力学实验使两位科学家Joe M.McCord 和Irwin Fridovich 发现了一种新的酶，根据其活性命名为超氧化物歧化酶（SOD），并证实SOD 的独特作用是清除一种氧气衍生的超氧阴离子自由基，也就是我们身体氧化反应过程中的废弃产物。超氧化物歧化酶2（SOD2）是SOD 家族中的重要成员，编码锰超氧化物歧化酶，该基因位于第6 号染色体6q25.3 位置。SOD2 编码的锰超氧化物歧化酶可以清除氧自由基，产生过氧化氢和氧，再在过氧化氢酶的作用下，最终转化为水和氧，以达到清除自由基的目的。SOD2 基因变异会显著影响锰超氧化物歧化酶的活性，因而不同基因型携带者的抗氧化能力有所不同。</p>",
        desc:"<p>皮肤是各种理化因素损伤的重要对象，如紫外线与环境污染物的不良影响可能造成皮肤结构和功能的损伤。越来越多的证据表明皮肤氧化与抗氧化稳态的失衡与皮肤老化、干燥、色素沉着等直接相关、而过敏性皮炎、色斑形成等严重皮肤病变也与氧化损伤密切相关。</p>"
    },
    {
        name: "皮肤抗光老化能力",
        img: "images/summary9.png",
        html:"<p>太阳的紫外线是过早皮肤老化的主要原因。 随着时间的推移，过度的日晒（特别是紫外线A）会导致皮肤外观和整体健康状况下降。</p><p>紫外线A具有非常小的即时外部效应，所积累的损伤通常要很多年才显现。该基因编码一种含WD40 重复序列和突触结合结构域的蛋白，在囊泡转运和胞吐过程中发挥作用。研究表明，该基因在皮肤光老化中起重要作用。</p>"
    },
    {
        name: "皮肤抗衰老能力",
        img: "images/summary4.png",
        html:"<p>TERC（telomerase RNA component）基因位于3号染色体上，它是端粒酶的组成成分之一——端粒酶用它来延长端粒。端粒酶RNA在DNA复制过程中，为端粒的逆转录过程提供模板，它通过给端粒加上重复序列来维持其长度。</p><p>TERT（telomerase reverse transcriptase）基因位于5号染色体上，是保持端粒长度重要的反转录酶，调节端粒酶的活性。<br/>OBFC1（oligosaccharide binding fold containing 1）促进端粒的复制，可以改变端粒的长度。</p><p>N1R85P（vomeronasal 1 receptor 85 pseudogene）NAF1（nuclear assemblyfactor 1）4号染色体，编码的蛋白质参与到端粒酶的产生与活性。</p><p>为什么肉嘟嘟的脸不显老？<br/>面部衰老有两个阶段，第一阶段是皮下脂肪的流失，造成面部整体的干瘪，出现更多的细纹；第二阶段是面部整体组织的下沉，整个面部的轮廓出现走形。脸微胖的人通常有更多的皮下脂肪，这些人对于第一阶段的衰老有较强的抵抗能力，更晚出现皱纹。</p>",
        desc:"<p>什么是衰老？<br/>一个人身体机能的最高峰，通常出现在20岁左右。之后，随着年龄的增长，身体的机能会逐渐出现一定的衰退，这个过程称作衰老。科学研究发现，衰老可能与细胞端粒 (英文名:Telomeres)的缩短有关。端粒是存在于真核细胞染色体末端的一小段DNA蛋白质复合体。DNA的每一次复制，细胞每一次分裂，都会缩短端粒的长度。端粒越短，在后续的复制中出错的可能性越大，就越容易导致疾病和身体机能的下降。环境、生活方式和压力也都会对衰老程度产生影响。</p><p>基因和衰老有什么关系？<br/>人的衰老是一个复杂的过程，而端粒的老化是其中一个重要的原因。</p>"
    },
    {
        name: "疤痕肤质风险",
        img: "images/summary5.png",
        html:"<p>什么是瘢痕疙瘩？<br/>瘢痕疙瘩是一种特殊的疤痕，形态为皮肤表面光滑发亮的肉色隆起，通常在受伤和手术切口处形成。瘢痕疙瘩区别于普通疤痕的三个要素是：疤痕凸起于皮肤表面，面积大于伤口，通常不会在几个月内自行消失。</p><p>瘢痕疙瘩最容易发生在前胸，后背，耳垂和肩部三角肌位置，这些位置的真皮组织对损伤更加敏感。真皮组织包括脂肪、胶原蛋白和弹性纤维，它们可以给皮肤提供支撑力量和灵活性。瘢痕疙瘩的形成，通常意味着皮肤真皮层的严重受损。</p><p>皮肤的真皮层受伤后，真皮中纤维细胞会在愈合过程中出现增生，同时伴随胶原蛋白，纤维蛋白，弹性蛋白，糖蛋白以及生长因子（TGFβ）的过度生成。如果在愈合过程中，纤维细胞的生长在单一方向上对齐排列，而不是随机形成的网篮状，功能质量通常较为低劣，外观表现即为瘢痕疙瘩。</p>"
    },
    {
        name: "雀斑黑色素风险",
        img: "images/summary6.png",
        html:"<p>在我们的皮肤中，黑色素主要是由黑色素小体产生的，黑色素小体位于真皮与表皮交界处。黑皮质素受体1（MC1R）基因调节黑色素产生的数量和类型，是皮肤色素沉着的主要决定因素。在受到黑皮质素受体1（MC1R）基因的表达影响后，黑素小体将酪氨酸一步步转化成黑色素，排到角质之间，这样皮肤的外观就逐渐变深了，MC1R 对紫外线诱导的伤害敏感。MC1R 与α-促黑激素在细胞膜上结合，从而激活了多条黑色素合成途径，其中包括酪氨酸在酪氨酸酶的催化下产生多巴，氧化成多巴醌，并最终转化为黑色素。科学家的研究显示，人群中不同的MC1R 基因分型导致了MC1R 基因活性的差异。MC1R 基因的多态性与肤色、头发颜色、阳光敏感性、色素沉着等相关。BNC2基因也与皮肤抗皱能力相关。</p>"
    },
    {
        name: "青春痘风险",
        img: "images/summary7.png",
        html:"<p>封闭型粉刺的毛囊中，很容易大量滋生痤疮丙酸杆菌，这是一种厌氧菌。细菌滋生会引发炎症红肿，形成炎性痘痘，即丘疹。深层的炎症可能会导致更严重的局部红肿和硬块（囊肿结节型痘痘），也可能会引发全身的免疫反应，例如淋巴肿大。</p><p>为什么会长痘痘？<br/>痘痘的成因中，大约80%和遗传有关。如果你的父母年轻时长过痘痘，你也有更大的几率会长痘。容易长痘痘人，皮脂分泌更旺盛，皮肤角质层更不稳定，皮肤抗炎能力也更差。这种特质受到多个基因上的多个位点影响。DDB2基因编码一个DNA结合蛋白，它可以调节组蛋白H4的分解，而H4蛋白是人类皮脂腺抗菌作用的主要成分。DDB2结合蛋白能够降解雄激素受体蛋白，全基因关联研究发现，DDB2基因上的rs747650位点为C型，更容易发生痤疮。</p><p>SELL基因影响人体内稳态，在发生痤疮的部位，SELL基因有更高表达，并促进血液中白血球聚集在皮肤的炎症部位。全基因关联研究发现，SELL基因rs7531806位点为A型，更容易发生痤疮。</p>",
        desc:"<p>什么是长痘痘？<br/>痘痘，又称青春痘，一般都是从青春期开始出现。学名痤疮，是一种常见的皮肤疾病。2010年，全世界罹患痤疮的人数可能达到6.5亿人。接近一半的年轻人，都经历过长痘的烦恼。根据中国的大规模人群调查，在19岁时，长痘痘的人比例高达46.8%。随着年龄增长，长痘的人比例变低，程度也越来越轻。黑人和白人比亚洲人更容易长痘痘。城市人口比乡村人口更容易长痘痘。男性比女性更容易长痘痘。</p><p>痘痘最容易长在脸上，特别是额头和下巴部位。胸部上半段和背部也很容易长痘痘。因为这些地方皮脂腺分泌更旺盛。如果分泌出的皮脂和脱落皮屑混合，干涸后变成堵住毛囊口的蜡状物，使后续皮脂无法顺利继续排出，就会形成粉刺。毛囊口没有完全封闭时，裸露的皮脂角质混合物会氧化变黑，形成黑头粉刺。如果毛囊完全封闭，就会形成和肤色一致的突起，即封闭性粉刺（俗称闭口）。</p>"
    }
];














