import inngest
from inngest.experimental.sandbox import image


async def choose_image(ctx: inngest.Context) -> None:
    await ctx.step.sandbox.create(
        "build",
        name="build",
        vcpu=2,
        memory_mb=2048,
        image=image.inngest("base"),
    )

    await ctx.step.sandbox.create(
        "custom",
        name="custom",
        vcpu=2,
        memory_mb=2048,
        image=image.custom("my-image:v1"),
    )
