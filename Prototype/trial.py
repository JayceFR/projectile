import numpy as np
import matplotlib.pyplot as plt

# Constants
g = 9.81  # acceleration due to gravity (m/s^2)
omega = 7.2921e-5  # angular velocity of Earth (rad/s)
R = 6371000  # radius of Earth (m)

# Initial conditions
v0 = 100  # initial speed (m/s)
theta = np.radians(45)  # launch angle from horizontal
phi = np.radians(30)  # azimuth angle from reference direction
lambda_lat = np.radians(45)  # latitude of launch point

# Initial velocity components relative to the surface
v0x = v0 * np.cos(theta) * np.cos(phi)
v0y = v0 * np.cos(theta) * np.sin(phi)
v0z = v0 * np.sin(theta)

# Tangential velocity due to Earth's rotation at latitude
v_rot = omega * R * np.cos(lambda_lat)
v0x += v_rot  # adding rotational component to initial x velocity

# Time settings
dt = 0.01  # time step (s)
t_max = 20  # maximum time (s)
n_steps = int(t_max / dt)  # number of time steps

# Arrays to store position and velocity
x = np.zeros(n_steps)
y = np.zeros(n_steps)
z = np.zeros(n_steps)
vx = np.zeros(n_steps)
vy = np.zeros(n_steps)
vz = np.zeros(n_steps)

# Initial conditions
x[0], y[0], z[0] = 0, 0, 0
vx[0], vy[0], vz[0] = v0x, v0y, v0z

# Time-stepping loop
for i in range(1, n_steps):
    # Update positions
    x[i] = x[i-1] + vx[i-1] * dt
    y[i] = y[i-1] + vy[i-1] * dt
    z[i] = z[i-1] + vz[i-1] * dt
    
    # Coriolis accelerations
    ax_coriolis = -2 * omega * vy[i-1] * np.cos(lambda_lat)
    ay_coriolis = 2 * omega * vx[i-1] * np.cos(lambda_lat)
    
    # Update velocities
    vx[i] = vx[i-1] + ax_coriolis * dt
    vy[i] = vy[i-1] + ay_coriolis * dt
    vz[i] = vz[i-1] - g * dt
    
    # Stop if projectile hits the ground
    if z[i] < 0:
        break

# Truncate arrays to the actual length of the flight
x = x[:i+1]
y = y[:i+1]
z = z[:i+1]

# Plot the trajectory
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot(x, y, z)
ax.set_xlabel('X (m)')
ax.set_ylabel('Y (m)')
ax.set_zlabel('Z (m)')
ax.set_title('3D Trajectory of Projectile with Coriolis Effect')
plt.show()
