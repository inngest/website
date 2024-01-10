import { useRef, useState } from "react";
import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";

export default function LaunchWeek() {
  return (
    <div className="home font-sans bg-slate-1000">
      <Header />
      <Container className="py-8">
        <div className="my-12 tracking-tight flex items-center justify-center">
          <div className="mx-auto inline-flex rounded-md p-px bg-gradient-to-tl from-green-800/60 via-orange-300/60 to-rose-900/60">
            <div className="py-12 md:py-24 px-12 md:px-24 rounded-md bg-slate-1000">
              <h1 className="uppercase tracking-tight font-bold text-4xl md:text-8xl bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                Inngest Launch <br />
                Week{" "}
                <span className="bg-clip-text bg-indigo-600">Jan 2023</span>
              </h1>
              <p className="my-8 font-bold text-slate-200 text-lg md:text-xl">
                A week of updates from Inngest starting January 22nd, 2023
              </p>
              <ul className="uppercase font-bold text-lg text-slate-200">
                <li>Monday - Jan 22</li>
                <li>Tuesday - Jan 23</li>
                <li>Wednesday - Jan 24</li>
                <li>Thursday - Jan 25</li>
              </ul>

              <NewsletterSignup tags={["launch-week-jan-2023"]} />
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}

function NewsletterSignup({ tags = [] }: { tags: string[] }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    error: string;
    result: boolean | null;
  }>({
    error: "",
    result: null,
  });

  const subscribeUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/newsletter/subscribe", {
      body: JSON.stringify({
        email: inputRef.current.value,
        tags,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    setLoading(false);
    if (res.status === 201) {
      alert("Success! 🎉 You are now subscribed to the newsletter.");
      inputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={subscribeUser}>
      <p className="my-8 font-bold text-slate-200 text-lg md:text-xl">
        Get notified:
      </p>

      <div className="flex flex-row gap-4">
        <input
          className="w-72 border border-slate-800 rounded-md px-4 py-2 text-slate-200 bg-slate-1000 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          type="email"
          id="email-input"
          name="email"
          placeholder="Enter your email address"
          ref={inputRef}
          required
          autoCapitalize="off"
          autoCorrect="off"
        />
        <button
          type="submit"
          name="register"
          disabled={loading || response.result === true}
          className="whitespace-nowrap button group inline-flex items-center justify-center gap-0.5 rounded-lg font-medium tracking-tight transition-all text-white bg-indigo-500 hover:bg-indigo-400 text-sm px-6 py-2.5"
        >
          Register
        </button>
      </div>
    </form>
  );
}
