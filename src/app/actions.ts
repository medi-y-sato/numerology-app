"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

interface NumerologyResult {
  text: string;
  mark: string;
}

interface NumerologyResponse {
  naimen: NumerologyResult;
  kankyo: NumerologyResult;
  ningen: NumerologyResult;
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

// 占い結果のキーワード
const keywordsMap: { [key: number]: string } = {
  1: "始まり、リーダーシップ、独立、創造性",
  2: "協力、バランス、感受性、平和",
  3: "表現、喜び、社交性、創造性",
  4: "安定、努力、秩序、実践",
  5: "変化、自由、冒険、適応性",
  6: "奉仕、責任、調和、家族",
  7: "探求、分析、精神性、内省",
  8: "豊かさ、権力、達成、組織",
  9: "完了、人道主義、知恵、共感",
  11: "直感、啓示、理想主義、インスピレーション",
  22: "具現化、大いなる建設、普遍的な愛、実践的な理想主義",
};

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

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    // GEMINI_API_KEYがない場合のフォールバック
    const generateFallbackText = (fortuneNum: number): string => {
      const keyword = keywordsMap[fortuneNum] || "";
      return `占いの対象: ${fortuneNum}, キーワード: ${keyword}`;
    };

    return {
      naimen: { text: generateFallbackText(naimenFortuneNumber), mark: naimenMark },
      kankyo: { text: generateFallbackText(kankyoFortuneNumber), mark: kankyoMark },
      ningen: { text: generateFallbackText(ningenFortuneNumber), mark: ningenMark },
    };
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const generateFortuneText = async (target: string, fortuneNum: number, mark: string): Promise<string> => {
    const prompt = `あなたは、プロの占い師であり、言葉選びが美しい詩人です。数秘術の深い知識を持っています。
これから、Webアプリで表示する占いの文章を作成していただきます。このアプリのターゲットは20代の女性で、コンセプトは「一日の始まりに、少しだけ気分がアガるような、優しくポジティブなメッセージを届けること」です。決して利用者を不安にさせたり、ネガティブな気持ちにさせたりする表現は使わないでください。

以下の情報をもとに、占いの文章を生成してください。
* 占いの対象: ${target}
* 導き出された運勢ナンバー: ${fortuneNum}
* ナンバーが持つキーワード: ${keywordsMap[fortuneNum] || ""}
* 今日の天気マーク: ${mark}

上記の情報を元に、占いの結果を、自然で、詩的で、心に響く文章で生成してください。文章量は150字程度で、丁寧で優しい「です・ます調」でお願いします。キーワードをすべて文章に含める必要はありませんが、それらのニュアンスを汲み取ってください。また、天気マークの持つ雰囲気（例: ☀️ならパワフルに、🌸なら穏やかに、☁️なら落ち着いた）も文章に反映させてください。
占いの結果以外の、余計な前置きや後書き（例：「占いの結果をお伝えします」など）は含めないでください。断定的な表現は避け、「～かもしれません」「～となりそうです」「～を意識してみては？」のような、優しく示唆する表現を心がけてください。`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  return {
    naimen: { text: naimenText, mark: naimenMark },
    kankyo: { text: kankyoText, mark: kankyoMark },
    ningen: { text: ningenText, mark: ningenMark },
  };
}

