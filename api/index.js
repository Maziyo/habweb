// api/texts.js
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {

    // CORS 설정 (다른 도메인에서 접근 가능하게 설정)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('tests') // 'texts' 테이블에서 데이터를 조회
                .select('*');

            if (error) {
                throw error;
            }

            return res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching texts:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    if (req.method === 'POST') {
        try {
            const { text } = req.body;

            const { data, error } = await supabase
                .from('tests')
                .insert([
                    { text }
                ])
                .select('id, text')

             // 로그 출력
             console.log('Inserted data:', data);  // 삽입된 데이터 확인
             console.log('Error:', error);  // 오류 로그 확인
 
             // 오류가 발생했을 때 추가 정보 출력
             if (error) {
                 console.error('Supabase error during insert:', error);
                 return res.status(500).json({ error: error.message, details: error.details, code: error.code });
             }
 
             // data가 반환되지 않은 경우 문제 해결
             if (!data || data.length === 0) {
                 console.error('Failed to insert data: No data returned');
                 return res.status(500).json({ error: 'Failed to insert data' });
             }

            return res.status(200).json(data[0]);  // 첫 번째 삽입된 데이터 반환
        } catch (error) {
            console.error('Error adding text:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    // Method Not Allowed
    return res.status(405).send('Method Not Allowed');
};
