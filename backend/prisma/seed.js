const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const exercises = [
  // CHEST
  { name:"Bench Press",      nameEs:"Press de banca",    nameJa:"ベンチプレス",    nameKo:"벤치프레스",    muscleGroup:"chest",     equipment:"Barbell",   difficulty:"intermediate", defaultSets:4, defaultReps:10, caloriesPerMin:8 },
  { name:"Incline Dumbbell", nameEs:"Press inclinado",   nameJa:"インクラインダンベル", nameKo:"인클라인 덤벨",  muscleGroup:"chest",     equipment:"Dumbbell",  difficulty:"intermediate", defaultSets:3, defaultReps:12, caloriesPerMin:7 },
  { name:"Push-ups",         nameEs:"Flexiones",         nameJa:"腕立て伏せ",      nameKo:"팔굽혀펴기",    muscleGroup:"chest",     equipment:"Bodyweight",difficulty:"beginner",     defaultSets:3, defaultReps:15, caloriesPerMin:6 },
  { name:"Cable Fly",        nameEs:"Cable abierto",     nameJa:"ケーブルフライ",  nameKo:"케이블 플라이",  muscleGroup:"chest",     equipment:"Cable",     difficulty:"intermediate", defaultSets:3, defaultReps:15, caloriesPerMin:6 },
  // BACK
  { name:"Pull-ups",         nameEs:"Dominadas",         nameJa:"懸垂",           nameKo:"턱걸이",        muscleGroup:"back",      equipment:"Bodyweight",difficulty:"intermediate", defaultSets:4, defaultReps:8,  caloriesPerMin:7 },
  { name:"Deadlift",         nameEs:"Peso muerto",       nameJa:"デッドリフト",   nameKo:"데드리프트",     muscleGroup:"back",      equipment:"Barbell",   difficulty:"advanced",     defaultSets:3, defaultReps:6,  caloriesPerMin:10 },
  { name:"Barbell Row",      nameEs:"Remo con barra",    nameJa:"バーベルロウ",   nameKo:"바벨 로우",      muscleGroup:"back",      equipment:"Barbell",   difficulty:"intermediate", defaultSets:4, defaultReps:10, caloriesPerMin:8 },
  { name:"Lat Pulldown",     nameEs:"Jalón al pecho",    nameJa:"ラットプルダウン",nameKo:"랫 풀다운",     muscleGroup:"back",      equipment:"Machine",   difficulty:"beginner",     defaultSets:4, defaultReps:12, caloriesPerMin:7 },
  // LEGS
  { name:"Squat",            nameEs:"Sentadilla",        nameJa:"スクワット",     nameKo:"스쿼트",        muscleGroup:"legs",      equipment:"Barbell",   difficulty:"intermediate", defaultSets:4, defaultReps:8,  caloriesPerMin:10 },
  { name:"Leg Press",        nameEs:"Prensa de piernas", nameJa:"レッグプレス",   nameKo:"레그 프레스",    muscleGroup:"legs",      equipment:"Machine",   difficulty:"beginner",     defaultSets:4, defaultReps:12, caloriesPerMin:8 },
  { name:"Romanian Deadlift",nameEs:"Peso muerto rumano",nameJa:"ルーマニアンデッドリフト",nameKo:"루마니안 데드리프트",muscleGroup:"legs",equipment:"Barbell",difficulty:"intermediate",defaultSets:3,defaultReps:10,caloriesPerMin:9},
  { name:"Leg Curl",         nameEs:"Curl de pierna",    nameJa:"レッグカール",   nameKo:"레그 컬",       muscleGroup:"legs",      equipment:"Machine",   difficulty:"beginner",     defaultSets:3, defaultReps:12, caloriesPerMin:6 },
  // SHOULDERS
  { name:"Overhead Press",   nameEs:"Press militar",     nameJa:"オーバーヘッドプレス",nameKo:"오버헤드 프레스",muscleGroup:"shoulders",equipment:"Barbell",difficulty:"intermediate",defaultSets:4,defaultReps:8,caloriesPerMin:8},
  { name:"Lateral Raise",    nameEs:"Elevación lateral", nameJa:"サイドレイズ",   nameKo:"레터럴 레이즈",  muscleGroup:"shoulders", equipment:"Dumbbell",  difficulty:"beginner",     defaultSets:3, defaultReps:15, caloriesPerMin:5 },
  { name:"Arnold Press",     nameEs:"Press Arnold",      nameJa:"アーノルドプレス",nameKo:"아놀드 프레스",  muscleGroup:"shoulders", equipment:"Dumbbell",  difficulty:"intermediate", defaultSets:3, defaultReps:12, caloriesPerMin:7 },
  // ARMS
  { name:"Bicep Curl",       nameEs:"Curl de bíceps",    nameJa:"バイセップカール",nameKo:"바이셉 컬",      muscleGroup:"arms",      equipment:"Dumbbell",  difficulty:"beginner",     defaultSets:3, defaultReps:12, caloriesPerMin:5 },
  { name:"Tricep Dip",       nameEs:"Fondos de tríceps", nameJa:"トライセップディップ",nameKo:"트라이셉 딥",muscleGroup:"arms",      equipment:"Bodyweight",difficulty:"intermediate", defaultSets:3, defaultReps:12, caloriesPerMin:5 },
  { name:"Hammer Curl",      nameEs:"Curl martillo",     nameJa:"ハンマーカール", nameKo:"해머 컬",        muscleGroup:"arms",      equipment:"Dumbbell",  difficulty:"beginner",     defaultSets:3, defaultReps:12, caloriesPerMin:5 },
  // CORE
  { name:"Plank",            nameEs:"Plancha",           nameJa:"プランク",       nameKo:"플랭크",        muscleGroup:"core",      equipment:"Bodyweight",difficulty:"beginner",     defaultSets:3, defaultReps:60, caloriesPerMin:4 },
  { name:"Russian Twist",    nameEs:"Giro ruso",         nameJa:"ロシアンツイスト",nameKo:"러시안 트위스트",muscleGroup:"core",     equipment:"Bodyweight",difficulty:"beginner",     defaultSets:3, defaultReps:20, caloriesPerMin:5 },
  { name:"Cable Crunch",     nameEs:"Crunch en polea",   nameJa:"ケーブルクランチ",nameKo:"케이블 크런치", muscleGroup:"core",      equipment:"Cable",     difficulty:"intermediate", defaultSets:3, defaultReps:15, caloriesPerMin:5 },
];

async function main() {
  console.log("Seeding database...");

  // Clear in correct order — child tables first, then parent
  await prisma.sessionExercise.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.exercise.deleteMany();

  // Seed exercises
  for (const ex of exercises) {
    await prisma.exercise.create({ data: ex });
  }

  console.log(`Seeded ${exercises.length} exercises`);
  console.log("Database seeded successfully!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());