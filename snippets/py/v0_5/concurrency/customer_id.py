import inngest

inngest_client = inngest.Inngest(app_id="my-app")

class Bucket:
    def fetch(self, uri: str) -> object:
        pass

bucket = Bucket()

def parse_file(file: object):
    pass



# !snippet:start
@inngest_client.create_function(
    fn_id="process-customer-csv-import",
    name="Process customer csv import",
    trigger=inngest.TriggerEvent(event="csv/file.uploaded"),
    concurrency=[
        inngest.Concurrency(
            limit=1,
            key="event.data.customerId"  # You can use any piece of data from the event payload
        )
    ]
)
async def process_csv_import(ctx: inngest.Context):
    async def process_file():
        file = await bucket.fetch(ctx.event.data.file_uri)
        parse_file(file)

    await ctx.step.run("process-file", process_file)
    return {"message": "success"}
