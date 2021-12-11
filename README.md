## auto-scaled-application

This app is the main app which we have configured with autoscaler service ( BTP core provides autoscaler service out of the box in all regions). We have chosen request throughput to scale out the application.

If the application crosses threshold of 20 requests per second autoscaler service will spawn a new instance. The instances are load balanced by haproxy ( BTP core provides haproxy out of the box in all regions ).

If the application requests per second drops down to 15 requests per second autoscaler service will also de-spawn the additional instance.

## auto-scaled-application-initiator

This multi-scalar application is used to put stress on the auto-scaled-app so that autoscaler service will spawn new instances. The application consumes rabbitmq and its horizontally scaled out. It contains 100 threads and in total 6 instances.

## request-dispatcher

This application is used to distribute requests among all instances of auto-scaled-application-tester.
