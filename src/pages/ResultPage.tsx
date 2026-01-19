import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { ENDPOINTS } from "../constants/endpoint";

type SubmissionResponse = {
    isSuccess: boolean;
    result: {
        scores: Array<{
            linkItemID: number;
            psfCode: string;
            type: string;
            description: string;
            userCount: number;
            totalCount: number;
        }>;
    };
};

type PollQuestionsResponse = {
    isSuccess: boolean;
    result: Array<{
        id: number;
        translations: Array<{ questionText: string; languageCode: string }>;
        choices: Array<{
            id: number;
            translations: Array<{ choiceText: string; languageCode: string }>;
        }>;
    }>;
};

const ResultPage = () => {
    const [submissionData, setSubmissionData] = useState<SubmissionResponse["result"]["scores"]>([]);
    const [pollQuestions, setPollQuestions] = useState<PollQuestionsResponse["result"]>([]);
    const [selectedPollChoices, setSelectedPollChoices] = useState<Record<number, number[]>>({});
    const [language] = useState<string>("th");
    const [sessionValue, setSessionValue] = useState<string | null>(null);
    const adminEmail = [
        "sirawit.arsa@kmutt.ac.th",
		"thanet.jomp@kmutt.ac.th",
		"metta.mon@kmutt.ac.th",
		"phaithun.ana@kmutt.ac.th",
    ]

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('Email');
        if (storedEmail) {
            try {
                setSessionValue(JSON.parse(storedEmail));
            } catch {
                setSessionValue(storedEmail);
            }
        }
        const fetchPoll = async () => {
            try {
                const { data } = await api.get<PollQuestionsResponse>(ENDPOINTS.POLLQUESTIONS(language));
                if (data.isSuccess) setPollQuestions(data.result);
            } catch (error) {
                console.error("Error fetching poll:", error);
            }
        };
        const fetchCurrentSubmission = async () => {
            try {
                const { data } = await api.get<SubmissionResponse>(ENDPOINTS.CURRENTSUBMISSION(language));
                if (data.isSuccess) setSubmissionData(data.result.scores)
            } catch (error) {
                console.error("Error fetching poll:", error);
            }
        };
        fetchPoll();
        fetchCurrentSubmission();
    }, []);

    const getStatusColor = (userCount: number, totalCount: number) => {
        if (userCount === 0) return "bg-gray-400";
        if (userCount % totalCount === 0) return "bg-green-500";
        return "bg-yellow-400";
    };

    const handlePollChange = (questionID: number, choiceID: number) => {
        const current = selectedPollChoices[questionID] || [];

        const isMultiple = questionID !== 2;

        if (isMultiple) {
            const next = current.includes(choiceID)
                ? current.filter(id => id !== choiceID)
                : [...current, choiceID];
            setSelectedPollChoices({ ...selectedPollChoices, [questionID]: next });
        } else {
            setSelectedPollChoices({ ...selectedPollChoices, [questionID]: [choiceID] });
        }
    };

    const handleSubmitPoll = async () => {
        const payload = {
            pollAnswers: Object.entries(selectedPollChoices).map(([qID, cIDs]) => ({
                pollQuestionID: parseInt(qID),
                pollChoiceIDs: cIDs
            }))
        };
        try {
            await api.post(ENDPOINTS.POLLSUBMISSIONS, payload);
            alert("บันทึกข้อมูลสำเร็จ");
            window.location.reload();
        } catch (error) {
            alert("เกิดข้อผิดพลาด");
        }
    };

    const handleDownloadReport = async () => {
        try {
            // เรียกใช้ API export โดยระบุ responseType เป็น blob
            const response = await api.get(ENDPOINTS.EXPORT_SUBMISSION(language), {
                responseType: 'blob',
            });

            // สร้าง Link ชั่วคราวเพื่อสั่ง Download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // กำหนดชื่อไฟล์ (หรือจะดึงจาก Header Content-Disposition ก็ได้)
            link.setAttribute('download', `PSF_Report_${new Date().getTime()}.xlsx`);

            document.body.appendChild(link);
            link.click();

            // ทำความสะอาด
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            alert("ไม่สามารถดาวน์โหลดรายงานได้ในขณะนี้");
        }
    };

    const handleAdminDownloadReport = async () => {
        if (!sessionValue || !adminEmail.includes(sessionValue)) {
            alert("You don't have permission in this file");
            return;
        }

        try {
            const response = await api.get(ENDPOINTS.EXPORT_ADMIN_SUBMISSION(language), {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `PSF_Summary_Report_${new Date().getTime()}.xlsx`);

            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            alert("ไม่สามารถดาวน์โหลดรายงานได้ในขณะนี้");
        }
    };

    if (!submissionData) return <div className="p-10 text-center">ไม่พบข้อมูลผลการประเมิน</div>;

    const submissions = submissionData;
    const competentScores = submissions.filter(s => s.type === "Competent");
    const proficientScores = submissions.filter(s => s.type === "Proficient");

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans bg-white shadow-lg my-10 rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-8">ระดับสมรรถนะการเรียนการสอนตามกรอบแนวคิด KMUTT PSF</h1>

            {/* --- Section 1: PSF Scores Table --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border p-6 rounded-md">
                {/* Column: Competent */}
                <div>
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Competent</h2>
                    <div className="space-y-4">
                        {competentScores.map(score => (
                            <div key={score.linkItemID} className="flex items-start gap-4 text-sm">
                                <span className="font-bold min-w-10">{score.psfCode}</span>
                                <p className="flex-1 text-gray-600 leading-tight">{score.description}</p>
                                <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${getStatusColor(score.userCount, score.totalCount)}`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column: Proficient */}
                <div>
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Proficient</h2>
                    <div className="space-y-4">
                        {proficientScores.map(score => (
                            <div key={score.linkItemID} className="flex items-start gap-4 text-sm">
                                <span className="font-bold min-w-10">{score.psfCode}</span>
                                <p className="flex-1 text-gray-600 leading-tight">{score.description}</p>
                                <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${getStatusColor(score.userCount, score.totalCount)}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Section 2: Legend --- */}
            <div className="mt-8 p-4 bg-gray-50 rounded-md text-sm border">
                <h3 className="font-bold mb-2">สถานะผลการประเมิน:</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>หมายถึง พฤติกรรมการสอนของท่านสอดคล้องกับคุณลักษณะที่คาดหวังในสมรรถนะระดับ Competent/Proficient</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span>หมายถึง พฤติกรรมการสอนของท่านสอดคล้องกับคุณลักษณะที่คาดหวังเพียงบางส่วน</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span>หมายถึง พฤติกรรมการสอนของท่านยังไม่สอดคล้องกับคุณลักษณะที่คาดหวัง</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-4 mt-8">
                <button
                    onClick={handleDownloadReport}
                    className="bg-blue-600 text-white px-10 py-2 rounded-4xl hover:bg-blue-700 transition-all font-semibold"
                >
                    Download report
                </button>
                {sessionValue && adminEmail.includes(sessionValue) && (
                    <button
                        onClick={handleAdminDownloadReport}
                        className="bg-green-600 text-white px-10 py-2 rounded-4xl hover:bg-green-700 transition-all font-semibold"
                    >
                        Download summary report
                    </button>
                )}
            </div>

            {/* --- Section 3: Poll Questions --- */}
            <div className="mt-12 border-t pt-8">
                <h2 className="text-lg font-bold mb-6">หลังจากได้ทำแบบประเมินเรียบร้อยแล้ว เราอยากทราบความคิดเห็นของท่าน</h2>
                {pollQuestions.map((poll) => (
                    <div key={poll.id} className="mb-8">
                        <p className="font-semibold mb-4 text-gray-800">
                            {poll.translations[0]?.questionText}
                        </p>
                        <div className="space-y-2 ml-4">
                            {poll.choices.map((choice) => (
                                <label key={choice.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type={poll.id === 2 ? "radio" : "checkbox"}
                                        className="w-4 h-4 accent-blue-600"
                                        // กำหนดชื่อกลุ่มสำหรับ radio เพื่อให้ browser จัดการการเลือกให้อัตโนมัติในระดับหนึ่ง
                                        name={`poll-${poll.id}`}
                                        checked={(selectedPollChoices[poll.id] || []).includes(choice.id)}
                                        onChange={() => handlePollChange(poll.id, choice.id)}
                                    />
                                    <span className="text-sm group-hover:text-blue-600 transition-colors">
                                        {choice.translations[0]?.choiceText}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="text-center mt-10">
                    <button
                        onClick={handleSubmitPoll}
                        className="bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-700 shadow-md transition-all font-semibold"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;