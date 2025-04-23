const url = "https://api.ashbyhq.com/jobPosting.list";
const apiKey = process.env.ASHBY_API_KEY;

export default async function Roles() {
  const auth = Buffer.from(`${apiKey}:`).toString("base64");
  console.log(auth);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Basic ${auth}`,
      accept: "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

  const roles = response.results;
  // return res.status(200).json({
  //   roles: response.results ?? [],
  // });

  return (
    <div>
      {roles.map((role) => (
        <div
          key={role.id}
          className="my-8 flex flex-row justify-between items-center text-basis text-lg"
        >
          <h3 className="font-medium m-0">
            <a
              href={role.externalLink}
              className="hover:underline"
              target="_blank"
            >
              {role.title}
            </a>
          </h3>
          <p className="m-0">{role.locationName}</p>
        </div>
      ))}
      {roles.length === 0 && <p>Check the job board for all open roles</p>}
    </div>
  );
}
