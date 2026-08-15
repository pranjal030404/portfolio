# Pranjal Tiwari — Software Developer

## Navigation
System · About · Experience · Work · Code · Stack · Lab · Education · Contact

---

## Hero

Pranjal Tiwari · Software Developer

# I build web systems, APIs and *real-time infrastructure.*

Backend systems, IoT device communication and production web platforms.
Most of my work sits between a request, a database and a device.

Currently working on **[typewriter — cycles through]:**
- TCP servers that speak GT06
- Redis Streams between services
- REST APIs in Node and Express
- React dashboards over live data
- MongoDB schemas for position history

**Actions:** View work → · GitHub → · Get in touch →

Noida, India. Currently building production systems at Zebraffe Technologies.

*(Portrait caption: Noida, 2026)*

---

## System — "From a device on a truck to a dot on a map"

A GPS tracking and IoT management system I built at Atrivis. Trackers in
the field talk to it over raw TCP; a browser somewhere else shows where
they are. These are the eight things in between.

**01 · GPS device** — Vehicle tracker in the field
> **The trigger.** Interval and ACC-triggered reports, ignition and voltage state,
> GPS with LBS/Wi-Fi fallback when the sky view is bad — the tracker
> decides when to talk, the server just has to be listening.

**02 · TCP server** — Custom, long-lived connections
> **Not HTTP.** Trackers open a socket and hold it, sometimes for days. The server
> reads whatever arrives, whenever it arrives — there is no request
> to respond to, only a stream of frames to buffer and split.

**03 · GT06 · Concox · Prithivi** — Binary frames
> **Raw device frame.** Start bits, protocol number, payload, CRC-ITU checksum. Every
> session opens with a login packet carrying the device's IMEI —
> that's what ties a socket to a vehicle. Three families, three
> checksum tables, one shape.

**04 · Parser** — Decode and validate
> **Decode.** Out comes latitude, longitude, speed, heading, satellite count and
> status — the first point in the chain where the bytes mean
> anything. A frame that fails checksum gets dropped, not guessed
> at; a valid one gets an ACK written back on the same socket.

**05 · Redis Streams** — Queue between services
> **Decouple ingestion.** The TCP server XADDs and moves on. Consumer groups on the other
> side read independently — a slow consumer falls behind and
> catches up on redelivery; it doesn't drop packets or block the
> socket server.

**06 · Microservices** — Geofences, alerts, trips
> **Isolated by concern.** Geofencing runs point-in-polygon checks against stored zones,
> trip segmentation watches ignition and movement state, alerts fan
> out on threshold breaches — three consumers on the same stream,
> no shared state between them.

**07 · MongoDB** — Position history
> **Persist.** Historical playback and route analytics both read from here.
> Positions carry a 2dsphere index, so geofence and viewport
> queries stay index-backed instead of scanning the collection.

**08 · Live map** — Socket.io · React · Leaflet
> **Present.** Each vehicle gets a Socket.io room; a client only hears about the
> fleet it's watching. Anything happening right now goes straight
> out to the dashboard, and the dot moves.

---

## About

### I like the parts of software you don't notice when they're working.

I'm a software developer working on backend systems, real-time
applications, device communication and production web platforms. The
part I find most interesting is the layer between a device, a
protocol, a backend, a database and the interface someone actually
looks at — most software only has to worry about the last two.

That's meant writing TCP servers that speak GT06, Concox and
Prithivi — parsing binary frames, validating CRC-ITU checksums,
authenticating devices off their IMEI — putting Redis Streams with
consumer groups between ingestion and processing, and keeping two
MERN platforms running in production. Day to day it's Node.js,
Express, React and MongoDB.

**Now** — Software Developer · Zebraffe Technologies
**Education** — BTech CSE · BBDIT · Graduated 2026
**Based** — Noida, India
**Open source** — [DOOCS](https://github.com/doocs) · [TheAlgorithms](https://github.com/TheAlgorithms)

### Terminal (`pranjal@noida zsh`)
```
$ whoami
Software Developer · Zebraffe Technologies

$ cat stack.txt
Node.js · Express · React · MongoDB · Redis · Docker

$ uptime --since
Dec 2024 — two platforms in production

$ ping device
GT06 frame in, position out, 0 packets dropped
```

### Code snippet (`developer.ts`)
```ts
const developer = {
  name: 'Pranjal Tiwari',
  role: 'Software Developer',
  based: 'Noida, India',
  works: ['backend', 'real-time', 'IoT'],
  stack: ['Node', 'React', 'MongoDB', 'Redis'],
  // the part between a device and a map
  ships: true
}
```

---

## Marquee strips

**Loud:** BUILD ◆ SHIP ◆ DEBUG ◆ SCALE ◆

**Technologies:** Node.js ◆ Express ◆ React ◆ MongoDB ◆ Redis Streams ◆
Socket.io ◆ TCP/IP ◆ GT06 ◆ Concox ◆ Docker ◆ Kubernetes ◆ TypeScript ◆
Python ◆ Leaflet ◆ ESP32 ◆ Linux ◆

---

## Experience

### Software Developer — Current
**Zebraffe Technologies Limited · Noida, India**
Dec 2024 — Present

Two production platforms — a vehicle fitness system and the company
franchise portal. I build MERN-stack features on both, write the REST
APIs behind them, and I'm the one who finds out why something broke.

**Responsibilities**
- Vehicle Fitness Platform — features for fitness workflows and operational tracking
- Franchise Platform — live business workflows and site updates
- RESTful API design and implementation
- React applications and component work
- Node.js / Express services
- MongoDB schema and query work
- Production debugging and platform stability
- Deployment and ongoing maintenance

**Tech:** React · Node.js · Express.js · MongoDB · REST APIs
**Links:** [vehiclefitness.gocarriage.com](https://stg.vehiclefitness.gocarriage.com/) · [in.zebraffe.net](https://in.zebraffe.net/)

### MERN Stack Developer Intern
**Atrivis Technologies Pvt. Ltd. · Noida, India**
Sep 2024 — Nov 2024

Built a real-time GPS tracking and IoT management system end to end, on
a microservices architecture — from the socket that accepts device
connections up to the map the operator watches.

**Responsibilities**
- GT06, Concox and Prithivi binary protocol parsers
- Custom TCP servers holding long-lived device connections
- IMEI-based device authentication on the login packet
- CRC-ITU checksum validation on inbound frames
- Redis Streams with consumer groups between services
- Microservices for geofencing, alerts and trip segmentation
- REST APIs and MongoDB schemas for position history
- 2dsphere geospatial indexing for geofence and route queries
- Socket.io rooms scoped per vehicle for real-time push
- Live vehicle tracking and route analytics
- Historical playback and geofencing alerts

**Tech:** Node.js · Redis Streams · MongoDB · Socket.io · TCP/IP · React · Leaflet
**Link:** [Live platform](http://139.59.13.130:5173/login)

---

## Selected work

### 01 · GPS Tracking & IoT Management System
**Atrivis Technologies · Production**

A real-time vehicle tracking system on a microservices architecture,
built around custom TCP servers, GT06 / Concox / Prithivi frame
parsing and IMEI-based device auth, Redis Streams with consumer
groups, Node.js and MongoDB with 2dsphere geospatial indexing. Live
tracking, route analytics, historical playback and point-in-polygon
geofencing alerts.

**Tech:** Node.js · Redis Streams · MongoDB · Socket.io · TCP/IP · React · Leaflet

**Architecture:**
1. TCP socket · persistent connection
2. GT06 / Concox / Prithivi frame
3. IMEI login handshake · device auth
4. Parser · CRC-ITU checksum validation
5. Redis Stream · XADD on ingest
6. Consumer groups · at-least-once processing
7. Geofence / trip / alert microservices
8. MongoDB · 2dsphere position index
9. Socket.io · room per vehicle
10. React / Leaflet · live map

**Links:** [Live platform](http://139.59.13.130:5173/login) · [GT06 repository](https://github.com/pranjal030404/Gt06-)

### 02 · Vehicle Fitness Platform
**Zebraffe Technologies · Production**
Fitness workflows and operational tracking. Feature work plus production support.
**Tech:** React · Node.js · Express · MongoDB
**Link:** [Live](https://stg.vehiclefitness.gocarriage.com/)

### 03 · Franchise Platform
**Zebraffe Technologies · Production**
The company franchise portal — live business workflows and platform stability work.
**Tech:** React · Node.js · Express
**Link:** [Live](https://in.zebraffe.net/)

### 04 · Meet with Recording
**Personal · JavaScript**
A browser meeting app with recording. Built to understand media capture and streaming in the browser.
**Tech:** JavaScript
**Link:** [GitHub](https://github.com/pranjal030404/Meets_with_recording)

### 05 · AI-based Recommendation Engine
Personal · Python
[GitHub](https://github.com/pranjal030404/AI-based-recommendation-engine)

### 06 · YouTube Clone
Personal · JavaScript, YouTube Data API, Tailwind
[GitHub](https://github.com/pranjal030404/Youtube-Clone-)

### 07 · CRM / EMS Portal
Frontend · authentication and dashboard operations
[Live](https://crm-frontend-omega-eight.vercel.app)

### 08 · Job
Personal · TypeScript
[GitHub](https://github.com/pranjal030404/Job)

### 09 · Library Management System
Personal · Python, Tkinter, MySQL
[GitHub](https://github.com/pranjal030404)

---

## Gallery
*"The same work, sideways. Open one for the detail."*

**01 · TCP · REDIS · MONGO — GPS Tracking & IoT**
Atrivis Technologies · Production · Node.js · Redis Streams · Socket.io
> A real-time vehicle tracking system on a microservices architecture. Custom
> TCP servers accept long-lived device connections authenticated by IMEI,
> GT06/Concox/Prithivi frames are checksum-validated and parsed into
> positions, Redis Streams with consumer groups decouple ingestion from
> processing, MongoDB holds positions under a 2dsphere index for geofence
> queries, and Socket.io pushes anything happening right now straight to
> the map.

**02 · MERN · PRODUCTION — Vehicle Fitness Platform**
Zebraffe Technologies · Production · React · Node.js · MongoDB
> Fitness workflows and operational tracking for commercial vehicles.
> MERN-stack feature work, the REST APIs behind it, and the production
> support when something breaks.

**03 · REACT · EXPRESS — Franchise Platform**
Zebraffe Technologies · Production · React · Node.js · Express
> The company franchise portal — live business workflows, site updates and
> the platform stability work that keeps them running.

**04 · WEBRTC · MEDIA — Meet with Recording**
Personal · JavaScript · JavaScript · MediaRecorder
> A browser meeting app with recording, built to understand media capture
> and streaming in the browser — getUserMedia, MediaRecorder and the peer
> connection underneath.

**05 · PYTHON · ML — Recommendation Engine**
Personal · Python
> A recommendation engine in Python — the modelling side of the stack
> rather than the request side, written to understand how the ranking
> actually gets made.

**06 · DASHBOARD · AUTH — CRM / EMS Portal**
Frontend · Dashboard · React
> A CRM and employee management front end — authentication, dashboard
> operations and the table-heavy screens that come with them.

---

## Code & open source
Public repositories and contributions to projects around algorithms,
developer tooling and hardware.

**Contributions**
- [DOOCS / LeetCode](https://github.com/doocs/leetcode) — Website work and solutions
- [TheAlgorithms · website](https://github.com/TheAlgorithms/website) — Site maintenance and Docker builds
- [TheAlgorithms · Java](https://github.com/TheAlgorithms/Java) — Algorithm implementations
- [OnStep](https://github.com/pranjal030404/OnStep) — Arduino telescope GoTo controller — fork

**Repositories**
- [Gt06-](https://github.com/pranjal030404/Gt06-) — GT06 protocol work · JavaScript
- [Meets_with_recording](https://github.com/pranjal030404/Meets_with_recording) — JavaScript
- [AI-based-recommendation-engine](https://github.com/pranjal030404/AI-based-recommendation-engine) — Python
- [Flood-Risk-analyser](https://github.com/pranjal030404/Flood-Risk-analyser) — Jupyter Notebook
- [3D_building_layout-](https://github.com/pranjal030404/3D_building_layout-) — JavaScript

**Communities**
TheAlgorithms · DOOCS · dev-protocol · Py-Contributors · Design-and-Code · CommunityPro

Problem solving on LeetCode, HackerRank and GeeksforGeeks.

[View GitHub →](https://github.com/pranjal030404)

---

## Stack

**Languages** — JavaScript, TypeScript, Python, Java, C, PHP
**Backend** — Node.js, Express.js, REST APIs, Microservices
**Frontend** — React, Tailwind CSS, HTML / CSS
**Databases** — MongoDB, MySQL, Redis
**DevOps** — Docker, Kubernetes, Fedora Linux, Git, GitHub Actions
**IoT & real-time** — TCP/IP, Socket.io, GPS device integration, ESP32

**Word cloud:** Node.js · React · MongoDB · Redis · Express · TypeScript ·
Docker · Socket.io · TCP/IP · Python · Kubernetes · Leaflet · MySQL ·
Java · ESP32 · Tailwind · Git · Linux

---

## Lab
Small browser experiments. TypeScript, no libraries.

- **Snake** — A small Canvas experiment. → Play
- **Typing** — A test built around the technologies I work with. → Play
- **Reaction** — How quickly can you react? → Play

---

## Education

**B.Tech, Computer Science Engineering**
BBD Institute of Technology · AKTU, Lucknow · 2022—2026
Completed: 2026 · CGPA: 8.17

- Class XII · PCM — CBSE · 2021
- Class X — CBSE · 2019

---

## Contact

### Have something worth building?

For work, collaborations, software problems, or a good technical
conversation. Messages from the form open in WhatsApp.

Open to work in India — on-site, hybrid or remote.

- **Email:** [pranjaltiwari69058@gmail.com](mailto:pranjaltiwari69058@gmail.com)
- **WhatsApp:** [+91 84000 95088](https://wa.me/918400095088)
- **GitHub:** [pranjal030404](https://github.com/pranjal030404)
- **LinkedIn:** [prajal030404](https://www.linkedin.com/in/prajal030404)

**Contact form fields:** Name · Email · Message → "Send on WhatsApp"

---

## Footer

Pranjal Tiwari — Software Developer · Noida
[GitHub](https://github.com/pranjal030404) · [LinkedIn](https://www.linkedin.com/in/prajal030404) · © 2026
