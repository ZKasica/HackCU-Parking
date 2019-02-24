# Inspiration
Parking at the Colorado School of Mines is always a tricky task-- our parking lots are on average 91% full during the week according to Mines' parking services. With so many cars and so little spots on campus, students often have to search for over 15 minutes to find a spot to park before class. We decided that it was time to put an end to this parking madness by taking a technological step in the right direction. Our solution-- RapidPark!

# What it does
RapidPark provides both students and parking services with the technology necessary to lessen stress around parking on school campuses. For the student, RapidPark is a web-based application that acts as an easy reference for parking spot availability information. For parking services, it provides a system of license plate recognition and authorization to streamline ticketing and lot analysis.

On the hardware front, RapidPark is a system of cameras stationed at entrances to parking lots that detects cars entering and leaving the parking lot. When a car is detected, it will update the current lot capacity on our heat-mapped google maps web application. The system updates in real-time, and uses fast computer-vision classification APIs to take the images of the cars and detects aspects of them, such as their license plates.

# How we built it
We built RapidPark around an Angular webapp utilizing Python Flask on the backend. Any "detection system" that is capable of HTTP requests has the ability to update the parking lot availability. We used Python OpenCV for motion detection and frame parsing to detect direction and key frame grabs during the motion. We tested this system on a raspberry Pi 3, and subsequently created an entire detector for ~$50.

# Set up tips
-Change IP in app.component.ts

# Credits
X Icon made by [Pavel Kozlov](https://www.flaticon.com/authors/pavel-kozlov) from www.flaticon.com 

Parking Icon made by [Google](https://www.flaticon.com/authors/google) from www.flaticon.com
