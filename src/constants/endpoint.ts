const BASE_URL = "http://localhost:3000/api";

export const ENDPOINTS = {
    LOGIN: `${BASE_URL}/login`,
    
    QUESTIONS: (id: number | string, lang: string) => 
        `${BASE_URL}/questions/${id}?language=${lang}`,
    
    SUBMISSIONS: `${BASE_URL}/submissions`,
    
    POLLQUESTIONS: (lang: string) => 
        `${BASE_URL}/poll-questions?language=${lang}`,
    
    CURRENTSUBMISSION: (lang: string) => 
        `${BASE_URL}/current-submissions?language=${lang}`,
    
    POLLSUBMISSIONS: `${BASE_URL}/poll-submissions`,

    EXPORT_SUBMISSION: (lang: string) => 
        `${BASE_URL}/submissions/export?language=${lang}`,

    EXPORT_ADMIN_SUBMISSION: (lang: string) => 
        `${BASE_URL}/submissions/admin/export?language=${lang}`,
};