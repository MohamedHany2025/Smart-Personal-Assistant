import subprocess
import sys
import os

# تحديد المسار الكامل للمشروع
project_path = os.path.dirname(os.path.abspath(__file__))

# أوامر البناء مع إضافة البيانات اللازمة
build_command = [
    'pyinstaller',
    '--onefile',  # ملف واحد فقط
    '--windowed',  # بدون نافذة console
    '--name=SmartAssistant',  # اسم البرنامج
    '--icon=logo.ico',  # الأيقونة
    '--add-data=logo.ico:.',  # إضافة الأيقونة للملف
    '--collect-all=PyQt6',  # جمع كل مكتبات PyQt6
    '--collect-all=PyQt6_WebEngine_Qt6',  # جمع WebEngine
    '--hidden-import=PyQt6.QtWebEngineWidgets',  # إضافة WebEngine بشكل واضح
    '--hidden-import=PyQt6.QtCore',
    '--hidden-import=PyQt6.QtGui',
    '--hidden-import=PyQt6.QtWidgets',
    'main.py'
]

print("جاري بناء البرنامج...")
print(f"المسار: {project_path}")
print()

result = subprocess.run(build_command, cwd=project_path)
sys.exit(result.returncode)
