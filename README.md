# ct-environment-builder
Scripts that help you build an already populated environment

To create a new environment:

1. Inside the `contact-tracing` repo, run `make run-fresh`
3. Inside this repo, run `make run users=10 establishments=10 mobility=1 days=5 [n95Mandatory=true] [infected=2]`
4. Once you want to drop the environment, run `make stop-fresh` inside `contact-tracing`

The script generates random visits with an exponential distribution, with the median per day being the `mobility` parameter, during a period of the number of days received in the paremeter `days`. The parameter `n95Mandatory` determines if the inside the space it is mandatory to use those masks. The parameter `infected` determines the number of users that will declare themselves as infected and share their user generated codes.

It logs all the visits created, and groups them by user and by space to make the debugging easier.