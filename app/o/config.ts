export type ChatBoxConfig = {
    css: string
    showBadge: boolean
    showPlatform: boolean
    showName: boolean
    showColon: boolean
    backgroundColor: string
    textColor: string
    fontFace: string
    fontSize: number
    messageHideDelay: number
    showRecentChat: boolean
    showChzzk: boolean
    showTwitch: boolean
}

const defaultCss = `
#log>div.deleted {
  visibility: hidden;
}
#log .emote_wrap {
  position: relative;
}
#log .emote_wrap img.emoticon {
  height: $font_sizepx;
  vertical-align: middle;
  margin: -5px 0;
}
.badge,
.colon,
.name {
  display: inline;
  vertical-align: top
}
#log .meta {
  padding-right: 4px;
  position: relative;
}
.badge {
  margin-right: 4px;
  height: 1em
}
.name {
  font-weight: 600;
  margin-left: .1em
}
.colon,
.name {
  height: 24px
}
body,
html {
  height: 100%;
  overflow: hidden
}
#log {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0 10px 10px;
  width: 100%;
  box-sizing: border-box;
  font-weight: 600;
  text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;
}
body {
  -webkit-mask-image: -webkit-gradient(linear,left 10%,left top,from(rgba(0,0,0,1)),to(rgba(0,0,0,0)));
  -webkit-mask-image: -webkit-gradient(linear,left 20%,left top,from(rgba(0,0,0,1)),to(rgba(0,0,0,0)));
}
#log>div {
  padding-bottom: .25em;
  word-wrap: break-word;
}
body {
  background: $background_color;
  color: $text_color;
  font-size: $font_sizepx;
}
#log {
  font: 0.8em '$font_face', serif;
}
#log>div {
  animation: fadeOut 1s ease $message_hide_delays forwards;
}
span.message > img {
  height: 1em;
}
span.message > img.emote {
  height: auto;
  vertical-align: text-top;
}
`.trim()

export const defaultConfig: ChatBoxConfig = {
    css: defaultCss,
    showBadge: true,
    showPlatform: true,
    showName: true,
    showColon: true,
    backgroundColor: "#00000000",
    textColor: "#FAFAFA",
    fontFace: "Nanum Gothic",
    fontSize: 24,
    messageHideDelay: 0,
    showRecentChat: false,
    showChzzk: true,
    showTwitch: true
}

export const fontFaces = [
    {name: "간이벽온방체", value: "Kanibuk"},
    {name: "감자꽃", value: "Gamja Flower"},
    {name: "개그체", value: "Gaegu"},
    {name: "개미똥구멍", value: "SangSangAnt"},
    {name: "거지이야기", value: "Poor Story"},
    {name: "검은고딕", value: "Black Han Sans"},
    {name: "경기천년바탕", value: "GyeonggiBatang"},
    {name: "경기천년제목", value: "GyeonggiTitleM"},
    {name: "고도마음체", value: "godoMaum"},
    {name: "고도체", value: "Godo"},
    {name: "고양덕양체", value: "GoyangDeogyang"},
    {name: "고양일산체", value: "GoyangIlsan"},
    {name: "고양체", value: "Goyang"},
    {name: "구기", value: "Gugi"},
    {name: "기랑해랑체", value: "Kirang Haerang"},
    {name: "김남윤체", value: "KimNamyun"},
    {name: "김제시체", value: "GIMJE-L"},
    {name: "꽃길", value: "SangSangFlowerRoad"},
    {name: "나눔고딕", value: "Nanum Gothic"},
    {name: "나눔고딕코딩", value: "Nanum Gothic Coding"},
    {name: "나눔명조", value: "Nanum Myeongjo"},
    {name: "나눔손글씨 붓체", value: "Nanum Brush Script"},
    {name: "나눔손글씨 펜체", value: "Nanum Pen Script"},
    {name: "나눔스퀘어라운드", value: "NanumSquareRoundEB"},
    {name: "납작블럭체", value: "NapjakBlock"},
    {name: "다래손글씨체", value: "drfont_daraehand"},
    {name: "다온수달고딕", value: "DAONOTTERGOTHICM"},
    {name: "다온청년고딕", value: "DAONYOUTHGOTHICM"},
    {name: "다음체", value: "Daum"},
    {name: "대한체", value: "Daehan"},
    {name: "도현체", value: "BMDOHYEON"},
    {name: "독도체", value: "Dokdo"},
    {name: "돋움", value: "Dotum"},
    {name: "동그라미체", value: "Dongrami"},
    {name: "동해독도체", value: "East Sea Dokdo"},
    {name: "디자인하우스체", value: "designhouseOTFLight00"},
    {name: "롯데마트 드림체", value: "LotteMartDream"},
    {name: "롯데마트 행복체", value: "LotteMartHappy"},
    {name: "맑은 고딕", value: "Malgun Gothic"},
    {name: "몬소리체", value: "TmonMonsori"},
    {name: "미래앤미소체", value: "Miraenmisoche"},
    {name: "미래앤예은체", value: "Miraenyeeunche"},
    {name: "미래앤지이체", value: "MiraenJilee"},
    {name: "미래앤해환체", value: "MiraenHaehwan"},
    {name: "미래엔대교체돋움", value: "MiraenDaekyoDotum"},
    {name: "미래엔대교체바탕", value: "MiraenDaekyoBatang"},
    {name: "미래엔은미체", value: "Miraeneunmiche"},
    {name: "미래엔지원체", value: "MiraenChoiJiwon"},
    {name: "미생체", value: "SDMiSaeng"},
    {name: "바른돋움체", value: "BareunDotum"},
    {name: "바른바탕체", value: "BareunBatang"},
    {name: "바탕", value: "Batang"},
    {name: "밝은체", value: "Bright"},
    {name: "법정체", value: "Beopjeong"},
    {name: "본고딕", value: "Noto Sans KR"},
    {name: "봄바람체", value: "GabiaBombaram"},
    {name: "부산바다체", value: "BusanBada"},
    {name: "부산체", value: "Busan"},
    {name: "빙그레볼드체", value: "Binggrae-Bold"},
    {name: "빙그레체", value: "Binggrae"},
    {name: "빛의계승자", value: "Heirof"},
    {name: "산돌국대떡볶이체", value: "SDKukdetopokki"},
    {name: "서울남산체", value: "SeoulNamsanM"},
    {name: "서울한강체", value: "SeoulHangangM"},
    {name: "성동고딕", value: "SungDongGothic"},
    {name: "성동명조", value: "SungDongMyungjo"},
    {name: "솔미체", value: "GabiaSolmee"},
    {name: "송명", value: "Song Myung"},
    {name: "스웨거체", value: "Swagger"},
    {name: "스타일리시", value: "Stylish"},
    {name: "신과장", value: "SangSangShin"},
    {name: "신비는일곱살", value: "SangSangShinb7"},
    {name: "아리따돋움", value: "Arita-dotum-Medium"},
    {name: "아리따부리", value: "Arita-buri-SemiBold"},
    {name: "안경잡이체", value: "FOUREYES"},
    {name: "야놀자야체", value: "YanolJaYache"},
    {name: "어그로체", value: "SB Aggro"},
    {name: "연성체", value: "BMYEONSUNG"},
    {name: "월인석보체", value: "Wolin"},
    {name: "윤고래체", value: "YunTaemin"},
    {name: "이롭게 바탕체", value: "Iropke Batang"},
    {name: "이순신돋움체", value: "YiSunShinDotum"},
    {name: "이순신체", value: "YiSunShin"},
    {name: "이숲체", value: "LeeHyunJi"},
    {name: "인테이크체", value: "Intake"},
    {name: "잉크립퀴드체", value: "InkLipquid"},
    {name: "전라북도체", value: "CHONBUKL"},
    {name: "제주 고딕", value: "Jeju Gothic"},
    {name: "제주 명조", value: "Jeju Myeongjo"},
    {name: "제주 한라산", value: "Jeju Hallasan"},
    {name: "조선일보명조체", value: "Chosunilbo_myungjo"},
    {name: "즐거운이야기체", value: "OTEnjoystoriesBA"},
    {name: "청소년체", value: "Youth"},
    {name: "커엽체", value: "Cute Font"},
    {name: "포천막걸리체", value: "Makgeolli"},
    {name: "포천오성과한음체", value: "OSeongandHanEum"},
    {name: "푸른전남체", value: "PureunJeonnam-Bold"},
    {name: "하이멜로디", value: "Hi Melody"},
    {name: "한겨레결체", value: "Hankc"},
    {name: "한글누리체", value: "HangeulNuri-Bold"},
    {name: "한나", value: "Hanna"},
    {name: "한돋움체", value: "KHNPHD"},
    {name: "한둥근돋움", value: "WONDotum"},
    {name: "한둥근바탕", value: "WONBatang"},
    {name: "한둥근제목", value: "WONTitle"},
    {name: "한마음고딕체", value: "KBIZHanmaumGothic"},
    {name: "한마음명조체", value: "KBIZHanmaumMyungjo"},
    {name: "한울림체", value: "KHNPHU"},
    {name: "해바라기", value: "Sunflower"},
    {name: "흑백사진", value: "Black And White Picture"},
    {name: "EBS훈민정음", value: "EBS_HoonminjungeumSB"},
    {name: "EBS훈민정음새론", value: "EBS_HoonminjungeumSaeronSB"},
    {name: "HS가을생각체", value: "HSGaeulsenggak"},
    {name: "HS겨울눈꽃체", value: "HSGyoulnoonkot"},
    {name: "HS두꺼비체", value: "HSDookubi"},
    {name: "HS봄바람체", value: "HSBombaram"},
    {name: "HS여름물빛체", value: "HSSummer"},
    {name: "KCC김훈체", value: "KCC-Kimhoon"},
    {name: "KCC은영체", value: "KCC-eunyoung"},
    {name: "KoPub 바탕", value: "KoPub Batang"}
]

export function buildCss(config: ChatBoxConfig) {
    return config.css
        .replaceAll("$background_color", config.backgroundColor)
        .replaceAll("$text_color", config.textColor)
        .replaceAll("$font_face", config.fontFace)
        .replaceAll("$font_size", config.fontSize.toString())
        .replaceAll("$message_hide_delay", (config.messageHideDelay == 0 ? 1000000 : config.messageHideDelay).toString())
}