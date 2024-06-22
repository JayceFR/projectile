import math
import pygame
import numpy
import matplotlib.pyplot as plt
from scipy.interpolate import interp1d

u = 20 #ms^-1
g = 9.81 #ms^-2
angle = 45 #degrees
launch_height = 2 #metres
time_step = 0.2

t = 0
ux = math.cos(math.radians(angle)) * u
uy = math.sin(math.radians(angle)) * u

screen = pygame.display.set_mode((1000,600))
pygame.display.set_caption('projectiles')
run = True

x = ux * t
y = launch_height + uy*t - 1/2 * g * t**2
x_points = []
y_points = []
while y > -10:
  x_points.append(x)
  y_points.append(y)
  t += time_step
  x = ux * t
  y = launch_height + uy*t - 1/2 * g * t**2

x_coords = numpy.array(x_points)
y_coords = numpy.array(y_points)
cubic_interpolation_model = interp1d(x_coords, y_coords, kind='cubic')
X_= numpy.linspace(x_coords.min(), x_coords.max(), 500)
Y_=cubic_interpolation_model(X_)

plt.plot(X_, Y_)
plt.ylim(bottom=0)
plt.xlim(left=0)
plt.show()

while run:
  screen.fill((0,0,0))

  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      run = False
  
  pygame.display.flip()

