"use client";

import { useState, useEffect } from "react";
import { getNumerologyFortune } from "./fortuneUtils";
import Accordion from "./components/Accordion";

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

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [fortuneResults, setFortuneResults] = useState<NumerologyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      // 保存されたメールアドレスがあれば、自動的に占いを実行
      const fetchFortuneOnLoad = async () => {
        setIsLoading(true);
        try {
          const results = await getNumerologyFortune(savedEmail);
          setFortuneResults(results);
          setIsResultVisible(true);
        } catch (err) {
          console.error("Failed to fetch fortune on load:", err);
          setError("占いの取得に失敗しました。時間をおいて再度お試しください。");
        } finally {
          setIsLoading(false);
        }
      };
      fetchFortuneOnLoad();
    }
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("メールアドレスを入力してください。");
      return;
    }
    if (!validateEmail(email)) {
      setError("メールアドレスの形をもう一度、確かめてみてくださいね");
      return;
    }
    setError("");
    localStorage.setItem("userEmail", email);
    setIsLoading(true);
    try {
      const results = await getNumerologyFortune(email);
      setFortuneResults(results);
      setIsResultVisible(true);
    } catch (err) {
      console.error("Failed to fetch fortune:", err);
      setError("占いの取得に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsResultVisible(false);
    setFortuneResults(null);
    setError("");
  };

  const handleShare = () => {
    if (!fortuneResults) return;

    const text = `今日の私の運勢は【総合運: ${fortuneResults.sogo.mark}, 内面: ${fortuneResults.naimen.mark}, 環境: ${fortuneResults.kankyo.mark}, 人間関係: ${fortuneResults.ningen.mark}】でした！ #数秘術占い ${window.location.origin}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-100 to-pink-100 text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        {!isResultVisible ? (
          <>
            <h1 className="text-4xl font-bold mb-4 text-purple-700">今日の運勢</h1>
            <p className="mb-8 text-lg text-gray-600">あなたのメールアドレスから、今日の運勢を占います</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                disabled={isLoading}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl"
                disabled={isLoading}
              >
                {isLoading ? "占いを計算中..." : "占う"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-purple-700">今日のあなたの運勢</h2>
            {fortuneResults ? (
              <div className="space-y-4">
                <Accordion title={`あなたの内面: ${fortuneResults.naimen.mark}`}>
                  <p className="text-left whitespace-pre-wrap">{fortuneResults.naimen.text}</p>
                </Accordion>
                <Accordion title={`あなたの環境: ${fortuneResults.kankyo.mark}`}>
                  <p className="text-left whitespace-pre-wrap">{fortuneResults.kankyo.text}</p>
                </Accordion>
                <Accordion title={`あなたの人間関係: ${fortuneResults.ningen.mark}`}>
                  <p className="text-left whitespace-pre-wrap">{fortuneResults.ningen.text}</p>
                </Accordion>
                <Accordion title={`総合運: ${fortuneResults.sogo.mark}`}>
                  <p className="text-left whitespace-pre-wrap">{fortuneResults.sogo.text}</p>
                </Accordion>
              </div>
            ) : (
              <p>占い結果を読み込み中...</p>
            )}
            <div className="mt-8 flex flex-col space-y-4">
              <button
                onClick={handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-lg"
              >
                別のアドレスで占う
              </button>
              <button
                onClick={handleShare}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-lg"
              >
                Twitterでシェア
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
