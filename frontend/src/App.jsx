import { useState, useEffect, useRef } from "react";
import { authService } from "./services/auth.service";
import { workoutService, nutritionService, progressService, aiService, userService } from "./services/services";

// ─── FONTS & GLOBAL CSS ───────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #07070E; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #1e1e30; border-radius: 4px; }
    input, button, select, textarea { font-family: inherit; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:.5; } }
    @keyframes radialIn { from { opacity:0; transform:scale(.6) rotate(-20deg); } to { opacity:1; transform:scale(1) rotate(0deg); } }
    @keyframes floatBg { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(30px,-20px) scale(1.05); } 66% { transform:translate(-20px,10px) scale(.97); } }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes liquidWave { 0%,100% { transform:translateX(0); } 50% { transform:translateX(-25%); } }
    .fade-up { animation:fadeUp .5s ease both; }
    .fade-in { animation:fadeIn .4s ease both; }
    .btn-press:active { transform:scale(.97); }
    input:focus { outline:none; }
  `}</style>
);

const C = {
  bg:"#07070E", bg2:"#0D0D1A", card:"#10101F", border:"#1C1C30", borderHi:"#2a2a44",
  lime:"#C8FF00", limeDim:"#C8FF0018", limeGlow:"0 0 24px #C8FF0035",
  orange:"#FF6B00", blue:"#3B82F6", pink:"#FF3CAC",
  text:"#F2F2FF", sub:"#8888A8", muted:"#4A4A68",
};

// ─── I18N ─────────────────────────────────────────────────────────────────────
const T = {
  en: { langTitle:"Choose Your Language", login:"Sign In", signup:"Create Account", google:"Continue with Google", email:"Email address", password:"Password", forgot:"Forgot password?", noAcc:"Don't have an account?", haveAcc:"Already have an account?", name:"Full name", confirm:"Confirm password", forgotTitle:"Reset Password", forgotSub:"We'll send a link to your email", send:"Send Reset Link", back:"Back to Sign In", country:"Where are you from?", countrySub:"Your origin shapes your diet plan", metrics:"Your Body Metrics", metricsSub:"Used to calculate your personalized plan", height:"Height", weight:"Weight", age:"Age", goal:"What's your goal?", goalSub:"We build everything around this", gainM:"Build Muscle", gainMd:"Increase strength & muscle mass", maintain:"Stay Fit", maintainD:"Maintain current physique", loseW:"Lose Weight", loseDsc:"Burn fat, get lean", next:"Continue", finish:"Start My Journey", dashboard:"Dashboard", workouts:"Workouts", nutrition:"Nutrition", progress:"Progress", library:"Exercise Library", diet:"Diet Plan", ai:"AI Coach", greeting:"Good morning", todayGoal:"Today's Goal", calories:"Calories", protein:"Protein", carbs:"Carbs", fat:"Fat", water:"Water", steps:"Steps", streak:"Day Streak", recentWorkout:"Recent Workout", viewAll:"View all", weeklyProgress:"Weekly Progress", bodyWeight:"Body Weight", addWorkout:"Log Workout", addMeal:"Add Meal", aiCoach:"Ask AI", scan:"Scan Food", timer:"Timer", profile:"Profile", settings:"Settings", logout:"Sign Out", search:"Search exercises...", filterAll:"All", chest:"Chest", back2:"Back", legs:"Legs", shoulders:"Shoulders", arms:"Arms", core:"Core", sets:"Sets", reps:"Reps", dietTitle:"Your Diet Plan", dietSub:"Curated for your country & goal", breakfast:"Breakfast", lunch:"Lunch", dinner:"Dinner", snacks:"Snacks", chatPlaceholder:"Ask your AI fitness coach...", send2:"Send", aiGreet:"Hi! I'm your personal FitoGlobe coach. Ask me anything about workouts, nutrition, or your progress.", loading:"Loading...", error:"Something went wrong", logWorkout:"Log Workout", logMeal:"Log Meal", logWeight:"Log Weight", kg:"kg", },
  es: { langTitle:"Elige tu Idioma", login:"Iniciar Sesión", signup:"Crear Cuenta", google:"Continuar con Google", email:"Correo electrónico", password:"Contraseña", forgot:"¿Olvidaste tu contraseña?", noAcc:"¿No tienes cuenta?", haveAcc:"¿Ya tienes cuenta?", name:"Nombre completo", confirm:"Confirmar contraseña", forgotTitle:"Restablecer Contraseña", forgotSub:"Te enviaremos un enlace", send:"Enviar Enlace", back:"Volver", country:"¿De dónde eres?", countrySub:"Tu origen da forma a tu plan dietético", metrics:"Tus Medidas", metricsSub:"Para calcular tu plan personalizado", height:"Altura", weight:"Peso", age:"Edad", goal:"¿Cuál es tu objetivo?", goalSub:"Construimos todo en torno a esto", gainM:"Ganar Músculo", gainMd:"Aumenta fuerza y masa muscular", maintain:"Mantenerse", maintainD:"Mantén tu físico actual", loseW:"Perder Peso", loseDsc:"Quema grasa", next:"Continuar", finish:"Comenzar", dashboard:"Inicio", workouts:"Entrenamientos", nutrition:"Nutrición", progress:"Progreso", library:"Biblioteca", diet:"Dieta", ai:"IA Coach", greeting:"Buenos días", todayGoal:"Meta de Hoy", calories:"Calorías", protein:"Proteína", carbs:"Carbos", fat:"Grasa", water:"Agua", steps:"Pasos", streak:"Días", recentWorkout:"Reciente", viewAll:"Ver todo", weeklyProgress:"Progreso", bodyWeight:"Peso", addWorkout:"Registrar", addMeal:"Añadir", aiCoach:"IA", scan:"Escanear", timer:"Temporizador", profile:"Perfil", settings:"Ajustes", logout:"Salir", search:"Buscar...", filterAll:"Todos", chest:"Pecho", back2:"Espalda", legs:"Piernas", shoulders:"Hombros", arms:"Brazos", core:"Core", sets:"Series", reps:"Reps", dietTitle:"Plan Dietético", dietSub:"Adaptado a tu país", breakfast:"Desayuno", lunch:"Almuerzo", dinner:"Cena", snacks:"Snacks", chatPlaceholder:"Pregunta a tu coach...", send2:"Enviar", aiGreet:"¡Hola! Soy tu coach de FitoGlobe.", loading:"Cargando...", error:"Algo salió mal", logWorkout:"Registrar", logMeal:"Añadir Comida", logWeight:"Registrar Peso", kg:"kg", },
  ja: { langTitle:"言語を選択", login:"サインイン", signup:"アカウント作成", google:"Googleで続ける", email:"メールアドレス", password:"パスワード", forgot:"パスワードを忘れた？", noAcc:"アカウントをお持ちでない方", haveAcc:"すでにアカウントをお持ちですか？", name:"氏名", confirm:"パスワード確認", forgotTitle:"パスワードリセット", forgotSub:"メールにリンクを送信します", send:"リンクを送る", back:"戻る", country:"出身国は？", countrySub:"出身地がダイエットプランを決めます", metrics:"体の測定値", metricsSub:"パーソナライズドプランの計算に使用", height:"身長", weight:"体重", age:"年齢", goal:"目標は？", goalSub:"これをもとに構築します", gainM:"筋肉をつける", gainMd:"筋力と筋肉量を増やす", maintain:"維持する", maintainD:"現在の体型を維持する", loseW:"体重を減らす", loseDsc:"脂肪を燃やす", next:"続ける", finish:"旅を始める", dashboard:"ホーム", workouts:"トレーニング", nutrition:"栄養", progress:"進捗", library:"エクサ一覧", diet:"食事プラン", ai:"AIコーチ", greeting:"おはようございます", todayGoal:"今日の目標", calories:"カロリー", protein:"タンパク質", carbs:"炭水化物", fat:"脂質", water:"水分", steps:"歩数", streak:"連続日数", recentWorkout:"最近のトレーニング", viewAll:"すべて見る", weeklyProgress:"週間進捗", bodyWeight:"体重", addWorkout:"記録", addMeal:"食事追加", aiCoach:"AI質問", scan:"スキャン", timer:"タイマー", profile:"プロフィール", settings:"設定", logout:"サインアウト", search:"エクサ検索...", filterAll:"すべて", chest:"胸", back2:"背中", legs:"脚", shoulders:"肩", arms:"腕", core:"体幹", sets:"セット", reps:"回", dietTitle:"食事プラン", dietSub:"あなたの国と目標に合わせたプラン", breakfast:"朝食", lunch:"昼食", dinner:"夕食", snacks:"間食", chatPlaceholder:"AIコーチに質問...", send2:"送信", aiGreet:"こんにちは！FitoGlobeのコーチです。", loading:"読み込み中...", error:"エラーが発生しました", logWorkout:"記録", logMeal:"食事追加", logWeight:"体重記録", kg:"kg", },
  ko: { langTitle:"언어 선택", login:"로그인", signup:"계정 만들기", google:"Google로 계속하기", email:"이메일 주소", password:"비밀번호", forgot:"비밀번호를 잊으셨나요?", noAcc:"계정이 없으신가요?", haveAcc:"이미 계정이 있으신가요?", name:"전체 이름", confirm:"비밀번호 확인", forgotTitle:"비밀번호 재설정", forgotSub:"이메일로 링크를 보내드립니다", send:"링크 보내기", back:"돌아가기", country:"어디 출신인가요?", countrySub:"출신 국가가 식단 계획을 결정합니다", metrics:"신체 정보", metricsSub:"개인 맞춤 계획 계산에 사용", height:"키", weight:"체중", age:"나이", goal:"목표가 무엇인가요?", goalSub:"이를 바탕으로 구성합니다", gainM:"근육 키우기", gainMd:"근력과 근육량 증가", maintain:"유지하기", maintainD:"현재 체형 유지", loseW:"체중 감량", loseDsc:"지방을 태우기", next:"계속", finish:"여정 시작하기", dashboard:"홈", workouts:"운동", nutrition:"영양", progress:"진행상황", library:"운동 목록", diet:"식단 계획", ai:"AI 코치", greeting:"좋은 아침이에요", todayGoal:"오늘의 목표", calories:"칼로리", protein:"단백질", carbs:"탄수화물", fat:"지방", water:"수분", steps:"걸음수", streak:"연속 일수", recentWorkout:"최근 운동", viewAll:"모두 보기", weeklyProgress:"주간 진행상황", bodyWeight:"체중", addWorkout:"운동 기록", addMeal:"식사 추가", aiCoach:"AI 질문", scan:"음식 스캔", timer:"타이머", profile:"프로필", settings:"설정", logout:"로그아웃", search:"운동 검색...", filterAll:"전체", chest:"가슴", back2:"등", legs:"다리", shoulders:"어깨", arms:"팔", core:"코어", sets:"세트", reps:"회", dietTitle:"식단 계획", dietSub:"국가와 목표에 맞춘 계획", breakfast:"아침", lunch:"점심", dinner:"저녁", snacks:"간식", chatPlaceholder:"AI 코치에게 질문하세요...", send2:"전송", aiGreet:"안녕하세요! FitoGlobe 코치입니다.", loading:"로딩 중...", error:"오류가 발생했습니다", logWorkout:"운동 기록", logMeal:"식사 추가", logWeight:"체중 기록", kg:"kg", },
};

const COUNTRIES = [
  {code:"JP",name:"Japan",flag:"🇯🇵",diet:"japanese"},{code:"KR",name:"South Korea",flag:"🇰🇷",diet:"korean"},
  {code:"IN",name:"India",flag:"🇮🇳",diet:"indian"},{code:"MX",name:"Mexico",flag:"🇲🇽",diet:"mexican"},
  {code:"IT",name:"Italy",flag:"🇮🇹",diet:"mediterranean"},{code:"US",name:"United States",flag:"🇺🇸",diet:"western"},
  {code:"BR",name:"Brazil",flag:"🇧🇷",diet:"brazilian"},{code:"TR",name:"Turkey",flag:"🇹🇷",diet:"mediterranean"},
  {code:"CN",name:"China",flag:"🇨🇳",diet:"chinese"},{code:"TH",name:"Thailand",flag:"🇹🇭",diet:"thai"},
  {code:"GR",name:"Greece",flag:"🇬🇷",diet:"mediterranean"},{code:"NG",name:"Nigeria",flag:"🇳🇬",diet:"african"},
  {code:"EG",name:"Egypt",flag:"🇪🇬",diet:"middleeast"},{code:"AR",name:"Argentina",flag:"🇦🇷",diet:"southamerican"},
  {code:"GB",name:"United Kingdom",flag:"🇬🇧",diet:"western"},{code:"DE",name:"Germany",flag:"🇩🇪",diet:"european"},
  {code:"FR",name:"France",flag:"🇫🇷",diet:"mediterranean"},{code:"ES",name:"Spain",flag:"🇪🇸",diet:"mediterranean"},
  {code:"SA",name:"Saudi Arabia",flag:"🇸🇦",diet:"middleeast"},{code:"PH",name:"Philippines",flag:"🇵🇭",diet:"filipino"},
];

const DIET_PLANS = {
  japanese:{breakfast:["Miso soup","Steamed rice","Grilled salmon","Pickled vegetables"],lunch:["Soba noodles","Edamame","Green tea"],dinner:["Chicken teriyaki","Brown rice","Seaweed salad"],snacks:["Onigiri","Green tea","Fruit"]},
  korean:{breakfast:["Congee","Kimchi","Boiled egg"],lunch:["Bibimbap","Doenjang jjigae"],dinner:["Grilled bulgogi","Steamed rice","Banchan"],snacks:["Roasted seaweed","Sweet potato"]},
  indian:{breakfast:["Oats upma","Boiled eggs","Chai"],lunch:["Dal with brown rice","Vegetable sabzi","Curd"],dinner:["Grilled chicken tikka","Roti","Palak paneer"],snacks:["Almonds","Sprout chaat","Buttermilk"]},
  mediterranean:{breakfast:["Greek yogurt","Whole grain toast","Olive oil"],lunch:["Grilled fish","Tabbouleh","Hummus"],dinner:["Chicken souvlaki","Roasted vegetables","Quinoa"],snacks:["Mixed nuts","Fresh fruit","Olives"]},
  western:{breakfast:["Egg white omelette","Whole grain toast","Avocado"],lunch:["Grilled chicken salad","Sweet potato"],dinner:["Lean beef steak","Roasted broccoli","Brown rice"],snacks:["Protein bar","Greek yogurt"]},
  mexican:{breakfast:["Huevos rancheros","Black beans","Corn tortilla"],lunch:["Chicken taco bowl","Guacamole"],dinner:["Grilled fish tacos","Brown rice","Pinto beans"],snacks:["Fresh mango","Jicama sticks"]},
  chinese:{breakfast:["Congee with ginger","Steamed bun","Green tea"],lunch:["Steamed fish","Bok choy","Jasmine rice"],dinner:["Kung pao chicken","Stir-fried vegetables","Brown rice"],snacks:["Walnuts","Green tea"]},
  thai:{breakfast:["Rice porridge","Thai iced tea","Boiled egg"],lunch:["Som tum salad","Grilled chicken","Rice"],dinner:["Tom yum soup","Steamed fish","Mixed vegetables"],snacks:["Fresh tropical fruit","Coconut water"]},
  brazilian:{breakfast:["Açaí bowl","Whole grain bread","Papaya"],lunch:["Grilled chicken","Black beans","Rice"],dinner:["Grilled fish","Vegetables","Quinoa"],snacks:["Cashew nuts","Coconut water"]},
  african:{breakfast:["Akara bean cakes","Boiled eggs"],lunch:["Jollof rice with chicken","Moi moi"],dinner:["Egusi soup","Yam","Grilled fish"],snacks:["Groundnuts","Fresh fruit"]},
  middleeast:{breakfast:["Ful medames","Pita bread","Labneh"],lunch:["Grilled kofta","Tabouleh","Hummus"],dinner:["Chicken shawarma","Fattoush salad","Lentil soup"],snacks:["Dates","Mixed nuts"]},
  southamerican:{breakfast:["Empanada","Mate tea","Fruit"],lunch:["Grilled beef","Chimichurri","Quinoa"],dinner:["Fish with lemon","Roasted vegetables","Brown rice"],snacks:["Fruit salad"]},
  european:{breakfast:["Müsli with berries","Rye bread","Cottage cheese"],lunch:["Schnitzel","Sauerkraut","Potato salad"],dinner:["Grilled salmon","Roasted vegetables","Whole grain bread"],snacks:["Quark with fruit","Nuts"]},
  filipino:{breakfast:["Sinangag","Grilled tilapia","Green mango"],lunch:["Sinigang na hipon","Brown rice","Pinakbet"],dinner:["Chicken inasal","Ensaladang talong","Rice"],snacks:["Banana","Buko juice"]},
};

// ─── SHARED UI ────────────────────────────────────────────
const Btn = ({ children, onClick, variant="primary", style={}, disabled, loading }) => {
  const base = { width:"100%", padding:"14px 20px", borderRadius:12, border:"none", fontFamily:"DM Sans, sans-serif", fontWeight:700, fontSize:15, cursor:disabled||loading?"not-allowed":"pointer", transition:"all .2s", opacity:disabled||loading?.5:1 };
  const styles = { primary:{background:C.lime,color:"#000"}, outline:{background:"transparent",color:C.text,border:`1px solid ${C.borderHi}`}, ghost:{background:C.limeDim,color:C.lime}, danger:{background:"#FF3B3020",color:"#FF5050",border:"1px solid #FF3B3040"} };
  return <button onClick={onClick} disabled={disabled||loading} className="btn-press" style={{...base,...styles[variant],...style}}>{loading?"Loading...":children}</button>;
};

const Input = ({ label, type="text", value, onChange, placeholder, icon, error }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:"block", marginBottom:6, fontSize:12, fontWeight:600, color:C.sub, letterSpacing:".08em", textTransform:"uppercase" }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {icon && <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.muted, fontSize:16 }}>{icon}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", padding:icon?"13px 14px 13px 44px":"13px 14px", background:C.bg2, border:`1px solid ${error?C.orange:C.border}`, borderRadius:10, color:C.text, fontSize:15, fontFamily:"DM Sans, sans-serif", transition:"border-color .2s" }}
        onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=error?C.orange:C.border}/>
    </div>
    {error && <p style={{ color:C.orange, fontSize:12, marginTop:4 }}>{error}</p>}
  </div>
);

const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, ...style, cursor:onClick?"pointer":"default", transition:"border-color .2s" }}
    onMouseEnter={e=>onClick&&(e.currentTarget.style.borderColor=C.borderHi)}
    onMouseLeave={e=>onClick&&(e.currentTarget.style.borderColor=C.border)}
  >{children}</div>
);

const MacroRing = ({ value, max, color, label, size=64 }) => {
  const pct = Math.min(value/max,1), r=(size-8)/2, circ=2*Math.PI*r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={4}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} style={{ transition:"stroke-dashoffset .8s ease" }}/>
      </svg>
      <div style={{ textAlign:"center", marginTop:-size*.85, lineHeight:1 }}>
        <div style={{ fontSize:13, fontWeight:800, color:C.text }}>{value}</div>
      </div>
      <div style={{ fontSize:10, color:C.sub, fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", marginTop:size*.85-18 }}>{label}</div>
    </div>
  );
};

const Spinner = () => (
  <div style={{ display:"flex", justifyContent:"center", padding:40 }}>
    <div style={{ width:32, height:32, border:`3px solid ${C.border}`, borderTopColor:C.lime, borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
  </div>
);

const Toast = ({ msg, type="success" }) => (
  msg ? <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:type==="error"?C.orange:C.lime, color:"#000", padding:"10px 20px", borderRadius:10, fontWeight:700, fontSize:13, zIndex:999, animation:"fadeUp .3s ease" }}>{msg}</div> : null
);

// ─── LANGUAGE SCREEN ──────────────────────────────────────
const LanguageScreen = ({ onSelect }) => {
  const langs = [{code:"en",name:"English",native:"English",flag:"EN"},{code:"es",name:"Spanish",native:"Español",flag:"ES"},{code:"ja",name:"Japanese",native:"日本語",flag:"JP"},{code:"ko",name:"Korean",native:"한국어",flag:"KR"}];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-100, left:-100, width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle, ${C.lime}12, transparent 70%)`, animation:"floatBg 8s ease-in-out infinite" }}/>
      <div className="fade-up" style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:16 }}>
         <img src="/logo.png" alt="FitoGlobe" style={{ width:56, height:56, borderRadius:14 }}/>
         <span style={{ fontFamily:"Bebas Neue", fontSize:36, letterSpacing:2, color:C.text }}>FITO<span style={{ color:C.lime }}>GLOBE</span></span>
        </div>
        <h2 style={{ fontFamily:"Bebas Neue", fontSize:32, letterSpacing:1, color:C.text, marginBottom:8 }}>Choose Your Language</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, width:"100%", maxWidth:360 }}>
        {langs.map((l,i) => (
          <div key={l.code} className="fade-up" onClick={() => onSelect(l.code)}
            style={{ animationDelay:`${i*.08}s`, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px 20px", textAlign:"center", cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.lime;e.currentTarget.style.boxShadow=C.limeGlow;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
            <div style={{ fontFamily:"DM Mono", fontSize:11, color:C.muted, letterSpacing:".15em", marginBottom:8 }}>{l.flag}</div>
            <div style={{ fontFamily:"Bebas Neue", fontSize:22, letterSpacing:1, color:C.text }}>{l.name}</div>
            <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{l.native}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── AUTH SCREEN ──────────────────────────────────────────
const AuthScreen = ({ t, lang, onAuth }) => {
  const [mode,setMode]=useState("login");
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [confirm,setConfirm]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [success,setSuccess]=useState("");

  const handle = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        await authService.login(email, pass);
        onAuth();
      } else if (mode === "signup") {
        if (pass !== confirm) { setError("Passwords don't match"); setLoading(false); return; }
        await authService.signup(name, email, pass, lang);
        onAuth();
      } else {
        await authService.forgotPassword(email);
        setSuccess("Reset link sent! Check your email.");
      }
    } catch(err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
    setLoading(false);
  };

  const Divider = () => <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}><div style={{ flex:1, height:1, background:C.border }}/><span style={{ color:C.muted, fontSize:12, fontWeight:600 }}>OR</span><div style={{ flex:1, height:1, background:C.border }}/></div>;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:4 }}>
            <img src="/logo.png" alt="FitoGlobe" style={{ width:40, height:40, borderRadius:10 }}/>
            <span style={{ fontFamily:"Bebas Neue", fontSize:32, letterSpacing:2, color:C.text }}>FITO<span style={{color:C.lime}}>GLOBE</span></span>
          </div>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:4 }}>{mode==="forgot"?t.forgotTitle:mode==="login"?t.login:t.signup}</h2>
        </div>
        <Card>
          {error && <div style={{ background:"#FF3B3015", border:"1px solid #FF3B3040", borderRadius:8, padding:"10px 14px", marginBottom:16, color:"#FF5050", fontSize:13 }}>{error}</div>}
          {success && <div style={{ background:C.limeDim, border:`1px solid ${C.lime}40`, borderRadius:8, padding:"10px 14px", marginBottom:16, color:C.lime, fontSize:13 }}>{success}</div>}
          {mode !== "forgot" && (
            <>
              <button onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`; }} style={{ width:"100%", padding:"13px 20px", background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:12, color:C.text, fontFamily:"DM Sans", fontWeight:600, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:0 }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.lime} onMouseLeave={e=>e.currentTarget.style.borderColor=C.borderHi}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
                {t.google}
              </button>
              <Divider/>
            </>
          )}
          {mode==="signup" && <Input label={t.name} value={name} onChange={setName} placeholder="John Doe" icon="◈"/>}
          <Input label={t.email} type="email" value={email} onChange={setEmail} placeholder="you@email.com" icon="@"/>
          {mode!=="forgot" && <Input label={t.password} type="password" value={pass} onChange={setPass} placeholder="••••••••" icon="◉"/>}
          {mode==="signup" && <Input label={t.confirm} type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" icon="◉"/>}
          {mode==="login" && <div style={{ textAlign:"right", marginBottom:16, marginTop:-8 }}><span onClick={()=>setMode("forgot")} style={{ color:C.lime, fontSize:13, fontWeight:600, cursor:"pointer" }}>{t.forgot}</span></div>}
          <Btn onClick={handle} loading={loading}>{mode==="forgot"?t.send:mode==="login"?t.login:t.signup}</Btn>
          {mode==="forgot"
            ? <p style={{ textAlign:"center", marginTop:16, color:C.sub, fontSize:13 }}><span style={{ color:C.lime, cursor:"pointer" }} onClick={()=>setMode("login")}>{t.back}</span></p>
            : <p style={{ textAlign:"center", marginTop:16, color:C.sub, fontSize:13 }}>{mode==="login"?t.noAcc:t.haveAcc}{" "}<span style={{ color:C.lime, cursor:"pointer", fontWeight:600 }} onClick={()=>setMode(mode==="login"?"signup":"login")}>{mode==="login"?t.signup:t.login}</span></p>
          }
        </Card>
      </div>
    </div>
  );
};

// ─── ONBOARDING SCREEN ────────────────────────────────────
const OnboardingScreen = ({ t, lang, onDone }) => {
  const [step,setStep]=useState(0);
  const [country,setCountry]=useState(null); const [search,setSearch]=useState("");
  const [height,setHeight]=useState("175"); const [weight,setWeight]=useState("70"); const [age,setAge]=useState("25");
  const [unit,setUnit]=useState("metric"); const [goal,setGoal]=useState(null);
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  const filtered = COUNTRIES.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  const goals = [{id:"gain",icon:"▲",label:t.gainM,desc:t.gainMd,color:C.orange},{id:"maintain",icon:"◆",label:t.maintain,desc:t.maintainD,color:C.blue},{id:"lose",icon:"▼",label:t.loseW,desc:t.loseDsc,color:C.pink}];

  const finish = async () => {
    setLoading(true); setError("");
    try {
      await authService.completeOnboarding({ country:country.code, countryName:country.name, countryDiet:country.diet, height:parseFloat(height), weight:parseFloat(weight), age:parseInt(age), unit, goal, language:lang });
      onDone({ country, height, weight, age, unit, goal });
    } catch(err) { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  const steps = [
    <div key="country" className="fade-in">
      <h2 style={{ fontFamily:"Bebas Neue", fontSize:30, letterSpacing:1, color:C.text, marginBottom:4 }}>{t.country}</h2>
      <p style={{ color:C.sub, fontSize:14, marginBottom:20 }}>{t.countrySub}</p>
      <Input value={search} onChange={setSearch} placeholder="Search country..." icon="◈"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:340, overflowY:"auto" }}>
        {filtered.map(c=>(
          <div key={c.code} onClick={()=>setCountry(c)} style={{ padding:"14px 16px", borderRadius:12, border:`1.5px solid ${country?.code===c.code?C.lime:C.border}`, background:country?.code===c.code?C.limeDim:C.card, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all .18s" }}>
            <span style={{ fontSize:20 }}>{c.flag}</span>
            <span style={{ fontSize:13, fontWeight:600, color:country?.code===c.code?C.lime:C.text }}>{c.name}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop:20 }}><Btn onClick={()=>country&&setStep(1)} disabled={!country}>{t.next}</Btn></div>
    </div>,
    <div key="metrics" className="fade-in">
      <h2 style={{ fontFamily:"Bebas Neue", fontSize:30, letterSpacing:1, color:C.text, marginBottom:4 }}>{t.metrics}</h2>
      <p style={{ color:C.sub, fontSize:14, marginBottom:20 }}>{t.metricsSub}</p>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["metric","imperial"].map(u=>(
          <div key={u} onClick={()=>setUnit(u)} style={{ flex:1, padding:"10px", borderRadius:10, border:`1.5px solid ${unit===u?C.lime:C.border}`, background:unit===u?C.limeDim:C.card, textAlign:"center", cursor:"pointer", fontSize:13, fontWeight:700, color:unit===u?C.lime:C.sub }}>{u==="metric"?"Metric (cm/kg)":"Imperial (ft/lb)"}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[{label:t.height,val:height,set:setHeight,unit:unit==="metric"?"cm":"ft"},{label:t.weight,val:weight,set:setWeight,unit:unit==="metric"?"kg":"lb"}].map(f=>(
          <div key={f.label}>
            <label style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:".1em", textTransform:"uppercase", display:"block", marginBottom:6 }}>{f.label} ({f.unit})</label>
            <input type="number" value={f.val} onChange={e=>f.set(e.target.value)} style={{ width:"100%", padding:"13px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:18, fontWeight:700, fontFamily:"DM Mono", textAlign:"center" }} onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12 }}>
        <label style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:".1em", textTransform:"uppercase", display:"block", marginBottom:6 }}>{t.age}</label>
        <input type="number" value={age} onChange={e=>setAge(e.target.value)} style={{ width:"100%", padding:"13px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:18, fontWeight:700, fontFamily:"DM Mono", textAlign:"center" }} onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:20 }}>
        <Btn variant="outline" onClick={()=>setStep(0)}>{t.back2}</Btn>
        <Btn onClick={()=>setStep(2)}>{t.next}</Btn>
      </div>
    </div>,
    <div key="goal" className="fade-in">
      <h2 style={{ fontFamily:"Bebas Neue", fontSize:30, letterSpacing:1, color:C.text, marginBottom:4 }}>{t.goal}</h2>
      <p style={{ color:C.sub, fontSize:14, marginBottom:20 }}>{t.goalSub}</p>
      {error && <div style={{ color:C.orange, fontSize:13, marginBottom:12 }}>{error}</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {goals.map(g=>(
          <div key={g.id} onClick={()=>setGoal(g.id)} style={{ padding:"20px 22px", borderRadius:14, border:`2px solid ${goal===g.id?g.color:C.border}`, background:goal===g.id?g.color+"15":C.card, cursor:"pointer", display:"flex", alignItems:"center", gap:16, transition:"all .2s" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:g.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:g.color, flexShrink:0 }}>{g.icon}</div>
            <div><div style={{ fontWeight:800, fontSize:16 }}>{g.label}</div><div style={{ color:C.sub, fontSize:13 }}>{g.desc}</div></div>
            {goal===g.id && <div style={{ marginLeft:"auto", width:20, height:20, borderRadius:"50%", background:g.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#000", fontWeight:900 }}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:20 }}>
        <Btn variant="outline" onClick={()=>setStep(1)}>{t.back2}</Btn>
        <Btn onClick={()=>goal&&finish()} disabled={!goal} loading={loading}>{t.finish}</Btn>
      </div>
    </div>
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <div style={{ display:"flex", gap:6, marginBottom:32 }}>
          {[0,1,2].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:4, background:i<=step?C.lime:C.border, transition:"background .3s" }}/>)}
        </div>
        {steps[step]}
      </div>
    </div>
  );
};

// ─── RADIAL MENU ─────────────────────────────────────────
const RadialMenu = ({ open, onClose, t, setPage, onProfile }) => {
  const items = [
    {icon:"💬", label:"Fito Chat",  page:"chat",       color:C.blue  },
    {icon:"📷", label:"Scan Food",  page:"scan",       color:C.pink  },
    {icon:"👤", label:"Profile",    page:"profile",    color:C.sub   },
  ];
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#07070ECC", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} className="fade-up"
        style={{ width:"100%", maxWidth:430, background:C.card, borderRadius:"20px 20px 0 0", border:`1px solid ${C.border}`, padding:"20px 16px 40px" }}>
        
        {/* Handle bar */}
        <div style={{ width:40, height:4, borderRadius:2, background:C.border, margin:"0 auto 20px" }}/>
        
        {/* Title */}
        <div style={{ fontFamily:"Bebas Neue", fontSize:18, letterSpacing:1, color:C.sub, marginBottom:16, textAlign:"center" }}>QUICK ACTIONS</div>

        {/* Items grid — 3 per row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {items.map((item, i) => (
            <div key={i} onClick={() => { if(item.page==="profile") { onProfile(); onClose(); } else { setPage(item.page); onClose(); } }} className="fade-up"
              style={{ animationDelay:`${i*.05}s`, background:C.bg2, border:`1.5px solid ${item.color}30`, borderRadius:14, padding:"14px 8px", textAlign:"center", cursor:"pointer", transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background=item.color+"15";e.currentTarget.style.borderColor=item.color;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.bg2;e.currentTarget.style.borderColor=item.color+"30";}}>
              <div style={{ fontSize:22, marginBottom:6 }}>{item.icon}</div>
              <div style={{ fontSize:10, color:C.sub, fontWeight:700, lineHeight:1.3 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Close */}
        <div onClick={onClose} style={{ marginTop:16, textAlign:"center", color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", padding:"8px" }}>✕ Close</div>
      </div>
    </div>
  );
};

// ─── BOTTOM NAV ───────────────────────────────────────────
const BottomNav = ({ page, setPage, t, onPlus }) => {
  const items = [{id:"dashboard",icon:"⬡",label:t.dashboard},{id:"workouts",icon:"◈",label:t.workouts},{id:"nutrition",icon:"◉",label:t.nutrition},{id:"progress",icon:"▣",label:t.progress}];
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:C.bg2, borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"8px 0 12px", zIndex:50, maxWidth:430, margin:"0 auto" }}>
      {items.slice(0,2).map(it=>(
        <div key={it.id} onClick={()=>setPage(it.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer" }}>
          <span style={{ fontSize:18, color:page===it.id?C.lime:C.muted }}>{it.icon}</span>
          <span style={{ fontSize:9, fontWeight:700, color:page===it.id?C.lime:C.muted, textTransform:"uppercase" }}>{it.label}</span>
        </div>
      ))}
      <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
        <div onClick={onPlus} style={{ width:52, height:52, borderRadius:"50%", background:C.lime, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, color:"#000", cursor:"pointer", boxShadow:`0 4px 20px ${C.lime}50`, marginTop:-20, transition:"transform .2s" }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>+</div>
      </div>
      {items.slice(2).map(it=>(
        <div key={it.id} onClick={()=>setPage(it.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer" }}>
          <span style={{ fontSize:18, color:page===it.id?C.lime:C.muted }}>{it.icon}</span>
          <span style={{ fontSize:9, fontWeight:700, color:page===it.id?C.lime:C.muted, textTransform:"uppercase" }}>{it.label}</span>
        </div>
      ))}
    </nav>
  );
};

// ─── DASHBOARD PAGE (real stats) ─────────────────────────
const trackLoginStreak = () => {
  const today = new Date().toISOString().split("T")[0];
  const stored = JSON.parse(localStorage.getItem("fitoglobe_streak") || "{}");
  if (stored.lastDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  const newStreak = stored.lastDate === yStr ? (stored.streak||0) + 1 : 1;
  const loginDays = [...(stored.loginDays||[]), today].slice(-7);
  localStorage.setItem("fitoglobe_streak", JSON.stringify({
    lastDate: today, streak: newStreak, loginDays,
  }));
};

//LiquidStreakCard
const LiquidStreakCard = ({ streak, maxStreak = 30, label }) => {
  const fillPct = Math.min(streak / maxStreak, 1);
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"14px 10px" }}>
      {/* Liquid fill layer */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${fillPct * 100}%`, transition:"height 1.5s cubic-bezier(0.34,1.56,0.64,1)", zIndex:0 }}>
        {/* Animated wave at the top edge of fill */}
        <svg viewBox="0 0 400 20" preserveAspectRatio="none"
          style={{ position:"absolute", top:-17, left:0, width:"200%", height:20, animation:"liquidWave 2.5s ease-in-out infinite" }}>
          <path d="M0,10 C50,2 100,18 150,10 C200,2 250,18 300,10 C350,2 400,18 400,10 L400,20 L0,20 Z"
            fill={`${C.lime}70`}/>
        </svg>
        {/* Second wave — offset phase for depth */}
        <svg viewBox="0 0 400 20" preserveAspectRatio="none"
          style={{ position:"absolute", top:-13, left:0, width:"200%", height:16, animation:"liquidWave 3.5s ease-in-out infinite reverse" }}>
          <path d="M0,10 C60,18 120,2 180,10 C240,18 300,2 360,10 C400,18 400,10 400,10 L400,20 L0,20 Z"
            fill={`${C.lime}35`}/>
        </svg>
        {/* Fill body */}
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:`linear-gradient(to top, ${C.lime}55, ${C.lime}25)` }}/>
      </div>

      {/* Content — always on top */}
      <div style={{ position:"relative", zIndex:1, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ fontSize:24, marginBottom:4 }}></div>
        <div style={{ fontFamily:"DM Mono", fontSize:20, fontWeight:700, color:C.text }}>{streak}d</div>
        <div style={{ fontSize:10, color:C.sub, fontWeight:600, letterSpacing:".07em", textTransform:"uppercase" }}>{label}</div>
        
      </div>
    </div>
  );
};

const DashboardPage = ({ t, user }) => {
  const [stats,     setStats]     = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [sessions,  setSessions]  = useState([]);
  const [time,      setTime]      = useState(new Date());
  const [goal, setGoal] = useState(() => parseInt(localStorage.getItem("fitoglobe_cal_goal") || "2200"));

       useEffect(() => {
  const onUpdate = () => setGoal(parseInt(localStorage.getItem("fitoglobe_cal_goal") || "2200"));
  window.addEventListener("fitoglobe_settings_updated", onUpdate);
  return () => window.removeEventListener("fitoglobe_settings_updated", onUpdate);
}, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      userService.getStats(),
      nutritionService.getLogs(today),
      workoutService.getSessions(1),
    ]).then(([s,n,w]) => {
      setStats(s.stats);
      setNutrition(n);
      setSessions(w.sessions||[]);
    }).catch(()=>{});
  }, []);

  // Streak from localStorage
  const streakData = JSON.parse(localStorage.getItem("fitoglobe_streak")||"{}");
  const streak = streakData.streak || 0;
  const workoutDates = sessions.map(s => 
    new Date(s.completedAt).toISOString().split("T")[0]
);
  const loginDays = streakData.loginDays || [];

  // Time-based greeting
  const hour = time.getHours();
  const greetings = {
    morning:   ["Good morning","Rise and grind","Morning warrior","Wake up champion"],
    afternoon: ["Good afternoon","Keep pushing","Halfway there","Stay focused"],
    evening:   ["Good evening","Evening grind","Almost done","Finish strong"],
    night:     ["Good night","Rest well","Recovery mode","Sleep is gains"],
  };
  const period = hour<12?"morning":hour<17?"afternoon":hour<21?"evening":"night";
  const greetList = greetings[period];
  const greeting = greetList[Math.floor(Date.now()/60000) % greetList.length];

  // Motivational messages
  const motives = [
    "Every rep counts. 💪","You showed up. That's half the battle. 🔥",
    "Progress > Perfection. ⚡","Your only competition is yesterday's you. 🎯",
    "Small steps, big results. 🚀","Consistency beats intensity. 💎",
    "Pain today, strength tomorrow. 🏆","You've got this. Keep going. ✨",
  ];
  const motive = motives[Math.floor(Date.now()/30000) % motives.length];

  // Timezone from country
  const tzMap = {
    IN:"IST",JP:"JST",KR:"KST",US:"EST",GB:"GMT",DE:"CET",FR:"CET",
    ES:"CET",IT:"CET",BR:"BRT",MX:"CST",CN:"CST",TH:"ICT",SA:"AST",
    EG:"EET",TR:"TRT",PH:"PST",GR:"EET",AR:"ART",NG:"WAT",
  };
  const tz = tzMap[user?.country] || "UTC";

  const fmtTime = (d) => d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  const fmtDate = (d) => d.toLocaleDateString([],{weekday:"long",month:"short",day:"numeric"});

  // Macros
  const cal  = nutrition?.totals?.calories || 0;
  const prot = nutrition?.totals?.protein  || 0;
  const carb = nutrition?.totals?.carbs    || 0;
  const fat  = nutrition?.totals?.fat      || 0;
  const macros = [
    {label:t.calories, value:Math.round(cal),  max:goal, color:C.lime},
    {label:t.protein,  value:Math.round(prot), max:150,  color:C.orange},
    {label:t.carbs,    value:Math.round(carb), max:250,  color:C.blue},
    {label:t.fat,      value:Math.round(fat),  max:70,   color:C.pink},
  ];

  // Weekly — last 7 days
  const weekDays = ["M","T","W","T","F","S","S"];
  const todayObj = new Date();
  const weekDates = Array.from({length:7}, (_,i) => {
  const d = new Date(todayObj);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const monday = d.getDate() - (day===0 ? 6 : day-1);
  d.setDate(monday + i);
  return d.toISOString().split("T")[0];
});

  // Profile emoji
  const profileEmoji = localStorage.getItem("fitoglobe_emoji") || null;

  return (
    <div className="fade-in" style={{ padding:"0 16px 100px" }}>

      {/* ── HERO HEADER ─────────────────────────────── */}
      <div style={{ padding:"20px 0 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
              <span style={{ fontFamily:"DM Mono", fontSize:22, fontWeight:700, color:C.lime }}>{fmtTime(time)}</span>
              <span style={{ fontSize:11, color:C.muted, background:C.bg2, padding:"2px 7px", borderRadius:20, border:`1px solid ${C.border}` }}>{tz}</span>
            </div>
            <div style={{ fontSize:12, color:C.sub }}>{fmtDate(time)}</div>
          </div>
          
        </div>
        <div style={{ marginTop:14 }}>
          <p style={{ color:C.sub, fontSize:14, fontWeight:500, marginBottom:2 }}>{greeting},</p>
          <h1 style={{ fontFamily:"Bebas Neue", fontSize:36, letterSpacing:1, color:C.text, lineHeight:1 }}>{user?.name||"Athlete"}</h1>
          <p style={{ color:C.muted, fontSize:13, marginTop:6, fontStyle:"italic" }}>{motive}</p>
        </div>
      </div>

      {/* ── STATS ROW ───────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:8, marginBottom:16 }}>
       
         <LiquidStreakCard streak={streak} maxStreak={30} label={t.streak} />

      {/* Mini Calendar card */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"10px 12px" }}>
       <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:6 }}>
         📅 {time.toLocaleString("default",{month:"short"})} {time.getFullYear()}
       </div>
       <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, textAlign:"center" }}>
        {["M","T","W","T","F","S","S"].map((d,i)=>(
          <div key={i} style={{ fontSize:8, color:C.muted, fontWeight:700, paddingBottom:3 }}>{d}</div>
        ))}
       {Array.from({length:(new Date(time.getFullYear(),time.getMonth(),1).getDay()||7)-1},(_,i)=>(
         <div key={"e"+i}/>
        ))}
       {Array.from({length:new Date(time.getFullYear(),time.getMonth()+1,0).getDate()},(_,i)=>{
        const day = i+1;
        const isToday = day===time.getDate();
        const dateStr = `${time.getFullYear()}-${String(time.getMonth()+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const isLogged = loginDays.includes(dateStr);
        return (
          <div key={day} style={{ aspectRatio:1, borderRadius:4, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:isToday?800:400, background:isToday?C.lime:isLogged?C.limeDim:"transparent", color:isToday?"#000":isLogged?C.lime:C.sub }}>
            {day}
            {workoutDates.includes(dateStr) && !isToday && (
              <div style={{ width:3, height:3, borderRadius:"50%", background:C.lime, marginTop:1 }}/>
            )}
         </div>
       );
      })}
    </div>
  </div>
</div>
  
      {/* ── TODAY'S GOAL ────────────────────────────── */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>{t.todayGoal}</span>
          <span style={{ fontSize:11, color:C.sub, fontFamily:"DM Mono" }}>{Math.round(cal)} / {goal} kcal</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          {macros.map(m=><MacroRing key={m.label} value={m.value} max={m.max} color={m.color} label={m.label}/>)}
        </div>
      </div>

      {/* ── WEEKLY PROGRESS (login-based) ───────────── */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>{t.weeklyProgress}</span>
          <span style={{ fontSize:11, color:C.sub }}>{streak} day streak </span>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"space-between" }}>
          {weekDates.map((date,i) => {
            const isActive = loginDays.includes(date);
            const isToday  = date === new Date().toISOString().split("T")[0];
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ width:"100%", aspectRatio:1, borderRadius:8, background:isActive?C.lime:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#000", fontWeight:800, border:isToday&&!isActive?`2px solid ${C.lime}`:undefined, transition:"all .3s" }}>
                  {isActive?"✓":""}
                </div>
                <span style={{ fontSize:10, color:isToday?C.lime:C.sub, fontWeight:isToday?700:400 }}>{weekDays[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RECENT WORKOUTS ─────────────────────────── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontWeight:700, fontSize:14 }}>{t.recentWorkout}</span>
        <span style={{ fontSize:12, color:C.lime, fontWeight:600 }}>{t.viewAll}</span>
      </div>
      {sessions.length === 0
        ? <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, textAlign:"center", color:C.sub, fontSize:13 }}>
            No workouts yet — log your first exercise! 💪
          </div>
        : sessions.slice(0,3).map(w=>(
          <div key={w.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14 }}>{w.name}</div>
              <div style={{ color:C.sub, fontSize:12, marginTop:2 }}>{w.exercises?.length||0} exercises · {w.durationMin||0} min</div>
            </div>
            <div style={{ fontFamily:"DM Mono", fontWeight:700, color:C.lime }}>{w.caloriesBurned||0} kcal</div>
          </div>
        ))
      }
    </div>
  );
};







































// ─── WORKOUT PAGE (real data) ────────────────────────────
// ─── EXERCISE STOPWATCH (one per logged exercise) ────────
const ExerciseStopwatch = ({ label }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps,    setLaps]    = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (running) { ref.current = setInterval(() => setSeconds(s => s+1), 1000); }
    else { clearInterval(ref.current); }
    return () => clearInterval(ref.current);
  }, [running]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ marginTop:10, background:C.bg, borderRadius:10, padding:"10px 12px", border:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:10, color:C.sub, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em" }}>Stopwatch</span>
        <span style={{ fontFamily:"DM Mono", fontSize:22, fontWeight:800, color:running?C.lime:C.text, transition:"color .3s" }}>{fmt(seconds)}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
        <button onClick={()=>setRunning(r=>!r)}
          style={{ padding:"8px 0", borderRadius:8, border:"none", background:running?"#FF3B3020":C.limeDim, color:running?"#FF5050":C.lime, fontFamily:"DM Sans", fontWeight:800, fontSize:12, cursor:"pointer" }}>
          {running?"⏸ Pause":seconds>0?"▶ Resume":"▶ Start"}
        </button>
        <button onClick={()=>{ if(running) setLaps(l=>[...l,seconds]); }} disabled={!running}
          style={{ padding:"8px 0", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:running?C.text:C.muted, fontFamily:"DM Sans", fontWeight:700, fontSize:12, cursor:running?"pointer":"not-allowed" }}>
          ◎ Lap
        </button>
        <button onClick={()=>{ setRunning(false); setSeconds(0); setLaps([]); }} disabled={seconds===0}
          style={{ padding:"8px 0", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:seconds>0?C.text:C.muted, fontFamily:"DM Sans", fontWeight:700, fontSize:12, cursor:seconds>0?"pointer":"not-allowed" }}>
          ↺ Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div style={{ marginTop:8, maxHeight:70, overflowY:"auto" }}>
          {laps.map((l,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"2px 0", fontSize:11 }}>
              <span style={{ color:C.muted }}>Lap {i+1}</span>
              <span style={{ fontFamily:"DM Mono", color:C.text }}>{fmt(l)}</span>
              {i>0 && <span style={{ fontFamily:"DM Mono", color:C.lime }}>+{fmt(l-laps[i-1])}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddExercisePopup = ({ exercise, onSave, onClose }) => {
  const [sets, setSets] = useState(String(exercise.defaultSets||3));
  const [reps, setReps] = useState(String(exercise.defaultReps||10));
  const [saving, setSaving] = useState(false);
  const muscleColors = { chest:"#FF6B00", back:"#3B82F6", legs:"#FF3CAC", shoulders:"#C8FF00", arms:"#FF6B00", core:"#3B82F6" };
  const color = muscleColors[exercise.muscleGroup] || C.lime;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#07070ECC", backdropFilter:"blur(6px)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} className="fade-up"
        style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, boxSizing:"border-box", paddingBottom:80 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
            {exercise.muscleGroup==="chest"?"💪":exercise.muscleGroup==="legs"?"🦵":exercise.muscleGroup==="back"?"🔙":exercise.muscleGroup==="shoulders"?"🏋️":exercise.muscleGroup==="arms"?"💪":exercise.muscleGroup==="core"?"⭕":"🏃"}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:16, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{exercise.displayName||exercise.name}</div>
            <div style={{ display:"flex", gap:6, marginTop:4 }}>
              <span style={{ fontSize:10, fontWeight:700, color, background:color+"18", padding:"2px 8px", borderRadius:20 }}>{exercise.muscleGroup}</span>
              <span style={{ fontSize:11, color:C.muted }}>{exercise.equipment}</span>
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[{label:"Sets", val:sets, set:setSets}, {label:"Reps", val:reps, set:setReps}].map(f=>(
            <div key={f.label}>
              <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>{f.label}</label>
              <div style={{ display:"flex", alignItems:"center", background:C.bg2, borderRadius:10, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                <button onClick={()=>f.set(v=>String(Math.max(1,parseInt(v||1)-1)))}
                  style={{ padding:"11px 14px", background:"transparent", border:"none", color:C.sub, fontSize:16, cursor:"pointer", fontWeight:700, flexShrink:0 }}>−</button>
                <input type="number" value={f.val} onChange={e=>f.set(e.target.value)}
                  style={{ flex:1, background:"transparent", border:"none", color:C.text, fontSize:16, fontFamily:"DM Mono", fontWeight:800, textAlign:"center", padding:"11px 0", width:0 }}/>
                <button onClick={()=>f.set(v=>String(parseInt(v||1)+1))}
                  style={{ padding:"11px 14px", background:"transparent", border:"none", color:C.sub, fontSize:16, cursor:"pointer", fontWeight:700, flexShrink:0 }}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={onClose}
            style={{ padding:"13px", borderRadius:12, border:`1px solid ${C.borderHi}`, background:"transparent", color:C.text, fontFamily:"DM Sans", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            Cancel
          </button>
          <button onClick={()=>{ setSaving(true); onSave(parseInt(sets)||3, parseInt(reps)||10); }} disabled={saving}
            style={{ padding:"13px", borderRadius:12, border:"none", background:saving?"#888":C.lime, color:"#000", fontFamily:"DM Sans", fontWeight:800, fontSize:14, cursor:"pointer" }}>
            {saving?"Saving...":"Save Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkoutPage = ({ t }) => {
  const [sessions,  setSessions]  = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showLib,   setShowLib]   = useState(false);
  const [toast,     setToast]     = useState("");
  const [exFilter,  setExFilter]  = useState("all");
  const [exSearch,  setExSearch]  = useState("");
  const [popup,     setPopup]     = useState(null);

  const muscleColors = { chest:"#FF6B00", back:"#3B82F6", legs:"#FF3CAC", shoulders:"#C8FF00", arms:"#FF6B00", core:"#3B82F6" };
  const muscleGroups = ["all","chest","back","legs","shoulders","arms","core"];

  useEffect(() => {
    Promise.all([
      workoutService.getSessions(),
      workoutService.getExercises({ lang:"en" }),
    ]).then(([s,e]) => {
      setSessions(s.sessions||[]);
      setExercises(e.exercises||[]);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  // ── FIX: case-insensitive filter ─────────────────────
  const filteredEx = exercises.filter(e => {
    const muscle = (e.muscleGroup||"").toLowerCase();
    const matchFilter = exFilter==="all" || muscle===exFilter.toLowerCase();
    const matchSearch = (e.name||"").toLowerCase().includes(exSearch.toLowerCase()) ||
                        (e.displayName||"").toLowerCase().includes(exSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  const saveExercise = async (ex, sets, reps) => {
    try {
      // Auto calories: caloriesPerMin × sets × 2.5 min per set
      const cal = Math.round((ex.caloriesPerMin||5) * sets * 2.5);
      const dur = Math.round(sets * 2.5);
      const d = await workoutService.createSession({
        name: ex.displayName || ex.name,
        durationMin: dur,
        caloriesBurned: cal,
        exercises: [{ exerciseId: ex.id, sets, reps, weightKg: null }],
      });
      setSessions(s=>[d.session,...s]);
      setPopup(null);
      setShowLib(false);
      showToast(`${ex.name} logged! ~${cal} kcal`);
    } catch { showToast("Failed to save"); }
  };

  const deleteSession = async (id) => {
    try {
      await workoutService.deleteSession(id);
      setSessions(s=>s.filter(x=>x.id!==id));
      showToast("Deleted!");
    } catch { showToast("Failed to delete"); }
  };

  const deleteAll = async () => {
    if(!window.confirm("Delete all logged exercises?")) return;
    try {
      await Promise.all(sessions.map(s=>workoutService.deleteSession(s.id)));
      setSessions([]);
      showToast("All cleared!");
    } catch { showToast("Failed"); }
  };

  const openLib = () => { setShowLib(true); setExSearch(""); setExFilter("all"); };

  // ── LIBRARY VIEW ─────────────────────────────────────
  if (showLib) return (
    <div className="fade-in" style={{ padding:"20px 16px 100px" }}>
      <Toast msg={toast}/>
      {popup && <AddExercisePopup exercise={popup} onSave={(sets,reps)=>saveExercise(popup,sets,reps)} onClose={()=>setPopup(null)}/>}

      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div onClick={()=>setShowLib(false)}
          style={{ width:36, height:36, borderRadius:10, background:C.card, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18, color:C.sub }}>
          ←
        </div>
        <h1 style={{ fontFamily:"Bebas Neue", fontSize:28, letterSpacing:1, color:C.text }}>Exercise Library</h1>
        <span style={{ marginLeft:"auto", fontSize:12, color:C.muted }}>{filteredEx.length} exercises</span>
      </div>

      <input value={exSearch} onChange={e=>setExSearch(e.target.value)} placeholder="Search exercises..."
        style={{ width:"100%", padding:"10px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:13, fontFamily:"DM Sans", marginBottom:10, boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>

      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:14, paddingBottom:2 }}>
        {muscleGroups.map(g=>(
          <div key={g} onClick={()=>setExFilter(g)}
            style={{ padding:"5px 12px", borderRadius:20, border:`1.5px solid ${exFilter===g?C.lime:C.border}`, background:exFilter===g?C.limeDim:C.card, cursor:"pointer", whiteSpace:"nowrap", fontSize:11, fontWeight:700, color:exFilter===g?C.lime:C.sub, flexShrink:0, transition:"all .15s" }}>
            {g==="all"?"All":g.charAt(0).toUpperCase()+g.slice(1)}
          </div>
        ))}
      </div>

      {filteredEx.length === 0 ? (
        <div style={{ textAlign:"center", padding:40, color:C.sub, fontSize:14 }}>
          No exercises found
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filteredEx.map(ex => {
            const color = muscleColors[ex.muscleGroup]||C.lime;
            const cal = Math.round((ex.caloriesPerMin||5) * 3 * 2.5);
            return (
              <div key={ex.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{ex.displayName||ex.name}</div>
                  <div style={{ display:"flex", gap:8, marginTop:4, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:700, color, background:color+"18", padding:"2px 8px", borderRadius:20 }}>{ex.muscleGroup}</span>
                    <span style={{ fontSize:11, color:C.muted }}>{ex.equipment}</span>
                    <span style={{ fontSize:11, color:C.muted }}>{ex.defaultSets}×{ex.defaultReps}</span>
                    <span style={{ fontSize:11, color:C.lime, fontWeight:600 }}>~{cal} kcal</span>
                  </div>
                </div>
                <div onClick={()=>setPopup(ex)}
                  style={{ width:36, height:36, borderRadius:"50%", background:C.lime, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#000", fontWeight:900, cursor:"pointer", flexShrink:0, marginLeft:12, transition:"transform .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                  +
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── DEFAULT VIEW ─────────────────────────────────────
  return (
    <div className="fade-in" style={{ padding:"20px 16px 100px" }}>
      <Toast msg={toast}/>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontFamily:"Bebas Neue", fontSize:34, letterSpacing:1, color:C.text }}>{t.workouts}</h1>
        <div onClick={openLib}
          style={{ background:C.lime, color:"#000", fontWeight:700, fontSize:13, padding:"8px 16px", borderRadius:10, cursor:"pointer" }}>
          + Add Exercise
        </div>
      </div>

      {loading ? <Spinner/> : sessions.length === 0 ? (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:48, textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🏋️</div>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>No exercises logged yet</div>
          <div style={{ color:C.sub, fontSize:13, marginBottom:20 }}>Tap "+ Add Exercise" to get started</div>
          <div onClick={openLib}
            style={{ display:"inline-block", background:C.lime, color:"#000", fontWeight:700, fontSize:13, padding:"10px 20px", borderRadius:10, cursor:"pointer" }}>
            Browse Exercises
          </div>
        </div>
      ) : (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.sub, letterSpacing:".08em", textTransform:"uppercase" }}>
              Logged ({sessions.length})
            </div>
            <div onClick={deleteAll}
              style={{ fontSize:11, color:"#FF5050", cursor:"pointer", fontWeight:700, padding:"5px 12px", border:"1px solid #FF505030", borderRadius:20, background:"#FF505010" }}>
              🗑 Delete All
            </div>
          </div>

          {sessions.map(s => {
            const ex = s.exercises?.[0];
            const muscle = ex?.exercise?.muscleGroup;
            const color = muscleColors[muscle]||C.lime;
            return (
              <div key={s.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    {muscle && <span style={{ fontSize:10, fontWeight:700, color, background:color+"18", padding:"2px 8px", borderRadius:20, display:"inline-block", marginBottom:6 }}>{muscle}</span>}
                    <div style={{ fontWeight:800, fontSize:15 }}>{s.name}</div>
                    <div style={{ display:"flex", gap:12, marginTop:2 }}>
                      {ex && <span style={{ color:C.sub, fontSize:12 }}>{ex.sets} sets × {ex.reps} reps</span>}
                      {s.caloriesBurned > 0 && <span style={{ color:C.lime, fontSize:12, fontFamily:"DM Mono", fontWeight:700 }}>{s.caloriesBurned} kcal</span>}
                    </div>
                    <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{new Date(s.completedAt).toLocaleDateString()}</div>
                  </div>
                  <div onClick={()=>deleteSession(s.id)}
                    style={{ fontSize:11, color:"#FF5050", cursor:"pointer", fontWeight:700, padding:"5px 10px", border:"1px solid #FF505030", borderRadius:20, background:"#FF505010", flexShrink:0, marginLeft:10 }}>
                    🗑
                  </div>
                </div>
                <ExerciseStopwatch label={s.name}/>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};










// ─── NUTRITION PAGE (real data) ──────────────────────────
// ─── NUTRITION PAGE — AI Auto Macros ─────────────────────
// ─── NUTRITION PAGE ──────────────────────────────────────
// ONLY 2 THINGS CHANGED from your original:
// 1. calculateMacros() — now uses aiService.getMacros() instead of aiService.chat()
// 2. useEffect debounce — food.length < 2 instead of < 3
// Everything else is 100% identical to your original.

const NutritionPage = ({ t }) => {
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [meal,     setMeal]     = useState("breakfast");
  const [food,     setFood]     = useState("");
  const [qty,      setQty]      = useState("");
  const [macros,   setMacros]   = useState(null);
  const [aiLoading,setAiLoading]= useState(false);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState("");
  const [toastType,setToastType]= useState("success");
  const [expanded, setExpanded] = useState({ breakfast:true, lunch:true, dinner:true, snack:true });

  const load = () => {
    const today = new Date().toISOString().split("T")[0];
    nutritionService.getLogs(today)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg, type="success") => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(""), 2500);
  };

  // ── ✅ CHANGED: AI Macro Calculator (uses new endpoint) ──
  const calculateMacros = async () => {
    if (!food.trim() || food.length < 2) return;
    setAiLoading(true);
    setMacros(null);
    try {
      const data = await aiService.getMacros(food, qty);
      setMacros({
        calories: data.calories,
        protein:  data.protein,
        carbs:    data.carbs,
        fat:      data.fat,
        serving:  data.serving,
      });
    } catch {
      showToast("Could not calculate macros, try again", "error");
    }
    setAiLoading(false);
  };

  // ── ✅ CHANGED: food.length < 2 (was < 3), 900ms debounce ──
  useEffect(() => {
    if (!food.trim() || food.length < 2) { setMacros(null); return; }
    const timer = setTimeout(() => calculateMacros(), 900);
    return () => clearTimeout(timer);
  }, [food, qty]);

  // ── Everything below is 100% unchanged ──────────────────

  const addLog = async () => {
    if (!food || !macros?.calories) return;
    setSaving(true);
    try {
      await nutritionService.addLog({
        mealType:  meal,
        foodName:  food + (qty ? ` (${qty})` : ""),
        calories:  parseFloat(macros.calories) || 0,
        proteinG:  parseFloat(macros.protein)  || 0,
        carbsG:    parseFloat(macros.carbs)    || 0,
        fatG:      parseFloat(macros.fat)      || 0,
      });
      load();
      setShowAdd(false);
      setFood(""); setQty(""); setMacros(null);
      showToast("Meal logged! 🍽️");
    } catch {
      showToast("Failed to save ❌", "error");
    }
    setSaving(false);
  };

  const totals    = data?.totals || { calories:0, protein:0, carbs:0, fat:0 };
  const [calGoal, setCalGoal] = useState(() => parseInt(localStorage.getItem("fitoglobe_cal_goal") || "2200"));
  useEffect(() => {
    const onUpdate = () => setCalGoal(parseInt(localStorage.getItem("fitoglobe_cal_goal") || "2200"));
    window.addEventListener("fitoglobe_settings_updated", onUpdate);
    return () => window.removeEventListener("fitoglobe_settings_updated", onUpdate);
}, []);
  const calPct    = Math.min((totals.calories / calGoal) * 100, 100);
  const mealTypes = ["breakfast","lunch","dinner","snack"];
  const mealLabels = { breakfast:t.breakfast, lunch:t.lunch, dinner:t.dinner, snack:t.snacks };
  const mealIcons  = { breakfast:"AM", lunch:"PM", dinner:"EVE", snack:"+" };
  const mealColors = { breakfast:C.orange, lunch:C.lime, dinner:C.blue, snack:C.pink };

  return (
    <div className="fade-in" style={{ padding:"20px 16px 100px" }}>
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:toastType==="error"?C.orange:C.lime, color:"#000", padding:"10px 20px", borderRadius:10, fontWeight:700, fontSize:13, zIndex:999, animation:"fadeUp .3s ease" }}>
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h1 style={{ fontFamily:"Bebas Neue", fontSize:34, letterSpacing:1, color:C.text }}>{t.nutrition}</h1>
        <div onClick={() => { setShowAdd(true); setFood(""); setQty(""); setMacros(null); }}
          style={{ background:C.lime, color:"#000", fontWeight:700, fontSize:13, padding:"8px 16px", borderRadius:10, cursor:"pointer" }}>
          + {t.addMeal}
        </div>
      </div>

      {/* ADD MEAL PANEL */}
      {showAdd && (
        <div style={{ background:C.card, border:`1px solid ${C.lime}30`, borderRadius:16, padding:20, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontWeight:800, fontSize:15 }}>🤖 AI Macro Calculator</div>
            <div onClick={() => setShowAdd(false)} style={{ color:C.muted, cursor:"pointer", fontSize:18 }}>✕</div>
          </div>

          {/* Meal type selector */}
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {mealTypes.map(m => (
              <div key={m} onClick={() => setMeal(m)}
                style={{ flex:1, padding:"7px 2px", borderRadius:10, border:`1.5px solid ${meal===m?mealColors[m]:C.border}`, background:meal===m?mealColors[m]+"18":C.bg2, textAlign:"center", cursor:"pointer", fontSize:10, fontWeight:700, color:meal===m?mealColors[m]:C.sub, transition:"all .15s" }}>
                {mealIcons[m]}<br/>{mealLabels[m]}
              </div>
            ))}
          </div>

          {/* Food input */}
          <div style={{ marginBottom:10 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>Food Item</label>
            <input value={food} onChange={e => setFood(e.target.value)}
              placeholder="e.g. Dal chawal, 2 eggs, banana..."
              style={{ width:"100%", padding:"12px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, fontFamily:"DM Sans", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = C.lime}
              onBlur={e  => e.target.style.borderColor = C.border}/>
          </div>

          {/* Quantity input */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>Quantity (optional)</label>
            <input value={qty} onChange={e => setQty(e.target.value)}
              placeholder="e.g. 1 bowl, 200g, 2 pieces..."
              style={{ width:"100%", padding:"12px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, fontFamily:"DM Sans", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = C.lime}
              onBlur={e  => e.target.style.borderColor = C.border}/>
          </div>

          {/* AI Loading */}
          {aiLoading && (
            <div style={{ background:C.limeDim, border:`1px solid ${C.lime}30`, borderRadius:12, padding:"14px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ display:"flex", gap:4 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.lime, animation:`pulse 1s ${i*.2}s infinite` }}/>
                ))}
              </div>
              <span style={{ fontSize:13, color:C.lime, fontWeight:600 }}>AI calculating macros...</span>
            </div>
          )}

          {/* AI Result */}
          {macros && !aiLoading && (
            <div style={{ background:C.limeDim, border:`1px solid ${C.lime}40`, borderRadius:12, padding:16, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.lime }}>🤖 AI Calculated</span>
                {macros.serving && <span style={{ fontSize:11, color:C.sub }}>{macros.serving}</span>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
                {[
                  { label:"Calories", val:macros.calories, unit:"kcal", color:C.lime   },
                  { label:"Protein",  val:macros.protein,  unit:"g",    color:C.orange },
                  { label:"Carbs",    val:macros.carbs,    unit:"g",    color:C.blue   },
                  { label:"Fat",      val:macros.fat,      unit:"g",    color:C.pink   },
                ].map(m => (
                  <div key={m.label} style={{ background:C.card, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                    <input
                      type="number"
                      value={m.val}
                      onChange={e => setMacros(prev => ({
                        ...prev,
                        [m.label.toLowerCase()]: e.target.value
                      }))}
                      style={{ width:"100%", textAlign:"center", background:"transparent", border:"none", color:m.color, fontFamily:"DM Mono", fontWeight:800, fontSize:15, padding:0 }}
                    />
                    <div style={{ fontSize:9, color:C.muted, marginTop:2, textTransform:"uppercase" }}>{m.label}</div>
                    <div style={{ fontSize:9, color:C.muted }}>{m.unit}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:8, textAlign:"center" }}>
                ✏️ Tap any value to edit manually
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <button onClick={() => { setShowAdd(false); setFood(""); setQty(""); setMacros(null); }}
              style={{ padding:"13px", borderRadius:12, border:`1px solid ${C.border}`, background:"transparent", color:C.text, fontFamily:"DM Sans", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={addLog} disabled={saving || !macros?.calories}
              style={{ padding:"13px", borderRadius:12, border:"none", background:saving||!macros?.calories?"#555":C.lime, color:"#000", fontFamily:"DM Sans", fontWeight:800, fontSize:14, cursor:saving||!macros?.calories?"not-allowed":"pointer" }}>
              {saving ? "Saving..." : "Save Meal"}
            </button>
          </div>
        </div>
      )}

      {loading ? <Spinner/> : (
        <>
          {/* CALORIE SUMMARY */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontWeight:800, fontSize:15 }}>Total: <span style={{ color:C.lime }}>{Math.round(totals.calories)}</span> kcal</span>
              <span style={{ color:C.sub, fontSize:12 }}>Goal: {calGoal}</span>
            </div>
            {/* Calorie bar */}
            <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden", marginBottom:16 }}>
              <div style={{ height:"100%", width:`${calPct}%`, background:calPct>90?`linear-gradient(90deg,${C.orange},#FF4444)`:`linear-gradient(90deg,${C.lime},${C.orange})`, borderRadius:4, transition:"width .8s" }}/>
            </div>
            {/* Macro rings */}
            <div style={{ display:"flex", justifyContent:"space-around" }}>
              {[
                { label:t.protein, value:Math.round(totals.protein), max:160, color:C.orange },
                { label:t.carbs,   value:Math.round(totals.carbs),   max:280, color:C.lime   },
                { label:t.fat,     value:Math.round(totals.fat),     max:80,  color:C.blue   },
              ].map(m => <MacroRing key={m.label} value={m.value} max={m.max} color={m.color} label={m.label} size={70}/>)}
            </div>

            {/* Macro breakdown bar */}
            <div style={{ marginTop:16 }}>
              <div style={{ display:"flex", height:6, borderRadius:4, overflow:"hidden", gap:2 }}>
                {[
                  { val: totals.protein * 4, color: C.orange },
                  { val: totals.carbs   * 4, color: C.lime   },
                  { val: totals.fat     * 9, color: C.blue   },
                ].map((m, i) => {
                  const total = totals.protein*4 + totals.carbs*4 + totals.fat*9 || 1;
                  return <div key={i} style={{ flex: m.val/total, background:m.color, minWidth: m.val>0?4:0 }}/>;
                })}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                {[
                  { label:"Protein", val:Math.round(totals.protein), color:C.orange },
                  { label:"Carbs",   val:Math.round(totals.carbs),   color:C.lime   },
                  { label:"Fat",     val:Math.round(totals.fat),     color:C.blue   },
                ].map(m => (
                  <div key={m.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:m.color }}/>
                    <span style={{ fontSize:10, color:C.sub }}>{m.label}: <span style={{ color:m.color, fontWeight:700 }}>{m.val}g</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MEAL SECTIONS */}
          {mealTypes.map(type => {
            const items = data?.grouped?.[type] || [];
            const mealCal = items.reduce((sum, i) => sum + (i.calories||0), 0);
            return (
              <div key={type} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:10 }}>
                <div onClick={() => setExpanded(p => ({...p, [type]:!p[type]}))}
  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:expanded[type]&&items.length>0?12:0, cursor:"pointer" }}>
  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
    <span style={{ fontSize:18 }}>{mealIcons[type]}</span>
    <span style={{ fontWeight:800, fontSize:14 }}>{mealLabels[type]}</span>
    {items.length > 0 && <span style={{ fontSize:10, color:C.muted, background:C.border, padding:"1px 7px", borderRadius:20 }}>{items.length}</span>}
  </div>
  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
    {mealCal > 0 && <span style={{ fontFamily:"DM Mono", fontSize:12, color:mealColors[type], fontWeight:700 }}>{Math.round(mealCal)} kcal</span>}
    <div onClick={e => { e.stopPropagation(); setMeal(type); setShowAdd(true); setFood(""); setQty(""); setMacros(null); }}
      style={{ width:24, height:24, borderRadius:"50%", background:C.limeDim, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:14, color:C.lime, fontWeight:900 }}>+</div>
    <span style={{ fontSize:12, color:C.muted, transition:"transform .2s", display:"inline-block", transform:expanded[type]?"rotate(0deg)":"rotate(-90deg)" }}>▼</span>
  </div>
</div>
{expanded[type] && (items.length === 0
  ? <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>Nothing logged yet</div>
  : items.map((item, idx) => (
                      <div key={item.id} style={{ padding:"8px 0", borderBottom:idx<items.length-1?`1px solid ${C.border}`:"none" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <span style={{ fontSize:13, fontWeight:600, flex:1 }}>{item.foodName}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, marginLeft:8 }}>
                            <span style={{ fontSize:12, color:mealColors[type], fontFamily:"DM Mono", fontWeight:700 }}>{item.calories} kcal</span>
                            <span onClick={async () => {
                              await nutritionService.deleteLog(item.id);
                              load();
                           }} style={{ fontSize:11, color:"#FF5050", cursor:"pointer", padding:"2px 7px", border:"1px solid #FF505030", borderRadius:20, background:"#FF505010", fontWeight:700 }}>✕</span>
                         </div>
                       </div>
                      {(item.proteinG > 0 || item.carbsG > 0 || item.fatG > 0) && (
                        <div style={{ display:"flex", gap:10, marginTop:3 }}>
                          {[
                            { label:"P", val:item.proteinG, color:C.orange },
                            { label:"C", val:item.carbsG,   color:C.lime   },
                            { label:"F", val:item.fatG,     color:C.blue   },
                          ].map(m => m.val > 0 && (
                            <span key={m.label} style={{ fontSize:10, color:m.color, fontWeight:700 }}>{m.label}: {Math.round(m.val)}g</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

























// ─── PROGRESS PAGE (real data) ───────────────────────────
// ─── PROGRESS PAGE — Achievement + Streak System ─────────────────────────────
// ─── PROGRESS PAGE — Replace karo App.jsx mein purane ProgressPage se ─────────

const ProgressPage = ({ t, user }) => {
  const [logs,        setLogs]        = useState([]);
  const [sessions,    setSessions]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [targetWeight,setTargetWeight]= useState(localStorage.getItem("fitoglobe_target_weight") || "");
  const [editTarget,  setEditTarget]  = useState(false);
  const [tempTarget,  setTempTarget]  = useState("");
  const [toast,       setToast]       = useState("");
  const [activeTab,   setActiveTab]   = useState("overview");

  const load = () => {
    Promise.all([
      progressService.getLogs(),
      workoutService.getSessions(),
    ]).then(([p, w]) => {
      setLogs(p.logs || []);
      setSessions(w.sessions || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  // ── Derived stats ──────────────────────────────────────
  const streakData    = JSON.parse(localStorage.getItem("fitoglobe_streak") || "{}");
  const streak        = streakData.streak || 0;
  const loginDays     = streakData.loginDays || [];

  // Current weight from localStorage (most reliable)
  const storedUser    = JSON.parse(localStorage.getItem("fitoglobe_user") || "{}");
  const currentWeight = parseFloat(storedUser?.weight || user?.weight) || 0;
  const height        = parseFloat(storedUser?.height || user?.height) || 170;
  const target        = parseFloat(targetWeight) || 0;

  // BMI calculations
  const currentBMI = height ? (currentWeight / ((height / 100) ** 2)).toFixed(1) : null;
  const targetBMI  = height && target ? (target / ((height / 100) ** 2)).toFixed(1) : null;

  const getBMILabel = (bmi) =>
    bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const getBMIColor = (bmi) =>
    bmi < 18.5 ? C.blue : bmi < 25 ? C.lime : bmi < 30 ? C.orange : "#FF4444";
  const getBMIPct = (bmi) => Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);

  // Workout dates for heatmap
  const workoutDates = sessions.reduce((acc, s) => {
    const d = new Date(s.completedAt).toISOString().split("T")[0];
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  // ── BADGES ────────────────────────────────────────────
  const allBadges = [
    { id:"first_workout",    icon:"🏋️", label:"First Rep",        desc:"Log your first workout",     unlocked: sessions.length >= 1 },
    { id:"week_streak",      icon:"🔥", label:"Week Warrior",     desc:"7-day login streak",          unlocked: streak >= 7 },
    { id:"month_streak",     icon:"👑", label:"Monthly King",     desc:"30-day login streak",         unlocked: streak >= 30 },
    { id:"five_workouts",    icon:"💪", label:"Getting Gains",    desc:"Log 5 workouts",              unlocked: sessions.length >= 5 },
    { id:"twenty_workouts",  icon:"⚡", label:"Consistent",       desc:"Log 20 workouts",             unlocked: sessions.length >= 20 },
    { id:"three_logs",       icon:"📊", label:"Data Nerd",        desc:"Log weight 3 times",          unlocked: logs.length >= 3 },
    { id:"ten_logs",         icon:"🗓️", label:"Tracker",          desc:"Log weight 10 times",         unlocked: logs.length >= 10 },
    { id:"normal_bmi",       icon:"⚖️", label:"Balanced",         desc:"Achieve normal BMI",          unlocked: currentBMI >= 18.5 && currentBMI < 25 },
    { id:"target_set",       icon:"🎯", label:"Goal Setter",      desc:"Set a target weight",         unlocked: !!targetWeight },
    { id:"target_bmi_normal",icon:"✨", label:"Target is Healthy", desc:"Target BMI in normal range", unlocked: targetBMI >= 18.5 && targetBMI < 25 },
    { id:"week_workout",     icon:"🏆", label:"Weekly Grind",     desc:"7 workouts total",            unlocked: sessions.length >= 7 },
    { id:"streak3",          icon:"🌟", label:"3-Day Fire",       desc:"3-day login streak",          unlocked: streak >= 3 },
  ];

  const unlockedCount = allBadges.filter(b => b.unlocked).length;

  // ── Heatmap ───────────────────────────────────────────
  const today      = new Date();
  const heatDates  = Array.from({ length: 91 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (90 - i));
    return d.toISOString().split("T")[0];
  });
  const firstDay    = new Date(heatDates[0]);
  const offset      = (firstDay.getDay() + 6) % 7;
  const paddedDates = [...Array(offset).fill(null), ...heatDates];
  const weeks       = [];
  for (let i = 0; i < paddedDates.length; i += 7) weeks.push(paddedDates.slice(i, i + 7));
  const weekLabels  = ["M","T","W","T","F","S","S"];

  const saveTarget = () => {
    const val = parseFloat(tempTarget);
    if (!val || val < 20 || val > 300) return;
    localStorage.setItem("fitoglobe_target_weight", String(val));
    setTargetWeight(String(val));
    setEditTarget(false);
    setToast("Target weight saved! 🎯");
    setTimeout(() => setToast(""), 2500);
  };

  if (loading) return <div style={{ padding:24 }}><Spinner/></div>;

  const tabs = [
    { id:"overview", label:"Overview" },
    { id:"heatmap",  label:"Heatmap"  },
    { id:"badges",   label:`Badges ${unlockedCount}/${allBadges.length}` },
  ];

  return (
    <div className="fade-in" style={{ padding:"20px 16px 100px" }}>
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:C.lime, color:"#000", padding:"10px 20px", borderRadius:10, fontWeight:700, fontSize:13, zIndex:999, animation:"fadeUp .3s ease" }}>
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"Bebas Neue", fontSize:34, letterSpacing:1, color:C.text, lineHeight:1 }}>PROGRESS</h1>
        <p style={{ color:C.sub, fontSize:12, marginTop:2 }}>Track. Achieve. Dominate.</p>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {tabs.map(tab => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex:1, padding:"8px 4px", borderRadius:10, border:`1.5px solid ${activeTab===tab.id?C.lime:C.border}`, background:activeTab===tab.id?C.limeDim:C.card, textAlign:"center", cursor:"pointer", fontSize:11, fontWeight:700, color:activeTab===tab.id?C.lime:C.sub, transition:"all .15s" }}>
            {tab.label}
          </div>
        ))}
      </div>

      {/* ══ OVERVIEW TAB ══════════════════════════════════ */}
      {activeTab === "overview" && (
        <>
          {/* STATS ROW */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
            {[
              { icon:"↑", val:`${streak}d`,        sub:"Streak"   },
              { icon:"▲", val:`${sessions.length}`, sub:"Workouts" },
              { icon:"◉", val:`${currentWeight}kg`, sub:"Current"  },
            ].map(s => (
              <div key={s.sub} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 8px", textAlign:"center" }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontFamily:"DM Mono", fontSize:16, fontWeight:800, color:C.text }}>{s.val}</div>
                <div style={{ fontSize:10, color:C.sub, fontWeight:600, textTransform:"uppercase", marginTop:2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* WEIGHT CARDS */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            {/* Current Weight */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:16, textAlign:"center" }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Current Weight</div>
              <div style={{ fontFamily:"DM Mono", fontSize:28, fontWeight:900, color:C.text }}>{currentWeight}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>kg</div>
              <div style={{ marginTop:8, fontSize:10, color:C.sub }}>From your profile</div>
            </div>

            {/* Target Weight */}
            <div style={{ background:C.card, border:`1.5px solid ${targetWeight?C.lime+"40":C.border}`, borderRadius:16, padding:16, textAlign:"center", cursor:"pointer" }}
              onClick={() => { setTempTarget(targetWeight); setEditTarget(true); }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Target Weight</div>
              {targetWeight
                ? <div style={{ fontFamily:"DM Mono", fontSize:28, fontWeight:900, color:C.lime }}>{targetWeight}</div>
                : <div style={{ fontSize:28, marginBottom:2 }}>🎯</div>
              }
              <div style={{ fontSize:11, color:targetWeight?C.muted:C.sub, marginTop:2 }}>{targetWeight?"kg":"Tap to set"}</div>
              <div style={{ marginTop:8, fontSize:10, color:C.lime, fontWeight:700 }}>{targetWeight?"✏️ Edit":"+ Set Goal"}</div>
            </div>
          </div>

          {/* TARGET WEIGHT POPUP */}
          {editTarget && (
            <div onClick={() => setEditTarget(false)} style={{ position:"fixed", inset:0, background:"#07070ECC", backdropFilter:"blur(6px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
              <div onClick={e => e.stopPropagation()} className="fade-up"
                style={{ background:C.card, border:`1px solid ${C.lime}40`, borderRadius:20, padding:24, width:"100%", maxWidth:340 }}>
                <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>🎯 Set Target Weight</div>
                <div style={{ fontSize:12, color:C.sub, marginBottom:16 }}>Current: {currentWeight}kg · Height: {height}cm</div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <input type="number" value={tempTarget} onChange={e => setTempTarget(e.target.value)}
                    placeholder="e.g. 70"
                    style={{ flex:1, padding:"14px", background:C.bg2, border:`1.5px solid ${C.lime}`, borderRadius:12, color:C.text, fontSize:22, fontFamily:"DM Mono", fontWeight:800, textAlign:"center" }}
                    autoFocus/>
                  <span style={{ color:C.sub, fontWeight:700, fontSize:16 }}>kg</span>
                </div>
                {tempTarget && parseFloat(tempTarget) > 0 && (
                  <div style={{ background:C.limeDim, border:`1px solid ${C.lime}30`, borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:12 }}>
                    {(() => {
                      const diff  = (parseFloat(tempTarget) - currentWeight).toFixed(1);
                      const tBMI  = (parseFloat(tempTarget) / ((height/100)**2)).toFixed(1);
                      const tLabel = getBMILabel(tBMI);
                      const tColor = getBMIColor(tBMI);
                      return (
                        <>
                          <div style={{ color:C.text }}>
                            {diff > 0 ? "📈" : "📉"} {diff > 0 ? "+" : ""}{diff}kg {diff > 0 ? "to gain" : "to lose"}
                          </div>
                          <div style={{ color:tColor, marginTop:4 }}>Target BMI: {tBMI} ({tLabel})</div>
                        </>
                      );
                    })()}
                  </div>
                )}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <button onClick={() => setEditTarget(false)}
                    style={{ padding:"12px", borderRadius:12, border:`1px solid ${C.border}`, background:"transparent", color:C.text, fontWeight:700, cursor:"pointer", fontSize:14 }}>
                    Cancel
                  </button>
                  <button onClick={saveTarget}
                    style={{ padding:"12px", borderRadius:12, border:"none", background:C.lime, color:"#000", fontWeight:800, cursor:"pointer", fontSize:14 }}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BMI — CURRENT */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18, marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontWeight:800, fontSize:14 }}>📉 Current BMI</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"DM Mono", fontSize:20, fontWeight:900, color:getBMIColor(currentBMI) }}>{currentBMI}</span>
                <span style={{ fontSize:11, fontWeight:700, color:getBMIColor(currentBMI), background:getBMIColor(currentBMI)+"20", padding:"2px 8px", borderRadius:20 }}>{getBMILabel(currentBMI)}</span>
              </div>
            </div>
            <div style={{ position:"relative", height:10, borderRadius:6, overflow:"hidden", background:`linear-gradient(90deg, ${C.blue} 0%, ${C.lime} 35%, ${C.lime} 65%, ${C.orange} 80%, #FF4444 100%)` }}>
              <div style={{ position:"absolute", top:-2, left:`${getBMIPct(currentBMI)}%`, transform:"translateX(-50%)", width:14, height:14, borderRadius:"50%", background:"#fff", border:`3px solid ${getBMIColor(currentBMI)}`, transition:"left .8s ease" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:9, color:C.muted, fontWeight:600 }}>
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
          </div>

          {/* BMI — TARGET */}
          {targetBMI && (
            <div style={{ background:C.card, border:`1px solid ${C.lime}30`, borderRadius:16, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontWeight:800, fontSize:14 }}>🎯 Target BMI</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontFamily:"DM Mono", fontSize:20, fontWeight:900, color:getBMIColor(targetBMI) }}>{targetBMI}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:getBMIColor(targetBMI), background:getBMIColor(targetBMI)+"20", padding:"2px 8px", borderRadius:20 }}>{getBMILabel(targetBMI)}</span>
                </div>
              </div>
              <div style={{ position:"relative", height:10, borderRadius:6, overflow:"hidden", background:`linear-gradient(90deg, ${C.blue} 0%, ${C.lime} 35%, ${C.lime} 65%, ${C.orange} 80%, #FF4444 100%)` }}>
                <div style={{ position:"absolute", top:-2, left:`${getBMIPct(targetBMI)}%`, transform:"translateX(-50%)", width:14, height:14, borderRadius:"50%", background:"#fff", border:`3px solid ${getBMIColor(targetBMI)}`, transition:"left .8s ease" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:9, color:C.muted, fontWeight:600 }}>
                <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
              </div>
              <div style={{ marginTop:12, padding:"10px 12px", background:C.bg2, borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:12, color:C.sub }}>BMI Change</div>
                <div style={{ fontSize:13, fontWeight:800, color:targetBMI < currentBMI ? C.lime : C.orange }}>
                  {targetBMI < currentBMI ? "▼" : "▲"} {Math.abs((targetBMI - currentBMI).toFixed(1))} points
                </div>
              </div>
            </div>
          )}

          {!targetWeight && (
            <div style={{ background:C.limeDim, border:`1px solid ${C.lime}30`, borderRadius:14, padding:16, textAlign:"center", marginBottom:14 }}>
              <div style={{ fontSize:13, color:C.lime, fontWeight:700 }}>🎯 Set a target weight to see your goal BMI!</div>
              <div onClick={() => { setTempTarget(""); setEditTarget(true); }}
                style={{ marginTop:8, display:"inline-block", background:C.lime, color:"#000", fontWeight:800, fontSize:12, padding:"7px 18px", borderRadius:20, cursor:"pointer" }}>
                Set Target
              </div>
            </div>
          )}
        </>
      )}

      {/* ══ HEATMAP TAB ═══════════════════════════════════ */}
      {activeTab === "heatmap" && (
        <>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontWeight:800, fontSize:14 }}>📅 Activity Heatmap</div>
              <div style={{ fontSize:11, color:C.sub }}>Last 90 days</div>
            </div>
            <div style={{ display:"flex", gap:0, marginBottom:4 }}>
              <div style={{ width:20 }}/>
              {weekLabels.map((d,i) => (
                <div key={i} style={{ flex:1, textAlign:"center", fontSize:8, color:C.muted, fontWeight:700 }}>{d}</div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display:"flex", gap:3, alignItems:"center" }}>
                  <div style={{ width:20 }}/>
                  {week.map((date, di) => {
                    if (!date) return <div key={di} style={{ flex:1, aspectRatio:1 }}/>;
                    const hasLogin   = loginDays.includes(date);
                    const hasWorkout = workoutDates[date] || 0;
                    const isToday    = date === today.toISOString().split("T")[0];
                    const bg = isToday ? C.lime : hasWorkout > 0 ? `${C.lime}99` : hasLogin ? `${C.lime}30` : C.border;
                    return <div key={di} title={date} style={{ flex:1, aspectRatio:1, borderRadius:3, background:bg, border:isToday?`1.5px solid ${C.lime}`:"none" }}/>;
                  })}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:12, marginTop:14, alignItems:"center", justifyContent:"flex-end" }}>
              {[
                { color:C.border,      label:"None"    },
                { color:`${C.lime}30`, label:"Login"   },
                { color:`${C.lime}99`, label:"Workout" },
                { color:C.lime,        label:"Today"   },
              ].map(l => (
                <div key={l.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:l.color }}/>
                  <span style={{ fontSize:9, color:C.muted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:14 }}>📆 Monthly Breakdown</div>
            {[0,1,2].map(mOff => {
              const d    = new Date();
              d.setMonth(d.getMonth() - mOff);
              const yr   = d.getFullYear(), mo = d.getMonth();
              const name = d.toLocaleString("default",{month:"long"});
              const days = new Date(yr, mo+1, 0).getDate();
              const loginCount = Array.from({length:days},(_,i) => {
                const ds = `${yr}-${String(mo+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
                return loginDays.includes(ds);
              }).filter(Boolean).length;
              const workoutCount = Object.keys(workoutDates).filter(k => k.startsWith(`${yr}-${String(mo+1).padStart(2,"0")}`)).length;
              return (
                <div key={mOff} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:mOff<2?`1px solid ${C.border}`:"none" }}>
                  <div style={{ fontWeight:700, fontSize:13 }}>{name}</div>
                  <div style={{ display:"flex", gap:12 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"DM Mono", fontSize:14, fontWeight:800, color:C.lime }}>{loginCount}</div>
                      <div style={{ fontSize:9, color:C.muted }}>logins</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"DM Mono", fontSize:14, fontWeight:800, color:C.orange }}>{workoutCount}</div>
                      <div style={{ fontSize:9, color:C.muted }}>workouts</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ══ BADGES TAB ════════════════════════════════════ */}
      {activeTab === "badges" && (
        <>
          <div style={{ background:`linear-gradient(135deg,${C.limeDim},${C.card})`, border:`1px solid ${C.lime}40`, borderRadius:16, padding:18, marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:800, fontSize:16 }}>🏅 {unlockedCount} / {allBadges.length} Unlocked</div>
              <div style={{ fontSize:12, color:C.sub, marginTop:4 }}>Keep going to unlock more!</div>
            </div>
            <div style={{ position:"relative", width:56, height:56 }}>
              <svg width="56" height="56" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="28" cy="28" r="22" fill="none" stroke={C.border} strokeWidth="5"/>
                <circle cx="28" cy="28" r="22" fill="none" stroke={C.lime} strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2*Math.PI*22}
                  strokeDashoffset={2*Math.PI*22*(1-unlockedCount/allBadges.length)}
                  style={{ transition:"stroke-dashoffset 1s ease" }}/>
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:C.lime, fontFamily:"DM Mono" }}>
                {Math.round((unlockedCount/allBadges.length)*100)}%
              </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {allBadges.map(badge => (
              <div key={badge.id}
                style={{ background:badge.unlocked?C.card:C.bg2, border:`1.5px solid ${badge.unlocked?C.lime+"40":C.border}`, borderRadius:14, padding:16, opacity:badge.unlocked?1:.5, position:"relative" }}>
                {badge.unlocked && (
                  <div style={{ position:"absolute", top:8, right:8, width:16, height:16, borderRadius:"50%", background:C.lime, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:"#000" }}>✓</div>
                )}
                <div style={{ fontSize:28, marginBottom:8 }}>{badge.icon}</div>
                <div style={{ fontWeight:800, fontSize:13, color:badge.unlocked?C.text:C.sub, marginBottom:4 }}>{badge.label}</div>
                <div style={{ fontSize:11, color:C.muted, lineHeight:1.4 }}>{badge.desc}</div>
                {!badge.unlocked && (
                  <div style={{ marginTop:8, fontSize:10, color:C.muted, background:C.border, padding:"3px 8px", borderRadius:20, display:"inline-block" }}>🔒 Locked</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};



























// ─── EXERCISE LIBRARY (real data) ────────────────────────
const LibraryPage = ({ t, lang }) => {
  const [exercises,setExercises]=useState([]); const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all"); const [search,setSearch]=useState("");
  const groups=["all","chest","back","legs","shoulders","arms","core"];
  const groupT={all:t.filterAll,chest:t.chest,back:t.back2,legs:t.legs,shoulders:t.shoulders,arms:t.arms,core:t.core};
  const muscleColors={chest:C.orange,back:C.blue,legs:C.pink,shoulders:C.lime,arms:C.orange,core:C.blue};

  useEffect(()=>{
    const params={lang,...(filter!=="all"&&{muscle:filter}),...(search&&{search})};
    workoutService.getExercises(params).then(d=>{setExercises(d.exercises||[]);setLoading(false);}).catch(()=>setLoading(false));
  },[filter,search,lang]);

  return (
    <div className="fade-in" style={{ padding:"20px 16px 100px" }}>
      <h1 style={{ fontFamily:"Bebas Neue", fontSize:34, letterSpacing:1, color:C.text, marginBottom:16 }}>{t.library}</h1>
      <Input value={search} onChange={setSearch} placeholder={t.search} icon="◈"/>
      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
        {groups.map(g=><div key={g} onClick={()=>setFilter(g)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${filter===g?C.lime:C.border}`, background:filter===g?C.limeDim:C.card, cursor:"pointer", whiteSpace:"nowrap", fontSize:12, fontWeight:700, color:filter===g?C.lime:C.sub, transition:"all .18s" }}>{groupT[g]}</div>)}
      </div>
      {loading ? <Spinner/> : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {exercises.map(ex=>(
            <Card key={ex.id} style={{ padding:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", color:muscleColors[ex.muscleGroup]||C.lime, background:(muscleColors[ex.muscleGroup]||C.lime)+"18", padding:"3px 8px", borderRadius:20 }}>{ex.muscleGroup}</span>
                <span style={{ fontFamily:"DM Mono", fontSize:10, color:C.muted }}>{ex.caloriesPerMin}/min</span>
              </div>
              <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:4 }}>{ex.displayName||ex.name}</div>
              <div style={{ color:C.muted, fontSize:11 }}>{ex.equipment}</div>
              <div style={{ display:"flex", gap:8, marginTop:10 }}>
                {[{l:t.sets,v:ex.defaultSets},{l:t.reps,v:ex.defaultReps}].map(s=>(
                  <div key={s.l} style={{ flex:1, background:C.bg2, borderRadius:8, padding:"6px 4px", textAlign:"center" }}>
                    <div style={{ fontFamily:"DM Mono", fontWeight:700, fontSize:13 }}>{s.v}</div>
                    <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── DIET PLAN PAGE ───────────────────────────────────────
const DietPage = ({ t, user }) => {
  const dietKey = user?.countryDiet || "mediterranean";
  const plan = DIET_PLANS[dietKey] || DIET_PLANS.mediterranean;
  const sections=[{label:t.breakfast,items:plan.breakfast,icon:"◈",color:C.orange,kcal:480},{label:t.lunch,items:plan.lunch,icon:"◉",color:C.lime,kcal:650},{label:t.dinner,items:plan.dinner,icon:"◆",color:C.blue,kcal:580},{label:t.snacks,items:plan.snacks,icon:"▲",color:C.pink,kcal:220}];
  return (
    <div className="fade-in" style={{ padding:"20px 16px 100px" }}>
      <h1 style={{ fontFamily:"Bebas Neue", fontSize:34, letterSpacing:1, color:C.text, marginBottom:4 }}>{t.dietTitle}</h1>
      <p style={{ color:C.sub, fontSize:13, marginBottom:16 }}>{t.dietSub}</p>
      {user?.countryName && <Card style={{ marginBottom:16, display:"flex", alignItems:"center", gap:12, background:C.limeDim, border:`1px solid ${C.lime}30` }}><span style={{ fontSize:28 }}>{COUNTRIES.find(c=>c.code===user.country)?.flag||"🌍"}</span><div><div style={{ fontWeight:700 }}>{user.countryName} Style</div><div style={{ fontSize:12, color:C.sub }}>For your {user.goal} goal</div></div></Card>}
      {sections.map(s=>(
        <Card key={s.label} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:s.color+"20", display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>{s.icon}</div>
              <span style={{ fontWeight:800, fontSize:15 }}>{s.label}</span>
            </div>
            <span style={{ fontFamily:"DM Mono", color:s.color, fontWeight:700 }}>{s.kcal} kcal</span>
          </div>
          {s.items.map(item=><div key={item} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:`1px solid ${C.border}` }}><div style={{ width:5, height:5, borderRadius:"50%", background:s.color }}/><span style={{ fontSize:13 }}>{item}</span></div>)}
        </Card>
      ))}
    </div>
  );
};

// ─── AI COACH PAGE (real backend) ────────────────────────
const AIPage = ({ t }) => {
  const [msgs,setMsgs]=useState([{role:"ai",text:t.aiGreet}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const [convId,setConvId]=useState(null); const endRef=useRef(null);
  const suggestions=["Create me a workout plan","What should I eat today?","Analyze my progress","Best exercises for weight loss"];

  const send = async (text) => {
    const q=text||input; if(!q.trim()) return;
    setMsgs(m=>[...m,{role:"user",text:q}]); setInput(""); setLoading(true);
    try {
      const d = await aiService.chat(q, convId);
      setMsgs(m=>[...m,{role:"ai",text:d.reply}]);
      if(d.conversationId) setConvId(d.conversationId);
    } catch {
      setMsgs(m=>[...m,{role:"ai",text:"I'm here to help! Ask me anything about your fitness journey."}]);
    }
    setLoading(false);
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", position:"fixed", top:50, left:0, right:0, bottom:65, maxWidth:430, margin:"0 auto" }}>
      <div style={{ padding:"16px 16px 10px", borderBottom:`1px solid ${C.border}` }}>
        <h1 style={{ fontFamily:"Bebas Neue", fontSize:28, letterSpacing:1 }}>AI <span style={{color:C.lime}}>COACH</span></h1>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:12 }}>
            {m.role==="ai"&&<div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.lime},#8FFF00)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#000", flexShrink:0, marginRight:8, marginTop:2 }}>F</div>}
            <div style={{ maxWidth:"78%", padding:"11px 14px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?C.lime:C.card, border:m.role==="user"?"none":`1px solid ${C.border}`, color:m.role==="user"?"#000":C.text, fontSize:14, lineHeight:1.55, fontWeight:m.role==="user"?600:400 }}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{ display:"flex", gap:8, alignItems:"center", padding:"0 0 8px 36px" }}>{[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.lime, animation:`pulse 1s ${i*.2}s infinite` }}/>)}</div>}
        <div ref={endRef}/>
      </div>
      {msgs.length<3&&<div style={{ display:"flex", gap:8, overflowX:"auto", padding:"0 16px 10px" }}>{suggestions.map(s=><div key={s} onClick={()=>send(s)} style={{ padding:"7px 13px", borderRadius:20, border:`1px solid ${C.border}`, background:C.card, whiteSpace:"nowrap", fontSize:12, color:C.sub, cursor:"pointer", flexShrink:0 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.lime;e.currentTarget.style.color=C.lime;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub;}}>{s}</div>)}</div>}
      <div style={{ padding:"10px 16px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t.chatPlaceholder} style={{ flex:1, padding:"12px 16px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:24, color:C.text, fontSize:14, fontFamily:"DM Sans" }} onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>
        <button onClick={()=>send()} style={{ width:44, height:44, borderRadius:"50%", background:C.lime, border:"none", cursor:"pointer", fontSize:18, color:"#000", fontWeight:900 }}>▶</button>
      </div>
    </div>
  );
};



// ─── PROFILE BUBBLE & MODAL ───────────────────────────────
// ─── PROFILE MODAL (replace existing ProfileModal in App.jsx) ─────────────────
const ProfileModal = ({ user, t, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [legalModal, setLegalModal] = useState(null); // "privacy" | "terms"

  // Edit Profile state
  const [name,   setName]   = useState(user?.name   || "");
  const [height, setHeight] = useState(String(user?.height || ""));
  const [weight, setWeight] = useState(String(user?.weight || ""));
  const [age,    setAge]    = useState(String(user?.age    || ""));
  const [unit,   setUnit]   = useState(user?.unit || "metric");
  const [goal,   setGoal]   = useState(user?.goal || "maintain");
  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState("");

  // App Settings state
  const [calGoal, setCalGoal] = useState(localStorage.getItem("fitoglobe_cal_goal") || "2200");
  const [notif,   setNotif]   = useState(localStorage.getItem("fitoglobe_notif") !== "false");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await userService.updateProfile({ name, height: parseFloat(height), weight: parseFloat(weight), age: parseInt(age), unit });
      showToast("Profile updated! ✅");
    } catch { showToast("Failed to save ❌"); }
    setSaving(false);
  };

  const saveSettings = () => {
  localStorage.setItem("fitoglobe_cal_goal", calGoal);
  localStorage.setItem("fitoglobe_notif", String(notif));
  window.dispatchEvent(new Event("fitoglobe_settings_updated")); // ← add this
  showToast("Settings saved! ✅");
};

  const tabs = [
    { id:"profile",  label:"Profile",  icon:"👤" },
    { id:"settings", label:"Settings", icon:"⚙️"  },
    { id:"legal",    label:"Legal",    icon:"📄"  },
    { id:"account",  label:"Account",  icon:"🔐"  },
  ];

  const goals = [
    { id:"gain",     label:"Gain Muscle",  color:C.orange },
    { id:"maintain", label:"Stay Fit",     color:C.blue   },
    { id:"lose",     label:"Lose Weight",  color:C.pink   },
  ];

  // Legal text
  const PRIVACY = `PRIVACY POLICY — FitoGlobe

Last updated: March 2026

1. DATA WE COLLECT
We collect your name, email, fitness metrics (height, weight, age), workout logs, nutrition logs, and progress data that you voluntarily provide.

2. HOW WE USE YOUR DATA
Your data is used solely to personalize your fitness experience, calculate recommendations, and power AI features within the app.

3. DATA STORAGE
All data is stored securely on our servers. We use industry-standard encryption for data in transit and at rest.

4. AI FEATURES
Food scan and chat features send anonymized data to third-party AI providers (Groq, Anthropic) for processing. No personally identifiable information is shared.

5. YOUR RIGHTS
You may request deletion of your account and all associated data at any time by contacting us.

6. CONTACT
globefito@gmail.com`;

  const TERMS = `TERMS OF USE — FitoGlobe

Last updated: March 2026

1. ACCEPTANCE
By using FitoGlobe, you agree to these terms. If you disagree, please discontinue use.

2. USE OF SERVICE
FitoGlobe is for personal fitness tracking only. You must be 13+ to use this app.

3. HEALTH DISCLAIMER
FitoGlobe is not a medical application. AI-generated nutrition and fitness advice is for informational purposes only. Always consult a qualified healthcare professional before making significant changes to your diet or exercise routine.

4. ACCOUNT RESPONSIBILITY
You are responsible for maintaining the security of your account credentials.

5. INTELLECTUAL PROPERTY
All content, design, and code within FitoGlobe is proprietary.

6. LIMITATION OF LIABILITY
FitoGlobe is not liable for any health outcomes resulting from use of this application.

7. CONTACT
globefito@gmail.com`;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#07070ECC", backdropFilter:"blur(8px)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} className="fade-up"
        style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:430, maxHeight:"90vh", display:"flex", flexDirection:"column", boxSizing:"border-box" }}>

        {/* Toast */}
        {toast && (
          <div style={{ position:"absolute", top:-44, left:"50%", transform:"translateX(-50%)", background:C.lime, color:"#000", padding:"8px 18px", borderRadius:10, fontWeight:700, fontSize:13, whiteSpace:"nowrap", zIndex:999 }}>{toast}</div>
        )}

        {/* Header */}
        <div style={{ padding:"20px 20px 0", flexShrink:0 }}>
          {/* Handle */}
          <div style={{ width:40, height:4, borderRadius:2, background:C.border, margin:"0 auto 16px" }}/>

          {/* Avatar + name */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:`linear-gradient(135deg,${C.lime},#8FFF00)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#000", fontFamily:"Bebas Neue", flexShrink:0 }}>
              {(user?.name||"A")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:16 }}>{user?.name||"Athlete"}</div>
              <div style={{ fontSize:12, color:C.sub }}>{user?.email||""}</div>
              <div style={{ fontSize:11, color:C.lime, fontWeight:600, marginTop:2 }}>v1.0.0 · FitoGlobe</div>
            </div>
            <div onClick={onClose} style={{ marginLeft:"auto", color:C.muted, cursor:"pointer", fontSize:20, padding:4 }}>✕</div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:12 }}>
            {tabs.map(tab => (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:20, border:`1.5px solid ${activeTab===tab.id?C.lime:C.border}`, background:activeTab===tab.id?C.limeDim:C.bg2, cursor:"pointer", whiteSpace:"nowrap", fontSize:11, fontWeight:700, color:activeTab===tab.id?C.lime:C.sub, flexShrink:0, transition:"all .15s" }}>
                <span>{tab.icon}</span>{tab.label}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY:"auto", padding:"0 20px 40px", flex:1 }}>

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div>
              {/* Name */}
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)}
                  style={{ width:"100%", padding:"12px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, fontFamily:"DM Sans", boxSizing:"border-box" }}
                  onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>

              {/* Unit toggle */}
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                {["metric","imperial"].map(u => (
                  <div key={u} onClick={() => setUnit(u)}
                    style={{ flex:1, padding:"9px", borderRadius:10, border:`1.5px solid ${unit===u?C.lime:C.border}`, background:unit===u?C.limeDim:C.bg2, textAlign:"center", cursor:"pointer", fontSize:12, fontWeight:700, color:unit===u?C.lime:C.sub }}>
                    {u==="metric"?"Metric (kg/cm)":"Imperial (lb/ft)"}
                  </div>
                ))}
              </div>

              {/* Height + Weight */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                {[
                  {label:`Height (${unit==="metric"?"cm":"ft"})`, val:height, set:setHeight},
                  {label:`Weight (${unit==="metric"?"kg":"lb"})`, val:weight, set:setWeight},
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>{f.label}</label>
                    <input type="number" value={f.val} onChange={e=>f.set(e.target.value)}
                      style={{ width:"100%", padding:"12px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:16, fontFamily:"DM Mono", fontWeight:700, textAlign:"center", boxSizing:"border-box" }}
                      onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>
                  </div>
                ))}
              </div>

              {/* Age */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>Age</label>
                <input type="number" value={age} onChange={e=>setAge(e.target.value)}
                  style={{ width:"100%", padding:"12px 14px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:16, fontFamily:"DM Mono", fontWeight:700, textAlign:"center", boxSizing:"border-box" }}
                  onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>

              {/* Goal */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:8 }}>Goal</label>
                <div style={{ display:"flex", gap:8 }}>
                  {goals.map(g => (
                    <div key={g.id} onClick={() => setGoal(g.id)}
                      style={{ flex:1, padding:"10px 4px", borderRadius:10, border:`1.5px solid ${goal===g.id?g.color:C.border}`, background:goal===g.id?g.color+"18":C.bg2, textAlign:"center", cursor:"pointer", fontSize:10, fontWeight:700, color:goal===g.id?g.color:C.sub, transition:"all .15s" }}>
                      {g.label}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveProfile} disabled={saving}
                style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:saving?"#555":C.lime, color:"#000", fontWeight:800, fontSize:14, cursor:saving?"not-allowed":"pointer" }}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === "settings" && (
            <div>
              {/* Calorie Goal */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>Daily Calorie Goal</label>
                <div style={{ display:"flex", alignItems:"center", background:C.bg2, borderRadius:10, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <button onClick={() => setCalGoal(v => String(Math.max(1000, parseInt(v)-100)))}
                    style={{ padding:"12px 16px", background:"transparent", border:"none", color:C.sub, fontSize:18, cursor:"pointer", fontWeight:700 }}>−</button>
                  <input type="number" value={calGoal} onChange={e=>setCalGoal(e.target.value)}
                    style={{ flex:1, background:"transparent", border:"none", color:C.lime, fontFamily:"DM Mono", fontWeight:800, fontSize:18, textAlign:"center", padding:"12px 0" }}/>
                  <button onClick={() => setCalGoal(v => String(Math.min(5000, parseInt(v)+100)))}
                    style={{ padding:"12px 16px", background:"transparent", border:"none", color:C.sub, fontSize:18, cursor:"pointer", fontWeight:700 }}>+</button>
                </div>
                <div style={{ fontSize:11, color:C.muted, marginTop:4, textAlign:"center" }}>Recommended: 1800–2500 kcal/day</div>
              </div>

              {/* Quick presets */}
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {[1500,1800,2200,2500,3000].map(v => (
                  <div key={v} onClick={() => setCalGoal(String(v))}
                    style={{ flex:1, padding:"7px 2px", borderRadius:8, border:`1px solid ${calGoal===String(v)?C.lime:C.border}`, background:calGoal===String(v)?C.limeDim:C.bg2, textAlign:"center", cursor:"pointer", fontSize:10, fontWeight:700, color:calGoal===String(v)?C.lime:C.muted }}>
                    {v}
                  </div>
                ))}
              </div>

              {/* Notifications toggle */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.bg2, borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>Notifications</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>Daily reminders & streaks</div>
                </div>
                <div onClick={() => setNotif(v => !v)}
                  style={{ width:44, height:24, borderRadius:12, background:notif?C.lime:C.border, position:"relative", cursor:"pointer", transition:"background .2s" }}>
                  <div style={{ position:"absolute", top:3, left:notif?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
                </div>
              </div>

              <button onClick={saveSettings}
                style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:C.lime, color:"#000", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                Save Settings
              </button>
            </div>
          )}

          {/* ── LEGAL TAB ── */}
          {activeTab === "legal" && (
            <div>
              {[
                { icon:"🔒", title:"Privacy Policy",  sub:"How we handle your data",        key:"privacy" },
                { icon:"📋", title:"Terms of Use",     sub:"Rules for using FitoGlobe",      key:"terms"   },
              ].map(item => (
                <div key={item.key} onClick={() => setLegalModal(item.key)}
                  style={{ display:"flex", alignItems:"center", gap:14, padding:"16px", background:C.bg2, borderRadius:12, marginBottom:10, cursor:"pointer", border:`1px solid ${C.border}` }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.lime}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <span style={{ fontSize:24 }}>{item.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{item.title}</div>
                    <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{item.sub}</div>
                  </div>
                  <span style={{ color:C.muted, fontSize:16 }}>›</span>
                </div>
              ))}

              {/* App info */}
              <div style={{ background:C.bg2, borderRadius:12, padding:16, marginTop:8 }}>
                {[
                  { label:"App Version",  val:"v1.0.0"      },
                  { label:"Build",        val:"2026.03"      },
                  { label:"Platform",     val:"Web / PWA"    },
                  { label:"Contact",      val:"globefito@gmail.com" },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:12, color:C.sub }}>{r.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Legal modal */}
              {legalModal && (
                <div onClick={() => setLegalModal(null)} style={{ position:"fixed", inset:0, background:"#07070EF0", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                  <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:430, maxHeight:"80vh", display:"flex", flexDirection:"column", border:`1px solid ${C.border}` }}>
                    <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
                      <div style={{ fontFamily:"Bebas Neue", fontSize:20, letterSpacing:1 }}>{legalModal==="privacy"?"Privacy Policy":"Terms of Use"}</div>
                      <div onClick={() => setLegalModal(null)} style={{ color:C.muted, cursor:"pointer", fontSize:18 }}>✕</div>
                    </div>
                    <div style={{ overflowY:"auto", padding:20 }}>
                      <pre style={{ fontSize:12, color:C.sub, lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"DM Sans" }}>
                        {legalModal==="privacy" ? PRIVACY : TERMS}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ACCOUNT TAB ── */}
          {activeTab === "account" && (
            <div>
              {/* Account info */}
              <div style={{ background:C.bg2, borderRadius:12, padding:16, marginBottom:16 }}>
                {[
                  { label:"Email",        val: user?.email || "—"                                    },
                  { label:"Country",      val: user?.countryName || "—"                              },
                  { label:"Member Since", val: user?.createdAt ? new Date(user.createdAt).toLocaleDateString([], {year:"numeric",month:"short"}) : "—" },
                  { label:"Goal",         val: user?.goal ? user.goal.charAt(0).toUpperCase()+user.goal.slice(1) : "—" },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:12, color:C.sub }}>{r.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Sign out */}
              <div onClick={onLogout}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer", borderRadius:12, color:"#FF5050", background:"#FF505010", border:"1px solid #FF505030", marginBottom:10 }}>
                <span style={{ fontSize:18 }}>🚪</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>Sign Out</div>
                  <div style={{ fontSize:11, color:"#FF505080", marginTop:1 }}>You can sign back in anytime</div>
                </div>
              </div>

              {/* Delete account */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer", borderRadius:12, color:C.muted, background:C.bg2, border:`1px solid ${C.border}` }}
                onClick={() => alert("Contact globefito@gmail.com to delete your account [JUST SEND 'delete' MAIL].")}>
                <span style={{ fontSize:18 }}>🗑️</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:C.sub }}>Delete Account</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>Permanently removes all your data</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};






//SCAN
const ScanPage = () => {
  const [image,    setImage]   = useState(null);
  const [preview,  setPreview] = useState(null);
  const [result,   setResult]  = useState(null);
  const [loading,  setLoading] = useState(false);
  const [toast,    setToast]   = useState("");
  const [logged,   setLogged]  = useState(false);
  const fileRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 2500); };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null); setLogged(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      const base64 = ev.target.result.split(",")[1];
      setImage({ base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true); setResult(null);
    try {
      const data = await aiService.scanFood(image.base64, image.mimeType);
      setResult(data);
    } catch { showToast("Scan failed, try again"); }
    setLoading(false);
  };

  const logMeal = async () => {
    if (!result) return;
    try {
      await nutritionService.addLog({
        mealType: "snack",
        foodName: result.foodName,
        calories: result.calories,
        proteinG: result.protein,
        carbsG:   result.carbs,
        fatG:     result.fat,
      });
      setLogged(true);
      showToast("Logged to nutrition! 🍽️");
    } catch { showToast("Failed to log"); }
  };

  const getBMIColor = (score) => score >= 70 ? C.lime : score >= 40 ? C.orange : "#FF4444";

  return (
    <div className="fade-in" style={{ padding:"0 16px 100px" }}>
      {toast && <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:C.lime, color:"#000", padding:"10px 20px", borderRadius:10, fontWeight:700, fontSize:13, zIndex:999 }}>{toast}</div>}

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{ display:"none" }}/>

      {/* Upload area */}
      <div onClick={() => { setResult(null); setLogged(false); fileRef.current?.click(); }}
        style={{ marginBottom:16, borderRadius:16, border:`2px dashed ${preview?C.lime:C.border}`, overflow:"hidden", cursor:"pointer", minHeight:220, display:"flex", alignItems:"center", justifyContent:"center", background:C.card, position:"relative", transition:"border-color .3s" }}>
        {preview
          ? <img src={preview} alt="food" style={{ width:"100%", maxHeight:280, objectFit:"cover" }}/>
          : <div style={{ textAlign:"center", padding:32 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📷</div>
              <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>Tap to take photo</div>
              <div style={{ fontSize:12, color:C.sub }}>or upload from gallery</div>
            </div>
        }
        {preview && (
          <div style={{ position:"absolute", bottom:10, right:10, background:"#000000AA", padding:"4px 10px", borderRadius:20, fontSize:11, color:"#fff", fontWeight:600 }}>📷 Change</div>
        )}
      </div>

      {/* Analyze button */}
      {preview && !result && (
        <button onClick={analyze} disabled={loading}
          style={{ width:"100%", padding:"14px", borderRadius:12, border:"none", background:loading?"#555":C.lime, color:"#000", fontWeight:800, fontSize:15, cursor:loading?"not-allowed":"pointer", marginBottom:16 }}>
          {loading ? "🔍 Analyzing..." : "🔍 Analyze Food"}
        </button>
      )}

      {/* Loading dots */}
      {loading && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24, textAlign:"center", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:12 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:C.lime, animation:`pulse 1s ${i*.2}s infinite` }}/>)}
          </div>
          <div style={{ color:C.sub, fontSize:13 }}>AI analyzing your food...</div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="fade-in">
          {/* Health score card */}
          <div style={{ background:C.card, border:`1px solid ${getBMIColor(result.healthScore)}40`, borderRadius:16, padding:20, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"Bebas Neue", fontSize:24, letterSpacing:1, color:C.text }}>{result.foodName}</div>
                <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{result.serving}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"DM Mono", fontSize:32, fontWeight:900, color:getBMIColor(result.healthScore) }}>{result.healthScore}</div>
                <div style={{ fontSize:10, fontWeight:700, color:getBMIColor(result.healthScore), textTransform:"uppercase" }}>{result.healthLabel}</div>
              </div>
            </div>
            {/* Score bar */}
            <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden", marginBottom:8 }}>
              <div style={{ height:"100%", width:`${result.healthScore}%`, background:`linear-gradient(90deg,#FF4444,${C.orange},${C.lime})`, borderRadius:4, transition:"width 1s ease" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:C.muted }}>
              <span>Unhealthy</span><span>Moderate</span><span>Healthy</span>
            </div>
          </div>

          {/* Macros */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:12 }}>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:14 }}>📊 Nutrition Facts</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
              {[
                { label:"Calories", val:result.calories, unit:"kcal", color:C.lime   },
                { label:"Protein",  val:result.protein,  unit:"g",    color:C.orange },
                { label:"Carbs",    val:result.carbs,    unit:"g",    color:C.blue   },
                { label:"Fat",      val:result.fat,      unit:"g",    color:C.pink   },
              ].map(m => (
                <div key={m.label} style={{ background:C.bg2, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                  <div style={{ fontFamily:"DM Mono", fontWeight:800, fontSize:16, color:m.color }}>{m.val}</div>
                  <div style={{ fontSize:9, color:C.muted, marginTop:2, textTransform:"uppercase" }}>{m.label}</div>
                  <div style={{ fontSize:9, color:C.muted }}>{m.unit}</div>
                </div>
              ))}
            </div>
            {result.fiber > 0 && <div style={{ marginTop:10, fontSize:12, color:C.sub }}>🌾 Fiber: <span style={{ color:C.lime, fontWeight:700 }}>{result.fiber}g</span></div>}
          </div>

          {/* Health tips */}
          {result.healthTips?.length > 0 && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:12 }}>
              <div style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>💡 Health Tips</div>
              {result.healthTips.map((tip, i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:C.limeDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.lime, fontWeight:900, flexShrink:0 }}>{i+1}</div>
                  <div style={{ fontSize:13, color:C.sub, lineHeight:1.5 }}>{tip}</div>
                </div>
              ))}
            </div>
          )}

          {/* Good for */}
          {result.goodFor?.length > 0 && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
              {result.goodFor.map((g,i) => (
                <span key={i} style={{ fontSize:11, fontWeight:700, color:C.lime, background:C.limeDim, padding:"4px 12px", borderRadius:20 }}>✓ {g}</span>
              ))}
            </div>
          )}

          {/* Log + Rescan buttons */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <button onClick={() => { setResult(null); setPreview(null); setImage(null); setLogged(false); fileRef.current?.click(); }}
              style={{ padding:"13px", borderRadius:12, border:`1px solid ${C.border}`, background:"transparent", color:C.text, fontWeight:700, fontSize:14, cursor:"pointer" }}>
              📷 Scan Again
            </button>
            <button onClick={logMeal} disabled={logged}
              style={{ padding:"13px", borderRadius:12, border:"none", background:logged?"#555":C.lime, color:"#000", fontWeight:800, fontSize:14, cursor:logged?"not-allowed":"pointer" }}>
              {logged ? "✓ Logged!" : "Log to Nutrition"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

//CHAT
const ChatPage = () => {
  const [msgs,    setMsgs]   = useState([{ role:"ai", text:"Hey! I'm Fito 👋 Ask me anything about fitness, diet, or nutrition!" }]);
  const [input,   setInput]  = useState("");
  const [loading, setLoading]= useState(false);
  const endRef = useRef(null);

  const suggestions = ["Best foods for muscle gain?", "How to lose belly fat?", "Is dal chawal healthy?", "Daily protein intake?"];

  const send = async (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setMsgs(m => [...m, { role:"user", text:q }]);
    setInput(""); setLoading(true);
    try {
      const data = await aiService.fitoChat(q);
      setMsgs(m => [...m, { role:"ai", text:data.reply }]);
    } catch {
      setMsgs(m => [...m, { role:"ai", text:"Sorry, I had trouble connecting. Try again!" }]);
    }
    setLoading(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
  };

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", position:"fixed", top:50, left:0, right:0, bottom:65, maxWidth:430, margin:"0 auto" }}>
      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:12 }}>
            {m.role==="ai" && (
              <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.lime},#8FFF00)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#000", flexShrink:0, marginRight:8, marginTop:2 }}>F</div>
            )}
            <div style={{ maxWidth:"78%", padding:"11px 14px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?C.lime:C.card, border:m.role==="user"?"none":`1px solid ${C.border}`, color:m.role==="user"?"#000":C.text, fontSize:14, lineHeight:1.55, fontWeight:m.role==="user"?600:400 }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:6, alignItems:"center", paddingLeft:38, marginBottom:8 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.lime, animation:`pulse 1s ${i*.2}s infinite` }}/>)}
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Suggestions */}
      {msgs.length < 3 && (
        <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"0 16px 10px" }}>
          {suggestions.map(s => (
            <div key={s} onClick={() => send(s)}
              style={{ padding:"7px 13px", borderRadius:20, border:`1px solid ${C.border}`, background:C.card, whiteSpace:"nowrap", fontSize:12, color:C.sub, cursor:"pointer", flexShrink:0 }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.lime;e.currentTarget.style.color=C.lime;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub;}}>
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding:"10px 16px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
          placeholder="Ask Fito anything..."
          style={{ flex:1, padding:"12px 16px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:24, color:C.text, fontSize:14, fontFamily:"DM Sans" }}
          onFocus={e=>e.target.style.borderColor=C.lime} onBlur={e=>e.target.style.borderColor=C.border}/>
        <button onClick={() => send()}
          style={{ width:44, height:44, borderRadius:"50%", background:C.lime, border:"none", cursor:"pointer", fontSize:18, color:"#000", fontWeight:900 }}>▶</button>
      </div>
    </div>
  );
};


// ─── MAIN APP ─────────────────────────────────────────────
// ─── MAIN APP ─────────────────────────────────────────────
export default function FitoGlobe() {
  const stored = authService.getStoredUser();
  const token  = authService.getToken();

  const getInitialScreen = () => {
    if (!token) return "language";
    if (stored && !stored.country) return "onboard";
    if (stored && stored.country) return "app";
    return "language";
  };

  const [screen,   setScreen]   = useState(getInitialScreen);
  const [lang,     setLang]     = useState(stored?.language || "en");
  const [user,     setUser]     = useState(stored);
  const [page,     setPage]     = useState("dashboard");
  const [radial,   setRadial]   = useState(false);
  const [profOpen, setProfOpen] = useState(false);

  const t = T[lang] || T.en;

  // ✅ Google OAuth callback handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cbToken = params.get("token");
    const onboarding = params.get("onboarding");
    if (cbToken) {
      localStorage.setItem("fitoglobe_token", cbToken);
      window.history.replaceState({}, "", "/");
      authService.getMe().then(u => {
        if (u) {
          setUser(u);
          setScreen(onboarding === "true" ? "onboard" : "app");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (screen === "app") {
      authService.getMe().then(u => { if(u) setUser(u); }).catch(()=>{});
    }
  }, [screen]);

  const handleLang = (code) => { setLang(code); setScreen("auth"); };
  trackLoginStreak();

  const handleAuth = async () => {
    const fresh = await authService.getMe();
    setUser(fresh);
    if (fresh && !fresh.country) setScreen("onboard");
    else setScreen("app");
  };

  const handleOnboard = async () => {
    const u = authService.getStoredUser();
    setUser(u); setScreen("app");
  };

  const handleLogout = () => {
    authService.logout(); setUser(null); setScreen("language"); setProfOpen(false); setPage("dashboard");
  };

  const pages = {
    dashboard: <DashboardPage t={t} user={user}/>,
    workouts:  <WorkoutPage t={t}/>,
    nutrition: <NutritionPage t={t}/>,
    progress:  <ProgressPage t={t} user={user}/>,
    library:   <LibraryPage t={t} lang={lang}/>,
    diet:      <DietPage t={t} user={user}/>,
    ai:        <AIPage t={t}/>,
    scan:      <ScanPage/>,
    chat:      <ChatPage/>,
  };

  const stickyPages = {
    diet: t.diet,
    ai:   t.ai,
    scan: "📷 Food Scan",
    chat: "💬 Fito Chat",
  };

  return (
    <div style={{ background:"#030308", minHeight:"100vh", display:"flex", justifyContent:"center" }}>
      <div style={{ fontFamily:"DM Sans, sans-serif", color:C.text, background:C.bg, minHeight:"100vh", width:"100%", maxWidth:430, position:"relative", overflow:"hidden" }}>
        <GlobalStyles/>
        {screen==="language" && <LanguageScreen onSelect={handleLang}/>}
        {screen==="auth"     && <AuthScreen t={t} lang={lang} onAuth={handleAuth}/>}
        {screen==="onboard"  && <OnboardingScreen t={t} lang={lang} onDone={handleOnboard}/>}
        {screen==="app" && (
          <>
            {stickyPages[page] && (
              <div style={{ position:"sticky", top:0, background:C.bg, borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, zIndex:30 }}>
                <div onClick={()=>setPage("dashboard")} style={{ color:C.sub, cursor:"pointer", fontSize:18 }}>←</div>
                <div style={{ fontFamily:"Bebas Neue", fontSize:22, letterSpacing:1 }}>{stickyPages[page]}</div>
              </div>
            )}
            <div style={{ overflowY:"auto", height:"100vh" }}>{pages[page]||pages.dashboard}</div>
            <BottomNav page={page} setPage={setPage} t={t} onPlus={()=>setRadial(true)}/>
            <RadialMenu open={radial} onClose={()=>setRadial(false)} t={t} setPage={setPage} onProfile={()=>setProfOpen(true)}/>
            {profOpen&&<ProfileModal user={user} t={t} onClose={()=>setProfOpen(false)} onLogout={handleLogout}/>}
          </>
        )}
      </div>
    </div>
  );
}