$(document).ready(function(){
    fn_setMainOnLoad()
  });


/**
 * <pre>
 * CALENDAR PROJECT
 * @COPYRIGHT (c) 2009-2012 WebCash, Inc. All Right Reserved.
 *
 * @File Name      : schd2_0005_01.js
 * @File path    	 : CALENDAR_PT_STATIC/web/js/schd_mngm
 * @author       	 : 주광욱 ( greenjkw@naver.com )
 * @Description    : 월간
 * @History      	 : 20150617021515, 주광욱
 * </pre>
 **/
// 변수설정
var g_calStartDate = "";		//달의 시작일자.
var g_calEndDate = "";			//달의 마지막 일자.
var G_ROW_MAX_CNT = 6;			//row 최대 갯수.
var G_ROW_CNT = 6; 				//row 세팅된 갯수


var g_maxValue = 0;
var localArrValue = 0;
var tmpLocalValue = 0;

var g_arr_sun = new Array();
var g_arr_mon = new Array();
var g_arr_tue = new Array();
var g_arr_wed = new Array();
var g_arr_thu = new Array();
var g_arr_fri = new Array();
var g_arr_sat = new Array();

var isSequential = true;


/**
 * 높이를 이용하여 표현할 수 있는 row 갯수를 구한다.
 */
function uf_getSearchRow(){
	var height = parseInt($(".hidden_wrap").css("height").replace("px", ""));
	
	height = height-31;
	var row = G_ROW_MAX_CNT;
	//clog("height = "+ height);
	row = parseInt(height/22 );
	var startDate = 'Fri Dec 01 2023 00:00:00 GMT+0700 (Indochina Time)    '
	var endDate = 'Sun Nov 26 2023 00:00:00 GMT+0700 (Indochina Time)    '
	
	//clog("uf_getSearchRow = "+ row);
	return row;
}
/**
 * row갯수를 이용하여 화면을 변경한다. 
 */
function setAutoRow(b_auto){ 
	if( $("#monthScreen").find(".monthly_calendar").length > 0){
		if(!!b_auto){
			if(G_ROW_CNT != uf_getSearchRow() ){
				G_ROW_CNT = uf_getSearchRow();
				//clog("setAutoRow G_ROW_CNT = "+ G_ROW_CNT ) ;
				setAutoRowView();
			}
		}else{
			G_ROW_CNT = uf_getSearchRow();
			//clog("setAutoRow G_ROW_CNT = "+ G_ROW_CNT ) ;
			setAutoRowView();
		}
		
	}else{
		//done
	}
}
/**
 * row를 표현
 */
function setAutoRowView(){
	var startDate = Date.parseExact(g_calStartDate.toString("yyyyMMdd"), "yyyyMMdd");
	var endDate = Date.parseExact(g_calEndDate.toString("yyyyMMdd"), "yyyyMMdd");
	while(true){
		if( cnts_Null2Void(startDate, "") == ""){
			break;
		}
		for(var rowCnt=1; rowCnt <= 13; rowCnt++){
			if( $("#td_"+startDate.toString("yyyyMMdd")+"_"+rowCnt).length > 0){	// td 존재여부 colspan으로 없을 수 있다.
				if(rowCnt <= G_ROW_CNT){
					$("#td_"+startDate.toString("yyyyMMdd")+"_"+rowCnt).show();
				}else{
					$("#td_"+startDate.toString("yyyyMMdd")+"_"+rowCnt).hide();
				}
			}
		}
		setSchdViewCnt(startDate.toString("yyyyMMdd"), (parseInt(getSchdCnt(startDate.toString("yyyyMMdd")))-G_ROW_CNT));
		if(startDate.addDays(1) > endDate) break;
	}
}
function setResizeAutoRow(){
	setAutoRow(true);
	
	
	
}
window.onresize = setResizeAutoRow;


// new (Jex.extend({
// 	onload:function() {		
// 		_this = this;
// 		//--- todo onload start ---//
// 		//fn_setOnLoad();
// 		//parent.fn_initDate();
		
// 	}, event:function() {
		
	
// 	}
// }))();

/**
 * 로딩
 * @return
 */
function fn_setMainOnLoad(){
    console.log("heeeeeeeeeeee");
	$("#monthEtcScreen").hide();
	// 현재 날짜에 대한 초기값 처리 함수 호출
	fn_monthInitDate();
	// fn_searchSchdList();
	
	
}

/**
 * 현재 날짜에 대한 초기값 함수
 * @return
 */
function fn_monthInitDate(){
    var firstDayOfMonth = Date.parseExact($("#frm_schd_layout").find("#SEARCH_DAY").val(), "yyyyMMdd").moveToFirstDayOfMonth();
    var lastDayOfMonth = Date.parseExact($("#frm_schd_layout").find("#SEARCH_DAY").val(), "yyyyMMdd").moveToLastDayOfMonth();
	console.log(firstDayOfMonth);
	// 달력시작일자를 첫째일자의 일요일로 이동
	if(firstDayOfMonth.getDay()==0){
		g_calStartDate = firstDayOfMonth;
	} else {
		g_calStartDate = firstDayOfMonth.moveToDayOfWeek(0, -1);
	}
	
	// 달력종료일자를 마지막일자의 토요일로 이동
	if(lastDayOfMonth.getDay()==6){
		g_calEndDate = lastDayOfMonth;
	} else {
		g_calEndDate = lastDayOfMonth.moveToDayOfWeek(6); 
	}
	
	var viewMonth = Date.parseExact($("#frm_schd_layout").find("#SEARCH_DAY").val(), "yyyyMMdd");
	$("#currMonthView").html(viewMonth.toString("yyyy.MM"));
	$("#searchCurrMonthView").html(viewMonth.toString("yyyy.MM"));
	
	//clog("g_calStartDate = "+ g_calStartDate.toString("yyyyMMdd"));
	//clog("g_calEndDate = "+ g_calEndDate.toString("yyyyMMdd"));
	
}

/**
 * 날짜표현하는 부분.
 * @param startDate
 * @returns {String}
 */
function getCalLineTd(startDate){
	var reRslt = "";
	if(startDate.toString("MM") !== Date.parseExact($("#frm_schd_layout").find("#SEARCH_DAY").val(), 'yyyyMMdd').toString("MM")) {
		reRslt = "<td id='layout_"+startDate.toString("yyyyMMdd")+"'  class='disable'><span date='"+startDate.toString("yyyyMMdd")+"' style='display:none'>&nbsp;</span><div></div></td>";
	}else if(startDate.toString("yyyyMMdd") == $("#frm_schd_layout").find("#TODAY").val()) {
		reRslt = "<td id='layout_"+startDate.toString("yyyyMMdd")+"'  class='today_area'><span date='"+startDate.toString("yyyyMMdd")+"' style='display:none'>&nbsp;</span><div class='outline'></div></td>"
	}else{
		reRslt = "<td id='layout_"+startDate.toString("yyyyMMdd")+"' ><span date='"+startDate.toString("yyyyMMdd")+"' style='display:none'>&nbsp;</span><div></div></td>";
	}
	return reRslt; 
}
/**
 * 날짜 일수를 표현 01==> 1로 표현.
 * @param startDate
 * @returns
 */
function getNumberDate(startDate){
	var tmp= cnts_Null2Void(startDate.toString("dd"));
	if(tmp.length > 1){
		if(tmp.substr(0, 1) == "0"){
			tmp = tmp.substr(1, 1);
		}
	}else{
		//done.
	}
	return tmp;
}
/**
 * 공휴일 여부
 * @param startDate
 */
function getHoliday(dat, startDate){
	var tmp = "";
	var commDateRecLen = dat.COMM_DATE_REC.length;
	if(commDateRecLen>0){
		for(var i=0; i<commDateRecLen; i++){
			var hollyday_date = dat.COMM_DATE_REC[i].SOLAR_DATE;
			if(hollyday_date == startDate.toString("yyyyMMdd")){
				tmp = dat.COMM_DATE_REC[i].MEMO;
			}
		}
	}
	return tmp;
}

/**
 * 날짜 부분 레이아웃 생성.
 * @param startDate
 * @returns {String}
 */
function monthWeekLayout(startDate){
	var tmpDate = Date.parseExact(startDate.toString("yyyyMMdd"), "yyyyMMdd");
	var html = "";
	for(var tdCnt=0;tdCnt<7; tdCnt++){
		if( 0 == tmpDate.getDay()){	//일요일 - 최초 시작.
			html +=	"	<table class='cal_line'>";
			html += "		<tbody>";
			html += "			<tr>";
			html += getCalLineTd(tmpDate);	
		}else if( 0 < tmpDate.getDay() && tmpDate.getDay() < 6){		// 월~금요일
			html += getCalLineTd(tmpDate);
		}else if( 6 == tmpDate.getDay()){		//토요일 - 마지막.
			html += getCalLineTd(tmpDate);
			html += "			</tr>";
			html += "		</tbody>";
			html += "	</table>";
		}
		
		tmpDate.addDays(1);
		
	}
	return html;
}
/**
 * row 1~6까지 생성
 * @param startDate
 * @returns
 */
function rowLayout(startDate){
	var html = "";
	for(var tdRow=1;tdRow<14; tdRow++){
		var tmpDate = Date.parseExact(startDate.toString("yyyyMMdd"), "yyyyMMdd");
		tmpDate.addDays(-6);
		var firstOfweekDate = tmpDate;
		
		//clog("tdRow = "+ tdRow + "     "+ firstOfweekDate.toString("yyyyMMdd"));
		while(true){
			if( 0 == tmpDate.getDay()){	//일요일 - 최초 시작.
				html += "<tr id='"+firstOfweekDate.getWeekOfYear()+"_"+tdRow+"'>";
			}
			html += "<td id='td_"+firstOfweekDate.toString("yyyyMMdd")+"_"+tdRow+"'><span  date='"+firstOfweekDate.toString("yyyyMMdd")+"'>&nbsp;</span></td>";
			
			if( 6 == firstOfweekDate.getDay()){	//토요일
				html += "</tr>";
				break;
			}else{
				firstOfweekDate.addDays(1);
			}
		}
	}
	return html;
	
}
function monthLayout(dat){
	console.log(dat);
	//clog("===== monthlayout =======");
	var startDate = Date.parseExact(g_calStartDate.toString("yyyyMMdd"), "yyyyMMdd");
	var endDate = Date.parseExact(g_calEndDate.toString("yyyyMMdd"), "yyyyMMdd");
	//clog("startDate = "+ startDate.toString("yyyyMMdd"));
	//clog("endDate = "+ endDate.toString("yyyyMMdd"));
	setMonthLine(startDate, endDate);
	var schdHtml = "";
	console.log(g_calStartDate);
	console.log(setMonthLine(startDate, endDate));
	var hollydayNm = "";
	var weekClassNm = "";
	var dayClassNm = "";
	var disableClassNm = "";
	var rowCnt = 0;
	while(true){
		hollydayNm = "";
		weekClassNm = "";
		dayClassNm = "";
		disableClassNm = "";
		//clog("date = "+ startDate.toString("yyyyMMdd"));
		
		//clog("aaa = "+ startDate.getDay());
		//clog(startDate.getWeekOfYear());
		console.log("startDate.getDay",startDate.getDay)
		if( 0 == startDate.getDay()){	//일요일 - 최초 시작.
			schdHtml += "<div class='month_row' id='"+startDate.getWeekOfYear()+"_month_row'>";
			schdHtml += monthWeekLayout(startDate);
			schdHtml += "<div class='hidden_wrap'>";
			schdHtml += "	<table class='schedule_list' summary=''>";
			schdHtml += "		<caption></caption>";
			schdHtml += "		<tbody>";
			schdHtml += "			<tr id='tr_"+startDate.getWeekOfYear()+"_0' class='date'>";
			
			weekClassNm = " sun";
		}else if( 6 == startDate.getDay()){	//토요일
			weekClassNm = " sat";
		}
		
		var commDateRecLen = dat.COMM_DATE_REC.length;
		hollydayNm = getHoliday(dat, startDate);
		if("" != hollydayNm){
			weekClassNm = " sun";
			dayClassNm = "day_info";
		}
		
		if(startDate.toString("MM") !== Date.parseExact($("#frm_schd_layout").find("#SEARCH_DAY").val(), 'yyyyMMdd').toString("MM")) {
			disableClassNm = "disable";
		}
		
		schdHtml +="<td id='td_"+startDate.toString("yyyyMMdd")+"' class='"+disableClassNm+" "+weekClassNm+"'>";
		schdHtml +="<strong class='directDay' style='cursor:pointer' onclick='goDay("+startDate.toString("yyyyMMdd")+");'>"+getNumberDate(startDate)+"</strong>";			//일자
		schdHtml +="<span date='"+startDate.toString("yyyyMMdd")+"' class='"+dayClassNm+"'>"+hollydayNm+"</span>";	//휴일
		schdHtml +="<span id='day_"+startDate.toString("yyyyMMdd")+"' style='display:none'></span>";	//실제갯수.
		schdHtml +="<a title='일정더보기' onclick='goDay("+startDate.toString("yyyyMMdd")+");' class='more num_of_event' id='day_"+startDate.toString("yyyyMMdd")+"_view' style='display:block'> </a></td>"	//표현되는 갯수
		
		if( 6 == startDate.getDay()){	//토요일
			schdHtml +="</tr>";
			schdHtml += rowLayout(startDate);
			schdHtml +="</tbody>";
			schdHtml +="</table>";
			schdHtml +="</div>";
			schdHtml +="</div>";
		}
		if(startDate.addDays(1) > endDate) break;
	}
	$("#monthCal").html(schdHtml);
	
}
function goDay(startDate){
	//clog("goDay = "+ startDate);
	$("#frm_schd_layout").find("#SEARCH_DAY").val(startDate);
	fn_goUrl("D");
}
function setMonthLine(startDate, endDate){
	var between = getCalBetween(startDate.toString("yyyyMMdd"), endDate.toString("yyyyMMdd"));
	var monthLine = (between+1)/7;
	for(var i=4; i<= 6; i++){
		if($("#schdLine").hasClass("line"+i)){
			$("#schdLine").removeClass("line"+i);
			break;
		}
	}
	$("#schdLine").addClass("line"+monthLine);
}
/**
 * 일정조회 웹서비스 호출 함수
 * @return
 */
function fn_searchSchdList(){
	var searchWord =  "";
	if (!$.support.placeholder) {
		if ($("#searchContent").val() == $("#searchContent").attr("placeholder")){ 
			searchWord = "";
		}else{
			searchWord = $("#searchContent").val();
		}
	
	}else{
		searchWord = $("#searchContent").val();
	}
	
	var sClsfNm = "";
	var jexAjax = jex.createAjaxUtil("scrh_inq_0002");
	jexAjax.set("USER_ID"			, $("#frm_schd_layout").find("#SEARCH_USER_ID").val());
	jexAjax.set("START_DATE"		, g_calStartDate.toString("yyyyMMdd")		); 	
	jexAjax.set("END_DATE"			, g_calEndDate.toString("yyyyMMdd")			); 
	jexAjax.set("CLSF_SRNO"			, $("#srchSchdClsfTitle").attr("clsf_srno")	);
	jexAjax.set("SRCH_WD"			, searchWord);
	jexAjax.set("EMPL_GRP_SRNO"		, $("#frm_schd_layout").find("#SEARCH_EMPL_GRP_SRNO").val());
	jexAjax.set("INQ_KEY"			,"MONTH"									);
	jexAjax.set("SRCH_USER_IDNT_SRNO"			,"Y"									);
	
	jexAjax.execute(function(dat) {
		var startDate 	= Date.parseExact(g_calStartDate.toString("yyyyMMdd"), "yyyyMMdd");
		var endDate 	= Date.parseExact(g_calEndDate.toString("yyyyMMdd"), "yyyyMMdd");
		var schdHtml 	= "";
		
		var hollydayNm = "";
		var weekClassNm = "";
		var dayClassNm = "";
		var disableClassNm = "";
		var STTG_DT_TMP = "";
		var FNSH_DT_TMP = "";
		var between = 0;
		var scheduleClasses = "";
		var b_specDayYn = true;
		var b_OVER = false;
		var schdCnt = "";
		monthLayout(dat);
		//G_ROW_CNT = uf_getSearchRow();		//높이에 따른 높이를 찾는다.
		//clog("fn_searchSchdList G_ROW_CNT = "+ G_ROW_CNT ) ;
		
		//while(true){
			
			var i=0;
			var dayHtml = "";
			
			$.each(dat.SCHD_REC, function(i) {
				//alert("Loop = "+i);
				dayHtml = "";
				colorNm = "";
				b_specDayYn = true;
				schdCnt = "";
				between = 0;
				b_OVER = false;
				STTG_DT_TMP = dat.SCHD_REC[i].STTG_DT;
				FNSH_DT_TMP = dat.SCHD_REC[i].FNSH_DT;
				if(dat.SCHD_REC[i].STTG_DT < g_calStartDate.toString("yyyyMMdd")){ //달력의 최초 시작일보다 시작일이 먼저일 경우.
					STTG_DT_TMP = g_calStartDate.toString("yyyyMMdd");
					b_OVER = true;
				}
				if(g_calEndDate.toString("yyyyMMdd") < dat.SCHD_REC[i].FNSH_DT ){ //달력의 마지막일보다 마지막이 더 뒤일 경우.
					FNSH_DT_TMP = g_calEndDate.toString("yyyyMMdd");
					b_OVER = true;
				}
				
				var arr_startDT = new Array();
				var arr_endDT 	= new Array();
				var arr_gap 	= new Array();
				getSchdList(arr_startDT, arr_endDT, arr_gap, STTG_DT_TMP, FNSH_DT_TMP);
				/*
				clog("startDate= "+ startDate.toString("yyyyMMdd"));
				clog("arr_startDT[0] = "+ arr_startDT[0]);
				clog("arr_startDT.length = "+ arr_startDT.length);
				*/
				//if( startDate.toString("yyyyMMdd")  == arr_startDT[0]){
					//clog("===============  i = "+ i);
					for(var arrCnt=0; arrCnt< arr_startDT.length; arrCnt++){
						setSchdCreate(arr_startDT[0], arr_startDT[arrCnt], arr_endDT[arrCnt], dat.SCHD_REC[i], b_OVER, i , arr_gap[arrCnt]); //일정 생성.
					}
				//}
			});
			$("#monthEtcScreen").fadeOut();
			$("#monthScreen").fadeIn();
			
			//if(startDate.addDays(1) > endDate) break;
		//}
		setAutoRow();
		cursorBgSelect();
	});
}



/*
 * 배경 처리.
 */
var arr_disablestartDT 	= new Array();
function cursorBgSelect(){
	var startDate 	= Date.parseExact(g_calStartDate.toString("yyyyMMdd"), "yyyyMMdd");
	var endDate 	= Date.parseExact(g_calEndDate.toString("yyyyMMdd"), "yyyyMMdd");
	
	while(true){
		if( $("#layout_"+startDate.toString("yyyyMMdd")).hasClass("disable")){
			arr_disablestartDT.push(startDate.toString("yyyyMMdd"));
		}
				
		$("#layout_"+startDate.toString("yyyyMMdd")).droppable({
			over: function(event, ui) {
				$(this).addClass("bg_drag");
				if( $(this).hasClass("disable")){
					$(this).removeClass("disable");
				}
				$("#frm_schd_layout").find("#DRAG_SELECTED").val($(this).find("span").attr("date"));
		    },
		    out: function(event, ui) {

				for(var arrCnt=0; arrCnt< arr_disablestartDT.length; arrCnt++){
					if(arr_disablestartDT[arrCnt] == $(this).find("span").attr("date")){
						$(this).addClass("disable");
						break;
					}
				}
		        $(this).removeClass("bg_drag");
		    },

			drop: function( event, ui ) {
		        //clog("날짜 선택됨 = "+ $(this).html());
			}
	    });
		if(startDate.addDays(1) > endDate) break;
	}
}

/**
 * 연속으로 날짜 표현..
 * schd 값도 세팅
 */
function setColsSchdCnt(schdCnt, STTG_DT, FNSH_DT, gap){
	//clog("====== setColspan ============");
	//clog("STTG_DT = "+ STTG_DT);
	//clog("FNSH_DT = "+ FNSH_DT);
	var between = getCalBetween(STTG_DT, FNSH_DT);
	//clog("between = "+ between);	
	var tmpDate = Date.parseExact(FNSH_DT, "yyyyMMdd");		//종료일 세팅
	if(between > 0){
		for(var cnt=0; cnt<between; cnt++){
			//clog("cnt = "+ cnt);
			$("#td_"+tmpDate.toString("yyyyMMdd")+"_"+schdCnt).remove();		//뒤에부터 없앤다.	
			if( parseInt(schdCnt) > parseInt(getSchdCnt(tmpDate.toString("yyyyMMdd")))){
				setSchdCnt(tmpDate.toString("yyyyMMdd"), schdCnt);
			}
			//clog("#td_"+tmpDate.toString("yyyyMMdd")+"_"+schdCnt+" remove");
			tmpDate.addDays(-1);
		}
		var addBetween = between+1;
		$("#td_"+tmpDate.toString("yyyyMMdd")+"_"+schdCnt).attr("colspan", addBetween);
		$("#td_"+tmpDate.toString("yyyyMMdd")+"_"+schdCnt).attr("gap", gap);
		//clog("#td_"+tmpDate.toString("yyyyMMdd")+"_"+schdCnt+" attr(colspan, "+addBetween);
		
	}else{
		
	}
	if( parseInt(schdCnt) > parseInt(getSchdCnt(tmpDate.toString("yyyyMMdd")))){
		setSchdCnt(tmpDate.toString("yyyyMMdd"), schdCnt);
	}else{	
		//done.
	}
	
	return between;
}

/**
 * 주가 변경되는 스케쥴을 나눠서 배열에 시작, 종료일을 넣어준다.
 */
function getSchdList(arr_startDT, arr_endDT, arr_gap, STTG_DT_TMP, FNSH_DT_TMP){
	if(getCalWeek(STTG_DT_TMP) != getCalWeek(FNSH_DT_TMP)){		//주를 다음까지 처리할 경우.
		/*
		clog("=============== getSchdList =====================");
		clog("시작일 STTG_DT_TMP = "+ STTG_DT_TMP.toString("yyyyMMdd"));
		clog("종료일 FNSH_DT_TMP = "+ FNSH_DT_TMP.toString("yyyyMMdd"));
		*/
		var STTG_DT_TMP_1 = Date.parseExact(STTG_DT_TMP, "yyyyMMdd");	
		var FNSH_DT_TMP_1 = Date.parseExact(STTG_DT_TMP, "yyyyMMdd");	
		var b_stop = false;
		/*
		clog("시작일 STTG_DT_TMP_1 = "+ STTG_DT_TMP_1.toString("yyyyMMdd"));
		clog("시작일을 종료일로 변경 FNSH_DT_TMP = "+ FNSH_DT_TMP_1.toString("yyyyMMdd"));
		*/
		while(true){
			b_stop = false;
			/*
			clog("변경된 시작일 STTG_DT_TMP = "+ STTG_DT_TMP_1.toString("yyyyMMdd"));	
			clog("변경된 종료일 FNSH_DT_TMP = "+ FNSH_DT_TMP_1.toString("yyyyMMdd"));
			*/
			if(FNSH_DT_TMP_1.getDay() != 6){
				FNSH_DT_TMP_1.moveToDayOfWeek(6);
			}
			/*
			clog("=============== 비교 =====================");
			clog("종료일 비교 오리지널 FNSH_DT_TMP = "+ FNSH_DT_TMP.toString("yyyyMMdd"));	
			clog("종료일 비교 변경 FNSH_DT_TMP = "+ FNSH_DT_TMP_1.toString("yyyyMMdd"));
			*/
			if(FNSH_DT_TMP <= FNSH_DT_TMP_1.toString("yyyyMMdd")){
				FNSH_DT_TMP_1 = Date.parseExact(FNSH_DT_TMP, "yyyyMMdd");
				b_stop = true;
			}
			
			arr_startDT.push(STTG_DT_TMP_1.toString("yyyyMMdd"));
			arr_endDT.push(FNSH_DT_TMP_1.toString("yyyyMMdd"));
			arr_gap.push(getCalBetween(STTG_DT_TMP.toString("yyyyMMdd"), FNSH_DT_TMP.toString("yyyyMMdd")));
			/*
			clog("insert STTG_DT_TMP = "+ STTG_DT_TMP_1.toString("yyyyMMdd"));
			clog("insert FNSH_DT_TMP_ = "+ FNSH_DT_TMP_1.toString("yyyyMMdd"));
			*/
			if(b_stop){
				break;
			}else{
				//다음주 일요일로 이동시킨다.
				if(STTG_DT_TMP_1.getDay() != 6){
					STTG_DT_TMP_1.moveToDayOfWeek(6);
				}
				STTG_DT_TMP_1.addDays(1);
				FNSH_DT_TMP_1.addDays(1);
			}
		}
	}else{	
		arr_startDT.push(STTG_DT_TMP.toString("yyyyMMdd"));
		arr_endDT.push(FNSH_DT_TMP.toString("yyyyMMdd"));
		arr_gap.push(getCalBetween(STTG_DT_TMP.toString("yyyyMMdd"), FNSH_DT_TMP.toString("yyyyMMdd")));
	}
}

function setSchdCreate(startDate, STTG_DT_TMP, FNSH_DT_TMP, data, b_OVER , cnt, gap){
	//clog("SCHD_SRNO = "+ data);
	/*
	clog("============= create schedule ===============");
	clog("startDate = "+ startDate.toString("yyyyMMdd"));
	clog("STTG_DT_TMP = "+ STTG_DT_TMP);
	clog("FNSH_DT_TMP = "+ FNSH_DT_TMP);
	clog("b_OVER = "+ b_OVER);
	clog("gap = "+ gap);
	*/
	
	
	var scheduleClasses="";
	var dayHtml = "";
	var between = 0;
	var b_specDayYn = true;
	var schdCnt = getBlankSchdCnt(STTG_DT_TMP);
	//alert("Count = "+schdCnt);
	//clog("STTG_DT_TMP = "+ STTG_DT_TMP+ "schdCnt = "+ schdCnt);
	if(schdCnt !=0){
		$("#td_"+STTG_DT_TMP+"_"+schdCnt).addClass("not_empty");
		$("#td_"+STTG_DT_TMP+"_"+schdCnt).attr("gap", gap);
		between = setColsSchdCnt(schdCnt, STTG_DT_TMP, FNSH_DT_TMP, gap);	//colspan 사이의 차이
		
		if(b_OVER || data.STTG_DT != data.FNSH_DT){
			scheduleClasses = " color"+data.CLSF_SRNO;
			//scheduleClasses = " color1";
		}else{
			scheduleClasses = " ";
			//clog("dat.SCHD_REC[i].SPEC_DAY_YN  = "+ data.SPEC_DAY_YN );
			if("Y" == data.SPEC_DAY_YN ){
				scheduleClasses += " day_connect color"+data.CLSF_SRNO;
				//scheduleClasses += " day_connect color1";
			}else{
				scheduleClasses = "oneday color"+data.CLSF_SRNO;
				b_specDayYn = false;
			}
		}
		dayHtml = "<div id='"+data.SCHD_SRNO+"' class='schedule "+scheduleClasses+"' data='"+encodeURIComponent(JSON.stringify(data))+"'>";
		dayHtml += "<div class='info'>";
		if(!b_specDayYn){
			dayHtml += "<img class='ico_share' src='/design2/img/ico/ico_share"+data.CLSF_SRNO+".png' >";
			dayHtml += "<a date='"+startDate.toString("yyyyMMdd")+"' title='"+data.TTL+"'><span>"+data.TTL+"</span></a>";
		}else{
			//done.
			dayHtml += "<a date='"+startDate.toString("yyyyMMdd")+"' title='"+data.TTL+"'><span>"+data.TTL+"</span></a>";
		}
		
		if(!b_specDayYn){
			dayHtml += "<span class='time'>"+fn_timeFormat(cnts_Null2Void(data.STTG_TKTM))+"</span>";
		}else{
			//done.
		}
		
		if("3" == cnts_Null2Void(data.SCHD_DSNC, "") && "N" == cnts_Null2Void(data.EDTR_ATHR_YN, "") ){
			dayHtml += "&nbsp;<img src='/design2/img/ico/ico_group_s.png' alt='그룹' class='ico'>";
		}
		
		if("" != cnts_Null2Void(data.ITRT_SRNO, "") ){	//반복
			dayHtml += "&nbsp;<img src='/design2/img/ico/ico_repeat_s.png' alt='반복' class='ico'>";
		}
		
		dayHtml += "</div>";
		dayHtml += "</div>";
		//alert("#td_"+STTG_DT_TMP+"_"+schdCnt);
		$("#td_"+STTG_DT_TMP+"_"+schdCnt).html(dayHtml);
		
	
		if("E" == $("#frm_schd_layout").find("#SCREEN_GUBUN").val() || "EG" == $("#frm_schd_layout").find("#SCREEN_GUBUN").val()){
			
		}else{
			if(cnts_Null2Void($("#td_"+STTG_DT_TMP+"_"+schdCnt).find(".ico").attr("alt"), "") != "그룹"){
				$("#td_"+STTG_DT_TMP+"_"+schdCnt).draggable({
					revert: function(e){
						var b_revert = true;
						var obj = jQuery.parseJSON(decodeURIComponent(($("#td_"+STTG_DT_TMP+"_"+schdCnt).find(".schedule").attr("data"))));
						if(obj.STTG_DT == $("#frm_schd_layout").find("#DRAG_START").val()){
							b_revert = true;
						}else{
							b_revert = false;
						}
						return b_revert;
					},
					start: function(e){
						$("#td_"+STTG_DT_TMP+"_"+schdCnt).css("z-index", "99999999");
					},
					drag: function(e) {
						$(this).find(".schedule").addClass("active");
						//clog('2');
						b_schdMove = true;
						var dayGap = (parseInt($("#td_"+STTG_DT_TMP+"_"+schdCnt).attr("gap"))+1);
						//clog("dayGap = "+dayGap);
						var oddEven = dayGap%2;
						//clog("oddEven = "+ oddEven);
						var divide = parseInt(dayGap/2); 
						//clog("dayGap/2 = "+ divide);
						if( "" != $("#frm_schd_layout").find("#DRAG_SELECTED").val()){
							outLineRemove();
							$("#layout_" + $("#frm_schd_layout").find("#DRAG_SELECTED").val()).addClass("bg_drag");
							
							var bg_drag_dt = Date.parseExact($("#frm_schd_layout").find("#DRAG_SELECTED").val(), "yyyyMMdd");
							bg_drag_dt.addDays(-1*divide);
							$("#frm_schd_layout").find("#DRAG_START").val(bg_drag_dt.toString("yyyyMMdd"));
							
							
							bg_drag_dt = Date.parseExact($("#frm_schd_layout").find("#DRAG_SELECTED").val(), "yyyyMMdd");
							if(oddEven == 0){	//짝수일 때.
								bg_drag_dt.addDays(1*(divide-1));
							}else{ //홀수일 때는 중간에 위치
								bg_drag_dt.addDays(1*divide);
							}
							$("#frm_schd_layout").find("#DRAG_END").val(bg_drag_dt.toString("yyyyMMdd"));
							outLineAdd();
						}
						
					},
					stop: function(e) {
						clog("stop > removeClass active");
						$(this).find(".schedule").removeClass("active");
						var obj = jQuery.parseJSON(decodeURIComponent(($("#td_"+STTG_DT_TMP+"_"+schdCnt).find(".schedule").attr("data"))));
						if(obj.STTG_DT != $("#frm_schd_layout").find("#DRAG_START").val()){
							setMouseDragDrop($("#td_"+STTG_DT_TMP+"_"+schdCnt).find(".schedule").attr("id"), $("#frm_schd_layout").find("#DRAG_START").val(), $("#frm_schd_layout").find("#DRAG_END").val() );
						}
						outLineRemove();
						b_schdMove = false;
					}
				});
			}else{
				$("#td_"+STTG_DT_TMP+"_"+schdCnt).draggable({
					revert:true,
					start: function(e){
						alertLayer("9", "공유일정은 Drag&Drop을 할 수 없습니다.");
						e.preventDefault();
					}
				});
			}
		}
		
	}else{	//빈곳을 찾을 수 없다면!! 6줄초과하면7줄부터.. +1을 더해준다.
		setSchdMaxRow(STTG_DT_TMP, FNSH_DT_TMP);
	}
}
function setSchdMaxRow(STTG_DT_TMP, FNSH_DT_TMP){
	var between = getCalBetween(STTG_DT_TMP, FNSH_DT_TMP);
	//clog("between = "+ between);	
	var tmpDate = Date.parseExact(FNSH_DT_TMP, "yyyyMMdd");		//종료일 세팅
	if(between > 0){
		for(var cnt=0; cnt<between; cnt++){
			setSchdCnt(tmpDate.toString("yyyyMMdd"), (parseInt(getSchdCnt(tmpDate.toString("yyyyMMdd")))+1));
			tmpDate.addDays(-1);
		}
	}else{
		
	}
	setSchdCnt(STTG_DT_TMP, (parseInt(getSchdCnt(tmpDate.toString("yyyyMMdd")))+1));
	
}
/**
 * 비어있는 곳을 찾는다.
 * @param STTG_DT_TMP
 * @returns {Number}
 */
function getBlankSchdCnt(STTG_DT){
	var returnSchdCnt = 0;
	for(var schdCnt=0; schdCnt <= 13; schdCnt++){
		if($("#td_"+STTG_DT+"_"+schdCnt).length > 0){
			//clog("(#td_"+STTG_DT+"_"+schdCnt+").find(div).length = " + $("#td_"+STTG_DT+"_"+schdCnt).find("div").length);
			if( $("#td_"+STTG_DT+"_"+schdCnt).find("div").length == 0){
				returnSchdCnt = schdCnt;
				break;
			}
		}
	}
	return returnSchdCnt;
}
/**
 * 일정 높이 갯수 가져오기
 * @param STTG_DT
 * @returns
 */
function getSchdCnt(STTG_DT){
	var tmp = cnts_Null2Void($("#day_"+STTG_DT).html(), "0");
	clog("STTG_DT: "+STTG_DT+"tmp : "+ tmp);
	if(tmp.length >  1){
		if(tmp.substr(0, 1) == "+"){
			tmp = tmp.substr(1, tmp.length-1);
		}
	}
	return parseInt(tmp);
}
/**
 * 해당일의 연결된 일정 높이 세팅
 * @param startDate
 * @param value
 * @returns
 */
function setSchdCnt(STTG_DT_TMP, schdCnt){
	//clog("day_"+STTG_DT_TMP+ " = schdCnt = "+schdCnt);
	$("#day_"+STTG_DT_TMP).html("+"+schdCnt);
	setSchdViewCnt(STTG_DT_TMP, schdCnt);
}
/**
 * 실제로 표현되는 일정 갯수 7개일 때 ==> +1로 표현.
 * @param STTG_DT_TMP
 * @param schdCnt
 */
function setSchdViewCnt(STTG_DT_TMP, schdCnt){
	//clog("STTG_DT_TMP ="+ STTG_DT_TMP);
	//clog("getSchdCnt(STTG_DT_TMP) ="+ getSchdCnt(STTG_DT_TMP));
	//clog("G_ROW_CNT = "+ G_ROW_CNT);
	if( G_ROW_CNT < getSchdCnt(STTG_DT_TMP)){
		
		$("#day_"+STTG_DT_TMP+"_view").html("+"+( getSchdCnt(STTG_DT_TMP) - G_ROW_CNT));
		$("#day_"+STTG_DT_TMP+"_view").show();
	}else{
		$("#day_"+STTG_DT_TMP+"_view").hide();
	}
}


function fn_mouseEvent(e,th){
	if(e.type =="mouseover"){
		$(th).addClass("t_underline");
	}else{
		$(th).removeClass("t_underline");
	}
}

/**
 * 일정삭제 함수
 * @return
 */
function fn_delSchd(){
	var jexAjax = jex.createAjaxUtil("scrh_del_0001");
	jexAjax.set("PTL_ID"			, $("#frm_schd_layout").find("#PTL_ID").val()	);
	jexAjax.set("CHNL_ID"			, $("#frm_schd_layout").find("#CHNL_ID").val()	);
	jexAjax.set("USER_ID"			, $("#frm_schd_layout").find("#USER_ID").val()	);
	jexAjax.set("SCHD_SRNO"			, $("#frm_schd_layout").find("#SCHD_SRNO").val()			);
	jexAjax.set("ITRT_SCHD_DEL_DSNC", $("#frm_schd_layout").find("#ITRT_SCHD_DEL_DSNC").val());
	jexAjax.set("_LODING_BAR_YN_"	,"N");
	jexAjax.execute(function(dat) {	
		if(!jex.isError(dat)){
			alert("삭제되었습니다.");
			//fn_setOnLoad();
			
		}
	});
}

/**
 * 일정수정팝업 호출
 * @param json 단일 수정, 다건수정 팝업 호출 콜백값
 * @return
 */
function fn_modifySchd(json){
		$("#frm_schd_layout").find("#ITRT_SCHD_EDTR_DSNC").val(json.ITRT_SCHD_EDTR_DSNC);
		$("#frm_schd_layout").find("#RGSR_USER_ID").val(json.RGSR_USER_ID);
		close_popup();
		open_smartPop({href:"/schd_mngm/schd_0001_01.act", width:550, height:385, target:window, frm:$("#frm_schd_layout")});
}



/**
 * 더보기버튼 클릭시 일간달력으로 이동하는 함수
 * @param argsDate
 * @return
 */
function fn_goDailyView(argsDate){
	close_smartPop();
	$("#frm_schd_layout").find("#START_DATE").val(argsDate);
	$("#frm_schd_layout").attr("action", "/schd_mngm/schd_0003_01.act");
	$("#frm_schd_layout").submit();
}



/*
 * 시간 오전/오후단위로 변환
 * */
function fn_timeFormat(time){
	var hour = time.substring(0,2);
	var min = time.substring(2,4);
	var rtn = "";
	
	//오전
//	if(Number(hour) < 12){
		rtn += hour + ":" + min+" ";
	 
	//오후
//	}else{
//		rtn += "오후 ";
//		if((Number(hour) - 12) < 1){
//			rtn += "12:" + min;
//		}else{
//			rtn += (Number(hour)-12) + ":" + min;
//		}
//	}
	
	return rtn;
}

/**
 * 등록후 호출 등록이 완료되었다는 팝업 도출
 */
function fn_insShow(arg1){
	if(arg1 =="C"){
		$("#sc_result").text("일정이 등록 되었습니다.");
	}
	if(arg1 =="U"){
		$("#sc_result").text("일정이 수정 되었습니다.");
	}
	if(arg1 =="D"){
		$("#sc_result").text("일정이 삭제 되었습니다.");
	}
	if(arg1 =="A"){
		$("#sc_result").text("알림이 발송 되었습니다.");
	}
	$(".ly_notice_wrap02").show();
	$(document).click(function(e){
		if($(".ly_notice_wrap02").css("display") == "block"){
			$(".ly_notice_wrap02").hide();
		}
	});
}

function bottomSize() {
	var bottom = "4";
	if (navigator.userAgent.indexOf("MSIE") > 0){
		bottom = "5";
	}
	/*else if(navigator.userAgent.indexOf("Firefox") > 0) bottom = "4";   // FF
	else if(navigator.userAgent.indexOf("Opera") > 0) marginY = 30;     // Opera
	else if(navigator.userAgent.indexOf("Netscape") > 0) marginY = -2;  // Netscape
	*/
	else{	//크롬
		bottom = "4";
	}
	return bottom;
	
}