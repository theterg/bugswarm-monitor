bugswarm-monitor
----------------

A custom monitoring suite for bug swarm.  This intents to collect important system parameters (independent of the main swarm instance) and transmit them to a monitoring server.  Currently this records:
* Load average 1,5,15
* Swarm Latency
* Total number of messages in swarm history database
* Swarm messages/second as reported by histories

This requires a node.js "client" to run on any servers that are to be monitored, and a node.js "server" that is the central hub and hosts the monitoring application.  On the horizon:
* Host "online" detection" (have we heard from a host within a timeout or three?)
* Un-Hardcoding the thresholds for "OK" values (store in DB)
* Ability to register a notification on a parameter (e-mail? text?)


