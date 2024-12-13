from flask import Flask, request, jsonify, render_template
from url_bypasser import bypass_url
import time

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/bypass', methods=['POST'])
def bypass_link():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'الرجاء إدخال رابط صحيح'}), 400
    
    # قياس وقت المعالجة
    start_time = time.time()
    result = bypass_url(url)
    processing_time = round(time.time() - start_time, 2)
    
    # إضافة وقت المعالجة للنتيجة
    result['processing_time'] = processing_time
    
    # إضافة معلومات إضافية للنتيجة
    if 'error' not in result:
        result['is_safe'] = True if result['status_code'] in [200, 301, 302] else False
        result['message'] = 'تم تخطي الرابط بنجاح وهو آمن' if result['is_safe'] else 'تم تخطي الرابط لكن يرجى الحذر'
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 