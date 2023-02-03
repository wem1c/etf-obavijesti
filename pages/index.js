import Subscribe from "../components/Subscribe";

export default function Home() {
  const handleClick = async (e) => {
    e.preventDefault();

    console.log("Creating new campaign...");
    const response = await fetch("/api/campaign/create");
    console.log("response: ", response);
    const resp_json = await response.json();
    console.log("json: ", resp_json);
    console.log("Campaign ID: ", resp_json.id);

    console.log(`Setting campaign (id: ${resp_json.id}) content...`);
    const response_content_set = await fetch(
      `/api/campaign/content?id=${resp_json.id}`,
      {
        body: JSON.stringify({
          plain_text:
            "Test Content! I am just testing whether this would be formatted correctly. Or if it even works.",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    console.log("response_content_set: ", response_content_set);
    const resp_json_content_set = await response_content_set.json();
    console.log("response_json_set: ", resp_json_content_set);

    console.log(`Getting campaign (id: ${resp_json.id}) content...`);
    const response_content = await fetch(
      `/api/campaign/content?id=${resp_json.id}`
    );
    console.log("response_content: ", response_content);
    const resp_json_content = await response_content.json();
    console.log("response_json: ", resp_json_content);

    console.log(`Sending campaign (id: ${resp_json.id})...`);
    const resp_send = await fetch(`/api/campaign/send?id=${resp_json.id}`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    console.log("resp_send: ", resp_send);
    const resp_send_json = await resp_send.json();
    console.log("resp_send_json: ", resp_send_json);
  };

  const handleGetPosts = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/posts");
    console.log("Response: ", response);
    const resp_data = await response.json();
    console.log("resp_data: ", resp_data);
  };
  return (
    <>
      <Subscribe />
      <button onClick={handleClick}>Test Create Campaign API</button>
      <button onClick={handleGetPosts}>Test Get Posts</button>
    </>
  );
}
