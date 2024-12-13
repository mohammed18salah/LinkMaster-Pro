import requests
from urllib.parse import urlparse

def bypass_url(url):
    try:
        # Add http:// if not present
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
            
        # Send request and allow redirects
        response = requests.get(url, allow_redirects=True)
        
        # Get the final URL after all redirects
        final_url = response.url
        
        # Get status code
        status_code = response.status_code
        
        return {
            'original_url': url,
            'final_url': final_url,
            'status_code': status_code,
            'redirects': len(response.history)
        }
    except requests.exceptions.RequestException as e:
        return {
            'error': str(e),
            'original_url': url
        }

def main():
    while True:
        url = input("\nأدخل الرابط المراد تخطيه (او اكتب 'خروج' للإنهاء): ")
        
        if url.lower() in ['exit', 'quit', 'خروج']:
            print("تم الإنهاء!")
            break
            
        result = bypass_url(url)
        
        if 'error' in result:
            print(f"\nحدث خطأ: {result['error']}")
        else:
            print("\nنتيجة التخطي:")
            print(f"الرابط الأصلي: {result['original_url']}")
            print(f"الرابط النهائي: {result['final_url']}")
            print(f"عدد التحويلات: {result['redirects']}")
            print(f"رمز الحالة: {result['status_code']}")

if __name__ == "__main__":
    main() 