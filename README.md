# ct-environment-builder
Scripts that help you build an already populated environment

To create a new environment:

1. Inside the `contact-tracing` repo, run `make run-fresh`
2. Inside the `ct-auth-server` repo, run `make run`
3. Inside this repo, run `make run users=120 establishments=10`
4. Once you want to drop the environment, run `make stop-fresh` inside `contact-tracing`

**Important**: as the auth server uses the auth server, we don't have a "fresh" instance. When you try to run this environment builder, you pass a number `x` as the users parameter. The script tries to create `x` users with the format `email: user_${i}@gmail.com && password: user_${i} && DNI: ${i}`, with i from 0 to x. If the user doesn't exist, it creates it. In case it already exists, it ignores that user. To sum up, if we have 100 users created and we pass the command 120, now we are going to have the users from 0 to 119.

Firebase has a hard limit of 100 accounts created per hour, so the script may fail because of that if you pass a big number.
