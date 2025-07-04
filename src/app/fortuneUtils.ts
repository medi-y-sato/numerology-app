

interface NumerologyResult {
  text: string;
  mark: string;
}

interface NumerologyResponse {
  naimen: NumerologyResult;
  kankyo: NumerologyResult;
  ningen: NumerologyResult;
  sogo: NumerologyResult;
}

// 数値変換ルール
const charToNumber = (char: string): number => {
  const code = char.toLowerCase().charCodeAt(0);
  if (code >= 97 && code <= 122) { // a-z
    return (code - 96 - 1) % 9 + 1; // 1-9に変換
  } else if (code >= 48 && code <= 57) { // 0-9
    return parseInt(char);
  }
  return 0; // 記号は無視
};

// 数値を1桁またはマスターナンバー(11, 22)に還元
const reduceNumber = (num: number): number => {
  if (num === 11 || num === 22) {
    return num;
  }
  while (num > 9) {
    num = String(num).split("").reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
};

// 天気マークの決定
const getWeatherMark = (num: number): string => {
  switch (num) {
    case 1: case 8: case 11: case 22:
      return "☀️";
    case 3: case 5: case 6:
      return "🌸"; // 花のマークに変更
    case 2: case 4: case 7: case 9:
      return "☁️";
    default:
      return "";
  }
};

// 占い結果のデータをインポート
import numerologyFortunes from "../../public/data/numerology_fortunes.json";

export async function getNumerologyFortune(email: string): Promise<NumerologyResponse> {
  const lowerCaseEmail = email.toLowerCase();
  const [localPart, domainPart] = lowerCaseEmail.split("@");

  // ベースナンバー計算
  const calculateBaseNumber = (str: string): number => {
    let sum = 0;
    for (const char of str) {
      sum += charToNumber(char);
    }
    return reduceNumber(sum);
  };

  const naimenBaseNumber = calculateBaseNumber(localPart); // 内面: メールアドレスのローカル部
  const kankyoBaseNumber = calculateBaseNumber(domainPart.split(".")[0]); // 環境: ドメイン名（トップレベルドメイン除く）
  const ningenBaseNumber = calculateBaseNumber(lowerCaseEmail.replace(/[^a-z0-9]/g, "")); // 人間関係: メールアドレス全体（記号除く）

  // 今日の数字計算
  const today = new Date();
  const todayNumber = reduceNumber(today.getDate() + today.getMonth() + 1 + today.getFullYear());

  // 運勢ナンバー計算
  const calculateFortuneNumber = (baseNum: number): number => {
    return reduceNumber(baseNum + todayNumber);
  };

  const naimenFortuneNumber = calculateFortuneNumber(naimenBaseNumber);
  const kankyoFortuneNumber = calculateFortuneNumber(kankyoBaseNumber);
  const ningenFortuneNumber = calculateFortuneNumber(ningenBaseNumber);

  // 天気マーク
  const naimenMark = getWeatherMark(naimenFortuneNumber);
  const kankyoMark = getWeatherMark(kankyoFortuneNumber);
  const ningenMark = getWeatherMark(ningenFortuneNumber);

  // JSONデータから占い結果を取得
  const naimenKey = `naimen_${naimenFortuneNumber}` as keyof typeof numerologyFortunes;
  const kankyoKey = `kankyo_${kankyoFortuneNumber}` as keyof typeof numerologyFortunes;
  const ningenKey = `ningen_${ningenFortuneNumber}` as keyof typeof numerologyFortunes;

  const naimenFortune = numerologyFortunes[naimenKey] || { text: "", mark: naimenMark };
  const kankyoFortune = numerologyFortunes[kankyoKey] || { text: "", mark: kankyoMark };
  const ningenFortune = numerologyFortunes[ningenKey] || { text: "", mark: ningenMark };

  const sogoFortuneNumber = reduceNumber(naimenFortuneNumber + kankyoFortuneNumber + ningenFortuneNumber);
  const sogoMark = getWeatherMark(sogoFortuneNumber);
  const sogoKey = `sogo_${sogoFortuneNumber}` as keyof typeof numerologyFortunes;
  const sogoFortune = numerologyFortunes[sogoKey] || { text: "", mark: sogoMark };

  return {
    naimen: { text: naimenFortune.text, mark: naimenFortune.mark },
    kankyo: { text: kankyoFortune.text, mark: kankyoFortune.mark },
    ningen: { text: ningenFortune.text, mark: ningenFortune.mark },
    sogo: { text: sogoFortune.text, mark: sogoFortune.mark },
  };
}

