import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../constants/endpoint";

type QuestionResponse = {
    isSuccess: boolean;
    result: {
        id: number;
        translations: Array<{ question: string; languageCode: string }>;
        choices: Array<{
            id: number;
            translations: Array<{ choiceText: string; languageCode: string }>;
        }>;
    };
};

type SubmissionRequest = {
    answers: Array<{
        questionID: number;
        choiceIDs: Array<number>
    }>;
};

const FormPage = () => {
    const navigate = useNavigate();
    const [questionCount, setQuestionCount] = useState<number>(1);
    const [questionData, setQuestionData] = useState<QuestionResponse | null>(null);
    const [selectedChoices, setSelectedChoices] = useState<Record<number, number[]>>({});
    const [language] = useState<string>("th");
    const TOTAL_QUESTIONS = 8; // กำหนดจำนวนข้อสูงสุด

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const { data } = await api.get<QuestionResponse>(
                    ENDPOINTS.QUESTIONS(questionCount, language)
                );
                setQuestionData(data);
            } catch (error) {
                console.error("Server error");
            }
        };
        fetchQuestion();
    }, [questionCount, language]);

    const handleToggleChoice = (choiceID: number) => {
        const currentAnswers = selectedChoices[questionCount] || [];
        if (currentAnswers.includes(choiceID)) {
            setSelectedChoices({
                ...selectedChoices,
                [questionCount]: currentAnswers.filter(id => id !== choiceID)
            });
        } else {
            setSelectedChoices({
                ...selectedChoices,
                [questionCount]: [...currentAnswers, choiceID]
            });
        }
    };

    // ฟังก์ชันส่งคำตอบ
    const handleSubmitAnswer = async () => {
        try {
            // แปลง Object selectedChoices เป็นรูปแบบ SubmissionRequest
            const payload: SubmissionRequest = {
                answers: Object.entries(selectedChoices).map(([qID, cIDs]) => ({
                    questionID: parseInt(qID),
                    choiceIDs: cIDs
                }))
            };

            const { data } = await api.post(ENDPOINTS.SUBMISSIONS, payload);
            
            if (data.isSuccess) {
                alert("บันทึกคำตอบเรียบร้อยแล้ว");
                navigate("/result");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("เกิดข้อผิดพลาดในการส่งคำตอบ");
        }
    };

    if (!questionData) return <div className="p-10 text-center">กำลังโหลด...</div>;

    const currentQuestion = questionData.result;
    const userAnswers = selectedChoices[questionCount] || [];

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg font-sans text-[#333]">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                    {questionCount}. {currentQuestion.translations[0]?.question}
                </h2>
            </div>

            <div className="space-y-4 mb-10">
                {currentQuestion.choices.map((choice) => (
                    <label 
                        key={choice.id} 
                        className="flex items-start gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                    >
                        <input
                            type="checkbox"
                            className="mt-1.5 w-4 h-4 accent-blue-600"
                            checked={userAnswers.includes(choice.id)}
                            onChange={() => handleToggleChoice(choice.id)}
                        />
                        <span className="text-lg leading-relaxed text-gray-700">
                            {choice.translations[0]?.choiceText}
                        </span>
                    </label>
                ))}
            </div>

            <div className="flex justify-between items-center mt-12 border-t pt-6">
                <button
                    onClick={() => setQuestionCount(prev => Math.max(1, prev - 1))}
                    disabled={questionCount === 1}
                    className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-30"
                >
                    ย้อนกลับ
                </button>
                
                {/* เช็คว่าถ้าเป็นข้อสุดท้ายให้แสดงปุ่ม ส่งคำตอบ */}
                {questionCount === TOTAL_QUESTIONS ? (
                    <button
                        onClick={handleSubmitAnswer}
                        className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-md font-bold"
                    >
                        ส่งคำตอบ
                    </button>
                ) : (
                    <button
                        onClick={() => setQuestionCount(prev => prev + 1)}
                        className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
                    >
                        ถัดไป
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormPage;