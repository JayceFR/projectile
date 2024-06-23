import sys
from PySide6 import QtCore, QtGui, QtWidgets
from PySide6.QtCore import Qt


class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()

        self.label = QtWidgets.QLabel()
        canvas = QtGui.QPixmap(400, 300)
        canvas.fill(Qt.white)
        self.label.setPixmap(canvas)
        self.setCentralWidget(self.label)
        self.draw_something()
u = 20 #ms^-1
g = 9.81 #ms^-2
angle = 45 #degrees
launch_height = 2 #metres
launch_depth = 0 #metres
time_step = 0.2
t = 0
ux = math.cos(math.radians(angle)) * u
uy = math.sin(math.radians(angle)) * u

while y > -100:
  t += time_step
  x = ux * t
  y = launch_height + uy*t - 1/2 * g * t**2
  
    def draw_something(self):
        canvas = self.label.pixmap()
        painter = QtGui.QPainter(canvas)
      while y > -100:
        x = ux * t
        y = launch_height + uy*t - 1/2 * g * t**2
        painter.drawLine(launch_depth, launch_height, x, y)
        t += time_step
        launch_depth= x
        launch_height= y
        painter.end()
        self.label.setPixmap(canvas)


app = QtWidgets.QApplication(sys.argv)
window = MainWindow()
window.show()
app.exec()
