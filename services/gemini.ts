import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchQuestions = async (count: number = 10): Promise<Question[]> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    あなたは日本の原付免許（原動機付自転車免許）の学科試験の鬼教官です。
    生徒を合格させるために、特に間違いやすい「ひっかけ問題」や「重要ルール」を中心に出題してください。
    
    以下のトピックを重点的に含めてください：
    1. 追い越し禁止場所と追い抜き
    2. 徐行すべき場所 vs 一時停止すべき場所
    3. 二段階右折（フックターン）のルールと適用場所
    4. 駐停車禁止場所
    5. 緊急自動車への対応
    
    問題文は日本語で、明確かつ簡潔に作成してください。
    各問題には、正誤（○か×か）と、なぜそうなるのかの分かりやすい解説を付けてください。
    解説は「〜だから、○です。」「〜は間違いです。正しくは〜です。」のように初学者にも優しく教えてください。
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "The quiz question text in Japanese.",
              },
              isCorrect: {
                type: Type.BOOLEAN,
                description: "True if the answer is O (Circle), False if the answer is X (Cross).",
              },
              explanation: {
                type: Type.STRING,
                description: "Detailed explanation of the answer in Japanese.",
              },
            },
            required: ["text", "isCorrect", "explanation"],
          },
        },
      },
      contents: `原付免許の学科試験の模擬問題をランダムに${count}問作成してください。`,
    });

    const data = JSON.parse(response.text || "[]");
    
    // Assign IDs
    return data.map((item: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      text: item.text,
      isCorrect: item.isCorrect,
      explanation: item.explanation
    }));

  } catch (error) {
    console.error("Failed to fetch questions:", error);
    // Fallback questions in case of API error
    return [
      {
        id: "fallback-1",
        text: "原動機付自転車が二段階右折をしなければならない交差点では、右折の合図を出して交差点の側端に沿って徐行する。",
        isCorrect: true,
        explanation: "正解です。二段階右折が必要な場所では、交差点の側端に沿って徐行し、直進した先の地点で向きを変えます。"
      },
      {
        id: "fallback-2",
        text: "信号機のある交差点で、信号が黄色の灯火に変わったとき、停止位置に近づいていたが安全に停止できない場合は、そのまま進むことができる。",
        isCorrect: true,
        explanation: "正解です。急ブレーキになり危険な場合は、そのまま通過することができます。"
      },
      {
        id: "fallback-3",
        text: "原動機付自転車の法定速度は時速60キロメートルである。",
        isCorrect: false,
        explanation: "間違いです。原動機付自転車の法定最高速度は時速30キロメートルです。"
      }
    ];
  }
};

export const fetchEncouragement = async (score: number, total: number): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  try {
    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction: "あなたは熱血かつ優しい自動車学校の教官です。生徒のテスト結果に基づいて、短いメッセージ（100文字以内）を送ってください。",
      },
      contents: `テスト結果は ${total}問中 ${score}問正解でした。この結果に対するフィードバックと応援メッセージを日本語で作成してください。`,
    });
    return response.text || "お疲れ様でした！復習して完璧を目指しましょう！";
  } catch (error) {
    console.error("Failed to fetch encouragement:", error);
    return "お疲れ様でした！結果を確認して、また挑戦してくださいね！";
  }
};