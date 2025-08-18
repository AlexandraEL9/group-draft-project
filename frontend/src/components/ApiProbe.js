import { useEffect, useState } from "react";
import { apiTest } from "../api/test";

export default function ApiProbe() {
  const [text, setText] = useState("Checking API…");

  useEffect(() => {
    let mounted = true;
    apiTest()
      .then((data) => { if (mounted) setText(`API OK: ${data.message}`); })
      .catch(() => { if (mounted) setText("API error"); });
    return () => { mounted = false; };
  }, []);

  return <p>{text}</p>;
}