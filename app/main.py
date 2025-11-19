import sys
import os
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QLabel, QToolBar
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, Qt
from PyQt6.QtGui import QFont, QIcon

class PersonalAssistant(QMainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()
    
    def initUI(self):
        # Set window properties
        self.setWindowTitle('Smart Personal Assistant - مساعد شخصي ذكي')
        self.setGeometry(100, 100, 1200, 800)
        
        # Load icon if it exists
        icon_path = os.path.join(os.path.dirname(__file__), 'logo.ico')
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))
        
        # Create central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        layout.setContentsMargins(0, 0, 0, 0)
        
        # Create toolbar
        toolbar = QToolBar("Navigation")
        toolbar.setMovable(False)
        toolbar.setIconSize(toolbar.iconSize())
        self.addToolBar(toolbar)
        
        # Add toolbar styling
        toolbar.setStyleSheet("""
            QToolBar {
                background-color: #0F0F0F;
                border-bottom: 2px solid #00D4FF;
                padding: 10px;
            }
            QToolBar QLabel {
                color: #00D4FF;
                font-size: 18px;
                font-weight: bold;
                margin-left: 10px;
            }
        """)
        
        title_label = QLabel('Smart Personal Assistant')
        title_label.setFont(QFont('Arial', 14, QFont.Weight.Bold))
        toolbar.addWidget(title_label)
        
        # Create web engine view to display website
        self.browser = QWebEngineView()
        self.browser.load(QUrl('https://mohamedhany2025.github.io/Smart-Personal-Assistant/'))
        layout.addWidget(self.browser)
        
        # Set application stylesheet (dark theme)
        self.setStyleSheet("""
            QMainWindow {
                background-color: #0F0F0F;
                color: #FFFFFF;
            }
            QWidget {
                background-color: #0F0F0F;
                color: #FFFFFF;
            }
        """)
        
        self.show()

def main():
    app = QApplication(sys.argv)
    
    # Set application-wide stylesheet
    app.setStyle('Fusion')
    
    window = PersonalAssistant()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
