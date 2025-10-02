-- تفعيل زر الواتساب
UPDATE whatsapp_button 
SET active = true, 
    phone = '+966501234567',
    updated_at = now()
WHERE id = '763df6d5-b7df-4a6e-a44e-ad7b0fb8a6c1';