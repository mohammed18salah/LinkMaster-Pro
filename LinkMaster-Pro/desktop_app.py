import sys
import tkinter as tk
from tkinter import ttk
import requests
from PIL import Image, ImageTk
import os
from threading import Thread
from url_bypasser import bypass_url

class URLBypasserApp:
    def __init__(self, root):
        self.root = root
        self.root.title("مُتخطي الروابط - URL Bypasser")
        self.root.geometry("800x600")
        self.root.configure(bg='#1a1a2e')

        # تهيئة الستايل
        style = ttk.Style()
        style.configure('TButton', font=('Cairo', 12))
        style.configure('TEntry', font=('Cairo', 12))
        style.configure('TLabel', font=('Cairo', 12), background='#1a1a2e', foreground='white')

        # الإطار الرئيسي
        main_frame = ttk.Frame(root)
        main_frame.pack(pady=20, padx=20, fill='both', expand=True)

        # العنوان
        title_label = ttk.Label(main_frame, text="متخطي الروابط المتقدم", font=('Cairo', 24, 'bold'))
        title_label.pack(pady=20)

        # حقل إدخال الرابط
        self.url_entry = ttk.Entry(main_frame, width=50, font=('Cairo', 12))
        self.url_entry.pack(pady=20)
        self.url_entry.insert(0, "أدخل الرابط هنا")

        # زر التخطي
        bypass_button = ttk.Button(main_frame, text="تخطي الرابط", command=self.bypass_url)
        bypass_button.pack(pady=10)

        # منطقة النتائج
        self.result_text = tk.Text(main_frame, height=10, width=50, font=('Cairo', 12), bg='#f0f0f0')
        self.result_text.pack(pady=20)

    def bypass_url(self):
        url = self.url_entry.get()
        if url:
            Thread(target=self._process_url, args=(url,)).start()

    def _process_url(self, url):
        try:
            result = bypass_url(url)
            if 'error' in result:
                self.show_result(f"حدث خطأ: {result['error']}")
            else:
                output = f"""
نتيجة التخطي:
الرابط الأصلي: {result['original_url']}
الرابط النهائي: {result['final_url']}
عدد التحويلات: {result['redirects']}
رمز الحالة: {result['status_code']}
"""
                self.show_result(output)
        except Exception as e:
            self.show_result(f"حدث خطأ غير متوقع: {str(e)}")

    def show_result(self, text):
        self.result_text.delete(1.0, tk.END)
        self.result_text.insert(tk.END, text)

def main():
    root = tk.Tk()
    app = URLBypasserApp(root)
    root.mainloop()

if __name__ == "__main__":
    main() 