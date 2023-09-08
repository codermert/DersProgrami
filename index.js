const XLSX = require("xlsx");

const teachers = [
  { name: "Büşra Özkurt", subject: "Matematik" },
  { name: "Elif Ayşe Atalan", subject: "Edebiyat" },
  { name: "Meliha Çelebi", subject: "Tarih" },
  { name: "Burhan Kaplan", subject: "İngilizce" },
  { name: "Vedat Tekin", subject: "Fizik" },
  { name: "Hülya Kaya", subject: "Matematik" },
  { name: "Nupelda Ergin", subject: "Gıda" },
  { name: "Güneş Acet", subject: "Kimya" },
  { name: "Elif Akay", subject: "Matematik" },
  { name: "Sidar Mızrak", subject: "Beden Eğitim" },
  { name: "Ramazan Akmeşe", subject: "Beden Eğitim" },
  { name: "Mustafa Yazıcı", subject: "Coğrafya" },
  { name: "Sena Kayar", subject: "Matematik" },
  { name: "Elif Bingöl", subject: "Biyoloji" },
  { name: "Lütfullah Arık", subject: "Din" },
  { name: "Berfin Eken", subject: "Tarih" },
  { name: "Sibel Gürsel", subject: "Biyoloji" },
  { name: "Mürvet Kaçar", subject: "Elektrik" },
  { name: "Arzu Yıldız", subject: "Elektrik" },
  { name: "Seda Kurtoğlu", subject: "Fizik" },
  { name: "Simge Yılmaz", subject: "İngilizce" },
  { name: "Hevidar Yazıcı", subject: "İngilizce" },
  { name: "Elif Derse", subject: "Edebiyat" },
  { name: "Emine Akbudak", subject: "Gıda" },
  { name: "Kader Şenyiğit", subject: "Edebiyat" },
  { name: "Tuğba Kürem", subject: "Felsefe" },
  { name: "Metin Altın", subject: "Edebiyat" },
  { name: "Mehmet Balca", subject: "Din" },
  { name: "Dilan Boz", subject: "Matematik" },
  { name: "Fatma Aslanlı", subject: "Matematik" },
  { name: "Mustafa Yetişten", subject: "Coğrafya" },
  { name: "Sultan", subject: "Edebiyat" },
  { name: "Gamze", subject: "Kimya" }
];

// Sınıfların listesi
const classes = [
  { name: "9A", level: 9 },
  { name: "9B", level: 9 },
  { name: "9C", level: 9 },
  { name: "9D", level: 9 },
  { name: "9E", level: 9 },
  { name: "9F", level: 9 },
  { name: "10A", level: 10 },
  { name: "10B", level: 10 },
  { name: "10C", level: 10 },
  { name: "10D", level: 10 },
  { name: "10E", level: 10 },
  { name: "11A", level: 11 },
  { name: "11B", level: 11 },
  { name: "11C", level: 11 },
  { name: "11D", level: 11 },
  { name: "11E", level: 11 },
  { name: "11F", level: 11 },
  { name: "11G", level: 11 },
  { name: "11H", level: 11 },
  { name: "11K", level: 11 },
  { name: "11L", level: 11 },
  { name: "11M", level: 11 },
  { name: "11N", level: 11 },
  { name: "11O", level: 11 },
  { name: "11P", level: 11 },
  { name: "12A", level: 12 },
  { name: "12B", level: 12 }
];


// Haftanın günlerini ve saatlerini tanımlayalım
const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
const hoursOfDay = ["1. Ders", "2. Ders", "3. Ders", "4. Ders", "5. Ders", "6. Ders", "7. Ders"];

const weeklySchedule = {};
const teacherHours = {};
let lastSubjectWasPhilosophyOrReligion = false;

function createSchedule() {
  for (const classInfo of classes) {
    const className = classInfo.name;

    for (const day of daysOfWeek) {
      if (!weeklySchedule[className]) {
        weeklySchedule[className] = {};
      }

      for (const hour of hoursOfDay) {
        if (!weeklySchedule[className][day]) {
          weeklySchedule[className][day] = {};
        }

        if (
          (hour === "Felsefe" || hour === "Din") &&
          lastSubjectWasPhilosophyOrReligion
        ) {
          lastSubjectWasPhilosophyOrReligion = false;
          continue;
        } else {
          lastSubjectWasPhilosophyOrReligion =
            hour === "Felsefe" || hour === "Din";
        }

        let randomTeacher;
        do {
          randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
        } while (
          teacherHours[randomTeacher.name] >= 35 ||
          (randomTeacher.subject !== classInfo.subject &&
            (hour === "Felsefe" || hour === "Din")) ||
          (hour !== "1. Ders" && weeklySchedule[className][day]["1. Ders"] &&
            weeklySchedule[className][day]["1. Ders"].teacher === randomTeacher.name)
        );

        weeklySchedule[className][day][hour] = {
          teacher: randomTeacher.name,
          subject: randomTeacher.subject,
        };

        if (!teacherHours[randomTeacher.name]) {
          teacherHours[randomTeacher.name] = 0;
        }
        teacherHours[randomTeacher.name]++;
      }
    }
  }
}

createSchedule();

// Verileri bir Excel dosyasına kaydetme
const workbook = XLSX.utils.book_new();

for (const className in weeklySchedule) {
  const classSchedule = weeklySchedule[className];
  const jsonArray = [];

  for (const day in classSchedule) {
    for (const hour in classSchedule[day]) {
      jsonArray.push({
        Sınıf: className,
        Gün: day,
        Saat: hour,
        Öğretmen: classSchedule[day][hour].teacher,
        Ders: classSchedule[day][hour].subject,
      });
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(jsonArray);
  XLSX.utils.book_append_sheet(workbook, worksheet, className);
}

XLSX.writeFile(workbook, "ders_programi.xlsx", { bookType: "xlsx" });
console.log("Ders programı Excel dosyası oluşturuldu: ders_programi.xlsx");
