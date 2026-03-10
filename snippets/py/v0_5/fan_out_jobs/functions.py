import inngest
import typing

inngest_client = inngest.Inngest(app_id="my-app")


# !snippet:start
@inngest_client.create_function(
    fn_id="send-welcome-email",
    trigger=inngest.TriggerEvent(event="app/user.signup"),
)
async def send_welcome_email(ctx: inngest.Context) -> None:
    await ctx.step.run("send-email", lambda: send_email(
        email=ctx.event.data["email"],
        template="welcome",
    ))

@inngest_client.create_function(
    fn_id="start-stripe-trial", 
    trigger=inngest.TriggerEvent(event="app/user.signup"),
)
async def start_stripe_trial(
    ctx: inngest.Context,
) -> None:
    customer = await ctx.step.run("create-customer", lambda: stripe.Customer.create(
        email=ctx.event.data["email"]
    ))
    
    await ctx.step.run("create-subscription", lambda: stripe.Subscription.create(
        customer=customer.id,
        items=[{"price": "price_1MowQULkdIwHu7ixraBm864M"}],
        trial_period_days=14
    ))

# !snippet:end

async def send_email(email: typing.Any, template: typing.Any) -> None:
    return None

class stripe:
    class Customer:
        @staticmethod
        def create(email: typing.Any) -> typing.Any:
            return None

    class Subscription:
        @staticmethod
        def create(customer: typing.Any, items: typing.Any, trial_period_days: typing.Any) -> typing.Any:
            return None